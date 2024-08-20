import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';

export const ConfirmDiscardFormChanges = props => {
    const { dirty = false, submitSucceeded = false, children } = props;

    const getDiscardFormChangesConfirmationLocale = () => {
        return locale.global.discardFormChangesConfirmation.confirmationMessage;
    };
    useEffect(() => {
        const promptDiscardFormChanges = () => {
            window.onbeforeunload = getDiscardFormChangesConfirmationLocale;
        };
        dirty && !submitSucceeded && promptDiscardFormChanges();

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
