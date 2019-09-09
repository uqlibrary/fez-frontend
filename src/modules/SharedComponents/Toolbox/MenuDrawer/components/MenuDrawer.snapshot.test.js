import MenuDrawer from './MenuDrawer';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0',
    },
];

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        menuItems: testProps.menuItems || defaultMenuItems,
        history: testProps.history || { push: jest.fn() },
    };
    return getElement(MenuDrawer, props, args);
}

describe('MenuDrawer Snapshot', () => {
    it('should create component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
