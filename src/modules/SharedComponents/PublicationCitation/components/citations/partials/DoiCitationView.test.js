import DoiCitationView from './DoiCitationView';

function setup(testProps = {}, args = { isShallow: false }) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(DoiCitationView, props, args);
}

describe('DoiCitationView test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with doi', () => {
        const wrapper = setup({ doi: '10.121212/lskdjflsdjf' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render doi without external link', () => {
        const wrapper = setup({ doi: '10.121212/lskdjflsdjf', hideDoiLink: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
