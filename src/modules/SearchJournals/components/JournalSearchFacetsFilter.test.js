import React from 'react';

import { facets, emptyFacets } from 'mock/data/testing/facets';
import JournalSearchFacetsFilter, { getFacetsToDisplay, showFavouritedOnlyFacet } from './JournalSearchFacetsFilter';

import { render, WithRouter, WithReduxStore, fireEvent, act } from 'test-utils';

import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import * as hooks from '../hooks';

import deparam from 'can-deparam';

const setup = ({
    filters = {},
    onFacetsChangedHandler: clickHandler = undefined,
    testHistory = createMemoryHistory({ initialEntries: ['/'] }),
}) => {
    const { activeFacets = [], facets = {} } = filters;
    const testProps = {
        key: 'journal-search-facets-filter',
        activeFacets: { ...activeFacets },
        facetsData: { ...facets },
        onFacetsChanged: clickHandler || undefined,
        disabled: false,
    };

    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore>
                <JournalSearchFacetsFilter {...testProps} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('Search Journals Facets component', () => {
    it('should render favourite facets if no facets are provided by the api', () => {
        const { getByText } = setup(emptyFacets);

        expect(getByText('Favourite Journals')).toBeInTheDocument();
    });

    it('should render the component categories and nested items that match the input data', () => {
        const { getByTestId, queryByText } = setup(facets);

        Object.keys(facets.filters?.facets).forEach(key => {
            const categoryId = `facet-category-${key.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();
            expect(getByTestId(categoryId)).toHaveTextContent(key);

            const facet = facets.filters.facets[key];

            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            facet.buckets.forEach(item => {
                const title = key.endsWith('quartile') ? `Q${item.key}` : item.key;
                const count = item.doc_count || undefined;
                const nestedItemLabel = count ? `${title} (${count})` : title;
                expect(queryByText(nestedItemLabel)).toBeInTheDocument();
            });

            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });

    it('should render facet categories that match the internally composed data', () => {
        const { getByTestId } = setup(facets);

        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            expect(getByTestId(categoryId)).toHaveTextContent(item.title);
        });
    });

    it('should, when each facet category is clicked, render facet category nested list items with correct labels', () => {
        const { getByTestId, getByText, queryByText } = setup(facets);

        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            // iterate the nested facet items and check they are *not*
            // currently in the component. These items are dynamically
            // added after the category is clicked so shouldnt be visible yet.
            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;
                expect(queryByText(nestedItemLabel)).not.toBeInTheDocument();
            });

            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            // Finally, repeat previous check this time to determine the
            // nested items *are* now present in the component.
            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;
                expect(getByText(nestedItemLabel)).toBeInTheDocument();
            });

            // click again to remove item from DOM to avoid any
            // ID collisions with the next iterations
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });

    it('should have the click handler of each nested list item receive expected parameters', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });

        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            // click (expand) each category one at a time to
            // dynamicaly populate the nested items.
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;

                const nestedButtonId = `facet-filter-nested-item-${nestedItemLabel.replace(/ /g, '-').toLowerCase()}`;

                act(() => {
                    fireEvent.click(getByTestId(nestedButtonId));
                });

                // Check the click callback was fired, and the expected parameters were received.
                // Parameter should be an object with one or more keys and associated array e.g.
                // {
                //     "filters": {
                //         "Listed in": [
                //             "CWTS"
                //         ]
                //     },
                //     "ranges": {...}
                // }
                //
                // The following test will only check that each nested list item adds its own
                // key and value to the array. A subsequent click event will then remove this
                // before the next pass of this loop.
                expect(testFacetChangeFn).toHaveBeenCalledWith({
                    filters: expect.objectContaining({
                        [item.facetTitle]:
                            item.facetTitle === showFavouritedOnlyFacet.facetTitle
                                ? true
                                : [item.facetTitle.endsWith('quartile') ? facet.title.substr(1) : facet.title],
                    }),
                    ranges: expect.objectContaining({ ...(facets.activeFacets?.ranges || []) }),
                });

                // fire another click event on this nested list item to remove its
                // key and value from the array
                act(() => {
                    fireEvent.click(getByTestId(nestedButtonId));
                });
            });

            // click category again to remove
            // nested items from DOM before next iteration
            // to avoid ID collisions
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });

    it('should have each nested list item showing or hiding a Clear button when clicked', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });

        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            // click (expand) each category one at a time to
            // dynamicaly populate the nested items.
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            item.facets.forEach((facet, index) => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;

                const nestedButtonId = `facet-filter-nested-item-${nestedItemLabel.replace(/ /g, '-').toLowerCase()}`;
                const nestedClearButtonId = `clear-facet-filter-nested-item-${index}`;

                // should not be in the document to begin with
                expect(queryByTestId(nestedClearButtonId)).not.toBeInTheDocument();

                act(() => {
                    fireEvent.click(getByTestId(nestedButtonId));
                });

                const nestedButton = getByTestId(nestedClearButtonId);
                expect(nestedButton).toBeInTheDocument();

                act(() => {
                    fireEvent.click(getByTestId(nestedButtonId));
                });

                // and finally, should be gone again
                expect(queryByTestId(nestedClearButtonId)).not.toBeInTheDocument();
            });

            // click category again to remove
            // nested items from DOM before next iteration
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });

    it('should clear active facets when keywords change', () => {
        const testFacetChangeFn = jest.fn();
        const testQueryPart =
            '?keywords%5BTitle-Testing%5D%5Btype%5D=Title&keywords%5BTitle-Testing%5D%5Btext%5D=Testing&keywords%5BTitle-Testing%5D%5Bid%5D=Title-Testing&keywords%5BKeyword-testing%5D%5Btype%5D=Keyword&keywords%5BKeyword-testing%5D%5Btext%5D=testing&keywords%5BKeyword-testing%5D%5Bid%5D=Keyword-testing&activeFacets%5Bfilters%5D%5BListed+in%5D%5B%5D=CWTS&activeFacets%5Bfilters%5D%5BIndexed+in%5D%5B%5D=Scopus&activeFacets%5Bfilters%5D%5BEmbargo%5D%5B%5D=12+months&page=1';
        const testQueryPartNoKeywords =
            '?keywords%5BTitle-Testing%5D%5Btype%5D=Title&keywords%5BTitle-Testing%5D%5Btext%5D=Testing&keywords%5BTitle-Testing%5D%5Bid%5D=Title-Testing';
        const path = `/espace/feature-strategic-publishing/#${pathConfig.journals.search}`;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        testHistory.push({
            path,
            search: testQueryPart,
            state: {
                source: 'code',
            },
        });

        const activeFacetList = deparam(testQueryPart);
        let activeFacetsCount = 0;
        Object.keys(activeFacetList.activeFacets.filters).forEach(key => {
            activeFacetsCount += Array.isArray(activeFacetList.activeFacets.filters[key])
                ? activeFacetList.activeFacets.filters[key].length
                : 0;
        });

        const mockActiveFiltersRef = jest.spyOn(hooks, 'useActiveFacetFilters');

        const { queryAllByTestId } = setup({ ...facets, testFacetChangeFn, testHistory });

        const nestedClearButtonId = 'clear-facet-filter-nested-item-0';
        expect(queryAllByTestId(nestedClearButtonId)).length === activeFacetsCount;

        expect(mockActiveFiltersRef).toHaveBeenCalledWith({
            // eslint-disable-next-line prettier/prettier
            'Embargo': ['12 months'],
            'Indexed in': ['Scopus'],
            'Listed in': ['CWTS'],
        });

        testHistory.push({
            path,
            search: testQueryPartNoKeywords,
            state: {
                source: 'code',
            },
        });

        expect(queryAllByTestId(nestedClearButtonId)).length === 0;
        // Probably a bug in the codebase, but right now the custom hook will be called twice at this point
        // due to rerender and we're only interested in the second call to determine active facets have been cleared
        expect(mockActiveFiltersRef).toHaveBeenNthCalledWith(2, {});
    });
});
