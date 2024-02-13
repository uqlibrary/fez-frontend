import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';
import Immutable from 'immutable';

jest.mock('../ControlledVocabularyContext');
import {
    ControlledVocabulariesActionContext,
    ControlledVocabulariesStateContext,
} from '../ControlledVocabularyContext';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

function setup(testProps = {}, state = {}) {
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
                    <VocabTable {...testProps} />
                </ControlledVocabulariesStateContext.Provider>
            </ControlledVocabulariesActionContext.Provider>
        </WithReduxStore>,
    );
}

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        const { getByText } = setup({ records: sortedList, labels: labels });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
        expect(getByText('Title')).toBeInTheDocument();
    });
});
