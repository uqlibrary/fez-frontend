import Masquerade from './Masquerade';

function setup(testProps, isShallow = true) {
    const props = {
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn()
        },
        account: testProps.account || {},
        ...testProps
    };
    return getElement(Masquerade, props, isShallow);
}

describe('Component Masquerade', () => {

    it('Should render form as expected', () => {
       const props = {};
       const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render readonly description', () => {
        const props = {
            account: {canMasqueradeType: 'readonly'}
        };
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
