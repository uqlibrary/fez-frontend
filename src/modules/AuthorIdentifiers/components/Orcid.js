import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createHash } from 'crypto';
import { parse } from 'querystring';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import { ORCID_AUTHORIZATION_URL, ORCID_CLIENT_ID, pathConfig } from 'config';

export default class Orcid extends Component {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,
        accountAuthorSaving: PropTypes.bool,
        accountAuthorError: PropTypes.string,
        navigate: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        // eslint-disable-next-line camelcase
        if (!this.props.accountAuthorLoading && (!this.props.author?.aut_id || this.props.author.aut_orcid_id)) {
            this._navigateToDashboard();
        }

        // when ORCID registration went through, and ORCID has redirected back to eSpace
        // check status of ORCID redirect, if it's still in the same session (state)
        // in prod/staging
        // http://espace/path/to/page/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a
        // or in dev environment
        // http://development/espace/branch/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a#path/to/page/
        const orcidStateId = this.createOrcidStateId(props.account);
        const queryString =
            window.location.hash.indexOf('?') >= 0
                ? window.location.hash.substr(window.location.hash.indexOf('?') + 1)
                : window.location.search.substr(1);

        let queryParams;
        try {
            queryParams = parse(queryString);
        } catch (e) {
            /* istanbul ignore next */
            queryParams = {
                code: null,
                state: null,
            };
        }

