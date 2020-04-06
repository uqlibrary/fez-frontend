import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';

function confirmDiscardFormChanges(WrappedComponent) {
    const ConfirmDiscardFormChanges = props => {
        const { dirty, submitSucceeded } = props;

        const getDiscardFormChangesConfirmationLocale = () => {
            return locale.global.discardFormChangesConfirmation.confirmationMessage;
        };

        useEffect(() => {
            const promptDiscardFormChanges = (isDirty = false) => {
                window.onbeforeunload = isDirty && getDiscardFormChangesConfirmationLocale;
            };
            promptDiscardFormChanges(dirty && !submitSucceeded);

            return () => {
                window.onbeforeunload = null;
            };
        }, [dirty, submitSucceeded]);

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

export const ConfirmDiscardFormChanges = props => {
    const { dirty, submitSucceeded, children } = props;
    const getDiscardFormChangesConfirmationLocale = () => {
        return locale.global.discardFormChangesConfirmation.confirmationMessage;
    };
    useEffect(() => {
        const promptDiscardFormChanges = () => {
            console.log('logging');
            window.onbeforeunload = getDiscardFormChangesConfirmationLocale;
        };
        dirty && !submitSucceeded && promptDiscardFormChanges();

        console.log(window.onbeforeunload);
        return () => {
            window.onbeforeunload = null;
        };
    }, [dirty, submitSucceeded]);

    return [children];
};

ConfirmDiscardFormChanges.propTypes = {
    dirty: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

ConfirmDiscardFormChanges.defaultProps = {
    dirty: false,
    submitSucceeded: false,
};
