import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router-dom';

// custom components
import './DialogBox.scss';

export default class DialogBox extends PureComponent {

    static propTypes = {
        open: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        primaryButtonLabel: PropTypes.string.isRequired,
        primaryButtonLink: PropTypes.string.isRequired,
        secondaryButtonLabel: PropTypes.string.isRequired,
        hideDialogBox: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.hideDialogBox();
    };

    render() {
        const {open, title, content, primaryButtonLabel, primaryButtonLink, secondaryButtonLabel} = this.props;
        const actions = [
            <FlatButton
                label={secondaryButtonLabel}
                secondary
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label={primaryButtonLabel}
                secondary
                keyboardFocused
                onTouchTap={this.handleClose}
                containerElement={<Link to={primaryButtonLink} />}
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
