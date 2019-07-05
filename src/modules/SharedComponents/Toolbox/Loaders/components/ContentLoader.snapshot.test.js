import ContentLoader from './ContentLoader';

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    return getElement(ContentLoader, props, isShallow);
}

describe('ContentLoader snapshots tests', () => {
    it('renders loader', () => {
        const wrapper = setup({ message: 'Waiting to load...' });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
