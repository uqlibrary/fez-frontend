import WhatIsEspace from './WhatIsEspace';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps
    };
    return getElement(WhatIsEspace, props, isShallow);
}

describe('Component WhatIsEspace', () => {
    it('should render as expected', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
