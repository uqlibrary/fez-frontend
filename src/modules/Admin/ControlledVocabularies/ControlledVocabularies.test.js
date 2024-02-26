import React from 'react';

import { render, WithReduxStore, WithRouter, waitFor, waitForElementToBeRemoved } from 'test-utils';

import * as mockData from 'mock/data';

import * as UserIsAdmin from 'hooks/userIsAdmin';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

import ControlledVocabularies from './ControlledVocabularies';
import * as repositories from 'repositories';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <ControlledVocabularies {...state} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies', () => {
    const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');
    beforeEach(() => {
        mockApi = setupMockAdapter();
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, mockData.vocabList);
        userIsAdmin.mockImplementation(() => true);
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render the controlled vocabulary list page as admin', async () => {
        const { getByText, getByTestId } = setup();
        await waitForElementToBeRemoved(getByTestId('vocab-page-loading'));
        const txt = 'Displaying 42 total controlled vocabularies';
        expect(getByText(txt)).toBeInTheDocument();
    });

    it('should show loading message', async () => {
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, {});

        const { getByText } = setup();
        await expect(getByText('...Loading Data...')).toBeInTheDocument();
    });

    it('should show relevant error message', async () => {
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(500, { error: 'Error' });
        const { getByText } = setup();
        await waitFor(() => getByText(/An error has occurred/));
        expect(getByText(/An error has occurred/)).toBeInTheDocument();
    });
});
