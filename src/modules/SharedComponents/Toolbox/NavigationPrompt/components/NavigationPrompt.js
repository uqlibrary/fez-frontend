import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBlocker, useNavigate } from 'react-router-dom';

/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * https://gist.github.com/bummzack/a586533607ece482475e0c211790dd50
 */
const NavigationPrompt = ({ when, children }) => {
    const [nextLocation, setNextLocation] = useState(null);
    const [confirmationBox, setConfirmationBox] = useState(null);
    const navigate = useNavigate();

    const blockNavigation = (currentLocation, nextLocation) => {
        if (when && nextLocation.pathname !== currentLocation.pathname) {
            setNextLocation(nextLocation);
            confirmationBox.showConfirmation();
            return true;
        }

        return false;
    };

    const blocker = useBlocker(({ currentLocation, nextLocation }) => blockNavigation(currentLocation, nextLocation));

    const navigateToNextLocation = () => {
        blocker.proceed();
        navigate(nextLocation.pathname);
    };

    const setNavigationConfirmation = ref => {
        setConfirmationBox(ref);
    };

    const _onCancel = () => {
        blocker.reset();
        setNextLocation(null);
    };

    const _onConfirm = () => {
        navigateToNextLocation();
    };

    return <div>{children(setNavigationConfirmation, _onConfirm, _onCancel)}</div>;
};

NavigationPrompt.propTypes = {
    when: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
};

export default NavigationPrompt;
