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
        primaryLink: PropTypes.string.isRequired,
        secondaryButtonLabel: PropTypes.string.isRequired,
        secondaryLink: PropTypes.string,
        hideDialogBox: PropTypes.func,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    handlePrimaryRedirect = () => {
        const {hideDialogBox, history, primaryLink} = this.props;
        history.push(`/claim-publications/${primaryLink}`);
        hideDialogBox();
    };

    handleSecondaryRedirect = () => {
        const {hideDialogBox, history, secondaryLink} = this.props;

        if (secondaryLink && secondaryLink.length > 0) {
            history.push(`/claim-publications/${secondaryLink}`);
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
