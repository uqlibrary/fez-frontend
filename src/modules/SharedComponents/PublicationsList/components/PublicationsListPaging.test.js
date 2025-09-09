import React from 'react';
import PublicationsListPaging, { paginate } from './PublicationsListPaging';
import { locale } from 'locale';
import { rtlRender, fireEvent } from 'test-utils';

const getProps = (testProps = {}) => ({
    pagingId: 'test',
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

function setup(testProps = {}, renderMethod = rtlRender) {
    return renderMethod(<PublicationsListPaging {...getProps(testProps)} />);
}

describe('PublicationsListPaging renders ', () => {
    it('component with empty paging data', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component renders as empty due to currentpage set outside range', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 20,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('component with non-empty paging data, first page', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('component with non-empty paging data, second page', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('component with non-empty paging data, last page', () => {
        const data = {
            from: 41,
            to: 60,
            total: 60,
            per_page: 20,
            current_page: 3,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('component with ellipsis paging results', () => {
        const data = {
            from: 501,
            to: 520,
            total: 1000,
            per_page: 20,
            current_page: 10,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };

        const { getByTestId } = setup({ disabled: true, pagingData: data });
        expect(getByTestId('test-select-page-1')).toBeDisabled();
        expect(getByTestId('test-select-page-2')).toBeDisabled();
        expect(getByTestId('test-select-page-3')).toBeDisabled();
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
        const { getByTestId } = setup({ pagingData: data, onPageChanged: testFunction });
        fireEvent.click(getByTestId('test-select-page-2'));
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
        const { getByRole } = setup({ pagingData: data, onPageChanged: testFunction });
        fireEvent.click(getByRole('button', { name: 'Next' }));
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
        const { getByRole } = setup({ pagingData: data, onPageChanged: testFunction });
        fireEvent.click(getByRole('button', { name: 'Previous' }));
        expect(testFunction).toBeCalled();
    });

    it('component should update page buttons', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        };
        const { rerender, container } = setup({ pagingData: data });
        setup({ pagingData: { ...data, current_page: 2 } }, rerender);
        expect(container).toMatchSnapshot();
    });

    it('method to render buttons appears as expected for 50 pages on page 25', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 25,
        };
        const { queryByRole } = setup({ pagingData: data });

        // rendered page buttons with current page in the middle
        expect(queryByRole('button', { name: 'Click to select page 1 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 22 of 50 result pages' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 23 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 24 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 25 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 26 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 27 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 28 of 50 result pages' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 50 of 50 result pages' })).toBeInTheDocument();
    });

    it('method to render buttons appears as expected for 50 pages on page 1', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 1,
        };
        const { queryByRole } = setup({ pagingData: data });

        expect(queryByRole('button', { name: 'Click to select page 1 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 2 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 3 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 4 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 5 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 6 of 50 result pages' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 50 of 50 result pages' })).toBeInTheDocument();
    });

    it('method to render buttons appears as expected for 50 pages on page 50', () => {
        const data = {
            from: 1,
            to: 20,
            total: 1000,
            per_page: 20,
            current_page: 50,
        };
        const { queryByRole } = setup({ pagingData: data });

        expect(queryByRole('button', { name: 'Click to select page 1 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 45 of 50 result pages' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 46 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 47 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 48 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 49 of 50 result pages' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Click to select page 50 of 50 result pages' })).toBeInTheDocument();
    });

    it('should render buttons with zero total pages', () => {
        const data = {
            from: 0,
            to: 0,
            total: null,
            per_page: 0,
            current_page: 1,
        };
        const { container } = setup({ pagingData: data });
        expect(container).toMatchSnapshot();
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
