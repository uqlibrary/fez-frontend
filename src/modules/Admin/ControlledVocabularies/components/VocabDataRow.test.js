import React from 'react';

import { render } from 'test-utils';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';

const vocabDataRow = mockData.vocabList.data[0];

const setup = vocabDataRow => render(<VocabDataRow row={vocabDataRow} />);

describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the table', async () => {
        const myTable = setup(vocabDataRow);
        expect(myTable).toMatchSnapshot();
    });
});
