import React from 'react';

import { render, screen } from 'test-utils';

import * as mockData from 'mock/data';

import VocabTable from './VocabTable';
import locale from 'locale/components';

const sortedList = mockData.vocabList.data;
const labels = locale.components.controlledVocabulary.columns.labels;

describe('ControlledVocabularies VocabTable', () => {
    it('should render the table', async () => {
        render(<VocabTable records={sortedList} labels={labels} />);
        expect(screen.getByText('AIATSIS codes')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
    });
});
