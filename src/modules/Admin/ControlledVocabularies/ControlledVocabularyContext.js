import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

export const ControlledVocabulariesStateContext = createContext(null);
export const ControlledVocabulariesActionContext = createContext(null);

export const ACTION = {
    ADD: 'add',
    EDIT: 'edit',
    CLOSE: 'close',
};
export const defaultManageDialogState = {
    id: 'controlledVocabulary',
    isOpen: false,
    covId: undefined,
    vocab: undefined,
    title: undefined,
    action: '',
};
export const manageDialogReducer = (state, action) => {
    switch (action.type) {
        case ACTION.ADD:
            return {
                ...defaultManageDialogState,
                ...state,
                isOpen: true,
                title: 'Add vocabulary',
                action: action.type,
            };
        case ACTION.EDIT: {
            return {
                ...defaultManageDialogState,
                ...state,
                isOpen: true,
                title: 'Update vocabulary',
                action: action.type,
            };
        }
        case ACTION.CLOSE: {
            return {
                ...defaultManageDialogState,
            };
        }
        default:
            throw Error('Unknown action');
    }
};

export const ControlledVocabulariesProvider = ({ children }) => {
    const [manageDialogState, actionDispatch] = useReducer(manageDialogReducer, defaultManageDialogState);

    const onAdminAddActionClick = parentId => {
        console.log('onAdminAddActionClick', parentId);
        actionDispatch({ type: ACTION.ADD, parentId });
    };
    const onAdminEditActionClick = vocab => {
        console.log('onAdminEditActionClick', vocab);
        actionDispatch({ type: ACTION.ADD, vocab });
    };
    const onHandleDialogClickClose = () => {
        actionDispatch({ type: ACTION.CLOSE });
    };

    const onHandleDialogClickSave = data => {
        console.log('onManageDialogClickSave', data);
    };

    return (
        <ControlledVocabulariesStateContext.Provider value={manageDialogState}>
            <ControlledVocabulariesActionContext.Provider
                value={{
                    onAdminAddActionClick,
                    onAdminEditActionClick,
                    onHandleDialogClickClose,
                    onHandleDialogClickSave,
                }}
            >
                {children}
            </ControlledVocabulariesActionContext.Provider>
        </ControlledVocabulariesStateContext.Provider>
    );
};
ControlledVocabulariesProvider.propTypes = {
    children: PropTypes.node,
};
