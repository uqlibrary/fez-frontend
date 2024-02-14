import React from 'react';
import { render, WithReduxStore } from 'test-utils';

import Immutable from 'immutable';

import * as Context from './ControlledVocabularyContext';

describe('ControlledVocabularyContext', () => {
    describe('getPortalId', () => {
        it('should format string as expected', () => {
            expect(Context.getPortalId()).toEqual(Context.defaultPortalId);
            expect(Context.getPortalId(null, 'add')).toEqual(Context.defaultPortalId);
            expect(Context.getPortalId(null, 'edit')).toEqual(Context.defaultPortalId);
            expect(Context.getPortalId(1, 'add')).toEqual('portal-add-1');
            expect(Context.getPortalId(100, 'edit')).toEqual('portal-edit-100');
            expect(Context.getPortalId(100)).toEqual('portal-undefined-100');
        });
    });

    describe('manageDialogReducer', () => {
        it('should return error for unknown action', () => {
            expect(() => Context.manageDialogReducer(null, Context.ACTION.CLOSE)).toThrow(/Unknown action:/);
            expect(() => Context.manageDialogReducer(null, { type: 'invalid' })).toThrow(/Unknown action: invalid/);
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
            const actual = Context.manageDialogReducer(null, { type: Context.ACTION.ADD, newProp: true });
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
            const actual = Context.manageDialogReducer(null, { type: Context.ACTION.EDIT, newProp: true });
            expect(actual).toMatchObject(expected);
        });
        it('should return expected CLOSE state', () => {
            expect(Context.manageDialogReducer(null, { type: Context.ACTION.CLOSE })).toMatchObject(
                Context.defaultManageDialogState,
            );
        });
    });

    describe('ControlledVocabulariesProvider', () => {
        const Child = () => <div data-testid="testDiv" />;

        function setup(state = {}) {
            return render(
                <WithReduxStore initialState={Immutable.Map(state)}>
                    <Context.ControlledVocabulariesProvider>
                        <Child />
                    </Context.ControlledVocabulariesProvider>
                </WithReduxStore>,
            );
        }

        it('renders children', () => {
            const { getByTestId } = setup();
            expect(getByTestId('testDiv')).toBeInTheDocument();
        });
    });
});
