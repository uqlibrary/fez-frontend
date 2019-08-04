import { ExternalLink } from './ExternalLink';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
    };
    return getElement(ExternalLink, props, isShallow);
}

describe('ExternalLink test ', () => {
    it('should render component with open-in-new window icon class', () => {
        const wrapper = setup({ href: 'www.google.com', text: 'Google' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without open-in-new window icon', () => {
        const wrapper = setup({ href: 'www.google.com', text: 'Google', openInNewIcon: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
