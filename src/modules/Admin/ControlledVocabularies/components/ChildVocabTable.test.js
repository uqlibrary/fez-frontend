import React from 'react';

import { render, WithReduxStore, WithRouter, waitFor, waitForElementToBeRemoved, userEvent } from 'test-utils';
import { createMemoryHistory } from 'history';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import Immutable from 'immutable';
import * as repositories from 'repositories';

jest.mock('../ControlledVocabularyContext');
import {
    ControlledVocabulariesActionContext,
    ControlledVocabulariesStateContext,
} from '../ControlledVocabularyContext';

const parentRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) => {
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
            <WithRouter history={testHistory}>
                <ControlledVocabulariesActionContext.Provider value={actionContext}>
                    <ControlledVocabulariesStateContext.Provider value={stateContext}>
                        <ChildVocabTable {...testProps} />
                    </ControlledVocabulariesStateContext.Provider>
                </ControlledVocabulariesActionContext.Provider>
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ChildVocabTable', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API({ parentId: 453669 }).apiUrl)
            .reply(200, mockData.childVocabList[453669]);
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render the child table', async () => {
        const { getByText, getByTestId } = setup({ parentRow: parentRow });
        expect(getByText('Description')).toBeInTheDocument();
        await waitFor(() => {
            expect(getByTestId('child-row-title-453670')).toHaveTextContent('Yukulta / Ganggalidda language G34');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(165);
        });
    });
    it('should render the locked child table', async () => {
        const { queryByTestId, getByTestId } = setup({ parentRow: parentRow, locked: true });
        await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));
        // Add button should not be present
        expect(queryByTestId('admin-add-vocabulary-button-453669')).not.toBeInTheDocument();
        // expect 4 columns
        expect(getByTestId('vocab-child-header').children.length).toBe(4);
    });

    it('should render the loader', async () => {
        const { getByTestId } = setup({ parentRow: parentRow });
        expect(getByTestId('childControlledVocab-page-loading')).toBeInTheDocument();
    });

    it('should hide the loader after the data is loaded', async () => {
        const { getByTestId, queryByText } = setup({ parentRow: parentRow });
        await waitFor(() => {
            getByTestId('child-row-em-456960');
        });
        expect(queryByText('Loading Data')).not.toBeInTheDocument();
    });

    it('should fire the add vocab function when the add button is clicked', async () => {
        const mockFn = jest.fn();
        const { getByTestId } = setup({
            parentRow: parentRow,
            actionContext: {
                onAdminAddActionClick: mockFn,
            },
        });
        await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));
        await userEvent.click(getByTestId('admin-add-vocabulary-button-453669'));
        expect(mockFn).toHaveBeenCalledWith(453669);
    });
});
