import React from 'react';
import AddFavouriteSearchIcon from './AddFavouriteSearchIcon';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, act } from 'test-utils';
import * as Context from 'context';
import * as FavouriteSearchActions from 'actions/favouriteSearch';
import Immutable from 'immutable';

function setup({ state = Immutable.Map({}) }) {
    return render(
        <WithRouter>
            <WithReduxStore initialState={state}>
                <AddFavouriteSearchIcon />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('Component AddFavouriteSearchIcon', () => {
    it('should save search as favourite search as an admin user', async () => {
        const useAccountContext = jest.spyOn(Context, 'useAccountContext');
        const addFavouriteSearch = jest.spyOn(FavouriteSearchActions, 'addFavouriteSearch');

        useAccountContext.mockImplementation(() => ({ account: { id: 'uqtest' } }));

        const { getByTestId } = setup({
            state: Immutable.Map({
                searchRecordsReducer: {
                    publicationsList: [{ rek_id: 'UQ:12356' }],
                },
            }),
        });

        act(() => {
            fireEvent.click(getByTestId('favourite-search-save'));
        });

        const descriptionInput = await waitFor(() => getByTestId('fvs-description-input'));

        fireEvent.change(descriptionInput, { target: { value: 'test favourite search' } });

        act(() => {
            fireEvent.click(getByTestId('confirm-action'));
        });

        expect(addFavouriteSearch).toHaveBeenCalledWith({
            fvs_description: 'test favourite search',
            fvs_username: 'uqtest',
            fvs_search_parameters: '/',
        });
    });

    it('should display icon for saved search as favourite search as an admin user', () => {
        const { getByTestId } = setup({
            state: Immutable.Map({
                searchRecordsReducer: {
                    publicationsList: [{ rek_id: 'UQ:12356' }],
                },
                favouriteSearchReducer: {
                    favouriteSearchAddSuccess: true,
                },
            }),
        });

        expect(getByTestId('favourite-search-saved')).toBeInTheDocument();
    });
});
