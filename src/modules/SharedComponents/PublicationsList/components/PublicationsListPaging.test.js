import PublicationsListPaging, { paginate } from './PublicationsListPaging';
import { locale } from 'locale';

// Responsiveness is handled in Cypress tests

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

function setup(testProps = {}, testArgs = {}) {
    const args = { isShallow: true, ...testArgs };
    return getElement(PublicationsListPaging, getProps(testProps), args);
}

describe('PublicationsListPaging renders ', () => {
    it('component with empty paging data', () => {
        const wrapper = setup();
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
        wrapper.setProps({ pagingData: nextData });
        expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));

        wrapper.setProps({ pagingData: {}, disabled: true });
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
        const pagination = paginate(
            wrapper.state.total,
            wrapper.state.current_page,
            wrapper.state.per_page,
            locale.components.paging.maxPagesToShow,
        );
        const paginationPages = pagination.pages;

        expect(wrapper.instance().renderPageButtons(paginationPages).length).toEqual(
            locale.components.paging.maxPagesToShow,
        );
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
        const pagination = paginate(
            wrapper.state.total,
            wrapper.state.current_page,
            wrapper.state.per_page,
            locale.components.paging.maxPagesToShow,
        );
        const paginationPages = pagination.pages;

        expect(wrapper.instance().renderPageButtons(paginationPages).length).toEqual(
            locale.components.paging.maxPagesToShow,
        );
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
        const pagination = paginate(
            wrapper.state.total,
            wrapper.state.current_page,
            wrapper.state.per_page,
            locale.components.paging.maxPagesToShow,
        );
        const paginationPages = pagination.pages;

        expect(wrapper.instance().renderPageButtons(paginationPages).length).toEqual(
            locale.components.paging.maxPagesToShow,
        );
    });
    it('should render buttons with zero total pages', () => {
        const wrapper = setup();
        wrapper.setState({
            total: null,
        });
        expect(wrapper.instance().renderButton('test')).toMatchSnapshot();
        expect(wrapper.instance().renderPageButtons()).toEqual([]);
    });

    describe('Pagination function', () => {
        it('should use default values if none provided', () => {
            const expectedResponse = {
                totalItems: 100,
                currentPage: 1,
                pageSize: 10,
                totalPages: 10,
                startPage: 1,
                endPage: 10,
                pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            };
            expect(paginate(100)).toMatchObject(expectedResponse);
        });

        it('should use default value if current page < 1', () => {
            const expectedResponse = {
                totalItems: 100,
                currentPage: 1,
                pageSize: 10,
                totalPages: 10,
                startPage: 1,
                endPage: 10,
                pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            };
            expect(paginate(100, 0)).toMatchObject(expectedResponse);
        });

        it('should return correct values if current page = 5', () => {
            const expectedResponse = {
                totalItems: 100,
                currentPage: 5,
                pageSize: 10,
                totalPages: 10,
                startPage: 3,
                endPage: 7,
                pages: [3, 4, 5, 6, 7],
            };
            expect(paginate(100, 5, 10, locale.components.paging.maxPagesToShow)).toMatchObject(expectedResponse);
        });

        it('should return a single page response even with out of range current page', () => {
            const expectedResponse = {
                totalItems: 9,
                currentPage: 1,
                pageSize: 10,
                totalPages: 1,
                startPage: 1,
                endPage: 1,
                pages: [1],
            };
            expect(paginate(9, 2, 10, 10)).toMatchObject(expectedResponse);
        });

        it('should return correct limit on maximum pages', () => {
            const expectedResponse = {
                totalItems: 300,
                currentPage: 1,
                pageSize: 10,
                totalPages: 30,
                startPage: 1,
                endPage: 20,
                pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            };
            expect(paginate(300, 1, 10, 20)).toMatchObject(expectedResponse);
        });

        it('should return correct number of pages with provided values', () => {
            const expectedResponse = {
                totalItems: 10,
                currentPage: 1,
                pageSize: 1,
                totalPages: 10,
                startPage: 1,
                endPage: 1,
                pages: [1],
            };
            const paginated = paginate(10, 1, 1, 1);
            expect(paginated).toMatchObject(expectedResponse);
        });

        it('should reduce number of returned pages for 10 pages on page 4', () => {
            expect(paginate(100, 4, 10, 5).pages.length).toEqual(locale.components.paging.maxPagesToShow - 1);
        });

        it('should reduce number of returned pages for 10 pages on page 7', () => {
            expect(paginate(100, 7, 10, 5).pages.length).toEqual(locale.components.paging.maxPagesToShow - 1);
        });
    });
});
