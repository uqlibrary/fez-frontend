import TabContainer from './TabContainer';

function setup(testProps = {}) {
    const props = {
        value: 'ping',
        currentTab: 'pong',
        tabbed: false,
        children: '<p>Test container</p>',
        ...testProps,
    };

    return getElement(TabContainer, props);
}

describe('TabContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render null', () => {
        const wrapper = setup({
            tabbed: true,
            value: 'ping',
            currentTab: 'pong',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
