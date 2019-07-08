import FacetFilterListItem from './FacetFilterListItem';

function setup(testProps, isShallow = true) {
    const props = {
        key: '0',
        facetTitle: 'Test title',
        disabled: false,
        open: false,
        classes: { listItemGutters: 'listItemGutters' },
        nestedItems: [],
        onToggle: jest.fn(),
        ...testProps,
    };
    return getElement(FacetFilterListItem, props, isShallow);
}

describe('Facet filter list item ', () => {
    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render collapsed filter', () => {
        const wrapper = setup({ open: true, nestedItems: 'Test filter' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle nested items on click', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onToggle: testFn });
        wrapper.props().onToggle();
        expect(testFn).toBeCalled();
    });
});
