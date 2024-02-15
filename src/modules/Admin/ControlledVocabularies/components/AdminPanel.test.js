import React from 'react';

import Immutable from 'immutable';
import locale from 'locale/components';

import { render, WithReduxStore, WithRouter, userEvent, within, preview } from 'test-utils';

import AdminPanel from './AdminPanel';
/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

const setup = (testProps = {}, renderer = render) => {
    const props = { isOpen: true, action: 'add', id: 'test', initialize: jest.fn(), initialized: false, ...testProps };

    return renderer(
        <WithReduxStore initialState={Immutable.Map({})}>
            <WithRouter>
                <AdminPanel {...props} locale={locale.components.controlledVocabulary.admin} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('AdminPanel', () => {
    const ReduxFormMock = require('redux-form/immutable');
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disabled, label, floatingLabelText, textFieldId }) => {
            return (
                <input
                    is="mock"
                    name={name}
                    title={title}
                    required={required}
                    disabled={disabled}
                    label={label || floatingLabelText}
                    data-testid={`${textFieldId}-input`}
                />
            );
        },
    );

    const assertFields = getByTestId => {
        expect(getByTestId('cvo-title-input')).toBeInTheDocument();
        expect(getByTestId('cvo-desc-input')).toBeInTheDocument();
        expect(getByTestId('cvo-external-id-input')).toBeInTheDocument();
        expect(getByTestId('cvo-image-filename-input')).toBeInTheDocument();
        expect(getByTestId('cvo-order-input')).toBeInTheDocument();
    };

    it('should render form with parent style', () => {
        const { getByTestId } = setup();
        assertFields(getByTestId);
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-test-container')).toHaveStyle({
            'margin-block-end': '16px',
            'background-color': '#eee',
            padding: '20px',
            'box-shadow': 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        });
    });
    it('should render form without parent styles', () => {
        const { getByTestId } = setup({ parentId: 1 });

        assertFields(getByTestId);
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

    it('should not show a cancel button', () => {
        const { queryByTestId } = setup({ hideCancelButton: true });
        expect(queryByTestId('update_dialog-cancel-button')).not.toBeInTheDocument();
    });

    it('should not show an action button', () => {
        const { queryByTestId } = setup({ hideActionButton: true });
        expect(queryByTestId('update_dialog-action-button')).not.toBeInTheDocument();
    });
    it('should show a spinner in the action button when submitting', () => {
        const { getByTestId } = setup({ submitting: true });
        expect(
            within(getByTestId('update_dialog-action-button')).getByTestId('update_dialog-progress'),
        ).toBeInTheDocument();
    });

    it('should render an error panel', async () => {
        const { getByTestId } = setup({ error: { message: 'A test error occurred' } });
        preview.debug();
        expect(getByTestId('update_dialog-alert')).toHaveTextContent(/A test error occurred/);
    });
});
