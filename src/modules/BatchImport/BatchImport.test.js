import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import { fireEvent, rtlRender } from 'test-utils';

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

    it('navigates to homepage on cancel', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            history: {
                push: testFn(),
            },
        });
        fireEvent.click(getByTestId('cancelBatchImport'));

        expect(testFn).toBeCalled();
    });
});
