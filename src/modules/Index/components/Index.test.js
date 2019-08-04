import IndexComponent from './Index';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };
    return getElement(IndexComponent, props, isShallow);
}

describe('Index page', () => {
    it('should render placeholders', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
