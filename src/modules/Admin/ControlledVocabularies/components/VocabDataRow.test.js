import React from 'react';

import { render, WithReduxStore, fireEvent, waitFor } from 'test-utils';

import Immutable from 'immutable';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';
import * as actions from 'actions';
import * as actionTypes from 'actions/actionTypes';

jest.mock('../ControlledVocabularyContext');
import {
    ControlledVocabulariesActionContext,
    ControlledVocabulariesStateContext,
} from '../ControlledVocabularyContext';

const vocabDataRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}) => {
    const actionContext = {
        onAdminEditActionClick: jest.fn(),
        ...testProps.actionContext,
    };
    const stateContext = {
        cvo_id: null,
        isOpen: false,
        ...testProps.stateContext,
    };

    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <ControlledVocabulariesActionContext.Provider value={actionContext}>
                <ControlledVocabulariesStateContext.Provider value={stateContext}>
                    <VocabDataRow {...testProps} />
                </ControlledVocabulariesStateContext.Provider>
            </ControlledVocabulariesActionContext.Provider>
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
        const { getByTestId, getByText } = setup({ row: vocabDataRow });
        const button = getByTestId('expand-row-453669');
        fireEvent.click(button);
        await waitFor(() => {
            expect(getByText('...Loading Data...')).toBeInTheDocument();
        });
    });
    it('should hide row and child rows when admin panel displayed', async () => {
        const { queryByTestId } = setup({ row: vocabDataRow, stateContext: { cvo_id: 453669, isOpen: true } });

        expect(queryByTestId('expand-row-453669')).not.toBeInTheDocument();
        expect(queryByTestId('vocab-child-header')).not.toBeInTheDocument();
    });
});
