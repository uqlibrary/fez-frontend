import React from 'react';
import MenuDrawer from './MenuDrawer';
import { render, WithRouter } from 'test-utils';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0',
    },
];

function setup(testProps = {}) {
    const props = {
        ...testProps,
        drawerOpen: true,
        docker: true,
        locale: {
            skipNavTitle: 'skip-nav',
            skipNavAriaLabel: 'skip-nav',
            closeMenuLabel: 'close',
        },
        menuItems: testProps.menuItems || defaultMenuItems,
        history: testProps.history || { push: jest.fn() },
    };
    return render(
        <WithRouter>
            <MenuDrawer {...props} />
        </WithRouter>,
    );
}

describe('MenuDrawer Snapshot', () => {
    it('should create component', () => {
        const { baseElement } = setup();
        expect(baseElement).toMatchSnapshot();
    });
});
