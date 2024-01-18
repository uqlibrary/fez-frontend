import React from 'react';

import { render } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

function setup(testProps = {}) {
    return render(<VocabTable {...testProps} />);
}

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        const { getByText } = setup({ records: sortedList, labels: labels });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
        expect(getByText('Title')).toBeInTheDocument();
    });
});
