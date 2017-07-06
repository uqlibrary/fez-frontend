import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// custom components
import './DialogBox.scss';

export default class DialogBox extends PureComponent {

    static propTypes = {
        open: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        primaryButtonLabel: PropTypes.string.isRequired,
        primaryLink: PropTypes.string,
        primaryHandleFn: PropTypes.func,
        secondaryButtonLabel: PropTypes.string,
        secondaryLink: PropTypes.string,
        secondaryHandleFn: PropTypes.func,
        hideDialogBox: PropTypes.func,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    handlePrimaryRedirect = () => {
        const {hideDialogBox, history, primaryLink, primaryHandleFn} = this.props;

        if (primaryLink && primaryLink.length > 0) {
            history.push(primaryLink);
        }

        if (primaryHandleFn) {
            primaryHandleFn();
        }

        hideDialogBox();
    };

    handleSecondaryRedirect = () => {
        const {hideDialogBox, history, secondaryLink, secondaryHandleFn} = this.props;

        if (secondaryLink && secondaryLink.length > 0) {
            history.push(secondaryLink);
        }

        if (secondaryHandleFn) {
            secondaryHandleFn();
        }

        hideDialogBox();
    };

    render() {
        const {
            open,
            title,
            content,
            primaryButtonLabel,
            secondaryButtonLabel,
        } = this.props;

        const actions = [
            <FlatButton
                label={secondaryButtonLabel}
                secondary
                onTouchTap={this.handleSecondaryRedirect}
            />,
            <FlatButton
                label={primaryButtonLabel}
                secondary
                keyboardFocused
                onTouchTap={this.handlePrimaryRedirect}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={title}
                    actions={actions}
                    modal
                    open={open}
                >
                    {content}
                </Dialog>
            </div>
        );
    }
}
