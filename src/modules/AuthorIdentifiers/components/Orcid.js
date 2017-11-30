import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import {parse, stringify} from 'querystring';
import {createHash} from 'crypto';

import {locale, routes} from 'config';
import {APP_URL, SESSION_COOKIE_NAME, ORCID_CLIENT_ID, ORCID_AUTHORIZATION_URL} from 'config/general';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, ConfirmDialogBox, Alert} from 'uqlibrary-react-toolbox';

export default class Orcid extends Component {
    static propTypes = {
        account: PropTypes.object,
        locale: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const {orcid} = locale.authorIdentifiers;

        const queryParams = parse(window.location.search.substr(1));

        if (queryParams.code && queryParams.state && queryParams.state !== this.getState()) {
            this.setError(orcid.stateErrorAlert);
        } else if (queryParams.code) {
            this.props.actions.requestAuthorOrcidInfo(this.props.account.id, {code: queryParams.code, redirUri: this.props.location.pathname});
            this.props.history.push(routes.pathConfig.dashboard);
        }
    }

    _setAuthoriseConfirmation = (ref) => {
        this.authoriseConfirmationBox = ref;
    };

    _showAuthoriseConfirmation = (orcidUrlGenerator) => {
        const url = orcidUrlGenerator();
        this.authoriseConfirmationBox._onAction = () => (window.location.assign(url));
        this.authoriseConfirmationBox.showConfirmation();
    };

    _authoriseOrcid = () => {
        return this.requestPermissionUrl(this.props.location.pathname, {show_login: true});
    };

    _createOrcid = () => {
        const additionalParams = {
            show_login: false,
            family_names: this.props.account.lastName,
            given_names: this.props.account.firstName
        };
        return this.requestPermissionUrl(this.props.location.pathname, additionalParams);
    };

    setError = (error) => {
        this.setState({error: error});
    };

    getState = () => (createHash('md5').update(Cookies.get(SESSION_COOKIE_NAME)).digest('hex'));

    requestPermissionUrl = (returnUrl, additionalParams = {}) => {
        const params = {
            client_id: ORCID_CLIENT_ID,
            response_type: 'code',
            redirect_uri: `${APP_URL}#${returnUrl}`,
            state: this.getState(),
            scope: '/authenticate',
            ...additionalParams
        };

        return `${ORCID_AUTHORIZATION_URL}?${stringify(params)}`;
    };

    render() {
        const txt = locale.authorIdentifiers.orcid;

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <ConfirmDialogBox
                        onRef={this._setAuthoriseConfirmation}
                        locale={txt.grantAccessConfirmation} />
                    <StandardCard title={txt.authoriseOrcid.title}>
                        <div>{txt.authoriseOrcid.description}</div>
                        <div className="columns action-buttons">
                            <div className="column is-hidden-mobile"/>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    secondary
                                    fullWidth
                                    label={txt.authoriseOrcid.labels.submit}
                                    onTouchTap={() => this._showAuthoriseConfirmation(this._authoriseOrcid)}
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
                                    onTouchTap={() => this._showAuthoriseConfirmation(this._createOrcid)}
                                />
                            </div>
                        </div>
                    </StandardCard>

                    {
                        this.state.error &&
                        <Alert {...this.state.error} />
                    }
                </form>
            </StandardPage>
        );
    }
}
