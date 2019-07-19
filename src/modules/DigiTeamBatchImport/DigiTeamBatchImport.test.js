import React from 'react';
import { rtlRender } from 'test-utils';
import { Provider } from 'react-redux';
import { setupStoreForMount } from 'test.setup';

import DigiTeamBatchImport from './components/DigiTeamBatchImport';

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
});
