import React from 'react';
import ChangeAuthorIdForm from './ChangeAuthorIdForm';
import {
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    expectApiRequestToMatchSnapshot,
    api,
    turnOnJestPreviewOnTestFailure,
    waitForText,
    assertEnabled,
    assertDisabled,
    userEvent,
} from 'test-utils';
import * as repositories from 'repositories';
import { screen } from '@testing-library/react';
import { locale } from '../../../../../locale';

function setup(testProps = {}) {
    const props = {
        recordsSelected: {
            'UQ:123456': {
                rek_pid: 'UQ:123456',
                fez_record_search_key_author: [{ rek_author: 'Test', rek_author_order: 1 }],
                fez_record_search_key_author_id: [{ rek_author_id: null }],
            },
            'UQ:1234': {
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
            'UQ:4321': {
                rek_pid: 'UQ:4321',
                fez_record_search_key_author: [{ rek_author: 'Testing', rek_author_order: 1 }],
                fez_record_search_key_author_id: [
                    { rek_author_id: null },
                    { rek_author_id: 2, rek_author_id_order: 2, rek_author_id_id: 22 },
                ],
            },
        },
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
    turnOnJestPreviewOnTestFailure();
    const assertRequiredFieldError = async field =>
        await waitFor(() => {
            expect(screen.getByTestId(`${field}-helper-text`)).toBeInTheDocument();
            expect(screen.getByTestId(`${field}-helper-text`)).toHaveTextContent('This field is required');
        });

    const assertNoRequiredFieldError = async field =>
        await waitFor(() => {
            expect(screen.queryByTestId(`${field}-helper-text`)).not.toBeInTheDocument();
        });

    const assertFormInitialState = async () => {
        await waitForText(
            new RegExp(locale.components.bulkUpdates.bulkUpdatesForms.changeAuthorIdForm.alert.message, 'i'),
        );
        await assertRequiredFieldError('search-author-by');
        await assertRequiredFieldError('rek-author-id');
        await assertNoRequiredFieldError('search-by-rek-author');
        await assertNoRequiredFieldError('search-by-rek-author-id');
        assertDisabled('change-author-id-submit');
    };

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

    it('should correctly search by author name, submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-author-by-select'));
        await waitFor(() => getByTestId('search-author-by-options'));
        fireEvent.click(getByText('Author name'));

        await assertRequiredFieldError('search-by-rek-author');

        fireEvent.change(getByTestId('search-by-rek-author-input'), { target: { value: 'Test' } });

        // assert next state of the form
        await assertNoRequiredFieldError('search-by-rek-author');

        expect(getByTestId('alert-warning-change-author-id')).toHaveTextContent(
            '1 of the 3 works you have selected do not match and will not be updated',
        );

        fireEvent.click(getByTestId('rek-author-id-input'));
        fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        await waitFor(() => getByTestId('rek-author-id-options')).then(() => {
            fireEvent.click(getByText('Testing'));
        });

        // assert next state of the form
        await assertNoRequiredFieldError('rek-author-id');
        assertEnabled('change-author-id-submit');

        // submit form
        fireEvent.click(getByTestId('change-author-id-submit'));

        await waitFor(() => expect(getByTestId('alert-done-change-author-id')).toBeInTheDocument());
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should correctly search by author name, submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500);
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        fireEvent.mouseDown(getByTestId('search-author-by-select'));
        await waitFor(() => getByTestId('search-author-by-options'));
        fireEvent.click(getByText('Author name'));

        await assertRequiredFieldError('search-by-rek-author');

        fireEvent.change(getByTestId('search-by-rek-author-input'), { target: { value: 'Test' } });

        // assert next state of the form
        await assertNoRequiredFieldError('search-by-rek-author');

        fireEvent.click(getByTestId('rek-author-id-input'));
        fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        await assertNoRequiredFieldError('rek-author-id');
        assertEnabled('change-author-id-submit');

        // submit form
        fireEvent.click(getByTestId('change-author-id-submit'));

        await waitFor(() => expect(getByTestId('alert-error-change-author-id')).toBeInTheDocument());
    });

    it('should correctly search by author id, submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(200, {});
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 123, aut_org_username: 'uqtest' }],
        });
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 123, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup({});
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-author-by-select'));
        await waitFor(() => getByTestId('search-author-by-options'));
        fireEvent.click(getByText('Author ID'));

        await assertRequiredFieldError('search-by-rek-author-id');

        fireEvent.click(getByTestId('search-by-rek-author-id-input'));
        fireEvent.change(getByTestId('search-by-rek-author-id-input'), { target: { value: 'Test' } });
        await waitFor(() => getByTestId('search-by-rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        await assertNoRequiredFieldError('search-by-rek-author-id');

        fireEvent.click(getByTestId('rek-author-id-input'));
        fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        await assertNoRequiredFieldError('rek-author-id');
        assertEnabled('change-author-id-submit');

        // submit form
        fireEvent.click(getByTestId('change-author-id-submit'));

        await waitFor(() => expect(getByTestId('alert-done-change-author-id')).toBeInTheDocument());
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should correctly search by author id, submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).replyOnce(500);
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 111, aut_org_username: 'uqtest' }],
        });
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 123, value: 'Testing', aut_id: 123, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-author-by-select'));
        await waitFor(() => getByTestId('search-author-by-options'));
        fireEvent.click(getByText('Author ID'));

        await assertRequiredFieldError('search-by-rek-author-id');

        fireEvent.click(getByTestId('search-by-rek-author-id-input'));
        fireEvent.change(getByTestId('search-by-rek-author-id-input'), { target: { value: 'Test' } });
        await waitFor(() => getByTestId('search-by-rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        await assertNoRequiredFieldError('search-by-rek-author-id');

        fireEvent.click(getByTestId('rek-author-id-input'));
        fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        // assert next state of the form
        await assertNoRequiredFieldError('rek-author-id');
        assertEnabled('change-author-id-submit');

        // submit form
        fireEvent.click(getByTestId('change-author-id-submit'));

        await waitFor(() => expect(getByTestId('alert-error-change-author-id')).toBeInTheDocument());
    });

    it('should correctly clear author ID field', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [{ id: 111, value: 'Testing', aut_id: 123, aut_org_username: 'uqtest' }],
        });
        const { getByTestId, getByText, getAllByTitle } = setup();

        fireEvent.mouseDown(getByTestId('search-author-by-select'));
        await waitFor(() => getByTestId('search-author-by-options'));
        fireEvent.click(getByText('Author ID'));

        await assertRequiredFieldError('search-by-rek-author-id');

        fireEvent.click(getByTestId('search-by-rek-author-id-input'));
        fireEvent.change(getByTestId('search-by-rek-author-id-input'), { target: { value: 'Test' } });
        await waitFor(() => getByTestId('search-by-rek-author-id-options'));

        fireEvent.click(getByText('Testing'));
        await userEvent.click(getAllByTitle('Clear')[0]);

        await assertRequiredFieldError('search-by-rek-author-id');
    });
});
