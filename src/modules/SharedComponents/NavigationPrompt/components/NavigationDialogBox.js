import React from 'react';
import PropTypes from 'prop-types';
import {default as NavigationPrompt} from './NavigationPrompt';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

const NavigationDailogBox = ({when, locale}) => {
    return (
        <NavigationPrompt when={when}>
            {
                (_setNavigationConfirmation, onConfirm, onCancel) => (
                    <ConfirmDialogBox
                        onRef={_setNavigationConfirmation}
                        onAction={onConfirm}
                        onCancelAction={onCancel}
                        locale={locale}/>
                )
            }
        </NavigationPrompt>
    );
};

NavigationDailogBox.propTypes = {
    when: PropTypes.bool.isRequired,
    locale: PropTypes.object.isRequired
};

export default NavigationDailogBox;
