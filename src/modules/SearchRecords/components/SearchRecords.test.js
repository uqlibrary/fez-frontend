import SearchRecords from './SearchRecords';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        exportPublicationsLoading: false,
    };
    return getElement(SearchRecords, props, isShallow);
}

describe('SearchRecords page', () => {

    it('should render placeholders', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while export publications loading', () => {
        const wrapper = setup({ exportPublicationsLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
