import React from 'react';
import CopyToOrRemoveFromCollectionForm from './CopyToOrRemoveFromCollectionForm';
import {
    act,
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    waitForText,
    waitToBeDisabled,
    waitForTextToBeRemoved,
    waitToBeEnabled,
} from 'test-utils';
import * as repositories from 'repositories';
import { locale } from 'locale';

function setup(testProps = {}) {
    const props = {
        recordsSelected: {
            'UQ:123456': { rek_pid: 'UQ:123456', fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }] },
        },
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <CopyToOrRemoveFromCollectionForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('CopyToOrRemoveFromCollectionForm', () => {
    const assertFormInitialState = async idPrefix => {
        await waitForText(locale.validationErrors.required);
        await waitToBeDisabled(`${idPrefix}-collection-submit`);
    };
    const assertCopyToFormInitialState = async () => assertFormInitialState('copy-to');
    const assertRemoveFromFormInitialState = async () => assertFormInitialState('remove-from');

    const assertFormCanBeSubmitted = async idPrefix => {
        await waitForTextToBeRemoved(locale.validationErrors.required);
        await waitToBeEnabled(`${idPrefix}-collection-submit`);
    };
    const assertCopyToFormCanBeSubmitted = async () => assertFormCanBeSubmitted('copy-to');
    const assertRemoveFromFormCanBeSubmitted = async () => assertFormCanBeSubmitted('remove-from');

    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should correctly submit form and display success info for copy to collection form', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup();
        await assertCopyToFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));
        await assertCopyToFormCanBeSubmitted();

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-collection-submit'));
        });

        await waitFor(() => getByTestId('alert-done-copy-to-collection'));
        expect(getByTestId('alert-done-copy-to-collection')).toBeInTheDocument();
    });

    it('should submit form and display error for copy to collection form', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup();
        await assertCopyToFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));
        await assertCopyToFormCanBeSubmitted();

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-collection-submit'));
        });

        await waitFor(() => getByTestId('alert-error-copy-to-collection'));
        expect(getByTestId('alert-error-copy-to-collection')).toBeInTheDocument();
    });

    it('should correctly submit form and display success info for remove from collection', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup({ isRemoveFrom: true });
        await assertRemoveFromFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));
        await assertRemoveFromFormCanBeSubmitted();

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-collection-submit'));
        });

        await waitFor(() => getByTestId('alert-done-remove-from-collection'));
        expect(getByTestId('alert-done-remove-from-collection')).toBeInTheDocument();
    });

    it('should submit form and display error for remove from collection', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup({ isRemoveFrom: true });
        await assertRemoveFromFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));
        await assertRemoveFromFormCanBeSubmitted();

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-collection-submit'));
        });

        await waitFor(() => getByTestId('alert-error-remove-from-collection'));
        expect(getByTestId('alert-error-remove-from-collection')).toBeInTheDocument();
    });

    it('should display warning alert to user if work is being removed from all collections', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:123', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        expect(queryByTestId('alert-warning-remove-from-collection')).not.toBeInTheDocument();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));

        expect(getByTestId('alert-warning-remove-from-collection')).toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');
    });
    it('should display warning alert to user if an attempt to copy incorrect record exists in selected items', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 2 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:123', rek_title: 'Testing collection' },
                    { rek_pid: 'UQ:333', rek_title: 'Test collection' },
                ],
            });

        const { getByTestId, queryByTestId } = setup({
            recordsSelected: {
                'UQ:123456': {
                    rek_pid: 'UQ:123456',
                    rek_object_type: 2,
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }],
                },
            },
        });

        expect(queryByTestId('alert-warning-remove-from-collection')).not.toBeInTheDocument();

        expect(getByTestId('alert-info-copy-to-collection-notallowed')).toBeInTheDocument();
    });
});
