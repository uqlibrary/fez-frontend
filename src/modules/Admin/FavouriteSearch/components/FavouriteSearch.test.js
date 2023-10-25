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
        mockApi
            .onDelete(new RegExp(repository.routes.FAVOURITE_SEARCH_LIST_API({ id: '.*' }).apiUrl))
            .replyOnce(200, { data: {} });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        const loadFavouriteSearchListFn = jest.spyOn(FavouriteSearchActions, 'loadFavouriteSearchList');

        const { getByText } = setup({});
        expect(getByText('Loading list of favourite searches')).toBeInTheDocument();
        expect(loadFavouriteSearchListFn).toBeCalled();

        await waitFor(() => getByText('Favourite searches'));
        expect(getByText('Favourite searches')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('Real link')).toBeInTheDocument();
        expect(getByText('Description')).toBeInTheDocument();
        expect(getByText('Aliased link')).toBeInTheDocument();
        expect(getByText('Alias')).toBeInTheDocument();
    });

    it('should not update row if alias has found', async () => {
        const { getByText, getByTestId } = setup({});

        await waitFor(() => getByText('Favourite searches'));

        fireEvent.click(getByTestId('favourite-search-list-item-1-edit'));

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'testing' } });

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });
        await waitFor(() => getByTestId('favourite-search-list-item-0'));

        expect(getByTestId('fvs-alias-1')).toHaveTextContent('test');
        expect(getByText('Alias "testing" has been taken')).toBeInTheDocument();
    });

    it('should handle row delete', async () => {
        const { getByText, getByTestId } = setup({});
        const deleteFavouriteSearchListItemFn = jest.spyOn(FavouriteSearchActions, 'deleteFavouriteSearchListItem');

        await waitFor(() => getByText('Favourite searches'));

        fireEvent.click(getByTestId('favourite-search-list-item-1-delete'));
        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });
        expect(deleteFavouriteSearchListItemFn).toBeCalled();
    });
});
