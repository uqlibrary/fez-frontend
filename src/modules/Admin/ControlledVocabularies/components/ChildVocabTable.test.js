import React from 'react';

import { render, WithReduxStore, WithRouter, fireEvent, waitForElementToBeRemoved } from 'test-utils';
import { createMemoryHistory } from 'history';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import Immutable from 'immutable';
import { waitFor } from '@testing-library/dom';
import * as repositories from 'repositories';

const parentRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <ChildVocabTable {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table', async () => {
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
            .reply(200, mockData.childVocabList[453669]);

        const initState = {};
        const { getByTestId } = setup({ parentRow: parentRow }, initState);
        await waitFor(() => {
            expect(getByTestId('child-row-title-453670')).toHaveTextContent('Yukulta / Ganggalidda language G34');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(165);
        });
    });
    it('should go through the data and breadcrumb', async () => {
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API(451780).apiUrl)
            .reply(200, mockData.childVocabList[451780]);

        const parentRowResearch = mockData.vocabList.data[1];
        const initState = {};
        const { getByTestId } = setup({ parentRow: parentRowResearch }, initState);

        await waitFor(() => {
            expect(getByTestId('child-row-title-451799')).toHaveTextContent('01 Mathematical Sciences');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(2);
        });
        fireEvent.click(getByTestId('child-row-title-link-451799'));
        await waitFor(() => {
            expect(getByTestId('child-row-title-451800')).toHaveTextContent('0101 Pure Mathematics');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(6);
        });
        fireEvent.click(getByTestId('child-row-title-link-451800'));
        await waitFor(() => {
            expect(getByTestId('child-row-title-451801')).toHaveTextContent('010101 Algebra and Number Theory');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(13);
        });
        fireEvent.click(getByTestId('child-row-title-link-451801'));
        await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));
        await waitFor(() => {
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(0);
        });

        fireEvent.click(getByTestId('nav-451800'));
        await waitForElementToBeRemoved(getByTestId('childControlledVocab-page-loading'));
        await waitFor(() => {
            expect(getByTestId('child-row-title-451801')).toHaveTextContent('010101 Algebra and Number Theory');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(13);
        });

        fireEvent.click(getByTestId('nav-451780'));
        await waitFor(() => {
            expect(getByTestId('child-row-title-451799')).toHaveTextContent('01 Mathematical Sciences');
            expect(document.querySelectorAll('[data-testid^=child-row-em-]').length).toEqual(2);
        });
    });
});

describe('ControlledVocabularies ChildVocabTable Loader', () => {
    it('should render the loader', async () => {
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
            .reply(200, mockData.childVocabList[453669]);

        const initState = {};
        const { getByTestId } = setup({ parentRow: parentRow }, initState);
        expect(getByTestId('childControlledVocab-page-loading')).toBeInTheDocument();
    });

    it('should hide the loader after the data is loaded', async () => {
        mockApi
            .onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
            .reply(200, mockData.childVocabList[453669]);

        const initState = {};
        const { getByTestId, queryByText } = setup({ parentRow: parentRow }, initState);
        await waitFor(() => {
            getByTestId('child-row-em-456960');
        });
        expect(queryByText('Loading Data')).not.toBeInTheDocument();
    });
});
