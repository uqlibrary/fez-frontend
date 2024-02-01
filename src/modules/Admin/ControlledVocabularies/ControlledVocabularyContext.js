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
    parentId: undefined,
    row: {},
    title: undefined,
    action: '',
};
export const manageDialogReducer = (_, action) => {
    const { type, row, ...nextState } = action;
    switch (type) {
        case ACTION.ADD:
            return {
                ...defaultManageDialogState,
                ...nextState,
                action: type,
                isOpen: true,
                title: 'Add vocabulary',
                row: {
                    ...row,
                    ...(nextState.parentId ? { cvr_parent_cvo_id: nextState.parentId } : {}),
                },
            };
        case ACTION.EDIT: {
            return {
                ...defaultManageDialogState,
                ...nextState,
                action: type,
                isOpen: true,
                title: 'Update vocabulary',
                row,
            };
        }
        case ACTION.CLOSE: {
            return {
                ...defaultManageDialogState,
            };
        }
        default:
            throw Error('Unknown action: ', action);
    }
};

export const ControlledVocabulariesProvider = ({ children }) => {
    const [manageDialogState, actionDispatch] = useReducer(manageDialogReducer, defaultManageDialogState);

    const onAdminAddActionClick = parentId => {
        console.log('onAdminAddActionClick', parentId);
        actionDispatch({ type: ACTION.ADD, parentId });
    };
    const onAdminEditActionClick = row => {
        console.log('onAdminEditActionClick', row);
        actionDispatch({ type: ACTION.EDIT, row });
    };
    const onHandleDialogClickClose = () => {
        actionDispatch({ type: ACTION.CLOSE });
    };

    return (
        <ControlledVocabulariesStateContext.Provider value={manageDialogState}>
            <ControlledVocabulariesActionContext.Provider
                value={{
                    actionDispatch,
                    onAdminAddActionClick,
                    onAdminEditActionClick,
                    onHandleDialogClickClose,
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
