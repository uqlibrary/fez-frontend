import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';

const getDiscardFormChangesConfirmationLocale = event => {
    event.preventDefault();
    // legacy support
    event.returnValue = locale.global.discardFormChangesConfirmation.confirmationMessage;
    return locale.global.discardFormChangesConfirmation.confirmationMessage;
};

export const ConfirmDiscardFormChanges = props => {
    const { dirty = false, submitSucceeded = false, children } = props;

    useEffect(() => {
        if (!dirty || submitSucceeded) return () => {};

        window.onbeforeunload = getDiscardFormChangesConfirmationLocale;
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
