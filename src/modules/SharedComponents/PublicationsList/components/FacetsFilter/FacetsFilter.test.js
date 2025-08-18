import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import FacetsFilter from './FacetsFilter';
import { possibleUnclaimedList } from 'mock/data';
import { general } from 'config';

function setup(testProps = {}) {
    return rtlRender(
        <FacetsFilter
            activeFacets={{ filters: {}, ranges: {} }}
            facetsData={{}}
            excludeFacetsList={[]}
            onFacetsChanged={jest.fn()}
            {...testProps}
        />,
    );
}

describe('FacetsFilter', () => {
    it('should render with default props', () => {
        const { container } = rtlRender(<FacetsFilter />);
        expect(container).toMatchSnapshot();
    });

    it('should not render any filters', () => {
        const { getByTestId } = setup();
        expect(getByTestId('empty-facet-filters')).toBeInTheDocument();
    });

    it('should render filters for given facets data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const { getByTestId } = setup({ facetsData, showOpenAccessFilter: true });

        expect(getByTestId('facet-category-display-type')).toBeInTheDocument();
        expect(getByTestId('facet-category-keywords')).toBeInTheDocument();
        expect(getByTestId('facet-category-year-published')).toBeInTheDocument();
        expect(getByTestId('facet-category-journal-name')).toBeInTheDocument();
        expect(getByTestId('facet-category-collection')).toBeInTheDocument();
        expect(getByTestId('facet-category-author')).toBeInTheDocument();
        expect(getByTestId('facet-category-date-range')).toBeInTheDocument();
        expect(getByTestId('facet-category-open-access')).toBeInTheDocument();
    });

    it('should handle facet click event', () => {
        const onFacetsChangedFn = jest.fn();
        const facetsData = possibleUnclaimedList.filters.facets;
        const { getByTestId, getByText } = setup({
            facetsData,
            showOpenAccessFilter: true,
            onFacetsChanged: onFacetsChangedFn,
        });

        fireEvent.click(getByTestId('facet-category-display-type'));
        fireEvent.click(getByText('Journal Article (2)'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(1);

        expect(getByText('Reset')).toBeInTheDocument();

        fireEvent.click(getByText('Journal Article (2)'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(2);

        fireEvent.click(getByText('Journal Article (2)'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(3);

        fireEvent.click(getByText('Reset'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(4);

        fireEvent.click(getByTestId('facet-category-date-range'));
        fireEvent.click(getByText('Go'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(5);

        fireEvent.click(getByTestId('facet-category-open-access'));
        fireEvent.click(getByText('Show only open access works'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(6);

        fireEvent.click(getByTestId('clear-facet-filter-nested-item-date-range'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(7);

        fireEvent.change(getByTestId('from'), { target: { value: '2001' } });
        fireEvent.change(getByTestId('to'), { target: { value: '2012' } });
        fireEvent.click(getByText('Go'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(8);

        fireEvent.click(getByText('Reset'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(9);

        fireEvent.change(getByTestId('from'), { target: { value: '2001' } });
        fireEvent.change(getByTestId('to'), { target: { value: '20012' } });
        fireEvent.click(getByText('Go'));
        expect(onFacetsChangedFn).toHaveBeenCalledTimes(10);
        expect(getByText('2001 - *')).toBeInTheDocument();

        fireEvent.click(getByTestId('clear-facet-filter-nested-item-date-range'));
        fireEvent.change(getByTestId('from'), { target: { value: '20041' } });
        fireEvent.change(getByTestId('to'), { target: { value: '2001' } });
        fireEvent.click(getByText('Go'));
        expect(getByText('* - 2001')).toBeInTheDocument();
    });

    it('should render filters for given facets data excluding filters that are provided through props', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const { getByTestId } = setup({ facetsData, showOpenAccessFilter: true, excludeFacetsList: ['Display type'] });

        try {
            getByTestId('facet-category-display-type');
        } catch (e) {
            expect(e instanceof Error).toBeTruthy();
        }
        expect(getByTestId('facet-category-keywords')).toBeInTheDocument();
        expect(getByTestId('facet-category-year-published')).toBeInTheDocument();
        expect(getByTestId('facet-category-journal-name')).toBeInTheDocument();
        expect(getByTestId('facet-category-collection')).toBeInTheDocument();
        expect(getByTestId('facet-category-author')).toBeInTheDocument();
        expect(getByTestId('facet-category-date-range')).toBeInTheDocument();
        expect(getByTestId('facet-category-open-access')).toBeInTheDocument();
    });

    it('should render filters in disabled state', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const { getByTestId } = setup({
            facetsData,
            showOpenAccessFilter: true,
            disabled: true,
        });

        expect(getByTestId('clickable-facet-category-display-type')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-keywords')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-year-published')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-journal-name')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-collection')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-author')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-date-range')).toHaveAttribute('aria-disabled', 'true');
        expect(getByTestId('clickable-facet-category-open-access')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render filters for given facets data and active facets set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const { getByText, getByTestId } = setup({
            facetsData,
            showOpenAccessFilter: true,
            activeFacets: {
                filters: {
                    'Display type': 179,
                },
                ranges: {},
            },
            renameFacetsList: { 'Display type': 'Work type' },
        });

        expect(getByTestId('facet-category-display-type')).toBeInTheDocument();
        expect(getByText(/Work type/)).toBeInTheDocument();

        expect(getByTestId('clear-facet-filter-nested-item-display-type-journal-article')).toBeInTheDocument();
        expect(getByText('Journal Article (2)')).toBeInTheDocument();

        fireEvent.click(getByText('Journal Article (2)'));
        try {
            getByTestId('clear-facet-filter-nested-item-0');
        } catch (e) {
            expect(e instanceof Error).toBeTruthy();
        }
    });

    it('should display unknown if display type is not supported', () => {
        const facetsData = possibleUnclaimedList.filters.facets;

        const { getByText, getByTestId } = setup({
            facetsData: {
                ...facetsData,
                'Display type': {
                    buckets: [
                        {
                            key: 200,
                            doc_count: 123,
                        },
                    ],
                },
            },
            showOpenAccessFilter: true,
        });

        fireEvent.click(getByTestId('clickable-facet-category-display-type'));
        expect(getByText('Unknown (123)')).toBeInTheDocument();
    });

    it('should include "Display type" in initial facets but exclude from displaying it', () => {
        const onFacetsChangedFn = jest.fn();
        const facetsData = possibleUnclaimedList.filters.facets;

        const { getByTestId, getByText, queryByTestId } = setup({
            facetsData,
            initialFacets: {
                filters: {
                    'Display type': `${general.PUBLICATION_TYPE_DATA_COLLECTION}`,
                },
            },
            excludeFacetsList: ['Scopus document type', 'Subtype', 'Year published', 'Display type'],
            showOpenAccessFilter: true,
            onFacetsChanged: onFacetsChangedFn,
            lookupFacetsList: {
                Author: 'Author (lookup)',
                Collection: 'Collection (lookup)',
                Subject: 'Subject (lookup)',
            },
        });

        expect(queryByTestId('clickable-facet-category-display-type')).not.toBeInTheDocument();

        fireEvent.click(getByTestId('facet-category-keywords'));
        fireEvent.click(getByText('Biochemistry (1)'));

        expect(onFacetsChangedFn).toHaveBeenCalledWith({
            filters: {
                'Display type': `${general.PUBLICATION_TYPE_DATA_COLLECTION}`,
                Keywords: 'Biochemistry',
            },
            ranges: {},
            showOpenAccessOnly: false,
        });
    });
});
