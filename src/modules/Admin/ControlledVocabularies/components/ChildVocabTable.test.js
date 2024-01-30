import React from 'react';

import { render, WithReduxStore } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import locale from 'locale/components';
import Immutable from 'immutable';
import { waitFor } from '@testing-library/dom';

const parentRow = mockData.vocabList.data[0];

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
        //ztodo: when loading one children, it updated the other expanded children.
        //ztodo: the row data isn't loaded.
        waitFor(
            ()=>{getByText('Description').toBeInTheDocument()}
        );
        expect(getByText('Description')).toBeInTheDocument();
    });
});
