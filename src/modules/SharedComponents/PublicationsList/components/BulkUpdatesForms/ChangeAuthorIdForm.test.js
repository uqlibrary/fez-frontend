import React from 'react';
import ChangeAuthorIdForm from './ChangeAuthorIdForm';
import { act, render, WithRouter, WithReduxStore, fireEvent, waitFor } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        recordsSelected: [
            {
                rek_pid: 'UQ:123456',
                fez_record_search_key_author: [{ rek_author: 'Test', rek_author_order: 1 }],
                fez_record_search_key_author_id: [{ rek_author_id: null }],
            },
            {
                rek_pid: 'UQ:1234',
                fez_record_search_key_author: [
                    { rek_author: 'Test', rek_author_order: 1 },
                    { rek_author: 'Testing', rek_author_order: 2 },
                ],
                fez_record_search_key_author_id: [
                    { rek_author_id: null },
                    { rek_author_id: 2, rek_author_id_order: 2, rek_author_id_id: 22 },
                ],
            },
            {
                rek_pid: 'UQ:4321',
                fez_record_search_key_author: [{ rek_author: 'Testing', rek_author_order: 1 }],
            },
        ],
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ChangeAuthorIdForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ChangeAuthorIdForm', () => {
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

    it('should correctly submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-author-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-author-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('rek-author-id-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-author-id-submit')).toHaveAttribute('disabled');

        // interact with the form
        act(() => {
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'Test' } });
        });

        // assert next state of the form
        expect(queryByTestId('rek-author-helper-text')).not.toBeInTheDocument();

        act(() => {
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        expect(queryByTestId('rek-author-id-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-author-id-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-author-id-submit'));
        });

        await waitFor(() => getByTestId('alert-done-change-author-id'));
        expect(getByTestId('alert-done-change-author-id')).toBeInTheDocument();
    });

    it('should submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500);
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-author-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-author-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('rek-author-id-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-author-id-submit')).toHaveAttribute('disabled');

        // interact with the form
        act(() => {
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'Test' } });
        });

        // assert next state of the form
        expect(queryByTestId('rek-author-helper-text')).not.toBeInTheDocument();

        act(() => {
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        expect(queryByTestId('rek-author-id-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-author-id-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-author-id-submit'));
        });

        await waitFor(() => getByTestId('alert-error-change-author-id'));
        expect(getByTestId('alert-error-change-author-id')).toBeInTheDocument();
    });
});
