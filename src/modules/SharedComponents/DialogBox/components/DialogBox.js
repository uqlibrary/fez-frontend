import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Redirect} from 'react-router';

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
        hideDialogBox: PropTypes.funcs
    };

    constructor(props) {
        super(props);

        this.state = {
            primaryRedirect: false,
            secondaryRedirect: false
        };
    }

    componentWillReceiveProps(nextProps) {
        // onRequestClose for FlatButton isn't triggered so have put the resetState call in here
        if (nextProps.open) {
            this.resetState();
        }
    }

    handlePrimaryRedirect = () => {
        this.setState({primaryRedirect: true});
        this.props.hideDialogBox();
    };

    handleSecondaryRedirect = () => {
        this.setState({secondaryRedirect: true});
        this.props.hideDialogBox();
    };

    resetState = () => {
        this.setState({
            primaryRedirect: false,
            secondaryRedirect: false
        });
    };

    render() {
        const {
            open,
            title,
            content,
            primaryButtonLabel,
            primaryLink,
            secondaryButtonLabel,
            secondaryLink
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

        if (this.state.primaryRedirect && primaryLink.length > 0) {
            return (<Redirect to={primaryLink} />);
        }

        if (this.state.secondaryRedirect && secondaryLink.length > 0) {
            return (<Redirect to={secondaryLink} />);
        }

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
