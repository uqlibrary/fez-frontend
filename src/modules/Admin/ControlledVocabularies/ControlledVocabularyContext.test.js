import React, { useContext } from 'react';
import { render, WithReduxStore, userEvent, preview } from 'test-utils';

import Immutable from 'immutable';
import Button from '@mui/material/Button';

import {
    defaultPortalId,
    getPortalId,
    ACTION,
    defaultManageDialogState,
    manageDialogReducer,
    ControlledVocabulariesProvider,
    ControlledVocabulariesActionContext,
} from './ControlledVocabularyContext';

describe('getPortalId', () => {
    it('should format string as expected', () => {
        expect(getPortalId()).toEqual(defaultPortalId);
        expect(getPortalId(null, 'add')).toEqual(defaultPortalId);
        expect(getPortalId(null, 'edit')).toEqual(defaultPortalId);
        expect(getPortalId(1, 'add')).toEqual('portal-add-1');
        expect(getPortalId(100, 'edit')).toEqual('portal-edit-100');
        expect(getPortalId(100)).toEqual('portal-undefined-100');
    });
});

describe('manageDialogReducer', () => {
    it('should return error for unknown action', () => {
        expect(() => manageDialogReducer(null, ACTION.CLOSE)).toThrow(/Unknown action:/);
        expect(() => manageDialogReducer(null, { type: 'invalid' })).toThrow(/Unknown action: invalid/);
    });
    it('should return expected ADD state', () => {
        const expected = {
            id: 'controlledVocabulary',
            isOpen: true,
            parentId: undefined,
            title: 'Add vocabulary',
            action: 'add',
            portalId: undefined,
            newProp: true,
        };
        const actual = manageDialogReducer(null, { type: ACTION.ADD, newProp: true });
        expect(actual).toMatchObject(expected);
    });
    it('should return expected EDIT state', () => {
        const expected = {
            id: 'controlledVocabulary',
            isOpen: true,
            parentId: undefined,
            title: 'Update vocabulary',
            action: 'edit',
            portalId: undefined,
            newProp: true,
        };
        const actual = manageDialogReducer(null, { type: ACTION.EDIT, newProp: true });
        expect(actual).toMatchObject(expected);
    });
    it('should return expected CLOSE state', () => {
        expect(manageDialogReducer(null, { type: ACTION.CLOSE })).toMatchObject(defaultManageDialogState);
    });
});

describe('ControlledVocabulariesProvider', () => {
    const Child = () => {
        const { onAdminAddActionClick, onHandleDialogClickClose, onAdminEditActionClick } = useContext(
            ControlledVocabulariesActionContext,
        );

        return (
            <div data-testid="testDiv">
                <Button onClick={() => onAdminAddActionClick(123)}>Add</Button>
                <Button onClick={() => onAdminEditActionClick({ parentId: 456, row: { test: true } })}>Edit</Button>
                <Button onClick={onHandleDialogClickClose}>Close</Button>
            </div>
        );
    };

    function setup(formValues = {}, state = {}) {
        return render(
            <WithReduxStore initialState={Immutable.Map(state)}>
                <ControlledVocabulariesProvider>
                    <Child />
                </ControlledVocabulariesProvider>
            </WithReduxStore>,
        );
    }

    it('renders children', () => {
        const { getByTestId } = setup();
        expect(getByTestId('testDiv')).toBeInTheDocument();
    });
    it('renders and fires context functions as expected', () => {
        const { getByTestId } = setup();
        // here - spy on reducer function and make sure buttons fire expected functions.
        expect(getByTestId('testDiv')).toBeInTheDocument();
    });
});
