import React from 'react';
import { render, WithReduxStore, fireEvent, waitFor, act } from 'test-utils';
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
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should handle row update', async () => {
        const { getByText, getByTestId } = setup({});
        const updatejournalListsListItemFn = jest.spyOn(journalListsActions, 'updatejournalListsListItem');

        await waitFor(() => getByText('Favourite searches'));
        fireEvent.click(getByTestId('favourite-search-list-item-1-edit'));

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });
        expect(updatejournalListsListItemFn).toHaveBeenCalled();
    });
});
