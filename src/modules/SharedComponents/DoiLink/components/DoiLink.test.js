import DoiLink from './DoiLink';

function setup(testProps, isShallow = true) {
    const props = {
        DoiId: testProps.DoiId
    };

    return getElement(DoiLink, props, isShallow);
}

describe('DoiLink test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with DOI link', () => {
        const wrapper = setup({DoiId: '12345'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
