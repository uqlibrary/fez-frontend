import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as actions from 'actions';

export const ControlledVocabulariesStateContext = createContext(null);
export const ControlledVocabulariesActionContext = createContext(null);

export const defaultPortalId = 'portal-root';
export const getPortalId = (cvoId, action) => (!!cvoId ? `portal-${action}-${cvoId}` : defaultPortalId);
export const ACTION = {
    ADD: 'add',
    EDIT: 'edit',
    CLOSE: 'close',
};
export const defaultManageDialogState = {
    id: 'controlledVocabulary',
    isOpen: false,
    parentId: undefined,
    title: undefined,
    action: '',
    portalId: undefined,
};
export const manageDialogReducer = (_, action) => {
    const { type, ...nextState } = action;
    switch (type) {
        case ACTION.ADD:
            return {
                ...defaultManageDialogState,
                ...nextState,
                action: type,
                isOpen: true,
                title: 'Add vocabulary',
            };
        case ACTION.EDIT: {
            return {
                ...defaultManageDialogState,
                ...nextState,
                action: type,
                isOpen: true,
                title: 'Update vocabulary',
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
    const dispatch = useDispatch();

    const onAdminAddActionClick = parentId => {
        console.log('onAdminAddActionClick', parentId);
        actionDispatch({ type: ACTION.ADD, parentId, portalId: getPortalId(parentId, ACTION.ADD) });
    };
    const onAdminEditActionClick = row => {
        console.log('onAdminEditActionClick', row);
        dispatch(actions.setAdminActionVocab(row));
        actionDispatch({
            type: ACTION.EDIT,
            cvo_id: row.cvo_id,
            parentId: row.cvr_parent_cvo_id,
            portalId: getPortalId(row.cvo_id, ACTION.EDIT),
        });
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
