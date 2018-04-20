import PublicationTitle from './PublicationTitle';

function setup(testProps, isShallow = true) {
    const props = {
        title: 'This is my default publication title',
        ...testProps
    };

    return getElement(PublicationTitle, props, isShallow);
}

describe('PublicationTitle test ', () => {
    it('should render component with title without link', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with title with link', () => {
        const wrapper = setup({pid: 'UQ:111111', title: 'This is my test publication title'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
