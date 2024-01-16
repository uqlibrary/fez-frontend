import React from 'react';

import { render } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

const setup = (sortedList, labels) => render(<VocabTable records={sortedList} labels={labels} />);

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        const myTable = setup(sortedList, labels);
        expect(myTable).toMatchSnapshot();
    });
});
