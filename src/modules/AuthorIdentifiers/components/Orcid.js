import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createHash} from 'crypto';
import {parse} from 'querystring';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import {routes, ORCID_CLIENT_ID, ORCID_AUTHORIZATION_URL} from 'config';

export default class Orcid extends Component {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,
        accountAuthorSaving: PropTypes.bool,
        accountAuthorError: PropTypes.string,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        // when ORCID registration went through, and ORCID has redirected back to eSpace
        // check status of ORCID redirect, if it's still in the same session (state)
        // in prod/staging
        // http://espace/path/to/page/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a
        // or in dev environment
        // http://development/espace/branch/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a#path/to/page/
        const orcidStateId = this.createOrcidStateId(props.account);
        const queryString = window.location.hash.indexOf('?') >= 0
            ? window.location.hash.substr(window.location.hash.indexOf('?') + 1)
            : window.location.search.substr(1);
        const queryParams = parse(queryString);

        this.state = {
            orcidRequest: {
                client_id: ORCID_CLIENT_ID,
                response_type: 'code',
                scope: '/read-limited /activities/update /person/update',
                redirect_uri: routes.pathConfig.authorIdentifiers.orcid.absoluteLink,
                state: orcidStateId
            },
            existingOrcidRequest: {
                show_login: false,
                family_names: props.account ? props.account.lastName : '',
                given_names: props.account ? props.account.firstName : ''
            },
            createOrcidRequest: {
                show_login: true
            },
            orcidResponse: {
                code: queryParams.code || null,
                state: queryParams.state || null
            }
        };
    }

    componentWillMount() {
        // user should have a fez-author record to proceed
        // user should not be able to re-link to orcid if they already have an orcid id
        if (!this.props.accountAuthorLoading && (!this.props.author || this.props.author.aut_orcid_id)) {
            this._navigateToDashboard();
        }
    }

    componentDidMount() {
        // link author to orcid when orcid authorisation response is received from orcid website (url contains required parameters)
        if(this.props.account && this.props.author && !this.props.author.aut_orcid_id && this.state.orcidResponse.code && this.state.orcidResponse.state
            && this.isValidOrcidState(this.props.account, this.state.orcidRequest.state, this.state.orcidResponse.state)) {
            this.props.actions.linkAuthorOrcidId(
                this.props.account.id,
                this.props.author.aut_id,
                this.state.orcidResponse.code
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        // wait for user account to get loaded and set state if props were not available in constructor
        if (nextProps.account !== this.props.account && (!this.props.account || nextProps.account.id !== this.props.account.id)) {
            const orcidStateId = this.createOrcidStateId(nextProps.account);

            this.setState((prevState) => ({
                orcidRequest: {
                    ...prevState.orcidRequest,
                    state: orcidStateId
                },
                existingOrcidRequest: {
                    ...prevState.existingOrcidRequest,
                    family_names: nextProps.account ? nextProps.account.lastName : '',
                    given_names: nextProps.account ? nextProps.account.firstName : ''
                }
            }));
        }

        // user should have a fez-author record to proceed
        // user should not be able to re-link to orcid if they already have an orcid id
        if (nextProps.author !== this.props.author && (!nextProps.accountAuthorLoading && !nextProps.author || nextProps.author.aut_orcid_id)) {
            this._navigateToDashboard();
        }

        // author's orcid id has been updated successfully
        if (nextProps.author && this.props.author && nextProps.author.aut_orcid_id !== this.props.author.aut_orcid_id) {
            this.props.actions.showAppAlert({
                ...locale.pages.orcidLink.successAlert,
                dismissAction: this.props.actions.dismissAppAlert
            });
            this._navigateToDashboard();
        }

        // link author to orcid when orcid authorisation response is received from orcid website (if props.author were not available in componentDidMount)
        if (this.props.account && !nextProps.accountAuthorLoading
            && (nextProps.author !== this.props.author || (nextProps.author && this.props.author.aut_id !== nextProps.author.aut_id))
            && !nextProps.author.aut_orcid_id && this.state.orcidResponse.code && this.state.orcidResponse.state
            && this.isValidOrcidState(this.props.account, this.state.orcidRequest.state, this.state.orcidResponse.state)) {
            this.props.actions.linkAuthorOrcidId(
                nextProps.account.id,
                nextProps.author.aut_id,
                this.state.orcidResponse.code
            );
        }
    }

    componentWillUnmount() {
        // reset any saving state for current author on exit
        this.props.actions.resetSavingAuthorState();
    }

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    _setAuthoriseConfirmation = (ref) => {
        this.authoriseConfirmationBox = ref;
    };

    getOrcidUrl = (isNew = true) => {
        const params = {
            ...this.state.orcidRequest,
            ...(isNew ? this.state.createOrcidRequest : this.state.existingOrcidRequest )
        };
        const stringifiedParams = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        return `${ORCID_AUTHORIZATION_URL}?${stringifiedParams}`;
    };

    createOrcidStateId = (account) => {
        return account ? createHash('md5').update(`${account.id}/${account.mail}/${(new Date()).setHours(0, 0, 0, 0)}`).digest('hex') : '';
    };

    isValidOrcidState = (account, sessionId, receivedSessionId) => (
        !account || !receivedSessionId || receivedSessionId === sessionId
    );

    _showAuthoriseConfirmation = (isNew = true) => {
        const url = this.getOrcidUrl(isNew);
        this.authoriseConfirmationBox._onAction = () => (window.location.assign(url));
        this.authoriseConfirmationBox.showConfirmation();
    };

    getAlert = ({submitFailed = false, submitting = false, error, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message
                    ? alertLocale.errorAlert.message(error)
                    : error
            };
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    render() {
        // wait for author and account to be loaded
        if(!this.props.author || !this.props.account) {
            return (<div />);
        }

        const txt = locale.pages.orcidLink;
        const isValidOrcidState = this.isValidOrcidState(this.props.account, this.state.orcidRequest.state, this.state.orcidResponse.state);

        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={this._setAuthoriseConfirmation}
                    locale={txt.grantAccessConfirmation} />

                {
                    this.getAlert({
                        submitFailed: !!this.props.accountAuthorError || !isValidOrcidState,
                        error: !isValidOrcidState ? locale.pages.orcidLink.errorAlert.orcidStateError : this.props.accountAuthorError,
                        submitting: this.props.accountAuthorSaving,
                        alertLocale: txt
                    })
                }

                <StandardCard title={txt.linkOrcid.title}>
                    <div>{txt.linkOrcid.description}</div>
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                disabled={this.props.accountAuthorSaving}
                                label={txt.linkOrcid.labels.submit}
                                onClick={this._showAuthoriseConfirmation}
                            />
                        </div>
                    </div>
                </StandardCard>

                <StandardCard title={txt.createOrcid.title}>
                    <div>{txt.createOrcid.description}</div>
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                disabled={this.props.accountAuthorSaving}
                                label={txt.createOrcid.labels.submit}
                                onClick={this._showAuthoriseConfirmation.bind(this, false)}
                            />
                        </div>
                    </div>
                </StandardCard>
            </StandardPage>
        );
    }
}
