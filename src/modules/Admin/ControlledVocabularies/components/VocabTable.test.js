import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';
import Immutable from 'immutable';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

function setup(testProps = {}, state={}) {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <VocabTable {...testProps} />
        </WithReduxStore>
    );
}

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        const { getByText } = setup({ records: sortedList, labels: labels });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
        expect(getByText('Title')).toBeInTheDocument();
    });
});
