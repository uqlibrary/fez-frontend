import React from 'react';
import PropTypes from 'prop-types';
import NavigationPrompt from './NavigationPrompt';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

const NavigationDialogBox = ({ when, txt }) => {
    if (!when) return <span />;
    return (
        <NavigationPrompt when={when}>
            {(_setNavigationConfirmation, _onConfirm, _onCancel) => (
                <ConfirmDialogBox
                    onRef={_setNavigationConfirmation}
                    onAction={_onConfirm}
                    onCancelAction={_onCancel}
                    locale={txt}
                />
            )}
        </NavigationPrompt>
    );
};

NavigationDialogBox.propTypes = {
    when: PropTypes.bool.isRequired,
    txt: PropTypes.object,
};

export default NavigationDialogBox;
