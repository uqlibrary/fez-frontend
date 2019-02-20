import MenuDrawer from './MenuDrawer';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0'
    }
];

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        menuItems: testProps.menuItems || defaultMenuItems,
        history: testProps.history || {push: jest.fn()}
    };
    return getElement(MenuDrawer, props, isShallow);
}

describe('MenuDrawer Snapshot', () => {
    it('should create component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});