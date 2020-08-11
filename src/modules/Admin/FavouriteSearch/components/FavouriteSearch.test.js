import React from 'react';
import FavouriteSearch from './FavouriteSearch';
import { render, WithRedux, fireEvent, waitFor, act } from 'test-utils';
import * as FavouriteSearchActions from 'actions/favouriteSearch';
import * as repository from 'repositories';

const setup = (testProps = {}) => {
    return render(
        <WithRedux>
            <FavouriteSearch {...testProps} />
        </WithRedux>,
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
        expect(getByText('Loading list of favourite search')).toBeInTheDocument();
        expect(loadFavouriteSearchListFn).toBeCalled();

        await waitFor(() => getByText('Favourite search'));
        expect(getByText('Favourite search')).toBeInTheDocument();
        expect(getByText('List of favourite search')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('Real link')).toBeInTheDocument();
        expect(getByText('Description (Click to edit)')).toBeInTheDocument();
        expect(getByText('Aliased link')).toBeInTheDocument();
        expect(getByText('Alias (Click to edit)')).toBeInTheDocument();
    });

    it('should handle row update', async done => {
        const { getByText, getByTestId, getAllByTestId } = setup({});
        const updateFavouriteSearchListItemFn = jest.spyOn(FavouriteSearchActions, 'updateFavouriteSearchListItem');

        await waitFor(() => getByText('Favourite search'));
        fireEvent.click(getAllByTestId('favourite-search-list-item-edit')[0]);

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-save'));
        });
        expect(updateFavouriteSearchListItemFn).toBeCalled();

        done();
    });

    it('should not update row if alias has found', async () => {
        const { getByText, getByTestId, getAllByTestId } = setup({});

        await waitFor(() => getByText('Favourite search'));

        fireEvent.click(getAllByTestId('favourite-search-list-item-edit')[0]);

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'testing' } });

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-save'));
        });
        await waitFor(() => getByTestId('favourite-search-list-item-0'));

        expect(getAllByTestId('fvs-alias')[0]).toHaveTextContent('test');
        expect(getByText('Alias "testing" has been taken')).toBeInTheDocument();
    });

    it('should handle row delete', async done => {
        const { getByText, getByTestId, getAllByTestId } = setup({});
        const deleteFavouriteSearchListItemFn = jest.spyOn(FavouriteSearchActions, 'deleteFavouriteSearchListItem');

        await waitFor(() => getByText('Favourite search'));
        fireEvent.click(getAllByTestId('favourite-search-list-item-delete')[0]);

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-save'));
        });
        expect(deleteFavouriteSearchListItemFn).toBeCalled();

        done();
    });
});
