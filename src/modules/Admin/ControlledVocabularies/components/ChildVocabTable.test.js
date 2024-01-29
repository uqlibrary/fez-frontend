import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import locale from 'locale/components';
import Immutable from 'immutable';

const parentRow = mockData.vocabList.data[0];
const labels = locale.components.controlledVocabulary.columns.labels;

function setup(testProps = {}, state={}) {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <ChildVocabTable {...testProps} />
        </WithReduxStore>
    );
}

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table', async () => {
        const { getByText } = setup({ parentRow: parentRow});
        expect(getByText('Description')).toBeInTheDocument();
    });
});
