import React from 'react';
import PropTypes from 'prop-types';

function confirmDiscardFormChanges(WrappedComponent) {
    class ConfirmDiscardFormChanges extends React.Component {
        componentDidUpdate() {
            this.promptDiscardFormChanges(this.props.dirty);
        }

        componentWillUnmount() {
            window.onbeforeunload = null;
        }

        promptDiscardFormChanges(isUnsaved = false) {
            window.onbeforeunload = isUnsaved && (() => true);
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
