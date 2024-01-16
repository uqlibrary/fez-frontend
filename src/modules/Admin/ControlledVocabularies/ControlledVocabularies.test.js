import React from 'react';

import { render, WithReduxStore, WithRouter, waitFor } from 'test-utils';

import * as mockData from 'mock/data';

import * as UserIsAdmin from 'hooks/userIsAdmin';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

import ControlledVocabularies from './ControlledVocabularies';
import * as repositories from 'repositories';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = {}) => {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <ControlledVocabularies {...state} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('ControlledVocabularies', () => {
    mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, mockData.vocabList);

    const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');
    it('should render the controlled vocabulary list page as admin', async () => {
        userIsAdmin.mockImplementation(() => true);

        const { getByText } = setup();
        const txt = 'Displaying controlled vocabularies 1 to 42 of 42 total controlled vocabularies';
        await waitFor(() => getByText(txt));
        expect(getByText(txt)).toBeInTheDocument();
    });

    it('should show loading message', async () => {
        userIsAdmin.mockImplementation(() => true);
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, {});

        const { getByText } = setup();
        await waitFor(() => getByText('...Loading Data...'));
        expect(getByText('...Loading Data...')).toBeInTheDocument();
    });

    it('should show relevant error message', async () => {
        mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(500, { error: 'Error' });

        userIsAdmin.mockImplementation(() => false);

        const { getByText } = setup();
        await waitFor(() => getByText(/An error has occurred/));
        expect(getByText(/An error has occurred/)).toBeInTheDocument();
    });
});
