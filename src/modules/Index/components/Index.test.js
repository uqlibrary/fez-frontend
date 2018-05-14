import Index from './Index';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };
    return getElement(Index, props, isShallow);
}

describe('Index page', () => {

    it('should render placeholders', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render What is eSpace? as expected', () => {
        const wrapper = setup({}).find('.whatIsEspace').dive();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
