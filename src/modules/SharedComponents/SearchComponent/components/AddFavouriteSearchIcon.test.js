import React from 'react';
import AddFavouriteSearchIcon from './AddFavouriteSearchIcon';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor } from 'test-utils';
import * as Context from 'context';
import * as FavouriteSearchActions from 'actions/favouriteSearch';

import { useLocation } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: '/', search: '' })),
}));

function setup(state = {}) {
    return render(
        <WithRouter>
            <WithReduxStore initialState={state}>
                <AddFavouriteSearchIcon />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('Component AddFavouriteSearchIcon', () => {
    beforeEach(() => {
        useLocation.mockImplementation(() => ({ pathname: '/records/search', search: '?test=test', state: {} }));
    });

    it('should save search as favourite search as an admin user', async () => {
        const useAccountContext = jest.spyOn(Context, 'useAccountContext');
        const addFavouriteSearch = jest.spyOn(FavouriteSearchActions, 'addFavouriteSearch');

        useAccountContext.mockImplementation(() => ({ account: { id: 'uqtest' } }));

        const { getByTestId } = setup({
            searchRecordsReducer: {
                publicationsList: [{ rek_id: 'UQ:12356' }],
            },
        });

        fireEvent.click(getByTestId('favourite-search-save'));

        const descriptionInput = await waitFor(() => getByTestId('fvs-description-input'));

        fireEvent.change(descriptionInput, { target: { value: 'test favourite search' } });

        fireEvent.click(getByTestId('confirm-favourite-search-save'));

        expect(addFavouriteSearch).toHaveBeenCalledWith({
            fvs_description: 'test favourite search',
            fvs_username: 'uqtest',
            fvs_search_parameters: '/records/search?test=test',
        });
    });

    it('should display icon for saved search as favourite search as an admin user', () => {
        const { getByTestId } = setup({
            searchRecordsReducer: {
                publicationsList: [{ rek_id: 'UQ:12356' }],
            },
            favouriteSearchReducer: {
                favouriteSearchAddSuccess: true,
            },
        });

        expect(getByTestId('favourite-search-saved')).toBeInTheDocument();
    });

    it('should display star icon for saved search when redirected from the alias url', () => {
        useLocation.mockImplementation(() => ({
            pathname: '/records/search',
            search: '?test=test',
            state: {
                redirectedFromNotFound: true,
            },
        }));
        const { getByTestId } = setup({
            searchRecordsReducer: {
                publicationsList: [{ rek_id: 'UQ:12356' }],
            },
            favouriteSearchReducer: {
                favouriteSearchAddSuccess: false,
            },
        });
        expect(getByTestId('favourite-search-saved')).toBeInTheDocument();
    });
});
