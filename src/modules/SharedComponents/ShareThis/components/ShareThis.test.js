import ShareThis from './ShareThis';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps
    };
    return getElement(ShareThis, props, isShallow);
}

describe('Component Sharethis', () => {
    it('should render 3rd party elements with default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
