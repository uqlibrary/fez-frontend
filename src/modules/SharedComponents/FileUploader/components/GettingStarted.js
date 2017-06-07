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
        nextPage: PropTypes.func,
        reset: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    cancelFileUpload = () => {
        const {closeDialog, reset} = this.props;

        closeDialog();
        reset(); // resets the redux form fields in the dialog. Function available in redux-form itself
    }

    render() {
        const {
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
                        onTouchTap={this.cancelFileUpload}
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
