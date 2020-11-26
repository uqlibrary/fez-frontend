import React from 'react';
import { Router } from 'react-router-dom';
import { rtlRender } from 'test-utils';
import { createMemoryHistory } from 'history';

import JournalView from './JournalView';

const history = createMemoryHistory();
const testFn = jest.fn();
history.push = testFn;

function setup(testProps) {
    const props = {
        actions: {
            loadJournal: jest.fn(),
        },
        match: {
            params: {
                id: '1',
            },
        },
        ...testProps,
    };
    return rtlRender(
        <Router initialEntries={[{ pathname: '/journal/view/1' }]} history={history}>
            <JournalView {...props} />
        </Router>,
    );
}

describe('JournalView Component', () => {
    it('renders page', () => {
        setup({});
    });
});
