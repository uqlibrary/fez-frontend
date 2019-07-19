import React from 'react';
import Immutable from 'immutable';
import { rtlRender } from 'test-utils';
import { Provider } from 'react-redux';
import { setupStoreForMount } from 'test.setup';

import DigiTeamBatchImport, { getMenuObjectsFromCollectionsArray } from './components/DigiTeamBatchImport';

function setup(testProps) {
    return rtlRender(
        <Provider store={setupStoreForMount().store}>
            <DigiTeamBatchImport {...testProps} />
        </Provider>
    );
}

describe('DigiTeamBatchImport Component', () => {
    it('renders page', () => {
        setup({});
    });

    it('renders after a community is selected', () => {
        setup({
            formValues: Immutable.Map({
                communityID: 'UQ:342708',
            }),
        });
    });
});

describe('DigiTeamBatchImport helpers', () => {
    it('can convert collections array to menu object array', () => {
        const test = [
            { rek_title: 'test1', rek_pid: 'UQ:123456' },
            { rek_title: 'test3', rek_pid: 'UQ:123457' },
            { rek_title: 'test2', rek_pid: 'UQ:123458' },
        ];
        const expected = [
            { text: 'test1', value: 'UQ:123456', index: 0 },
            { text: 'test3', value: 'UQ:123457', index: 1 },
            { text: 'test2', value: 'UQ:123458', index: 2 },
        ];
        expect(getMenuObjectsFromCollectionsArray(test)).toEqual(expected);
    });
});
