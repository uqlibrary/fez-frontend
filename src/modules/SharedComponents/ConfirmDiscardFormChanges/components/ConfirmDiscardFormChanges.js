import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';

export const ConfirmDiscardFormChanges = props => {
    const { dirty = false, submitSucceeded = false, children } = props;

    useEffect(() => {
        if (!dirty || submitSucceeded) return () => {};

        window.onbeforeunload = () => locale.global.discardFormChangesConfirmation.confirmationMessage;
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
