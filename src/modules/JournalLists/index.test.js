import React from 'react';
import { render, WithReduxStore, fireEvent, userEvent, waitFor } from 'test-utils';
import * as journalListsActions from 'actions/journalLists';
import * as repository from '../../../repositories';
import { Index } from './JournalList';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <Index {...testProps} />
        </WithReduxStore>,
    );
};

describe('journalLists', () => {
    const getRows = () => document.querySelectorAll('.MuiDataGrid-row');

    beforeEach(() => {
        mockApi.onGet(repository.routes.FAVOURITE_SEARCH_LIST_API().apiUrl).replyOnce(200, {
            data: [
                {
                    fjl_id: 1,
                    fjl_description: 'test',
                    fjl_alias: 'test',
                    fjl_search_parameters: 'test',
                },
                {
                    fjl_id: 2,
                    fjl_description: 'testing',
                    fjl_alias: 'testing',
                    fjl_search_parameters: 'testing',
                },
            ],
        });
        mockApi.onGet(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)).replyOnce(200, {
            data: {
                fjl_id: 2,
                fjl_description: 'testing',
                fjl_alias: 'testing',
                fjl_search_parameters: 'testing',
            },
        });
        mockApi.onPut(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)).replyOnce(200, {
            data: {
                fjl_id: 1,
                fjl_description: 'test',
                fjl_alias: 'test',
                fjl_search_parameters: 'test',
            },
        });
        mockApi
            .onDelete(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl))
            .replyOnce(200, { data: {} });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        const loadjournalListsListFn = jest.spyOn(journalListsActions, 'loadjournalListsList');

        const { getByText } = setup({});
        expect(getByText('Loading list of favourite searches')).toBeInTheDocument();
        expect(loadjournalListsListFn).toHaveBeenCalled();

        await waitFor(() => getByText('Favourite searches'));
        expect(getByText('Favourite searches')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('Real link')).toBeInTheDocument();
        expect(getByText('Description')).toBeInTheDocument();
        expect(getByText('Aliased link')).toBeInTheDocument();
        expect(getByText('Alias')).toBeInTheDocument();
    });

    it('should not update row if alias has found', async () => {
        const { getByText, getByTestId, findByTestId } = setup({});

        await waitFor(() => getByText('Favourite searches'));

        fireEvent.click(getByTestId('favourite-search-list-item-0-edit'));

        fireEvent.change(getByTestId('fjl-alias-input'), { target: { value: 'testing' } });
        await userEvent.click(getByTestId('favourite-search-list-item-0-save'));

        await findByTestId('fjl-description-0');
        expect(getRows().length).toBe(2);
        expect(getByTestId('fjl-alias-0')).toHaveTextContent('test');
        expect(getByText('Alias "testing" has been taken')).toBeInTheDocument();
    });

    it('should handle row delete', async () => {
        const { getByText, getByTestId } = setup({});
        const deletejournalListsListItemFn = jest.spyOn(journalListsActions, 'deletejournalListsListItem');

        await waitFor(() => getByText('Favourite searches'));
        fireEvent.click(getByTestId('favourite-search-list-item-1-delete'));
        fireEvent.click(getByTestId('favourite-search-list-item-1-save'));

        expect(deletejournalListsListItemFn).toHaveBeenCalled();
    });
});
