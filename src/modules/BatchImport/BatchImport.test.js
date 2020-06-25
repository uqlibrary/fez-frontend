import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import { fireEvent, rtlRender } from 'test-utils';
import { createMemoryHistory } from 'history';

import BatchImport from './containers/BatchImport';

const history = createMemoryHistory();
const testFn = jest.fn();
history.push = testFn;

function setup(testProps) {
    return rtlRender(
        <Provider store={setupStoreForMount().store}>
            <Router initialEntries={[{ pathname: '/', key: 'testKey' }]} history={history}>
                <BatchImport {...testProps} />
            </Router>
        </Provider>,
    );
}

describe('BatchImport Component', () => {
    it('renders page', () => {
        setup({});
    });

    it('navigates to homepage on cancel', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('cancelBatchImport'));
        expect(testFn).toHaveBeenCalledWith('/');
    });
});
