import React from 'react';

import { render, WithReduxStore, fireEvent, waitFor } from 'test-utils';

import Immutable from 'immutable';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';
import * as actions from 'actions';
import * as actionTypes from 'actions/actionTypes';

const vocabDataRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <VocabDataRow {...testProps} />
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies VocabDataRow', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render the row', async () => {
        const { getByText } = setup({ row: vocabDataRow });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        const { getByTestId } = setup({ row: vocabDataRow });
        const button = getByTestId('expand-row-453669');
        expect(button).toBeInTheDocument();
    });
    it('should dispatch SET_OPENED_VOCAB action', async () => {
        const expectedActions = [actionTypes.SET_OPENED_VOCAB];
        await mockActionsStore.dispatch(actions.setOpenedVocab({ id: 453669, open: true }));
        const result = mockActionsStore.getActions();
        expect(result).toHaveDispatchedActions(expectedActions);
    });

    it('should expand when clicking button', async () => {
        const { getByTestId } = setup({ row: vocabDataRow });
        const button = getByTestId('expand-row-453669');
        fireEvent.click(button);
        await waitFor(() => {
            expect(getByTestId('vocab-child-header')).toBeInTheDocument();
        });
    });
});
