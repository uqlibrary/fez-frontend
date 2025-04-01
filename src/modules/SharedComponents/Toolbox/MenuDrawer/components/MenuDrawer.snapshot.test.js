import React from 'react';
import MenuDrawer from './MenuDrawer';
import { rtlRender, WithRouter } from 'test-utils';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0',
    },
    {
        linkTo: 'https://test.com',
        primaryText: 'External Link',
        isExternal: true,
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
    };
    return rtlRender(
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
