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
    it('should correctly submit form and display success info for copy to collection form', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:111', rek_title: 'Testing community' }] });
        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 }] });

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitFor(() => getByText('Please select a community'));

        // assert initial state of the form
        expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-ismemberof-select')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitFor(() => getByText('Please select a collection'));

        // assert next state of the form
        expect(queryByTestId('community-pid-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-select')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing collection (Public)'));

        // assert next state of the form on display type selected (e.g. Research book)
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
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:111', rek_title: 'Testing community' }] });
        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 }] });

        const { getByTestId, getByText, queryByTestId } = setup();

        await waitFor(() => getByText('Please select a community'));

        // assert initial state of the form
        expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-ismemberof-select')).not.toBeInTheDocument();
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitFor(() => getByText('Please select a collection'));

        // assert next state of the form
        expect(queryByTestId('community-pid-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-select')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('copy-to-collection-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing collection (Public)'));

        // assert next state of the form on display type selected (e.g. Research book)
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
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:111', rek_title: 'Testing community' }] });
        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 }] });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        await waitFor(() => getByText('Please select a community'));

        // assert initial state of the form
        expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-ismemberof-select')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitFor(() => getByText('Please select a collection'));

        // assert next state of the form
        expect(queryByTestId('community-pid-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-select')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing collection (Public)'));

        // assert next state of the form on display type selected (e.g. Research book)
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
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:111', rek_title: 'Testing community' }] });
        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:111' }).apiUrl)
            .replyOnce(200, { data: [{ rek_pid: 'UQ:222', rek_title: 'Testing collection', rek_security_policy: 5 }] });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        await waitFor(() => getByText('Please select a community'));

        // assert initial state of the form
        expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-ismemberof-select')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Testing community'));

        await waitFor(() => getByText('Please select a collection'));

        // assert next state of the form
        expect(queryByTestId('community-pid-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-select')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-ismemberof-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('remove-from-collection-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-ismemberof-select'));
        fireEvent.click(getByText('Testing collection (Public)'));

        // assert next state of the form on display type selected (e.g. Research book)
        expect(queryByTestId('rek-ismemberof-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('remove-from-collection-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-collection-submit'));
        });

        await waitFor(() => getByTestId('alert-error-remove-from-collection'));
        expect(getByTestId('alert-error-remove-from-collection')).toBeInTheDocument();
    });
});
