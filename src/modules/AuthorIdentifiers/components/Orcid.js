import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createHash} from 'crypto';
import {parse} from 'querystring';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';

import {ORCID_CLIENT_ID, ORCID_AUTHORIZATION_URL} from 'config/general';
import {locale} from 'locale';
import {routes} from 'config';

export default class Orcid extends Component {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        accountAuthorSaving: PropTypes.bool,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        // when ORCID registration went through, and ORCID has redirected back to eSpace
        // check status of ORCID redirec, if it's still in the same session (state)
        // in prod/staging
        // http://espace/path/to/page/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a
        // or in dev environment
        // http://development/espace/branch/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a#path/to/page/
        const orcidSessionId = this.getOrcidSessionId(props.account);
        const queryString = window.location.hash.indexOf('?') >= 0
            ? window.location.hash.substr(window.location.hash.indexOf('?') + 1)
            : window.location.search.substr(1);
        const queryParams = parse(queryString);

        this.state = {
            orcidParameters: {
                client_id: ORCID_CLIENT_ID,
                response_type: 'code',
                scope: '/read-limited /activities/update /person/update',
                redirect_uri: `${window.location.origin}${window.location.pathname}${window.location.hash}`,
                state: orcidSessionId
            },
            existingOrcidParameters: {
                show_login: false,
                family_names: props.account.lastName,
                given_names: props.account.firstName
            },
            newOrcidParameters: {
                show_login: true
            },
            orcidResponse: {
                code: queryParams.code || null,
                state: queryParams.state || null
            }
        };
    }

    componentDidMount() {
        if(!this.isValidOrcidSession(this.props.account, this.state.orcidParameters.state, this.state.orcidResponse.state)) {
            this.props.actions.showAppAlert(
                {
                    ...locale.pages.orcidLink.errorAlert,
                    message: locale.pages.orcidLink.errorAlert.message('Invalid authorisation response from ORCID'),
                    dismissAction: this.props.actions.dismissAppAlert
                }
            );
        }

        // link author to orcid when oricd authorisation response is received from orcid website (url contains required parameters)
        if (this.state.orcidResponse.code && this.state.orcidResponse.state && this.props.author && this.props.account
            && this.state.orcidResponse.state === this.state.orcidParameters.state) {
            console.log('componentDidMount - linkAuthorOrcidId()');
            this.props.actions.linkAuthorOrcidId(
                this.props.account.id,
                this.props.author.aut_id,
                this.state.orcidResponse.code
            );

            // remove all query string by re-navigating
            this.props.history.replace(routes.pathConfig.authorIdentifiers.orcid.link);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');

        // wait for used account to get loaded and set state
        if (nextProps.account !== this.props.account) {
            if (nextProps.account.id !== this.props.account.id) {
                const orcidSessionId = this.getOrcidSessionId(nextProps.account);
                this.setState({
                    orcidParameters: {
                        state: orcidSessionId
                    },
                    existingOrcidParameters: {
                        family_names: nextProps.account ? nextProps.account.lastName : '',
                        given_names: nextProps.account ? nextProps.account.firstName : ''
                    }
                });
            }

            if(!this.isValidOrcidSession(nextProps.account, this.state.orcidParameters.state, this.state.orcidResponse.state)) {
                this.props.actions.showAppAlert(
                    {
                        ...locale.pages.orcidLink.errorAlert,
                        message: locale.pages.orcidLink.errorAlert.message('Invalid token from ORCID'),
                        dismissAction: this.props.actions.dismissAppAlert
                    }
                );
            }
        }

        // author's orcid id has been updated, navigate back to dashboard and show success message
        if (nextProps.author && this.props.author && nextProps.author.aut_orcid_id !== this.props.author.aut_orcid_id) {
            console.log('componentWillReceiveProps - success');
            this.props.actions.showAppAlert({
                ...locale.pages.googleScholarLink.successAlert,
                dismissAction: this.props.actions.dismissAppAlert
            });
            this.props.history.push(routes.pathConfig.dashboard);
        } else if (this.props.accountAuthorSaving !== nextProps.accountAuthorSaving && !nextProps.accountAuthorSaving) {
            // link author to orcid when orcid authorisation response is received from orcid website (url contains required parameters)
            if (this.state.orcidResponse.code && this.state.orcidResponse.state && nextProps.author && nextProps.account
                && this.state.orcidResponse.state === this.state.orcidParameters.state) {
                console.log('componentWillReceiveProps - linkAuthorOrcidId()');
                this.props.actions.linkAuthorOrcidId(
                    nextProps.account.id,
                    nextProps.author.aut_id,
                    this.state.orcidResponse.code
                );

                // remove all query string by re-navigating
                // this.props.history.replace(routes.pathConfig.authorIdentifiers.orcid.link);
            }
        }
    }

    _setAuthoriseConfirmation = (ref) => {
        this.authoriseConfirmationBox = ref;
    };

    getOrcidUrl = (isNew = true) => {
        const params = {
            ...this.state.orcidParameters,
            ...(isNew ? this.state.newOrcidParameters : this.state.existingOrcidParameters )
        };
        const stringifiedParams = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        return `${ORCID_AUTHORIZATION_URL}?${stringifiedParams}`;
    };

    getOrcidSessionId = (account) => {
        return account ? createHash('md5').update(`${account.id}/${account.mail}/${(new Date()).setHours(0, 0, 0, 0)}`).digest('hex') : '';
    };

    isValidOrcidSession = (account, sessionId, receivedSessionId) => (
        !account || !receivedSessionId || receivedSessionId === sessionId
    );

    _showAuthoriseConfirmation = (isNew = true) => {
        const url = this.getOrcidUrl(isNew);
        console.log(url);
        this.authoriseConfirmationBox._onAction = () => (window.location.assign(url));
        this.authoriseConfirmationBox.showConfirmation();
    };

    render() {
        const txt = locale.pages.orcidLink;
        console.log(this.state);
        console.log(this.props);
        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={this._setAuthoriseConfirmation}
                    locale={txt.grantAccessConfirmation} />
                <StandardCard title={txt.linkOrcid.title}>
                    <div>{txt.linkOrcid.description}</div>
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={txt.linkOrcid.labels.submit}
                                onTouchTap={this._showAuthoriseConfirmation}
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
                                label={txt.createOrcid.labels.submit}
                                onTouchTap={this._showAuthoriseConfirmation.bind(this, false)}
                            />
                        </div>
                    </div>
                </StandardCard>
            </StandardPage>
        );
    }
}
