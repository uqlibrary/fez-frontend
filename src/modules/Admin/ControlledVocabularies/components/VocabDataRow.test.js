import React from 'react';

import { render, screen } from 'test-utils';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';

const vocabDataRow = mockData.vocabList.data[0];

describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the row', async () => {
        render(<VocabDataRow row={vocabDataRow} />);
        expect(screen.getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        render(<VocabDataRow row={vocabDataRow} />);
        const button = screen.getByRole('button', { id: 'expand-row-454025' });
        expect(button).toBeInTheDocument();
    });
});
