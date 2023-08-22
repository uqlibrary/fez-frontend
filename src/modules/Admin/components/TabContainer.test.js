import React from 'react';
import TabContainer from './TabContainer';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        value: 'ping',
        currentTab: 'pong',
        tabbed: false,
        children: '<p>Test containers</p>',
        ...testProps,
    };

    return rtlRender(<TabContainer {...props} />);
}

describe('TabContainer component', () => {
    it('should render default view', () => {
        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('should render null', () => {
        const { container } = setup({
            tabbed: true,
            value: 'ping',
            currentTab: 'pong',
        });
        expect(container).toMatchSnapshot();
    });
});
