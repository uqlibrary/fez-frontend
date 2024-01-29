import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import * as mockData from 'mock/data';

import VocabDataRow from './VocabDataRow';

const vocabDataRow = mockData.vocabList.data[0];
const setup = (testProps = {}, state = {}) => {
    return render(
        <WithReduxStore initialState={state}>
            <VocabDataRow {...testProps} />
        </WithReduxStore>,
    );
};

// function setup(testProps = {}) {
//     return renderWithRedux(<VocabDataRow {...testProps} />);
// }

describe('ControlledVocabularies VocabDataRow', () => {
    it('should render the row', async () => {
        const { getByText } = setup({ row: vocabDataRow });
        expect(getByText('AIATSIS codes')).toBeInTheDocument();
    });
    it('should have the expand button', async () => {
        const { getByRole } = setup({ row: vocabDataRow });
        const button = getByRole('button', { id: 'expand-row-454025' });
        expect(button).toBeInTheDocument();
    });
});
