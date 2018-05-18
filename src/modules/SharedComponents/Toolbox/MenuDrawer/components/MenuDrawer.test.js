import MenuDrawer from './MenuDrawer';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0'
    },
    {
        divider: true
    },
    {
        linkTo: '/xyz',
        primaryText: 'Primary text 1',
        secondaryText: 'secondary text 1'
    }
];

const defaultLocale = {
    skipNavTitle: 'Skip navigation',
    skipNavAriaLabel: 'Skip navigation',
    closeMenuLabel: 'Close menu'
};

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
        menuItems: testProps.menuItems || defaultMenuItems,
        onToggleDrawer: testProps.onToggleDrawer || jest.fn(),
        history: testProps.history || {push: jest.fn()},
        locale: testProps.locale || defaultLocale,
        drawerOpen: testProps.drawerOpen || false,
        docked: testProps.docked || false
    };
    return getElement(MenuDrawer, props, isShallow);
}

describe('Component MenuDrawer', () => {

    it('should render empty drawer', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider', () => {
        const wrapper = setup({drawerOpen: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const wrapper = setup({drawerOpen: true, docked: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const wrapper = setup({drawerOpen: true, docked: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should navigate to internal route', () => {
        const testMethod = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true, history: {push: testMethod}});
        // navigateToLink
        wrapper.find('span.menu-item-container ListItem').forEach(listItem => {
            listItem.props().onClick();
            expect(testMethod).toHaveBeenCalled();
        });
    });

    it('should skip navigation', () => {
        const testMethod = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true, history: {push: testMethod}});
        // TODO: how to spy?
        // const spy = jest.spyOn(wrapper.find('#afterMenuDrawer').getElement(), 'focus');
        // wrapper.find('#skipNav').simulate('click');
        // expect(spy).toHaveBeenCalled();
    });


    it('should render CRICOS footer', () => {
        const testMethod = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true, history: {push: testMethod}});
        expect(toJson(wrapper.find('.mainMenuFooter'))).toMatchSnapshot();
    });

    it('should call the lifecycle method of the component if props change', () => {
        const testFunction = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true});
        wrapper.instance().shouldComponentUpdate = testFunction;
        wrapper.setProps({docked: false});
        expect(testFunction).toBeCalled();
    });

});
