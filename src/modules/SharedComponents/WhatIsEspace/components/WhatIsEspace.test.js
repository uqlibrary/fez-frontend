import WhatIsEspace from './WhatIsEspace';

function setup(testProps, isShallow = true){
    const props = {...testProps};
    return getElement(WhatIsEspace, props, isShallow);
}

describe('Component WhatIsEspace', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render external link', () => {
        const wrapper = setup({
            details: {
                readMoreLink: 'https://example.com/',
                readMoreTitle: 'mouse over and see me',
                readMoreLabel: 'click me to learn more',
                title: 'what is espace title',
                text: 'what is espace intro'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
