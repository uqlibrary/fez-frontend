import { PublicationsListPaging } from './PublicationsListPaging';
import PublicationsListPagingWithStyles from './PublicationsListPaging';

const getProps = (testProps = {}) => ({
    classes: {},
    pagingData: {
        from: 0,
        to: 0,
        total: 0,
        per_page: 20,
        current_page: 1,
    },
    disabled: false,
    onPageChanged: jest.fn(),
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(PublicationsListPaging, getProps(testProps));
}

describe('PublicationsListPaging renders ', () => {
    it('component with empty paging data', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with styles', () => {
        const wrapper = getElement(PublicationsListPagingWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component renders as empty due to currentpage set outside range', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 20,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with non-empty paging data, first page', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with non-empty paging data, second page', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with non-empty paging data, last page', () => {
        const data = {
            from: 41,
            to: 60,
            total: 60,
            per_page: 20,
            current_page: 3,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with ellipsis paging results', () => {
        const data = {
            from: 501,
            to: 520,
            total: 1000,
            per_page: 20,
            current_page: 10,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };

        const wrapper = setup({ disabled: true, pagingData: data });
        wrapper.find('page').forEach(page => {
            expect(page.props().disabled).toEqual(true);
        });
    });

    it('component with non-empty paging data, pageChanged called', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const testFunction = jest.fn();
        const wrapper = setup({ pagingData: data, onPageChanged: testFunction, isShallow: false });
        wrapper.instance().pageChanged();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, next page clicked', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const testFunction = jest.fn();
        const wrapper = setup({ pagingData: data, onPageChanged: testFunction, isShallow: false });

        const nextPage = wrapper.find('.paging-next');
        expect(nextPage.length).toBe(1);
        nextPage.props().onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, previous page clicked', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2,
        };
        const testFunction = jest.fn();
        const wrapper = setup({ pagingData: data, onPageChanged: testFunction, isShallow: false });

        const page = wrapper.find('.paging-previous');
        expect(page.length).toBe(1);
        page.props().onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, page number is clicked', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const testFunction = jest.fn();
        const wrapper = setup({ pagingData: data, onPageChanged: testFunction, isShallow: false });
        const pages = wrapper.find('.paging-button');
        pages
            .at(1)
            .props()
            .onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, state is updated', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };

        const nextData = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2,
        };
        const testFunction = jest.fn();
        const wrapper = setup({ pagingData: data, onPageChanged: testFunction, isShallow: false });
        wrapper.instance().UNSAFE_componentWillReceiveProps({ pagingData: nextData });
        expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));

        wrapper.instance().UNSAFE_componentWillReceiveProps({ pagingData: {}, disabled: true });
        expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));
    });

    it('method to render buttons appears as expected for 50 pages on page 25', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 25,
        };
        const wrapper = setup({ pagingData: data });
        wrapper.setState({ ...data });
        wrapper.update();
        expect(wrapper.instance().renderPageButtons().length).toEqual(7);
    });

    it('method to render buttons appears as expected for 50 pages on page 1', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 1,
        };
        const wrapper = setup({ pagingData: data });
        wrapper.setState({ ...data });
        wrapper.update();
        expect(wrapper.instance().renderPageButtons().length).toEqual(4);
    });

    it('method to render buttons appears as expected for 50 pages on page 50', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 50,
        };
        const wrapper = setup({ pagingData: data });
        wrapper.setState({ ...data });
        wrapper.update();
        expect(wrapper.instance().renderPageButtons().length).toEqual(4);
    });

    it('should render buttons with zero total pages', () => {
        const wrapper = setup();
        wrapper.setState({
            total: null,
        });
        expect(wrapper.instance().renderButton('test')).toMatchSnapshot();
        expect(wrapper.instance().renderPageButtons()).toEqual([]);
    });
});
