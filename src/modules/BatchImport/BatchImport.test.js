import React from 'react';
import { rtlRender } from 'test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';

import BatchImport from './containers/BatchImport';

function setup(testProps) {
    return rtlRender(
        <Provider store={setupStoreForMount().store}>
            <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                <BatchImport {...testProps} />
            </MemoryRouter>
        </Provider>
    );
}

describe('BatchImport Component', () => {
    it('renders page', () => {
        setup({});
    });
});
