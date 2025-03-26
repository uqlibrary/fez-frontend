import { ContributorsEditor, mapStateToProps } from './ContributorsEditor';
import { authorsSearch } from 'mock/data';
import Immutable from 'immutable';
import React from 'react';
import { locale } from 'locale';
import { render, WithReduxStore, fireEvent, waitFor, within, userEvent } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}, renderMethod = render) {
    const props = {
        author: { aut_id: 1 },
        contributorEditorId: 'test',
        locale: testProps.locale || locale.components.contributors.field,
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <ContributorsEditor {...props} />
        </WithReduxStore>,
    );
}

describe('ContributorsEditor', () => {
    it('renders full component with a defined className', () => {
        const { container } = setup({ className: 'requiredField' });
        expect(container).toMatchSnapshot();
    });

    it('renders full component with identifier lookup', () => {
        const { container } = setup({ showIdentifierLookup: true });
        expect(container).toMatchSnapshot();
    });

    it('renders full component with role input', () => {
        const { container } = setup({ showRoleInput: true });
        expect(container).toMatchSnapshot();
    });

    it('renders full component with NTRO fields', () => {
        const { container } = setup({ isNtro: true });
        expect(container).toMatchSnapshot();
    });

    it('render authors list component for admin interface', () => {
        const { container } = setup({ isAdmin: true, locale: locale.components.authorsList('rek-author').field });
        expect(container).toMatchSnapshot();
    });

    it('renders full component for admin user', () => {
        const { container } = setup({ showContributorAssignment: false, canEdit: true });
        expect(container).toMatchSnapshot();
    });

    it('renders full component for admin user with affiliations list', () => {
        const { container } = setup({
            shouldHandleAffiliations: true,
            showContributorAssignment: false,
            isAdmin: true,
            canEdit: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders full component for admin user with record affiliations', () => {
        const record = {
            fez_author_affiliation: [
                {
                    af_id: 1,
                    af_author_id: 101,
                },
                {
                    af_id: 2,
                    af_author_id: 101,
                },
                {
                    af_id: 3,
                    af_author_id: 102,
                },
                {
                    af_id: 4,
                    af_author_id: 103,
                },
            ],
        };
        const { container } = setup({
            shouldHandleAffiliations: true,
            showContributorAssignment: false,
            isAdmin: true,
            canEdit: true,
            input: {
                name: 'test',
                value: [
                    {
                        aut_id: 101,
                    },
                ],
            },
            record,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders component with no locale', () => {
        const { container } = setup({ locale: {}, showContributorAssignment: false, canEdit: true });
        expect(container).toMatchSnapshot();
    });

    it('renders component in edit mode', () => {
        const { container } = setup({
            editMode: true,
            canEdit: true,
            locale: {
                form: {
                    locale: {
                        addButton: 'test',
                    },
                },
            },
            input: {
                name: 'test',
                value: [
                    {
                        aut_id: 101,
                    },
                ],
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('appends a contributor to the list', () => {
        const { getByTestId, getByRole } = setup();
        fireEvent.change(getByTestId('test-input'), { target: { value: 'J.Smith' } });
        fireEvent.click(getByRole('button', { name: 'Add contributor' }));
        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('J.Smith');
    });

    it('appends a contributor to the list as an admin', () => {
        const { getByTestId, getByRole } = setup({ isAdmin: true });

        fireEvent.click(getByRole('button', { name: 'Add contributor' }));
        fireEvent.change(getByTestId('test-input'), { target: { value: 'J.Smith' } });
        fireEvent.click(getByTestId('test-add-save'));

        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('J.Smith');
    });

    it('appends a contributor with identifier to the list', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, getByText } = setup({ canEdit: true, showIdentifierLookup: true });
        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: testParam } });

        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);

        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('Del Mar, Christopher');
    });

    it('appends a contributor with duplicate identifier to the list', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, queryByTestId, getByText } = setup({ canEdit: true, showIdentifierLookup: true });

        // add first contributor
        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: testParam } });
        let list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);
        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('Del Mar, Christopher');

        // trying to add a dup contributor
        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: testParam } });
        list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);
        expect(queryByTestId('test-list-row-1-name-as-published')).not.toBeInTheDocument();
    });

    it('appends a contributor with identifier who is a current author to the list', async () => {
        const testParam = 'researcher';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, getByText } = setup({
            author: authorsSearch.data[0],
            canEdit: true,
            showIdentifierLookup: true,
        });

        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: testParam } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);
        expect(getByTestId('test-list-row-0-name-as-published')).toBeInTheDocument();
    });

    it('can edit a selected contributor', async () => {
        const testParam = 'researcher';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByRole, getByTestId, getByText, container } = setup({
            author: authorsSearch.data[0],
            canEdit: true,
            showIdentifierLookup: true,
        });

        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: testParam } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);
        fireEvent.click(getByTestId('test-list-row-0-edit'));
        expect(getByRole('button', { name: 'Change Details' })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('can edit a selected contributor and reset other contributor selected state', async () => {
        const { container, getByRole } = setup({
            editMode: true,
            author: authorsSearch.data[0],
            showIdentifierLookup: true,
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                    },
                    {
                        nameAsPublished: 'test 2',
                    },
                ],
            },
        });
        fireEvent.click(getByRole('listitem', { name: 'Select this contributor (test 2) to assign it as you' }));

        expect(container).toMatchSnapshot();
    });

    it('deletes a contributor from the list', () => {
        const { queryByTestId, getByTestId } = setup({
            editMode: true,
            author: authorsSearch.data[0],
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                        aut_id: 410,
                        selected: true,
                    },
                    {
                        nameAsPublished: 'test 2',
                    },
                ],
            },
        });

        expect(queryByTestId('test-list-row-1-name-as-published')).toBeInTheDocument();
        fireEvent.click(getByTestId('test-list-row-1-delete'));
        fireEvent.click(getByTestId('confirm-test-list-row-1-delete'));

        expect(queryByTestId('test-list-row-1-name-as-published')).not.toBeInTheDocument();
    });

    it('deletes a non current contributor from the list', async () => {
        const testParam = '410';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);

        const { queryByTestId, getByTestId, getByText } = setup({
            canEdit: true,
            author: authorsSearch.data[0],
            showIdentifierLookup: true,
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                    },
                ],
            },
        });

        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: '410' } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);

        expect(queryByTestId('test-list-row-1-name-as-published')).toBeInTheDocument();
        fireEvent.click(getByTestId('test-list-row-0-delete'));
        fireEvent.click(getByTestId('confirm-test-list-row-0-delete'));

        expect(queryByTestId('test-list-row-1-name-as-published')).not.toBeInTheDocument();
    });

    it('deletes all contributors from a list', () => {
        const { queryByTestId, getByTestId, getByRole } = setup({
            editMode: true,
            author: authorsSearch.data[0],
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [
                    { nameAsPublished: 'test 1', disabled: false },
                    { nameAsPublished: 'test 2', disabled: false },
                ],
            },
        });
        expect(queryByTestId('test-list-row-0-name-as-published')).toBeInTheDocument();
        expect(queryByTestId('test-list-row-1-name-as-published')).toBeInTheDocument();
        fireEvent.click(getByRole('button', { name: 'Remove all items' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(queryByTestId('test-list-row-1-name-as-published')).not.toBeInTheDocument();
        expect(queryByTestId('test-list-row-0-name-as-published')).not.toBeInTheDocument();
    });

    it('moves up a contributor', async () => {
        const { container, getByTestId } = setup({
            editMode: true,
            author: authorsSearch.data[0],
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [{ nameAsPublished: 'test 1' }, { nameAsPublished: 'test 2' }],
            },
        });

        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('test 1');
        expect(getByTestId('test-list-row-1-name-as-published')).toHaveTextContent('test 2');

        fireEvent.click(getByTestId('test-list-row-1-move-up'));

        expect(container).toMatchSnapshot();
    });

    it('moves down a contributor', () => {
        const { container, getByTestId } = setup({
            editMode: true,
            author: authorsSearch.data[0],
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [{ nameAsPublished: 'test 1' }, { nameAsPublished: 'test 2' }],
            },
        });

        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('test 1');
        expect(getByTestId('test-list-row-1-name-as-published')).toHaveTextContent('test 2');

        fireEvent.click(getByTestId('test-list-row-0-move-down'));

        expect(container).toMatchSnapshot();
    });

    it('can not edit and add contributor with same id', async () => {
        const testParam = '410';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, getByText, getByRole, container } = setup({
            canEdit: true,
            showIdentifierLookup: true,
            author: authorsSearch.data[0],
            locale: { errorMessage: 'dup id' },
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test',
                        aut_id: authorsSearch.data[0].aut_id,
                    },
                    {
                        nameAsPublished: 'Test 2',
                    },
                ],
            },
        });

        fireEvent.click(getByTestId('test-list-row-1-edit'));
        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: authorsSearch.data[0].aut_id } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);
        fireEvent.click(getByRole('button', { name: 'Change Details' }));

        fireEvent.change(getByTestId('test-input'), { target: { value: 'EditedContributorAuthorIdNOTInTheList' } });
        fireEvent.click(getByRole('button', { name: 'Add author' }));

        expect(container).toMatchSnapshot();
    });

    it('assigns a contributor to current author', async () => {
        const testParam = '410';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, getByText } = setup({
            canEdit: true,
            showIdentifierLookup: true,
            author: authorsSearch.data[0],
        });

        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: '410' } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);

        const listItem = getByTestId('test-list-row-0');
        // assigned icon
        expect(within(listItem).getByTestId('HowToRegIcon')).toBeInTheDocument();
    });

    it('chooses a contributor to edit', () => {
        const { getByTestId, container } = setup({
            canEdit: true,
            editMode: true,
            showContributorAssignment: true,
            author: authorsSearch.data[0],
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                    },
                    {
                        nameAsPublished: 'test 2',
                    },
                ],
            },
        });

        fireEvent.click(getByTestId('test-list-row-0-edit'));
        fireEvent.click(getByTestId('test-add'));

        expect(container).toMatchSnapshot();
    });

    it('should keep authorId when editing a contributor that has been assigned as the publication author', async () => {
        let contributors = [];
        const { getByTestId } = setup({
            onChange: values => (contributors = values),
            canEdit: true,
            forceSelectable: true,
            author: authorsSearch.data[0],
            input: {
                name: 'test',
                value: [],
            },
        });

        // add a couple of contributors
        await userEvent.type(getByTestId('test-input'), 'Author 1');
        await userEvent.click(getByTestId('test-add'));
        await userEvent.type(getByTestId('test-input'), 'Author 2');
        await userEvent.click(getByTestId('test-add'));
        // assign the first contributor as the pub author
        await userEvent.click(getByTestId('test-list-row-0'));
        // update the first contributor's name
        await userEvent.click(getByTestId('test-list-row-0-edit'));
        await userEvent.type(getByTestId('test-input'), ' (edited)');
        await userEvent.click(getByTestId('test-add'));
        // assert that the assigned and edited contributor has the expected authorId
        expect(contributors[0].nameAsPublished).toEqual('Author 1 (edited)');
        expect(contributors[0].authorId).toEqual(authorsSearch.data[0].aut_id);
    });

    it('should not be able to select contributor in edit mode', () => {
        const { getByRole, getByTestId } = setup({
            editMode: true,
            canEdit: true,
            showContributorAssignment: true,
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                    },
                ],
            },
        });

        let listItem = getByTestId('test-list-row-0');
        // not selected icon
        expect(within(listItem).getByTestId('PersonOutlinedIcon')).toBeInTheDocument();

        // try to select
        fireEvent.click(getByRole('listitem', { name: 'Select this contributor (test 1) to assign it as you' }));

        // remain unselected
        listItem = getByTestId('test-list-row-0');
        // not selected icon
        expect(within(listItem).getByTestId('PersonOutlinedIcon')).toBeInTheDocument();
    });

    it('should disable selection when current author is selected', async () => {
        const testParam = '410';
        const testRequest = { query: testParam };
        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, authorsSearch);
        const { getByTestId, getByRole, getByText } = setup({
            canEdit: true,
            showIdentifierLookup: true,
            author: authorsSearch.data[0],
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'test 1',
                    },
                ],
            },
        });

        fireEvent.click(getByTestId('test-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('test-aut-id-input'), { target: { value: '410' } });
        const list = await waitFor(() => getByTestId('test-aut-id-options'));
        fireEvent.click(getByText('Professor J Researcher (uqresearcher)'), list);

        let listItem = getByTestId('test-list-row-1');
        // assigned icon
        expect(within(listItem).getByTestId('HowToRegIcon')).toBeInTheDocument();

        fireEvent.click(getByRole('listitem', { name: 'Select this contributor (test 1) to assign it as you' }));

        // remain unselected
        listItem = getByTestId('test-list-row-0');
        // not selected icon
        expect(within(listItem).getByTestId('PersonOutlinedIcon')).toBeInTheDocument();
    });

    it('renders 21 contributor rows wrapped in an infinite scroll', () => {
        const { container } = setup({
            canEdit: true,
            input: {
                name: 'test',
                value: [
                    { nameAsPublished: 1 },
                    { nameAsPublished: 2 },
                    { nameAsPublished: 3 },
                    { nameAsPublished: 4 },
                    { nameAsPublished: 5 },
                    { nameAsPublished: 6 },
                    { nameAsPublished: 7 },
                    { nameAsPublished: 8 },
                    { nameAsPublished: 9 },
                    { nameAsPublished: 10 },
                    { nameAsPublished: 11 },
                    { nameAsPublished: 12 },
                    { nameAsPublished: 3 },
                    { nameAsPublished: 14 },
                    { nameAsPublished: 15 },
                    { nameAsPublished: 16 },
                    { nameAsPublished: 17 },
                    { nameAsPublished: 18 },
                    { nameAsPublished: 19 },
                    { nameAsPublished: 20 },
                    { nameAsPublished: 21 },
                ],
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should show given validation error', () => {
        const { container } = setup({
            contributors: [],
            meta: { error: 'This is a test error' },
        });
        expect(container).toMatchSnapshot();
    });

    it('should show error when required props is true and there are no items selected', () => {
        const { getByTestId } = setup({
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 410,
                    },
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 420,
                    },
                ],
            },
            required: true,
        });
        expect(getByTestId('test-error')).toHaveTextContent(
            /Please provide a list as described and select one as you/i,
        );
    });

    it('should not show error when required props is true and there are items selected', () => {
        const { queryByTestId } = setup({
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 410,
                    },
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 420,
                        selected: true,
                    },
                ],
            },
            required: true,
        });
        expect(queryByTestId('test-error')).not.toBeInTheDocument();
    });

    it('should not show error when required props is not true, even when there are no items selected', () => {
        const { queryByTestId } = setup({
            input: {
                name: 'test',
                value: [
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 410,
                    },
                    {
                        nameAsPublished: 'author 2',
                        aut_id: 420,
                    },
                ],
            },
        });
        expect(queryByTestId('test-error')).not.toBeInTheDocument();
    });

    it('should call given onChange only when `contributors` change', () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, rerender } = setup({
            onChange: onChangeFn,
        });
        expect(onChangeFn).toHaveBeenCalledTimes(1);

        fireEvent.change(getByTestId('test-input'), { target: { value: 'J.Smith' } });
        fireEvent.click(getByRole('button', { name: 'Add contributor' }));
        expect(getByTestId('test-list-row-0-name-as-published')).toHaveTextContent('J.Smith');
        expect(onChangeFn).toHaveBeenCalledTimes(2);

        setup({ onChange: onChangeFn }, rerender);
        expect(onChangeFn).toHaveBeenCalledTimes(2);
    });

    it('should get contributors from props and input value set as an array', () => {
        const { container } = setup({
            input: {
                name: 'test',
                value: [{ displayName: 'test 1' }, { displayName: 'test 2' }],
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render error as html', () => {
        const { container } = setup({
            meta: {
                error: (
                    <p>
                        <span>test</span>
                    </p>
                ),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const { container } = setup({
            meta: {
                error: <span>test</span>,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should map state to props as expected', () => {
        const testFunction = () => ({
            author: 'test',
        });
        expect(
            mapStateToProps({
                get: testFunction,
            }),
        ).toEqual({
            author: 'test',
            record: undefined,
        });
        expect(
            mapStateToProps({
                get: () => false,
            }),
        ).toEqual({
            author: null,
            record: null,
        });
    });

    it('should update contributors state upon input prop changes', () => {
        const authorName = 'Author 1';
        const { rerender, queryByText } = setup();
        expect(queryByText(authorName)).not.toBeInTheDocument();

        setup(
            {
                input: {
                    name: 'test',
                    value: [
                        {
                            nameAsPublished: authorName,
                            aut_id: 410,
                            selected: true,
                        },
                    ],
                },
            },
            rerender,
        );
        expect(queryByText(authorName)).toBeInTheDocument();
    });
});
