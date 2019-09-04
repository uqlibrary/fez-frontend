import IndexComponent from './Index';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
    };
    return getElement(IndexComponent, props, args);
}

describe('Index page', () => {
    it('should render placeholders', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
