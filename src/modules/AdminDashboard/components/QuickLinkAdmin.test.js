import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, within, screen, userEvent } from 'test-utils';
import QuickLinkAdmin from './QuickLinkAdmin';

const locale = {
    add: {
        title: 'Add new quick link',
    },
    edit: {
        title: 'Edit ',
    },
    delete: {
        title: 'DELETE ',
    },
    button: {
        delete: 'Delete',
        save: 'Save',
        deleteBusy: 'Deleting...',
        saveBusy: 'Saving...',
        cancel: 'Cancel',
    },
    fields: {
        title: 'Title',
        link: 'Link',
    },
};
const testRow = {
    qlk_id: 1,
    qlk_amount: 10,
    qlk_order: 1,
    qlk_title: 'Link 1',
    qlk_link: 'https://espace.library.uq.edu.au/records/search',
};

const testEmptyRow = { title: '', target: '' };

const setup = (props = {}, state = {}, renderer = render) => {
    const testProps = {
        locale,
        onSubmitClick: jest.fn(),
        onCancelClick: jest.fn(),
        ...props,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <QuickLinkAdmin {...testProps} />
        </WithReduxStore>,
    );
};

describe('QuickLinkAdmin', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
        mockApi.onAny().reply(200, {});
    });

    afterEach(() => {
        mockApi.reset();
    });

    const updateForm = async (formValues, validate = true) => {
        for (const key of Object.keys(formValues)) {
            const value = formValues[key];

            await userEvent.type(screen.getByTestId(`${key}-input`), value);
            validate && expect(within(screen.getByTestId(key)).queryByText('Required')).not.toBeInTheDocument();
        }
    };

    describe('ADD', () => {
        it('should render ADD form', () => {
            const { getByTestId, getByRole } = setup({
                item: testEmptyRow,
                action: 'ADD',
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            // empty form should be invalid
            expect(getByTestId('qlk_title-input').closest('div')).toHaveClass('Mui-error');
            expect(getByTestId('qlk_link-input').closest('div')).toHaveClass('Mui-error');

            expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
            expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });
        it('should handle form validation and submission', async () => {
            const submitFn = jest.fn();
            const cancelFn = jest.fn();
            const { getByTestId, getByRole } = setup({
                item: testEmptyRow,
                action: 'ADD',
                onSubmitClick: submitFn,
                onCancelClick: cancelFn,
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            // test input validation and button actions
            await userEvent.click(getByRole('button', { name: 'Cancel' }));
            expect(cancelFn).toHaveBeenCalled();

            await userEvent.click(getByRole('button', { name: 'Save' }));
            expect(submitFn).not.toHaveBeenCalled(); // form is invalid
            expect(within(getByTestId('qlk_title')).getByText('Required')).toBeInTheDocument();
            expect(within(getByTestId('qlk_link')).getByText('Required')).toBeInTheDocument();

            await updateForm({ qlk_title: 'Test title', qlk_link: 'Test link' });

            await userEvent.click(getByRole('button', { name: 'Save' }));
            expect(submitFn).toHaveBeenCalledWith(
                expect.objectContaining({ qlk_link: 'Test link', qlk_title: 'Test title' }),
                expect.anything(), // ignore second param data from react-hook-form
            ); // form is valid
        });
    });
    describe('EDIT', () => {
        it('should render EDIT form', async () => {
            const { getByTestId, getByRole } = setup({
                item: testRow,
                action: 'EDIT',
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            expect(getByTestId('qlk_title-input').closest('div')).not.toHaveClass('Mui-error');
            expect(getByTestId('qlk_link-input').closest('div')).not.toHaveClass('Mui-error');
            expect(getByTestId('qlk_title-input')).toHaveValue(testRow.qlk_title);
            expect(getByTestId('qlk_link-input')).toHaveValue(testRow.qlk_link);

            expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
            expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        it('should handle form validation and submission', async () => {
            const submitFn = jest.fn();
            const cancelFn = jest.fn();
            const { getByTestId, getByRole } = setup({
                item: testRow,
                action: 'EDIT',
                onSubmitClick: submitFn,
                onCancelClick: cancelFn,
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'Cancel' }));
            expect(cancelFn).toHaveBeenCalled();

            expect(within(getByTestId('qlk_title')).queryByText('Required')).not.toBeInTheDocument();
            expect(within(getByTestId('qlk_link')).queryByText('Required')).not.toBeInTheDocument();

            await updateForm({ qlk_title: ' updated', qlk_link: ' updated' });

            await userEvent.click(getByRole('button', { name: 'Save' }));
            expect(submitFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    qlk_link: `${testRow.qlk_link} updated`,
                    qlk_title: `${testRow.qlk_title} updated`,
                }),
                expect.anything(), // ignore second param data from react-hook-form
            ); // form is valid
        });
    });
    describe('DELETE', () => {
        it('should render DELETE form', () => {
            const { getByTestId, getByRole } = setup({
                item: testRow,
                action: 'DELETE',
                onSubmitClick: jest.fn(),
                onCancelClick: jest.fn(),
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            expect(getByTestId('qlk_title-input')).toHaveAttribute('disabled');
            expect(getByTestId('qlk_link-input')).toHaveAttribute('disabled');
            expect(getByTestId('qlk_title-input')).toHaveValue(testRow.qlk_title);
            expect(getByTestId('qlk_link-input')).toHaveValue(testRow.qlk_link);

            expect(getByRole('button', { name: 'Delete' })).toBeInTheDocument();
            expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        it('should handle form submission', async () => {
            const submitFn = jest.fn();
            const cancelFn = jest.fn();
            const { getByTestId, getByRole } = setup({
                item: testRow,
                action: 'DELETE',
                onSubmitClick: submitFn,
                onCancelClick: cancelFn,
            });

            expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: 'Cancel' }));
            expect(cancelFn).toHaveBeenCalled();
            await userEvent.click(getByRole('button', { name: 'Delete' }));
            expect(submitFn).toHaveBeenCalledWith(
                testRow,
                expect.anything(), // ignore second param data from react-hook-form
            );
        });
    });

    it('should disable buttons when busy', () => {
        const { getByTestId, getByRole } = setup({
            item: testRow,
            action: 'EDIT',
            busy: true,
        });

        expect(getByTestId('quicklinks-admin-form')).toBeInTheDocument();

        expect(getByRole('button', { name: 'Saving...' })).toHaveAttribute('disabled');
        expect(getByRole('button', { name: 'Cancel' })).toHaveAttribute('disabled');
    });
});
