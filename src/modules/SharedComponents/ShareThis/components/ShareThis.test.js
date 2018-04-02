jest.dontMock('./ShareThis');

import ShareThis from './ShareThis';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        show: testProps.show || false // : PropTypes.bool,
    };
    return getElement(ShareThis, props, isShallow);
}

describe('Sharethis renders ', () => {
    it('component with show true', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with show false', () => {
        const wrapper = setup({ show: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
