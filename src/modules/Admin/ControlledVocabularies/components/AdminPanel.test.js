import React from 'react';

import Immutable from 'immutable';
import locale from 'locale/components';

import { render, WithReduxStore, WithRouter, userEvent, within, createMatchMedia } from 'test-utils';

import AdminPanel from './AdminPanel';
/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

const setup = (testProps = {}, renderer = render) => {
    const props = {
        title: 'Test form',
        isOpen: true,
        action: 'add',
        id: 'test',
        initialize: jest.fn(),
        initialized: false,
        ...testProps,
    };

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
        ({ name, title, required, disabled, label, floatingLabelText, textFieldId, id }) => {
            return (
                <input
                    is="mock"
                    name={name}
                    title={title}
                    required={required}
                    disabled={disabled}
                    label={label || floatingLabelText}
                    data-testid={`${textFieldId ?? id}-input`}
                />
            );
        },
    );

    const assertFields = getByTestId => {
        expect(getByTestId('cvo-title-input')).toBeInTheDocument();
        expect(getByTestId('cvo-desc-input')).toBeInTheDocument();
        expect(getByTestId('cvo-external-id-input')).toBeInTheDocument();
    };

    it('should not render if isOpen is false', () => {
        const { queryByTestId } = setup({ isOpen: false });
        expect(queryByTestId('update_dialog-test-container')).not.toBeInTheDocument();
    });

    it('should render form with parent style', () => {
        const { getByTestId } = setup();

        assertFields(getByTestId);
        expect(getByTestId('update_dialog-test-header')).toHaveTextContent('Test form');
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-test-container')).toHaveStyle({
            'margin-block-end': '16px',
            'background-color': '#eee',
            padding: '20px',
            'box-shadow': 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        });
        expect(getByTestId('update_dialog-test-vc-content')).toHaveStyle({
            'min-width': '300px',
            padding: '16px',
        });
    });

    it('should render with minimal content div styles (coverage)', () => {
        const { getByTestId } = setup({ noMinContentWidth: true });
        expect(getByTestId('update_dialog-test-vc-content')).toHaveStyle({
            'min-width': 'auto',
            padding: '16px',
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

    it('should fire expected Submit button functions', async () => {
        const mockSubmitBtn = jest.fn();
        const { getByTestId } = setup({ handleSubmit: mockSubmitBtn, valid: true });

        await userEvent.click(getByTestId('update_dialog-action-button'));

        expect(mockSubmitBtn).not.toHaveBeenCalled();

        await userEvent.type(getByTestId('cvo-title-input'), 'Test title');

        await userEvent.click(getByTestId('update_dialog-action-button'));

        expect(mockSubmitBtn).toHaveBeenCalled();
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

    it('should render an error panel', async () => {
        const { getByTestId } = setup({ error: { message: 'A test error occurred' } });
        expect(getByTestId('update_dialog-alert')).toHaveTextContent(/A test error occurred/);
    });

    it('should render buttons in desktop size when above phone breakpoint', () => {
        window.matchMedia = createMatchMedia(800);
        const { getByTestId } = setup({});
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveClass('MuiButton-fullWidth');
        expect(getByTestId('update_dialog-action-button')).not.toHaveClass('MuiButton-fullWidth');
    });
    it('should render buttons in mobile size when in phone breakpoint', () => {
        window.matchMedia = createMatchMedia(420);
        const { getByTestId } = setup({});
        expect(getByTestId('update_dialog-cancel-button')).toHaveClass('MuiButton-fullWidth');
        expect(getByTestId('update_dialog-action-button')).toHaveClass('MuiButton-fullWidth');
    });
    it('should disable controls when submitting is true', () => {
        const { getByTestId } = setup({ submitting: true });
        expect(getByTestId('cvo-title-input')).toHaveAttribute('disabled');
        expect(getByTestId('cvo-desc-input')).toHaveAttribute('disabled');
        expect(getByTestId('cvo-external-id-input')).toHaveAttribute('disabled');
        expect(getByTestId('cvo-hide-input')).toHaveAttribute('disabled');
        expect(
            within(getByTestId('update_dialog-action-button')).getByTestId('update_dialog-progress'),
        ).toBeInTheDocument();
        expect(getByTestId('update_dialog-cancel-button')).toHaveAttribute('disabled');
    });
    it('should disable submit when pristine is true', () => {
        const { getByTestId } = setup({ pristine: true });
        expect(getByTestId('cvo-title-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-desc-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-external-id-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-hide-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');
    });
    it('should disable submit when valid is false', () => {
        const { getByTestId } = setup({ valid: false });
        expect(getByTestId('cvo-title-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-desc-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-external-id-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('cvo-hide-input')).not.toHaveAttribute('disabled');
        expect(getByTestId('update_dialog-cancel-button')).not.toHaveAttribute('disabled');

        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');
    });
});
