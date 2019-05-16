import StandardPage from './StandardPage';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(StandardPage, props, isShallow);
}

describe('Snapshot tests for StandardPage component', () => {
    it('renders StandardPage with title', () => {
        const wrapper = setup({title: 'standard page title'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardPage without a title', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardPage with help', () => {
        const wrapper = setup({help: {title: 'Test', text: 'Test', buttonLabel:'Test'}});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

});
