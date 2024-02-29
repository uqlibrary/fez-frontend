import React, { useEffect, useState } from 'react';
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
    const navigate = useNavigate();
    let confirmationBox = null;

    const blockNavigation = nextLocation => {
        if (when) {
            setNextLocation(nextLocation);
            confirmationBox.showConfirmation();
            // return !when;
        }

        return when;
    };

    const blocker = useBlocker(({ nextLocation }) => blockNavigation(nextLocation));

    useEffect(() => {
        return () => {
            blocker && blocker.state === 'blocked' && blocker.reset();
        };
    }, [blocker, confirmationBox]);

    const navigateToNextLocation = () => {
        blocker.rest();
        navigate(nextLocation.pathname);
    };

    const setNavigationConfirmation = ref => {
        confirmationBox = ref;
    };

    const _onCancel = () => {
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
