import TopCitedPublications from './TopCitedPublications';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchTopCitedPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(TopCitedPublications, props, isShallow);
}

describe('Component TopCitedPublications with wrappers', () => {
    it('should render properly', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper.instance())).toMatchSnapshot();
    });
});