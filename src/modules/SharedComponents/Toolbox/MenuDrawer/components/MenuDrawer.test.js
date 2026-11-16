import React from 'react';
import { MenuDrawer } from './MenuDrawer';
import { render, WithMemoryRouter, fireEvent, within } from 'test-utils';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0',
    },
    {
        divider: true,
    },
    {
        linkTo: 'https://www.example.com',
        primaryText: 'Primary text 1',
        secondaryText: 'secondary text 1',
    },
];

const defaultLocale = {
    skipNavTitle: 'Skip navigation',
    skipNavAriaLabel: 'Skip navigation',
    closeMenuLabel: 'Close menu',
    navAriaLabel: 'Main menu',
};

const mockUseNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        ...testProps,
        classes: {},
        logoText: 'test',
        logoImage: 'test',
        logoLink: 'test',
        menuItems: testProps.menuItems || defaultMenuItems,
        onToggleDrawer: testProps.onToggleDrawer || jest.fn(),
        locale: testProps.locale || defaultLocale,
        drawerOpen: testProps.drawerOpen || false,
        docked: testProps.docked || false,
    };
    return renderMethod(
        <WithMemoryRouter>
            <MenuDrawer {...props} />
        </WithMemoryRouter>,
    );
}

describe('Component MenuDrawer', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render empty drawer', () => {
        const { baseElement } = setup();
        expect(baseElement).toMatchSnapshot();
    });

    it('should label the menu navigation and put the CRICOS notice in a footer landmark', () => {
        const { getByRole } = setup({ drawerOpen: true, docked: true });
        expect(getByRole('navigation', { name: 'Main menu' })).toHaveAttribute('id', 'mainMenu');
        // the items either side of a divider are separate real lists inside the nav
        const nav = getByRole('navigation', { name: 'Main menu' });
        const lists = within(nav).getAllByRole('list');
        expect(lists).toHaveLength(2);
        lists.forEach(list => expect(list.querySelectorAll(':scope > :not(li)')).toHaveLength(0));
        expect(within(nav).getAllByRole('listitem')).toHaveLength(defaultMenuItems.filter(i => !i.divider).length);
        expect(within(nav).getByRole('separator')).toBeInTheDocument();
        expect(getByRole('contentinfo')).toHaveTextContent('CRICOS');
    });

    it('should render opened drawer with menus, divider', () => {
        const { baseElement } = setup({ drawerOpen: true });
        expect(baseElement).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const { baseElement } = setup({ drawerOpen: true, docked: true });
        expect(baseElement).toMatchSnapshot();
    });

    it('should call the lifecycle method of the component if props change', () => {
        const { rerender, queryByRole } = setup({ drawerOpen: true, docked: true });
        expect(queryByRole('button', { name: 'Skip navigation' })).toBeInTheDocument();
        setup({ drawerOpen: true, docked: false }, rerender);
        expect(queryByRole('button', { name: 'Skip navigation' })).not.toBeInTheDocument();
    });

    it('should have working method for navigating to links', () => {
        global.open = jest.fn();
        const toggleFn = jest.fn();
        const { getByRole } = setup({ drawerOpen: true, onToggleDrawer: toggleFn });
        fireEvent.click(getByRole('button', { name: 'Close menu' }));
        expect(toggleFn).toHaveBeenCalled();

        fireEvent.click(getByRole('button', { name: /Primary text 0/i }));
        expect(mockUseNavigate).toHaveBeenCalledWith('/');

        fireEvent.click(getByRole('button', { name: /Primary text 1/i }));
        expect(global.open).toHaveBeenCalledWith('https://www.example.com', '_blank');
    });

    it('should have working method for skipping menu items', () => {
        const { queryByRole, getByTestId } = setup({ drawerOpen: true, docked: true });
        fireEvent.click(queryByRole('button', { name: 'Skip navigation' }));
        expect(getByTestId('after-menu-drawer')).toHaveFocus();
    });
});
