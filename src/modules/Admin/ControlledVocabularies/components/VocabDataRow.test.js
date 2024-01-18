import React from 'react';

import { render } from 'test-utils';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';

const vocabDataRow = mockData.vocabList.data[0];
function setup(TestElement, testProps = {}) {
    return render(<TestElement {...testProps} />);
}

describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the row', async () => {
        const { getByText } = setup(VocabDataRow, { row: vocabDataRow });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        const { getByRole } = setup(VocabDataRow, { row: vocabDataRow });
        const button = getByRole('button', { id: 'expand-row-454025' });
        expect(button).toBeInTheDocument();
    });
});
