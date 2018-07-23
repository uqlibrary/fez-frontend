import StandardCard from './StandardCard';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(StandardCard, props, isShallow);
}

describe('Snapshot tests for StandardCard component', () => {
    it('renders StandardCard with title and no help icon', () => {
        const wrapper = setup({title: 'card title'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders StandardCard with title and help button', () => {
        const wrapper = setup({title: 'card title', help: {title: 'help', text: ('help text'), buttonLabel: 'OK'}});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
