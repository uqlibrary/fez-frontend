import StandardRighthandCard from './StandardRighthandCard';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
        title: testProps.title,
        help: testProps.help,
        children: testProps.children
    };
    return getElement(StandardRighthandCard, props, isShallow);
}

describe('Snapshot tests for StandardRighthandCard component', () => {
    it('renders StandardRighthandCard with title and no help icon', () => {
        const wrapper = setup({title: 'card title'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardRighthandCard with title and help button', () => {
        const wrapper = setup({title: 'Title', help: {title:'Help text', text:'Some help text', buttonLabel:'OK'}});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardRighthandCard with title and help button and some content', () => {
        const wrapper = setup({title: 'Title', help: {title:'Help text', text:'Some help text', buttonLabel:'OK'}, children: 'Some content'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
