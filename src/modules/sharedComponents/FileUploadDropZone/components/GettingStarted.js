import React, {PureComponent} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

// custom components
import {locale} from 'config';
import './buttons.scss';

export default class GettingStarted extends PureComponent {

    static propTypes = {
        closeDialog: PropTypes.func,
        nextPage: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            closeDialog,
            nextPage
        } = this.props;

        const fileInformation = locale.sharedComponents.files;

        return (
            <div>
                {fileInformation.dialog.explanationText}
                <div className="buttonsContainer">
                    <FlatButton
                        className="prevBtn"
                        label={locale.global.labels.buttons.cancel}
                        onTouchTap={closeDialog}
                    />
                    <RaisedButton
                        label={fileInformation.buttons.getStartedLabel}
                        secondary
                        onClick={nextPage}
                    />
                </div>
            </div>
        );
    }
}
