import React from 'react';

import Immutable from 'immutable';
import locale from 'locale/components';

import { render, WithReduxStore, WithRouter, userEvent } from 'test-utils';

import AdminPanelContainer, { validate } from './AdminPanelContainer';

describe('AdminPanelContainer', () => {
    it('validate function returns expected results', () => {
        const input1 = Immutable.Map({
            cvo_title: null,
        });
        expect(validate(input1)).toEqual({ cvo_title: 'Required' });

        const input2 = Immutable.Map({
            cvo_title: 'abc',
        });
        expect(validate(input2)).toEqual({});

        const input3a = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: null,
        });
        expect(validate(input3a)).toEqual({});

        const input3b = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: undefined,
        });
        expect(validate(input3b)).toEqual({});

        const input3c = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: '',
        });
        expect(validate(input3c)).toEqual({});

        const input4 = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: 'abc',
        });
        expect(validate(input4)).toEqual({ cvo_order: 'Must be a number' });

        const input5a = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: -1,
        });
        expect(validate(input5a)).toEqual({ cvo_order: 'Must be a whole number above zero' });
        const input5b = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: 1.1,
        });
        expect(validate(input5b)).toEqual({ cvo_order: 'Must be a whole number above zero' });
    });
});

describe('AdminPanel with React-Hook-Form', () => {
    const setup = (testProps = {}, renderer = render) => {
        const props = { isOpen: true, action: 'add', id: 'test', onAction: jest.fn(), ...testProps };

        return renderer(
            <WithReduxStore>
                <WithRouter>
                    <AdminPanelContainer {...props} locale={locale.components.controlledVocabulary.admin} />
                </WithRouter>
            </WithReduxStore>,
        );
    };

    const assertFieldValues = (getByTestId, values = {}) => {
        expect(getByTestId('cvo-title-input')).toHaveValue(values.cvo_title ?? '');
        expect(getByTestId('cvo-desc-input')).toHaveValue(values.cvo_desc ?? '');
        expect(getByTestId('cvo-external-id-input')).toHaveValue(values.cvo_external_id ?? '');
        if (!!values.cvo_hide) expect(getByTestId('cvo-hide-input')).toBeChecked();
        else expect(getByTestId('cvo-hide-input')).not.toBeChecked();
    };

    it('should render an empty ADD form with expected fields', () => {
        const { getByTestId } = setup();
        assertFieldValues(getByTestId);
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-test-container')).toHaveStyle({
            'margin-block-end': '16px',
            'background-color': '#eee',
            padding: '20px',
            'box-shadow': 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        });
    });
    it('should render an empty child ADD form without parent styles', () => {
        const { getByTestId } = setup({ parentId: 1 });

        assertFieldValues(getByTestId);
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-test-container')).not.toHaveStyle({
            'margin-block-end': '16px',
            'background-color': '#eee',
            padding: '20px',
            'box-shadow': 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        });
    });

    it('should fire expected Cancel button functions', async () => {
        const mockCloseFn = jest.fn();
        const mockCancelFn = jest.fn();
        const { getByTestId } = setup({ onClose: mockCloseFn, onCancelAction: mockCancelFn });
        await userEvent.click(getByTestId('update_dialog-cancel-button'));

        expect(mockCloseFn).toHaveBeenCalled();
        expect(mockCancelFn).toHaveBeenCalled();
    });

    it('should render EDIT form with values and call submit function', async () => {
        const mockActionFn = jest.fn(() => jest.fn());
        const expected = {
            cvo_title: 'Test title',
            cvo_desc: 'Test dec',
            cvo_external_id: 'Test id',
            cvo_image_filename: 'Test filename',
            cvo_order: '1',
            cvo_hide: true,
        };
        const { getByTestId } = setup({ onAction: mockActionFn });

        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('cvo-title-input'), expected.cvo_title);
        await userEvent.type(getByTestId('cvo-desc-input'), expected.cvo_desc);
        await userEvent.type(getByTestId('cvo-external-id-input'), expected.cvo_external_id);
        await userEvent.click(getByTestId('cvo-hide-input'));

        assertFieldValues(getByTestId, expected);

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        await userEvent.click(getByTestId('update_dialog-action-button'));
        expect(mockActionFn).toHaveBeenCalled();
    });

    it('should render EDIT form with values and call submit function with ID', async () => {
        const mockActionFn = jest.fn(() => jest.fn());
        const expected = {
            cvo_title: 'Test title',
            cvo_desc: 'Test dec',
            cvo_external_id: 'Test id',
            cvo_image_filename: 'Test filename',
            cvo_order: '1',
            cvo_hide: true,
        };
        const parentId = 1234;
        const rootVocabId = 567;
        const { getByTestId } = setup({ onAction: mockActionFn, parentId, rootVocabId });

        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('cvo-title-input'), expected.cvo_title);
        await userEvent.type(getByTestId('cvo-desc-input'), expected.cvo_desc);
        await userEvent.type(getByTestId('cvo-external-id-input'), expected.cvo_external_id);
        await userEvent.click(getByTestId('cvo-hide-input'));

        await userEvent.click(getByTestId('update_dialog-action-button'));
        expect(mockActionFn).toHaveBeenCalledWith(parentId, rootVocabId);
    });
});
