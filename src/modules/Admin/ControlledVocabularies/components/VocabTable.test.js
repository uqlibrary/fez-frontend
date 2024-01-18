import React from 'react';

import { render } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

function setup(TestElement, testProps = {}) {
    return render(<TestElement {...testProps} />);
}

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        const { getByText } = setup(VocabTable, { records: sortedList, labels: labels });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
        expect(getByText('Title')).toBeInTheDocument();
    });
});
