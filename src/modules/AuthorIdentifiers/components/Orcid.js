import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';

import {orcid} from 'services';

import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

export default class Orcid extends Component {
    static propTypes = {
        locale: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);
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
                    <StandardCard title={txt.linkOrcid.title} help={txt.help}>
                        <div>
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
                                        label={txt.linkOrcid.labels.submit}
                                        onTouchTap={this._showAuthoriseConfirmation}
                                    />
                                </div>
                            </div>
                        </div>
                    </StandardCard>
                </form>
            </StandardPage>
        );
    }
}
