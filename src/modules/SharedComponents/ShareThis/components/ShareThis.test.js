jest.dontMock('./ShareThis');

import ShareThis from './ShareThis';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        hide: testProps.hide || false
    };
    return getElement(ShareThis, props, isShallow);
}

describe('Component Sharethis', () => {
    it('should render 3rd party elements with default props', () => {
        const wrapper = setup({});

        // create snapshot
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render 3rd party elements', () => {
        // set initial props values
        const wrapper = setup({ hide: false });

        // create snapshot
        expect(toJson(wrapper)).toMatchSnapshot();
   });

    it('should render empty component', () => {
        // set initial props values
        const wrapper = setup({ hide: true });

        // create snapshot
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
