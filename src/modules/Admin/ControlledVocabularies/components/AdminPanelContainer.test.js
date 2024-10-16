import React from 'react';

import Immutable from 'immutable';
import locale from 'locale/components';

import { render, WithReduxStore, WithRouter, userEvent } from 'test-utils';

import AdminPanelContainer, { validate } from './AdminPanelContainer';
import { preview } from 'test-utils';

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

        const checkbox = getByTestId('cvo-hide-input').querySelector('input[type="checkbox"]');
        if (!!values.cvo_hide) {
            expect(checkbox).toBeChecked();
        } else {
            expect(checkbox).not.toBeChecked();
        }
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
        const { getByTestId } = setup({ onClose: mockCloseFn, onCancelAction: mockCancelFn, onAction: jest.fn() });
        await userEvent.click(getByTestId('update_dialog-cancel-button'));

        expect(mockCloseFn).toHaveBeenCalled();
        expect(mockCancelFn).toHaveBeenCalled();
    });
});
