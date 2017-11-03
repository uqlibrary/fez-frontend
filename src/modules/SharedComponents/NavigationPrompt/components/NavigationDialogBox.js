import React from 'react';
import PropTypes from 'prop-types';
import {default as NavigationPrompt} from './NavigationPrompt';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';
import {locale} from 'config';

const NavigationDialogBox = ({when, txt}) => {
    return (
        <NavigationPrompt when={when}>
            {
                (_setNavigationConfirmation, onConfirm, onCancel) => (
                    <ConfirmDialogBox
                        onRef={_setNavigationConfirmation}
                        onAction={onConfirm}
                        onCancelAction={onCancel}
                        locale={txt}/>
                )
            }
        </NavigationPrompt>
    );
};

NavigationDialogBox.propTypes = {
    when: PropTypes.bool.isRequired,
    txt: PropTypes.object
};

NavigationDialogBox.defaultProps = {
    txt: locale.global.discardFormChangesConfirmation
};

export default NavigationDialogBox;
