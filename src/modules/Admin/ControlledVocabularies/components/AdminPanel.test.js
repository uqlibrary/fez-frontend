import React from 'react';
import { render, WithRouter, userEvent, waitFor, fireEvent, WithReduxStore } from 'test-utils';
import AdminPanel from './AdminPanel';
import locale from 'locale/components';

const setup = (testProps = {}, renderer = render) => {
    const props = {
        title: 'Test form',
        isOpen: true,
        action: 'add',
        id: 'test',
        onAction: jest.fn(),
        onClose: jest.fn(),
        locale: locale.components.controlledVocabulary.admin,
        initialValues: {
            cvo_title: '',
            cvo_desc: '',
            cvo_external_id: '',
            cvo_hide: false,
        },
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithRouter>
                <AdminPanel {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('AdminPanel', () => {
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

    it('should fire expected Cancel button functions', async () => {
        const mockCloseFn = jest.fn();
        const { getByTestId } = setup({ onClose: mockCloseFn });

        await userEvent.click(getByTestId('update_dialog-cancel-button'));
        expect(mockCloseFn).toHaveBeenCalled();
    });

    it('should fire expected Submit button functions', async () => {
        const mockSubmitFn = jest.fn();
        const { getByTestId } = setup({
            onAction: mockSubmitFn,
            initialValues: {
                cvo_title: '',
                cvo_desc: '',
                cvo_external_id: '',
            },
        });

        // Simulate typing valid inputs
        await userEvent.type(getByTestId('cvo-title-input'), 'Test title');
        await userEvent.type(getByTestId('cvo-desc-input'), 'Test description');

        // Ensure the submit button becomes enabled
        await waitFor(() => expect(getByTestId('update_dialog-action-button')).toBeEnabled());

        // Click the submit button
        await userEvent.click(getByTestId('update_dialog-action-button'));

        // Assert that the submit function was called
        expect(mockSubmitFn).toHaveBeenCalled();
    });

    it('should disable submit when form is invalid', async () => {
        const { getByTestId } = setup({
            initialValues: {
                cvo_title: '',
                cvo_desc: '',
                cvo_external_id: '',
            },
        });

        // Assert that the submit button is initially disabled
        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        // Simulate typing into the title input
        await userEvent.type(getByTestId('cvo-title-input'), 'T');

        // Wait for the submit button to become enabled
        await waitFor(() => expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled'));
    });

    it('should disable controls when submitting', async () => {
        const { getByTestId } = setup({
            initialValues: {
                cvo_title: '', // Start with an empty title
                cvo_desc: '',
                cvo_external_id: '',
            },
        });

        let titleInput = getByTestId('cvo-title-input');
        let submitButton = getByTestId('update_dialog-action-button');
        fireEvent.focus(titleInput);
        await userEvent.type(titleInput, 'Valid Title');
        fireEvent.blur(titleInput);

        await waitFor(async () => {
            expect(submitButton).toBeEnabled();
        });
        userEvent.click(submitButton);
        await waitFor(() => expect(submitButton).toBeDisabled());
        await waitFor(() => expect(submitButton).toBeEnabled());
    });

    it('should show Required', async () => {
        const { getByTestId } = setup({});
        let titleInput = getByTestId('cvo-title-input');
        fireEvent.focus(titleInput);
        fireEvent.change(titleInput, { target: { value: 'new value' } });
        fireEvent.change(titleInput, { target: { value: '' } });
        await waitFor(() => {
            expect(getByTestId('title-require-error')).toBeInTheDocument();
        });
    });
});
