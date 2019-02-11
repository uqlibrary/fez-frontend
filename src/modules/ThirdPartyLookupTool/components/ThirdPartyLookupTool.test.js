import {ThirdPartyLookupTool} from './ThirdPartyLookupTool';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(ThirdPartyLookupTool, props, isShallow);
}

describe('Component ThirdPartyLookupTool', () => {
    it('renders incites', () => {
        const wrapper = setup({});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
