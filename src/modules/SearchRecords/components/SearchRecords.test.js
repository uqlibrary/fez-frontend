import SearchRecords from './SearchRecords';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };
    return getElement(SearchRecords, props, isShallow);
}

describe('SearchRecords page', () => {

    it('should render placeholders', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
