import { ExternalLink } from './ExternalLink';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        ...testProps,
    };
    return getElement(ExternalLink, props);
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

    it('should render component without open-in-new window icon and open in a new sized window', () => {
        const wrapper = setup({});
        const openInSizedWindow = jest.spyOn(wrapper.instance(), 'openInSizedWindow');
        wrapper.setProps({
            href: 'www.google.com',
            text: 'Google',
            openInNewIcon: false,
            width: 100,
            height: 100,
        });
        wrapper.update();
        expect(openInSizedWindow).toHaveBeenCalled();
    });

    it('should render component without open-in-new window icon and open in a new sized window', () => {
        global.open = jest.fn();
        const wrapper = setup({
            href: 'www.google.com',
            text: 'Google',
            openInNewIcon: false,
            width: 100,
            height: 100,
            children: 'Hello',
        });
        const link = wrapper.find('a[text="Google"]');
        expect(link.length).toEqual(1);
        link.simulate('click');
        expect(global.open).toHaveBeenCalled();
    });
});
