import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import {parse, stringify} from 'querystring';
import {createHash} from 'crypto';

import {locale, routes} from 'config';
import {APP_URL, SESSION_COOKIE_NAME, AUTHOR_IDENTIFIER_ORCID, ORCID_CLIENT_ID, ORCID_AUTHORIZATION_URL} from 'config/general';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class Orcid extends Component {
    static propTypes = {
        account: PropTypes.object,
        orcidDetails: PropTypes.object,
        locale: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const queryParams = parse(window.location.search.substr(1, window.location.search.length));
        if (queryParams.code) {
            this.props.actions.requestAuthorOrcidInfo(this.props.account.id, {code: queryParams.code, redirUri: this.props.location.pathname});
        }
    }

    _setAuthoriseConfirmation = (ref) => {
        this.authoriseConfirmationBox = ref;
    };

    _showAuthoriseConfirmation = (orcidUrlGenerator) => {
        const url = orcidUrlGenerator();
        this.authoriseConfirmationBox._onAction = () => (window.location.replace(url));
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

    _linkOrcid = () => {
        this.props.actions.addAuthorIdentifier(AUTHOR_IDENTIFIER_ORCID, this.props.account.id, this.props.orcidDetails.orcid, this.props.orcidDetails);
        this.props.history.push(routes.pathConfig.dashboard);
    };

    requestPermissionUrl = (returnUrl, additionalParams = {}) => {
        const params = {
            client_id: ORCID_CLIENT_ID,
            response_type: 'code',
            redirect_uri: `${APP_URL}#${returnUrl}`,
            state: createHash('md5').update(Cookies.get(SESSION_COOKIE_NAME)).digest('hex'),
            scope: '/authenticate',
            ...additionalParams
        };

        return `${ORCID_AUTHORIZATION_URL}?${stringify(params)}`;
    };

    render() {
        const txt = locale.researcherIdentifiers.orcid;

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <div>
                        {
                            !this.props.orcidDetails &&
                            <div>
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
                            </div>
                        }
                        {
                            this.props.orcidDetails &&
                            <StandardCard title={txt.linkOrcid.title} help={txt.help}>
                                <div>
                                    {txt.linkOrcid.description}
                                    {`${txt.linkOrcid.labels.orcidId}${this.props.orcidDetails.orcid}`}
                                </div>
                                <div>
                                    <div className="columns action-buttons">
                                        <div className="column is-hidden-mobile"/>
                                        <div className="column is-narrow-desktop">
                                            <RaisedButton
                                                secondary
                                                fullWidth
                                                label={txt.linkOrcid.labels.submit}
                                                onTouchTap={this._linkOrcid}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </StandardCard>
                        }
                    </div>
                </form>
            </StandardPage>
        );
    }
}
