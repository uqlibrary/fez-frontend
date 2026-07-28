import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    const confirmationBoxRef = useRef(null);
    const phaseRef = useRef('idle');
    const lastShownLocationRef = useRef(null);
    const navigate = useNavigate();

    const resetPromptState = useCallback(() => {
        setPendingLocation(null);
        setPhase('idle');
        phaseRef.current = 'idle';
        lastShownLocationRef.current = null;
    }, []);

    useEffect(() => {
        if (phase === 'blocked' && pendingLocation?.pathname && confirmationBoxRef.current) {
            if (lastShownLocationRef.current !== pendingLocation.pathname) {
                confirmationBoxRef.current.showConfirmation?.();
                lastShownLocationRef.current = pendingLocation.pathname;
            }
            return;
        }

        if (phase === 'idle') {
            confirmationBoxRef.current?.hideConfirmation?.();
            lastShownLocationRef.current = null;
        }
    }, [confirmationBox, pendingLocation, phase]);

    useEffect(() => {
        if (!when && phase !== 'idle') {
            confirmationBoxRef.current?.hideConfirmation?.();
            resetPromptState();
        }
    }, [phase, resetPromptState, when]);

    const blockNavigation = useCallback(
        (currentLocation, nextLocation) => {
            if (!when || !nextLocation?.pathname || nextLocation.pathname === currentLocation.pathname) {
                return false;
            }

            if (phaseRef.current === 'resolving') {
                return false;
            }

            if (phaseRef.current === 'blocked' && pendingLocation?.pathname === nextLocation.pathname) {
                return true;
            }

            setPendingLocation(nextLocation);
            setPhase('blocked');
            phaseRef.current = 'blocked';
            return true;
        },
        [pendingLocation, when],
    );

    const blocker = useBlocker(({ currentLocation, nextLocation }) => blockNavigation(currentLocation, nextLocation));

    const navigateToNextLocation = useCallback(() => {
        if (blocker?.state === 'blocked' && blocker?.proceed) {
            confirmationBoxRef.current?.hideConfirmation?.();
            setPhase('resolving');
            phaseRef.current = 'resolving';
            lastShownLocationRef.current = null;
            blocker.proceed();
            return;
        }

        if (pendingLocation?.pathname) {
            navigate(pendingLocation.pathname);
            resetPromptState();
        }
    }, [blocker, navigate, pendingLocation, resetPromptState]);

    const setNavigationConfirmation = useCallback(ref => {
        confirmationBoxRef.current = ref;
        setConfirmationBox(ref);
    }, []);

    const _onCancel = useCallback(() => {
        confirmationBoxRef.current?.hideConfirmation?.();
        blocker?.reset?.();
        resetPromptState();
    }, [blocker, resetPromptState]);

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
