import React from 'react';
import Immutable from 'immutable';
import { fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';
import { createMemoryHistory } from 'history';
import { pathConfig } from '../../../config';
import { FavouriteJournals } from '../index';

function setup(testProps = Immutable.Map({})) {
    return render(
        <WithRouter history={testProps.history}>
            <WithReduxStore>
                <FavouriteJournals />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('FavouriteJournals', () => {
    it('should navigate to journal search page', () => {
        const history = createMemoryHistory({ initialEntries: [pathConfig.journals.compare] });
        history.push({
            pathname: pathConfig.journals.search,
        });
        const { getByTestId } = setup(Immutable.Map({ history: history }));
        fireEvent.click(getByTestId('return-to-search-results-button'));
        expect(history.location.pathname).toBe(pathConfig.journals.search);
    });
});
