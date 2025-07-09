import React from 'react';
import AuthorsListWithAffiliates from './AuthorsListWithAffiliates';
import { act, render, fireEvent, WithReduxStore, within, waitFor } from 'test-utils';
import locale from 'locale/components';
import * as repositories from 'repositories';

const props = {
    contributorEditorId: 'rek-author',
    list: [],
    locale: locale.components.authorsList('author').field,
    isNtro: false,
    showRoleInput: false,
    disabled: false,
    onChange: jest.fn(),
    organisationalUnitList: {},
    suggestedOrganisationalUnitList: {},
    loadOrganisationalUnitsList: jest.fn(),
    loadSuggestedOrganisationalUnitsList: jest.fn(),
};

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <AuthorsListWithAffiliates {...props} {...testProps} />
        </WithReduxStore>,
    );
}

describe('AuthorsListWithAffiliates', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render default list view', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
        expect(getByTestId('rek-author-add')).toBeInTheDocument();
    });

    it('should render a list of upto 10 contributors and should not show paging or filtering options', () => {
        const { getAllByTestId } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                },
                {
                    nameAsPublished: 'test 3',
                },
                {
                    nameAsPublished: 'test 4',
                },
                {
                    nameAsPublished: 'test 5',
                },
                {
                    nameAsPublished: 'test 6',
                },
                {
                    nameAsPublished: 'test 7',
                },
                {
                    nameAsPublished: 'test 8',
                },
                {
                    nameAsPublished: 'test 9',
                },
                {
                    nameAsPublished: 'test 10',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(10);
    });

    it('should render a list of upto 10 contributors and should not show paging and searching options', () => {
        const { getAllByTestId } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                },
                {
                    nameAsPublished: 'test 3',
                },
                {
                    nameAsPublished: 'test 4',
                },
                {
                    nameAsPublished: 'test 5',
                },
                {
                    nameAsPublished: 'test 6',
                },
                {
                    nameAsPublished: 'test 7',
                },
                {
                    nameAsPublished: 'test 8',
                },
                {
                    nameAsPublished: 'test 9',
                },
                {
                    nameAsPublished: 'test 10',
                },
                {
                    nameAsPublished: 'test 11',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(10);
    });

    it('should render disabled row', () => {
        const { getByTestId } = setup({
            disabled: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    affiliation: '',
                },
            ],
        });
        expect(getByTestId('rek-author-list-row-0-edit').closest('button')).toHaveAttribute('disabled');
        expect(getByTestId('rek-author-list-row-0-delete').closest('button')).toHaveAttribute('disabled');
        expect(getByTestId('rek-author-list-row-1-edit').closest('button')).toHaveAttribute('disabled');
        expect(getByTestId('rek-author-list-row-1-delete').closest('button')).toHaveAttribute('disabled');
    });

    it('should change order', () => {
        const { getByTestId } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    affiliation: '',
                },
            ],
        });
        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test 1');
        fireEvent.click(getByTestId('rek-author-list-row-0-move-down').closest('button'));
        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test 2');

        expect(getByTestId('rek-author-list-row-1-name-as-published')).toHaveTextContent('test 1');
        fireEvent.click(getByTestId('rek-author-list-row-1-move-up').closest('button'));
        expect(getByTestId('rek-author-list-row-1-name-as-published')).toHaveTextContent('test 2');
    });

    it('should add contributor correctly', () => {
        const { getAllByTestId, getByTestId, getByText, queryByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-author-add'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-add-save'));

        expect(queryByText('No records to display')).not.toBeInTheDocument();
        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(1);
    });

    it('should validate new contributor maxlength correctly', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-author-add'));
        expect(getByTestId('rek-author-add-save').closest('button')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1' } });
        expect(getByTestId('rek-author-add-save').closest('button')).not.toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(256) } });
        expect(getByTestId('rek-author-add-save').closest('button')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(255) } });
        expect(getByTestId('rek-author-add-save').closest('button')).not.toHaveAttribute('disabled');
    });

    it('should validate existing contributor maxlength correctly', () => {
        const initialValue = 'test 1';
        const { getAllByTestId, getByTestId } = setup({
            list: [
                {
                    nameAsPublished: initialValue,
                    uqIdentifier: '0',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(1);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: initialValue } });
        expect(getByTestId('rek-author-update-save').closest('button')).not.toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1' } });
        expect(getByTestId('rek-author-update-save').closest('button')).not.toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(256) } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(255) } });
        expect(getByTestId('rek-author-update-save').closest('button')).not.toHaveAttribute('disabled');
    });

    it('should render a list and user should be able to edit', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'test',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '0',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        // await waitFor(() => getByTestId('rek-author-list-row-0-uq-identifiers'));
        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('uqtest - 111');
    });

    it('should render a list and should render student username after edit', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_student_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'test',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '0',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        // await waitFor(() => getByTestId('rek-author-list-row-0-uq-identifiers'));
        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('uqtest - 111');
    });

    it('should render a list and should render ref num after edit', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_ref_num: '123456',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'uqtesting - 123',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '123',
                    uqUsername: 'uqtesting',
                    aut_id: 123,
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: '123456' } });
        });

        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        // await waitFor(() => getByTestId('rek-author-list-row-0-uq-identifiers'));
        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('123456 - 111');
    });

    it('should clear uq identifier', async () => {
        const { getAllByTestId, getByTestId } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '123',
                    uqUsername: 'uqtesting',
                    aut_id: 123,
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: '' } });
        });

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        // await waitFor(() => getByTestId('rek-author-list-row-0-uq-identifiers'));
        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('');
    });

    it('should render the same list if a new user with the same uq id has been added', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '111',
                    aut_id: 111,
                    affiliation: '',
                },
            ],
        });

        fireEvent.click(getByTestId('rek-author-add'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.click(getByTestId('rek-author-add-save'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(1);
    });

    it('should render the same list if an existing user with the same uq id in the list has been added', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'test 1',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getByTestId, getByText } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '111',
                    aut_id: 111,
                    affiliation: '',
                },
            ],
        });

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('');
        expect(getByTestId('rek-author-list-row-1-uq-identifiers')).toHaveTextContent('111');
    });

    it('should render a list and user should be able to edit for NTRO', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'test',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            isNtro: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '0',
                    orgaff: '',
                    orgtype: '',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('Not UQ'));

        fireEvent.change(getByTestId('org-affiliation-name'), { target: { value: 'Test org' } });
        fireEvent.mouseDown(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('Government'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'), 'Testing');
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('uqtest - 111');
        expect(getByTestId('rek-author-list-row-0-affiliation')).toHaveTextContent('Test org');
        expect(getByTestId('rek-author-list-row-0-affiliation-type')).toHaveTextContent('Government');
    });

    it('should render a list and user should be able to edit for NTRO 2', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
                {
                    id: 112,
                    value: 'test',
                    aut_id: 112,
                    aut_org_username: 'uqtest2',
                    aut_fname: 'UQ2',
                    aut_lname: 'Test2',
                },
            ],
        });
        const { getAllByTestId, getByTestId, getByText } = setup({
            isNtro: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '0',
                    orgaff: '',
                    orgtype: '',
                    affiliation: '',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    orgaff: '',
                    orgtype: '',
                    affiliation: '',
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('UQ'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('uqtest - 111');
        expect(getByTestId('rek-author-list-row-0-affiliation')).toHaveTextContent('The University of Queensland');
        expect(getByTestId('rek-author-list-row-0-affiliation-type')).toHaveTextContent('University');
    });

    it('should display role column and input field while editing', () => {
        const { getByTestId, getByText } = setup({
            showRoleInput: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    aut_id: 1234,
                },
            ],
        });

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.mouseDown(getByTestId('rek-author-role-input'));
        fireEvent.click(getByText('Technician'));
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-role')).toHaveTextContent('Technician');
    });

    it('should display uqUsername and uqIdentifier correctly while editing', () => {
        const { getByTestId, getByText } = setup({
            showRoleInput: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                    uqIdentifier: '1234',
                    uqUsername: 'uqtest',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    aut_id: 1234,
                },
            ],
        });

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        expect(getByTestId('rek-author-id-input')).toHaveAttribute('value', 'uqtest - 1234');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.mouseDown(getByTestId('rek-author-role-input'));
        fireEvent.click(getByText('Technician'));
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-role')).toHaveTextContent('Technician');
    });

    it('should delete row correctly', () => {
        const { getByTestId } = setup({
            showRoleInput: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    aut_id: 1234,
                },
            ],
        });
        fireEvent.click(getByTestId('rek-author-list-row-0-delete'));
        fireEvent.click(getByTestId('rek-author-delete-save'));

        // expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test 2');
    });

    it('should clear uq identifier column', () => {
        const { getByTestId, getByTitle } = setup({
            showRoleInput: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                    aut_id: 1234,
                },
            ],
        });
        fireEvent.click(getByTestId('rek-author-list-row-1-edit'));
        fireEvent.click(getByTitle('Clear'));
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-1-uq-identifiers')).toHaveTextContent('');
    });

    it('should handle row update cancelled; show error for creator role correctly', () => {
        const { getByTestId } = setup({
            showRoleInput: true,
            list: [
                {
                    nameAsPublished: 'test 1',
                },
            ],
        });
        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.click(getByTestId('rek-author-update-cancel'));

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });

        expect(getByTestId('rek-author-label')).toHaveClass('Mui-error');
        expect(getByTestId('rek-author-role-label')).toHaveClass('Mui-disabled');

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        expect(getByTestId('rek-author-role-label')).toHaveClass('Mui-error');
    });

    it('should render new affiliation view', async () => {
        const { getAllByTestId, getByTestId, getByText, getByRole, queryByTestId, queryByText } = setup({
            list: [
                {
                    creatorRole: '',
                    uqIdentifier: '88844',
                    aut_display_name: 'Robertson, Avril A. B. Not 100%',
                    affiliation: 'NotUQ',
                    aut_org_username: 'uqarob15',
                    nameAsPublished: 'Robertson, Avril A. B. not 100%',
                    uqUsername: 'uqarob15',
                    aut_student_username: '',
                    aut_id: 88844,
                    orgaff: 'University of Queensland',
                    orgtype: '',
                    affiliations: [
                        {
                            af_id: 478894,
                            af_pid: 'UQ:871c1f8',
                            af_author_id: 88844,
                            af_percent_affiliation: 50000,
                            af_org_id: 881,
                            af_status: 1,
                            fez_author: {
                                aut_id: 88844,
                                aut_display_name: 'Robertson, Avril A. B.',
                            },
                            fez_org_structure: {
                                org_id: 881,
                                org_title: 'School of Chemistry and Molecular Biosciences',
                            },
                        },
                        {
                            af_id: 478895,
                            af_pid: 'UQ:871c1f8',
                            af_author_id: 88844,
                            af_percent_affiliation: 40000,
                            af_org_id: 968,
                            af_status: 1,
                            fez_author: {
                                aut_id: 88844,
                                aut_display_name: 'Robertson, Avril A. B.',
                            },
                            fez_org_structure: {
                                org_id: 968,
                                org_title: 'Institute for Molecular Bioscience',
                            },
                        },
                    ],
                    id: 6,
                },
                {
                    creatorRole: '',
                    uqIdentifier: '',
                    aut_display_name: 'Smith, John Coverage',
                    affiliation: '',
                    aut_org_username: '',
                    nameAsPublished: 'Smith, John Coverage',
                    uqUsername: '',
                    aut_student_username: '',
                    aut_id: 1,
                    orgaff: '',
                    orgtype: '',
                    affiliations: [],
                    id: 7,
                },
            ],
        });

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);
        // Check the first row is for a linked author, which should
        // have the new UI interface for affiliations.
        const row = tableRows[0];
        expect(row).toBeInTheDocument();

        expect(within(row).getByText('Robertson, Avril A. B. not 100%')).toBeInTheDocument();
        expect(within(row).getByTestId('contributor-errorIcon-88844')).toBeInTheDocument();
        act(() => {
            within(row)
                .getByTestId('expandPanelIcon-88844')
                .closest('button')
                .click();
        });

        await waitFor(() => getByText('School of Chemistry and Molecular Biosciences'));

        expect(getByTestId('orgChip-881')).toHaveTextContent('50%');
        expect(getByText('School of Chemistry and Molecular Biosciences')).toBeInTheDocument();

        expect(getByTestId('orgChip-968')).toHaveTextContent('40%');
        expect(getByText('Percentage sum total of all affiliations must equal 100%')).toBeInTheDocument();
        expect(getByRole('button', { name: /Recalculate Percentages/ })).toBeInTheDocument();

        // Check there's a second row for an unlinked author
        const row2 = tableRows[1];
        expect(row2).toBeInTheDocument();

        expect(within(row2).getByText('Smith, John Coverage')).toBeInTheDocument();
        expect(within(row2).queryByTestId('expandPanelIcon')).not.toBeInTheDocument(); // unlinked dont have expand icons in this component
        expect(within(row2).getByTestId('contributor-unlinked-1')).toBeInTheDocument(); // should have an unlinked icon

        mockApi.onGet(repositories.routes.ORGANISATIONAL_UNITS().apiUrl).replyOnce(200, {
            data: [
                {
                    org_id: 1,
                    org_extdb_name: 'hr',
                    org_extdb_id: 1,
                    org_ext_table: null,
                    org_title: 'Test organisation',
                    org_is_current: 1,
                    org_desc: null,
                    org_image_filename: null,
                },
            ],
        });
        mockApi.onGet(repositories.routes.SUGGESTED_ORGANISATIONAL_UNITS({ authorId: 88844 }).apiUrl).replyOnce(200, {
            data: [
                {
                    aut_id: 88844,
                    org_title: 'Test suggested organisation',
                    org_id: 2,
                },
            ],
        });

        // Enter edit mode for row-0

        expect(queryByTestId('affiliationCancelBtn')).not.toBeInTheDocument();

        act(() => {
            getByTestId('affiliationEditBtn-88844').click();
        });

        await waitFor(() => getByTestId('affiliationCancelBtn'));
        act(() => {
            getByTestId('affiliationCancelBtn').click();
        });

        await waitFor(() => getByRole('button', { name: /Recalculate Percentages/ }));

        act(() => {
            getByRole('button', { name: /Recalculate Percentages/ }).click();
        });

        expect(queryByText('Percentage sum total of all affiliations must equal 100%')).not.toBeInTheDocument();

        expect(getByTestId('orgChip-881')).toHaveTextContent('50%');
        expect(getByTestId('orgChip-968')).toHaveTextContent('50%');
    });
});
