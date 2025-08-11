import React from 'react';
import AuthorsList from './AuthorsList';
import { act, render, fireEvent, WithReduxStore, waitFor, waitForElementToBeRemoved } from 'test-utils';
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
};

function setup(testProps = {}) {
    return render(
        <WithReduxStore>
            <AuthorsList {...props} {...testProps} />
        </WithReduxStore>,
    );
}

describe('AuthorsList', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const assertButtonFauxDisabled = element => {
        // with MRT, it does not appear possible to dynamically enable
        // or disable the save button during editing.
        // This function instead checks if the button still
        // exists after being clicked. This should be the case
        // when validation fails after the button click and
        // the row remains in Edit mode.
        fireEvent.click(element);
        expect(element).toBeInTheDocument();
    };
    const assertButtonFauxEnabled = element => {
        // with MRT, it does not appear possible to dynamically enable
        // or disable the save button during editing.
        // This function instead checks if the button has
        // been removed after being clicked. This should be the case
        // when validation passes after the button click, and
        // the row exits Edit mode.
        fireEvent.click(element);
        expect(element).not.toBeInTheDocument();
    };

    it('should render default list view', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
        expect(getByTestId('rek-author-add')).toBeInTheDocument();
    });

    it('should render a list of upto 10 contributors and should not show paging or filtering options', () => {
        const { container } = setup({
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

        expect(container).toHaveTableRowsLength(10);
    });

    it('should render a list of upto 10 contributors and should not show paging and searching options', () => {
        const { container } = setup({
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

        expect(container).toHaveTableRowsLength(10);
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
        const { container, getByTestId, getByText, queryByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-author-add'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-add-save'));

        expect(queryByText('No records to display')).not.toBeInTheDocument();
        expect(container).toHaveTableRowsLength(1);
    });

    it('should validate new contributor maxlength correctly', async () => {
        const { getByTestId, getByText, findByTestId } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();

        fireEvent.click(getByTestId('rek-author-add'));
        await findByTestId('rek-author-add-save');
        const element = getByTestId('rek-author-add-save').closest('button');
        assertButtonFauxDisabled(element);

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1' } });
        assertButtonFauxEnabled(element);

        fireEvent.click(getByTestId('rek-author-add'));
        await findByTestId('rek-author-add-save');
        const element2 = getByTestId('rek-author-add-save').closest('button');

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(256) } });
        assertButtonFauxDisabled(element2);
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(255) } });
        assertButtonFauxEnabled(element2);
    });

    it('should validate existing contributor maxlength correctly', () => {
        const initialValue = 'test 1';
        const { container, getByTestId } = setup({
            list: [
                {
                    nameAsPublished: initialValue,
                    uqIdentifier: '0',
                    affiliation: '',
                },
            ],
        });
        expect(container).toHaveTableRowsLength(1);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        const element = getByTestId('rek-author-update-save').closest('button');
        assertButtonFauxDisabled(element);
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: initialValue } });
        assertButtonFauxEnabled(element);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        const element2 = getByTestId('rek-author-update-save').closest('button');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1' } });
        assertButtonFauxEnabled(element2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        const element3 = getByTestId('rek-author-update-save').closest('button');
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(256) } });
        assertButtonFauxDisabled(element3);
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '1'.repeat(255) } });
        assertButtonFauxEnabled(element3);
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
        const { container, getByTestId, getByText } = setup({
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

        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

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
        const { container, getByTestId, getByText } = setup({
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
        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

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
        const { container, getByTestId, getByText } = setup({
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

        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: '123456' } });
        });

        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

        // await waitFor(() => getByTestId('rek-author-list-row-0-uq-identifiers'));
        expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('123456 - 111');
    });

    it('should clear uq identifier', async () => {
        const { container, getByTestId } = setup({
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

        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: '' } });
        });

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

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
        const { container, getByTestId, getByText } = setup({
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

        expect(container).toHaveTableRowsLength(1);
    });

    it('should render the same list if a existing user with the same uq id in the list has been added', async () => {
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
        const { container, getByTestId, getByText } = setup({
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

        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('Not UQ'));

        fireEvent.change(getByTestId('org-affiliation-name'), { target: { value: 'Test org' } });
        fireEvent.mouseDown(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('Government'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

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
        const { container, getByTestId, getByText } = setup({
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

        expect(container).toHaveTableRowsLength(2);

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
        assertButtonFauxDisabled(getByTestId('rek-author-update-save').closest('button'));

        act(() => {
            fireEvent.click(getByTestId('rek-author-id-input'));
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('UQ'));

        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
        assertButtonFauxEnabled(getByTestId('rek-author-update-save').closest('button'));

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

    it('should be able to add and update external identifier', () => {
        const externalId = '0000-0000-0000-0001';
        const updatedExternalId = '02mhbdp94';
        const { getByTestId, container, getByText } = setup({
            showExternalIdentifierInput: true,
        });

        // add a new author
        fireEvent.click(getByTestId('rek-author-add'));
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.change(getByTestId('rek-author-external-identifier-input'), { target: { value: externalId } });
        fireEvent.mouseDown(getByTestId('rek-author-external-identifier-type-select'));
        fireEvent.click(getByText('Orcid'));
        fireEvent.click(getByTestId('rek-author-add-save'));

        expect(container).toHaveTableRowsLength(1);
        expect(getByTestId('rek-author-list-row-0-external-identifier')).toHaveTextContent(externalId);

        // update author
        fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
        fireEvent.change(getByTestId('rek-author-external-identifier-input'), { target: { value: updatedExternalId } });
        fireEvent.mouseDown(getByTestId('rek-author-external-identifier-type-select'));
        fireEvent.click(getByText('ROR'));
        fireEvent.click(getByTestId('rek-author-update-save'));

        expect(getByTestId('rek-author-list-row-0-external-identifier')).toHaveTextContent(updatedExternalId);
    });

    it('should delete row correctly', async () => {
        const { getByTestId, findByTestId } = setup({
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
        await findByTestId('rek-author-delete-author-confirmation');
        fireEvent.click(getByTestId('confirm-rek-author-delete-author-confirmation'));
        await waitForElementToBeRemoved(() => getByTestId('rek-author-delete-author-confirmation'));

        expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test 2');
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
});
