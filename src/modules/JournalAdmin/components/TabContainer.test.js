import React from 'react';
import TabContainer from './TabContainer';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        value: 'ping',
        currentTab: 'pong',
        tabbed: false,
        children: <p>Test containers</p>,
        ...testProps,
    };

    return rtlRender(<TabContainer {...props} />);
}

describe('TabContainer component', () => {
    it('should render default view', () => {
        setup();
        expect(document.querySelector('p')).toHaveTextContent('Test containers');
    });

    it('should render null', () => {
        setup({
            tabbed: true,
            value: 'ping',
            currentTab: 'pong',
        });
        expect(document.querySelector('p')).not.toBeInTheDocument();
    });
});
