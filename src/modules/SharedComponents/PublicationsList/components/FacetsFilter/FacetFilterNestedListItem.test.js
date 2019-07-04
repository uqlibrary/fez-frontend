import FacetFilterNestedListItem from './FacetFilterNestedListItem';

function setup(testProps, isShallow = true) {
    const props = {
        index: 0,
        primaryText: 'Test facet filter',
        disabled: false,
        isActive: false,
        classes: {
            listItemGutters: 'listItemGutters',
            inset: 'inset',
            selectedFacet: 'selectedFacet',
        },
        onFacetClick: jest.fn(),
        ...testProps,
    };
    return getElement(FacetFilterNestedListItem, props, isShallow);
}

describe('Facet filter nested list item ', () => {
    it('should render default filter view', () => {
        const wrapper = setup({ primaryText: 'Test filter' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render active filter view', () => {
        const wrapper = setup({ primaryText: 'Test filter', isActive: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled filter view', () => {
        const wrapper = setup({ primaryText: 'Test filter', isActive: true, disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render inactive filter view', () => {
        const wrapper = setup({ primaryText: 'Test filter', isActive: false }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render memoised version of the filter view', () => {
        const wrapper = setup({ primaryText: 'Test filter', isActive: true, disabled: true }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setProps({
            inActive: true,
            disabled: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
