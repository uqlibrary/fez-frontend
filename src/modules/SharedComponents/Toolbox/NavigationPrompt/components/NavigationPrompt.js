import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useBlocker, useNavigate } from 'react-router';

/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * https://gist.github.com/bummzack/a586533607ece482475e0c211790dd50
 */
const NavigationPrompt = ({ when, children }) => {
    const [pendingLocation, setPendingLocation] = useState(null);
    const [confirmationBox, setConfirmationBox] = useState(null);
    const [phase, setPhase] = useState('idle');
    const navigate = useNavigate();

    const resetPromptState = useCallback(() => {
        setPendingLocation(null);
        setPhase('idle');
    }, []);

    const blockNavigation = useCallback(
        (currentLocation, nextLocation) => {
            if (!when || !nextLocation?.pathname || nextLocation.pathname === currentLocation.pathname) {
                return false;
            }

            if (phase === 'blocked' && pendingLocation?.pathname === nextLocation.pathname) {
                return true;
            }

            setPendingLocation(nextLocation);
            setPhase('blocked');
            confirmationBox?.showConfirmation?.();
            return true;
        },
        [confirmationBox, pendingLocation, phase, when],
    );

    const blocker = useBlocker(({ currentLocation, nextLocation }) => blockNavigation(currentLocation, nextLocation));

    const navigateToNextLocation = useCallback(() => {
        if (blocker?.state === 'blocked' && blocker?.proceed) {
            confirmationBox?.hideConfirmation?.();
            setPhase('resolving');
            blocker.proceed();
            resetPromptState();
            return;
        }

        if (pendingLocation?.pathname) {
            navigate(pendingLocation.pathname);
            resetPromptState();
        }
    }, [blocker, confirmationBox, navigate, pendingLocation, resetPromptState]);

    const setNavigationConfirmation = useCallback(ref => {
        setConfirmationBox(ref);
    }, []);

    const _onCancel = useCallback(() => {
        confirmationBox?.hideConfirmation?.();
        blocker?.reset?.();
        resetPromptState();
    }, [blocker, confirmationBox, resetPromptState]);

    const _onConfirm = useCallback(() => {
        navigateToNextLocation();
    }, [navigateToNextLocation]);

    return <div>{children(setNavigationConfirmation, _onConfirm, _onCancel)}</div>;
};

NavigationPrompt.propTypes = {
    when: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
};

export default React.memo(NavigationPrompt);
