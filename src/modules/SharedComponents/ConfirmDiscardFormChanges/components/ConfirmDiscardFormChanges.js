import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

function confirmDiscardFormChanges(WrappedComponent) {
    class ConfirmDiscardFormChanges extends React.Component {
        static propTypes = {
            dirty: PropTypes.bool,
            submitSucceeded: PropTypes.bool
        };

        componentDidUpdate() {
            this.promptDiscardFormChanges(this.props.dirty && !this.props.submitSucceeded);
        }

        componentWillUnmount() {
            window.onbeforeunload = null;
        }

        promptDiscardFormChanges(isDirty = false) {
            window.onbeforeunload = isDirty && (() => locale.global.discardFormChangesConfirmation.confirmationMessage);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return ConfirmDiscardFormChanges;
}

export default confirmDiscardFormChanges;
