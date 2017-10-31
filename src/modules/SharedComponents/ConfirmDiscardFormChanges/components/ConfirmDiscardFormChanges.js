import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';

function confirmDiscardFormChanges(WrappedComponent) {
    class ConfirmDiscardFormChanges extends React.Component {
        static propTypes = {
            dirty: PropTypes.bool
        };

        componentDidUpdate() {
            this.promptDiscardFormChanges(this.props.dirty);
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
