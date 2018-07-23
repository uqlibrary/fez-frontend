import InlineLoader from './InlineLoader';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(InlineLoader, props, isShallow);
}

describe('InlineLoader snapshots tests', () => {
    it('renders loader', () => {
        const wrapper = setup({message: 'Waiting to load...'});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
