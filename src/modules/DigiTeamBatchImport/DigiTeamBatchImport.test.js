import React from 'react';
import { rtlRender } from 'test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';

import DigiTeamBatchImport from './containers/DigiTeamBatchImport';

function setup(testProps) {
    return rtlRender(
        <Provider store={setupStoreForMount().store}>
            <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                <DigiTeamBatchImport {...testProps} />
            </MemoryRouter>
        </Provider>
    );
}

describe('DigiTeamBatchImport Component', () => {
    it('renders page', () => {
        setup({});
    });
});
