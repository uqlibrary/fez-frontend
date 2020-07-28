import React from 'react';
import FavouriteSearch from './FavouriteSearch';
import { render, RenderWithRouter, WithRedux } from 'test-utils';
import * as FavouriteSearchActions from 'actions/favouriteSearch';
import mediaQuery from 'css-mediaquery';

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
        const loadFavouriteSearchListFn = jest.spyOn(FavouriteSearchActions, 'loadFavouriteSearchList');
        const { getByText } = setup({});
        expect(getByText('Favourite search')).toBeInTheDocument();
        expect(loadFavouriteSearchListFn).toBeCalled();
    });
});
