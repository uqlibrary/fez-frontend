import React from 'react';

import { render, WithReduxStore, WithRouter } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabDataRow from './ChildVocabDataRow';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';

const row = mockData.childVocabList['453669'].data[0].controlled_vocab;

function setup(testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <ChildVocabDataRow {...testProps} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table row', async () => {
        const { getByText } = setup({ row: row });
        expect(getByText('Yukulta / Ganggalidda language G34')).toBeInTheDocument();
    });
});
