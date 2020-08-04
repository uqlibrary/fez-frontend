import React from 'react';
import * as ReactRedux from 'react-redux';
import FavouriteSearch from './FavouriteSearch';
import { render, RenderWithRouter, WithRedux, fireEvent } from 'test-utils';
import * as FavouriteSearchActions from 'actions/favouriteSearch';
import mediaQuery from 'css-mediaquery';
import Immutable from 'immutable';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

const setup = (testProps = {}, renderer = render) => {
    return renderer(
        <RenderWithRouter>
            <WithRedux>
                <FavouriteSearch {...testProps} />
            </WithRedux>
        </RenderWithRouter>,
    );
};

describe('FavouriteSearch', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render default view', () => {
        const useSelector = jest.spyOn(ReactRedux, 'useSelector');

        useSelector.mockImplementation(selectorFn =>
            selectorFn(
                new Immutable.Map({
                    favouriteSearchReducer: {
                        favouriteSearchListLoading: true,
                        favouriteSearchList: null,
                    },
                }),
            ),
        );

        const loadFavouriteSearchListFn = jest.spyOn(FavouriteSearchActions, 'loadFavouriteSearchList');

        const { getByText, getByTestId, rerender } = setup({});
        expect(getByText('Loading list of favourite search')).toBeInTheDocument();
        expect(loadFavouriteSearchListFn).toBeCalled();

        useSelector.mockClear();

        useSelector.mockImplementation(selectorFn =>
            selectorFn(
                new Immutable.Map({
                    favouriteSearchReducer: {
                        favouriteSearchListLoading: false,
                        favouriteSearchList: [
                            {
                                fvs_id: 1,
                                fvs_description: 'test',
                                fvs_alias: 'test',
                                fvs_search_parameters: 'test',
                            },
                        ],
                    },
                }),
            ),
        );

        setup({}, rerender);

        expect(getByText('Favourite search')).toBeInTheDocument();
        expect(getByText('List of favourite search')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('Real link')).toBeInTheDocument();
        expect(getByText('Description (Click to edit)')).toBeInTheDocument();
        expect(getByText('Aliased link')).toBeInTheDocument();
        expect(getByText('Alias (Click to edit)')).toBeInTheDocument();

        const listItem = getByTestId('favourite-search-list-item-0');
        fireEvent.click(getByTestId('favourite-search-list-item-edit', listItem));

        const editListItem = getByTestId('favourite-search-list-edit-item-0');
        fireEvent.click(getByTestId('favourite-search-list-item-save', editListItem));
    });
});