        this.state = {
            orcidRequest: {
                client_id: ORCID_CLIENT_ID,
                response_type: 'code',
                scope: '/read-limited /activities/update /person/update',
                redirect_uri: pathConfig.authorIdentifiers.orcid.absoluteLink,
                state: orcidStateId,
            },
            existingOrcidRequest: {
                show_login: false,
                family_names: props.account ? props.account.lastName : '',
                given_names: props.account ? props.account.firstName : '',
            },
            createOrcidRequest: {
                show_login: true,
            },
            orcidResponse: {
                code: queryParams.code || null,
                state: queryParams.state || null,
            },
            createOrcidStateId: this.createOrcidStateId,
            prevProps: { ...props },
        };
    }

    static getDerivedStateFromProps(props, state) {
        // wait for user account to get loaded and set state if props were not available in constructor
        if (
            props.account !== state.prevProps?.account &&
            (!state.prevProps?.account || /* istanbul ignore next */ props.account.id !== state.prevProps?.account.id)
        ) {
            const orcidStateId = state.createOrcidStateId(props.account);
            //
            return {
                orcidRequest: {
                    ...state.orcidRequest,
                    state: orcidStateId,
                },
                existingOrcidRequest: {
                    ...state.existingOrcidRequest,
                    family_names: !!props.account && !!props.account.lastName ? props.account.lastName : '',
                    given_names: !!props.account && !!props.account.firstName ? props.account.firstName : '',
                },
                prevProps: { ...props },
            };
        }
        return null;
    }

    componentDidMount() {
        // link author to orcid when orcid authorisation response is received from orcid website
        // (url contains required parameters)
        if (
            this.props.account &&
            // eslint-disable-next-line camelcase
            !this.props.author?.aut_orcid_id &&
            this.state.orcidResponse.code &&
            this.state.orcidResponse.state &&
            this.isValidOrcidState(this.props.account, this.state.orcidRequest.state, this.state.orcidResponse.state)
        ) {
            this.props.actions.linkAuthorOrcidId(
                this.props.account.id,
                this.props.author.aut_id,
                this.state.orcidResponse.code,
            );
        }
    }

    componentDidUpdate(prevProps) {
        // user should have a fez-author record to proceed
        // user should not be able to re-link to orcid if they already have an orcid id
        if (
            this.props.author !== prevProps.author &&
            // eslint-disable-next-line camelcase
            ((!this.props.accountAuthorLoading && !this.props.author) || this.props.author?.aut_orcid_id)
        ) {
            this._navigateToDashboard();
        }

        // author's orcid id has been updated successfully
        if (
            this.props.author &&
            prevProps.author &&
            // eslint-disable-next-line camelcase
            this.props.author?.aut_orcid_id !== prevProps.author?.aut_orcid_id
        ) {
            this.props.actions.showAppAlert({
                ...locale.pages.orcidLink.successAlert,
                dismissAction: this.props.actions.dismissAppAlert,
            });
            this._navigateToDashboard();
        }

        // link author to orcid when orcid authorisation response is received from orcid website
        // (if props.author were not available in componentDidMount)
        if (
            this.props.account &&
            !this.props.accountAuthorLoading &&
            (this.props.author !== prevProps.author ||
                // eslint-disable-next-line camelcase
                /* istanbul ignore next */
                (this.props.author && prevProps.author?.aut_id !== this.props.author?.aut_id)) &&
            // eslint-disable-next-line camelcase
            !this.props.author?.aut_orcid_id &&
            this.state.orcidResponse.code &&
            this.state.orcidResponse.state &&
            this.isValidOrcidState(this.props.account, this.state.orcidRequest.state, this.state.orcidResponse.state)
        ) {
            this.props.actions.linkAuthorOrcidId(
                this.props.account.id,
                this.props.author.aut_id,
                this.state.orcidResponse.code,
            );
        }
    }

    componentWillUnmount() {
        // reset any saving state for current author on exit
        this.props.actions.resetSavingAuthorState();
    }

    _navigateToDashboard = () => {
        this.props.navigate(pathConfig.dashboard);
    };

    _setAuthoriseConfirmation = ref => {
        this.authoriseConfirmationBox = ref;
    };

    getOrcidUrl = isNew => {
        const params = {
            ...this.state.orcidRequest,
            ...(isNew ? this.state.createOrcidRequest : this.state.existingOrcidRequest),
        };
        const stringifiedParams = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        return `${ORCID_AUTHORIZATION_URL}?${stringifiedParams}`;
    };

    createOrcidStateId = account => {
        return account
            ? createHash('md5')
                  .update(`${account.id}/${account.mail}/${new Date().setHours(0, 0, 0, 0)}`)
                  .digest('hex')
            : '';
    };

    isValidOrcidState = (account, sessionId, receivedSessionId) =>
        !account || !receivedSessionId || receivedSessionId === sessionId;

    _showAuthoriseConfirmation = (/* istanbul ignore next */ isNew = true) => {
        const url = this.getOrcidUrl(isNew);
        this.authoriseConfirmationBox._onAction = () => window.location.assign(url);
        this.authoriseConfirmationBox.showConfirmation();
    };

    getAlert = ({ submitFailed, submitting = false, error, alertLocale }) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message(error),
            };
        } else if (submitting) {
            alertProps = { ...alertLocale.progressAlert };
        }
        return alertProps ? <Alert {...alertProps} /> : null;
    };

    render() {
        // wait for author and account to be loaded
        // eslint-disable-next-line camelcase
        if (!this.props.author?.aut_id || !this.props.account) {
            return <div />;
        }

        const txt = locale.pages.orcidLink;
        const isValidOrcidState = this.isValidOrcidState(
            this.props.account,
            this.state.orcidRequest.state,
            this.state.orcidResponse.state,
        );

        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox onRef={this._setAuthoriseConfirmation} locale={txt.grantAccessConfirmation} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {this.getAlert({
                            submitFailed: !!this.props.accountAuthorError || !isValidOrcidState,
                            error: !isValidOrcidState
                                ? locale.pages.orcidLink.errorAlert.orcidStateError
                                : this.props.accountAuthorError,
                            submitting: this.props.accountAuthorSaving,
                            alertLocale: txt,
                        })}
                    </Grid>
                    <Grid item xs={12}>
                        <StandardCard title={txt.linkOrcid.title}>
                            <Typography component={'span'} gutterBottom>
                                {txt.linkOrcid.description}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                                <Grid item xs={12} sm={'auto'}>
                                    <Button
                                        aria-label={txt.linkOrcid.labels.submit}
                                        variant={'contained'}
                                        color={'primary'}
                                        fullWidth
                                        disabled={this.props.accountAuthorSaving}
                                        children={txt.linkOrcid.labels.submit}
                                        onClick={this._showAuthoriseConfirmation}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                    <Grid item xs={12}>
                        <StandardCard title={txt.createOrcid.title}>
                            <Typography component={'span'} gutterBottom>
                                {txt.createOrcid.description}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                                <Grid item xs={12} sm={'auto'}>
                                    <Button
                                        aria-label={txt.createOrcid.labels.submit}
                                        variant={'contained'}
                                        color={'primary'}
                                        fullWidth
                                        disabled={this.props.accountAuthorSaving}
                                        children={txt.createOrcid.labels.submit}
                                        onClick={this._showAuthoriseConfirmation.bind(this, false)}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}
