import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'config';

function confirmDiscardFormChanges(WrappedComponent) {
    class ConfirmDiscardFormChanges extends React.Component {
        componentDidUpdate() {
            this.promptDiscardFormChanges(this.props.dirty);
        }

        componentWillUnmount() {
            window.onbeforeunload = null;
        }

        promptDiscardFormChanges(isUnsaved = false) {
            window.onbeforeunload = isUnsaved && (() => locale.global.discardFormChangesConfirmation.confirmationMessage);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    ConfirmDiscardFormChanges.propTypes = {
        dirty: PropTypes.bool,
    };

    return ConfirmDiscardFormChanges;
}

export default confirmDiscardFormChanges;
