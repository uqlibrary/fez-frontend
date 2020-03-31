import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';

function confirmDiscardFormChanges(WrappedComponent) {
    const ConfirmDiscardFormChanges = props => {
        const { dirty, submitSucceeded } = props;

        const getDiscardFormChangesConfirmationLocale = () =>
            locale.global.discardFormChangesConfirmation.confirmationMessage;

        const promptDiscardFormChanges = useCallback((isDirty = false) => {
            window.onbeforeunload = isDirty && getDiscardFormChangesConfirmationLocale;
        }, []);

        useEffect(() => {
            promptDiscardFormChanges(dirty && !submitSucceeded);

            return () => {
                window.onbeforeunload = null;
            };
        }, [dirty, promptDiscardFormChanges, submitSucceeded]);

        return <WrappedComponent {...props} />;
    };

    ConfirmDiscardFormChanges.propTypes = {
        dirty: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
    };

    ConfirmDiscardFormChanges.defaultProps = {
        dirty: false,
        submitSucceeded: false,
    };

    return ConfirmDiscardFormChanges;
}

export default confirmDiscardFormChanges;
