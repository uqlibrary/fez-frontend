import {AdminLookupTool} from './AdminLookupTool';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(AdminLookupTool, props, isShallow);
}

describe('Component AdminLookupTool', () => {
    it('renders incites', () => {
        const wrapper = setup({});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
