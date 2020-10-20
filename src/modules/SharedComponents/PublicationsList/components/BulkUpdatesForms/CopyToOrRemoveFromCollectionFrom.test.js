import React from 'react';
import CopyToOrRemoveFromCollectionForm from './CopyToOrRemoveFromCollectionForm';
import { act, render, WithRouter, WithReduxStore, fireEvent, waitFor } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        recordsSelected: [{ rek_pid: 'UQ:123456', fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }] }],
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

        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-collection-submit')).not.toHaveAttribute('disabled');

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

        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-collection-submit')).not.toHaveAttribute('disabled');

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

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).not.toHaveAttribute('disabled');

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

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing collection'));

        // assert next state of the form
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).not.toHaveAttribute('disabled');

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
    });
});
