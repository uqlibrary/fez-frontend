import WhatIsEspace from './WhatIsEspace';
jest.mock('locale', () => ({
    locale: {
        components: {
            whatIsEspace: {
                readMoreLink: 'https://example.com/',
                readMoreTitle: 'mouse over and see me',
                readMoreLabel: 'click me to learn more',
                title: 'what is espace title',
                text: 'what is espace intro',
            },
        },
    },
}));

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    return getElement(WhatIsEspace, props, isShallow);
}

describe('Component WhatIsEspace with different locale', () => {
    it('should render external link', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
