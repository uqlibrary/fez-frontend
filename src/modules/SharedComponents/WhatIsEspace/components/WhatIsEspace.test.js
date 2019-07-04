import WhatIsEspace from './WhatIsEspace';

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    return getElement(WhatIsEspace, props, isShallow);
}

describe('Component WhatIsEspace', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
