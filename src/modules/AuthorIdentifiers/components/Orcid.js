import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';
import {parse} from 'querystring';

import {orcid} from 'services';

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

    _showAuthoriseConfirmation = () => {
        this.authoriseConfirmationBox.showConfirmation();
    };

    _authoriseOrcid = () => {
        const orcidAuthUrl = orcid.requestPermissionUrl(this.props.location.pathname, {show_login: true});
        window.location.replace(orcidAuthUrl);
    };

    render() {
        const txt = locale.researcherIdentifiers.orcid;

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <div>
                        {
                            !this.props.orcidDetails &&
                            <StandardCard title={txt.authoriseOrcid.title} help={txt.help}>
                                <div>{txt.authoriseOrcid.description}</div>
                                <ConfirmDialogBox
                                    onRef={this._setAuthoriseConfirmation}
                                    onAction={this._authoriseOrcid}
                                    locale={txt.grantAccessConfirmation} />
                                <div className="columns action-buttons">
                                    <div className="column is-hidden-mobile"/>
                                    <div className="column is-narrow-desktop">
                                        <RaisedButton
                                            secondary
                                            fullWidth
                                            label={txt.authoriseOrcid.labels.submit}
                                            onTouchTap={this._showAuthoriseConfirmation}
                                        />
                                    </div>
                                </div>
                            </StandardCard>
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
                                                onTouchTap={this._showAuthoriseConfirmation}
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
