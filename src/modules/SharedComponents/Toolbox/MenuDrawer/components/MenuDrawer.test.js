import { MenuDrawer } from './MenuDrawer';

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
        linkTo: '/xyz',
        primaryText: 'Primary text 1',
        secondaryText: 'secondary text 1',
    },
];

const defaultLocale = {
    skipNavTitle: 'Skip navigation',
    skipNavAriaLabel: 'Skip navigation',
    closeMenuLabel: 'Close menu',
};

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        logoText: 'test',
        logoImage: 'test',
        logoLink: 'test',
        menuItems: testProps.menuItems || defaultMenuItems,
        onToggleDrawer: testProps.onToggleDrawer || jest.fn(),
        history: testProps.history || { push: jest.fn() },
        locale: testProps.locale || defaultLocale,
        drawerOpen: testProps.drawerOpen || false,
        docked: testProps.docked || false,
    };
    return getElement(MenuDrawer, props);
}

describe('Component MenuDrawer', () => {
    it('should render empty drawer', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider', () => {
        const wrapper = setup({ drawerOpen: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const wrapper = setup({ drawerOpen: true, docked: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const wrapper = setup({ drawerOpen: true, docked: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render CRICOS footer', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ drawerOpen: true, docked: true, history: { push: testMethod } });
        expect(toJson(wrapper.find('.mainMenuFooter'))).toMatchSnapshot();
    });

    it('should call the lifecycle method of the component if props change', () => {
        const wrapper = setup({ drawerOpen: true, docked: true });
        const test = jest.spyOn(wrapper.instance(), 'shouldComponentUpdate');
        wrapper.setProps({ docked: false });
        expect(test).toBeCalled();
    });

    it('should have working method for navigating to links', () => {
        const wrapper1 = setup();
        const test1 = jest.spyOn(wrapper1.instance().props, 'onToggleDrawer');
        wrapper1.instance().navigateToLink(null, undefined);
        expect(test1).toBeCalled();

        const test2 = jest.fn();
        const wrapper2 = setup({ docked: true, history: { push: test2 } });

        wrapper2.instance().navigateToLink('/', '');
        expect(test2).toBeCalledWith('/');

        global.open = jest.fn();
        wrapper2.instance().navigateToLink('https://www.example.com', '');
        expect(global.open).toBeCalledWith('https://www.example.com', '');
    });

    it('should have working method for skipping menu items', () => {
        const wrapper = setup();
        const test = jest.spyOn(wrapper.instance(), 'focusOnElementId');
        wrapper.instance().skipMenuItems();
        expect(test).toBeCalledWith('afterMenuDrawer');
    });

    it('should have working method for focusing on given element ID', () => {
        let test = false;
        const dummyElement = document.createElement('div');
        dummyElement.focus = () => {
            test = true;
        };
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        const wrapper = setup();
        wrapper.instance().focusOnElementId('anything');
        expect(test).toBe(true);
    });
});
