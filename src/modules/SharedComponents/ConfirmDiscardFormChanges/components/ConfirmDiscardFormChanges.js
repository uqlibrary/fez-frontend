import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

function confirmDiscardFormChanges(WrappedComponent) {
    class ConfirmDiscardFormChanges extends React.Component {
        static propTypes = {
            dirty: PropTypes.bool,
            submitSucceeded: PropTypes.bool
        };

        static defaultProps = {
            dirty: false,
            submitSucceeded: false
        };

        componentDidUpdate() {
            this.promptDiscardFormChanges(this.props.dirty && !this.props.submitSucceeded);
        }

        componentWillUnmount() {
            window.onbeforeunload = null;
        }

        getDiscardFormChangesConfirmationLocale = () => locale.global.discardFormChangesConfirmation.confirmationMessage;

        promptDiscardFormChanges(isDirty = false) {
            window.onbeforeunload = isDirty && (this.getDiscardFormChangesConfirmationLocale);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return ConfirmDiscardFormChanges;
}

export default confirmDiscardFormChanges;
