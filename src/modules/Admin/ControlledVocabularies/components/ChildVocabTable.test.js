import React from 'react';

import { render, WithReduxStore, WithRouter } from 'test-utils';
import { createMemoryHistory } from 'history';

import * as mockData from 'mock/data';

import ChildVocabTable from './ChildVocabTable';
import locale from 'locale/components';
import Immutable from 'immutable';
import { waitFor } from '@testing-library/dom';
import * as repositories from 'repositories';

const parentRow = mockData.vocabList.data[0];

const setup = (testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <ChildVocabTable {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
};

// function setup(testProps = {}, state={}) {
//     return render(
//         <WithReduxStore initialState={Immutable.Map(state)}>
//             <ChildVocabTable {...testProps} />
//         </WithReduxStore>
//     );
// }

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table', async () => {
        mockApi.onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
        .reply(200, mockData.childVocabList[453669]);
        // console.log('url=', repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl);
        //work1
        // mockApi.onGet('vocabularies/453669').reply(200, mockData.childVocabList[453669]);
        //work2
        // mockApi.onAny().reply(
        //     (config)=>{
        //         console.log('config=', config);
        //         return [200, mockData.childVocabList[453669]];
        //     }
        // );

        // const initState={viewChildVocabReducer: {vocabList: mockData.childVocabList['453669'].data}}; 
        const initState={};
        // const initState={viewChildVocabReducer: mockData.childVocabList['453669']}; 
        const { getByText, getByTestId } = setup({ parentRow: parentRow}, initState);
        //ztodo: when loading one children, it updated the other expanded children.
        // await waitFor(
        //     ()=>{getByText('Description').toBeInTheDocument()}
        // );
        expect(getByText('Description')).toBeInTheDocument();
        await waitFor(() => 
        {
            //get text not working
            // expect(getByText('Yukulta')).toBeInTheDocument();
            //getByTestId works
            // expect(getByTestId('child-vocab-title-453670')).toBeDefined();
            expect(getByTestId('child-vocab-title-453670')).toBeInTheDocument();
        }
        );
        
    });
});
