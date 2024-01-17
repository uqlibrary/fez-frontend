import React from 'react';
import FavouriteSearch from './FavouriteSearch';
import { render, WithReduxStore, fireEvent, waitFor, act } from 'test-utils';
import * as FavouriteSearchActions from 'actions/favouriteSearch';
import * as repository from 'repositories';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <FavouriteSearch {...testProps} />
        </WithReduxStore>,
    );
};

describe('FavouriteSearch', () => {
    beforeEach(() => {
        mockApi.onGet(repository.routes.FAVOURITE_SEARCH_LIST_API().apiUrl).replyOnce(200, {
            data: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
                {
                    fvs_id: 2,
                    fvs_description: 'testing',
                    fvs_alias: 'testing',
                    fvs_search_parameters: 'testing',
                },
            ],
        });
        mockApi.onGet(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)).replyOnce(200, {
            data: {
                fvs_id: 2,
                fvs_description: 'testing',
                fvs_alias: 'testing',
                fvs_search_parameters: 'testing',
            },
        });
        mockApi.onPut(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl)).replyOnce(200, {
            data: {
                fvs_id: 1,
                fvs_description: 'test',
                fvs_alias: 'test',
                fvs_search_parameters: 'test',
            },
        });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should handle row update', async () => {
        const { getByText, getByTestId } = setup({});
        const updateFavouriteSearchListItemFn = jest.spyOn(FavouriteSearchActions, 'updateFavouriteSearchListItem');

        await waitFor(() => getByText('Favourite searches'));
        fireEvent.click(getByTestId('favourite-search-list-item-1-edit'));

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });
        expect(updateFavouriteSearchListItemFn).toBeCalled();
    });
});
