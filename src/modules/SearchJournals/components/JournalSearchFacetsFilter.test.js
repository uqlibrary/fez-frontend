import React from 'react';

import { emptyFacets, facets } from 'mock/data/testing/facets';
import JournalSearchFacetsFilter, {
    getFacetsToDisplay,
    resetFacetFiltersButtonId,
    showFavouritedOnlyFacet,
} from './JournalSearchFacetsFilter';

import { act, fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';

import { pathConfig } from 'config';
import { createMemoryHistory } from 'history';
import * as hooks from '../hooks';

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

const getIdText = label => {
    return label.replace(/ /g, '-').toLowerCase();
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
            const categoryId = `facet-category-${getIdText(item.facetTitle)}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            // click (expand) each category one at a time to
            // dynamicaly populate the nested items.
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            item.facets.forEach(facet => {
                const nestedButtonId = `facet-filter-nested-item-${getIdText(`${item.facetTitle}-${facet.title}`)}`;

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
            const categoryId = `facet-category-${getIdText(item.facetTitle)}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            // click (expand) each category one at a time to
            // dynamicaly populate the nested items.
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            item.facets.forEach(facet => {
                const idText = getIdText(`${item.facetTitle}-${facet.title}`);
                const nestedButtonId = `facet-filter-nested-item-${idText}`;
                const nestedClearButtonId = `clear-facet-filter-nested-item-${idText}`;

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
        const path = pathConfig.journals.search;
        const testHistory = createMemoryHistory({ initialEntries: [path] });
        act(() =>
            testHistory.push({
                path,
                search: testQueryPart,
                state: {
                    source: 'code',
                },
            }),
        );

        const mockActiveFiltersRef = jest.spyOn(hooks, 'useActiveFacetFilters');
        const nestedClearButtonId = 'clear-facet-filter-nested-item';

        const { getByTestId, queryByTestId } = setup({ ...facets, testFacetChangeFn, testHistory });
        expect(getByTestId(`${nestedClearButtonId}-listed-in-cwts`)).toBeVisible();
        expect(getByTestId(`${nestedClearButtonId}-indexed-in-scopus`)).toBeVisible();
        // not in the mock api response
        expect(queryByTestId(`${nestedClearButtonId}-embargo-12-months`)).not.toBeInTheDocument();

        expect(mockActiveFiltersRef).toHaveBeenCalledWith({
            Embargo: ['12 months'],
            'Indexed in': ['Scopus'],
            'Listed in': ['CWTS'],
        });

        act(() =>
            testHistory.push({
                path,
                search: testQueryPartNoKeywords,
                state: {
                    source: 'code',
                },
            }),
        );

        // Probably a bug in the codebase, but right now the custom hook will be called twice at this point
        // due to rerender and we're only interested in the second call to determine active facets have been cleared
        expect(mockActiveFiltersRef).toHaveBeenNthCalledWith(2, {});
    });

    it('should allow multi select for indexed in', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });
        const scieFacetItemTestId = 'facet-filter-nested-item-indexed-in-scie';
        const scieClearFacetItemTestId = 'clear-facet-filter-nested-item-indexed-in-scie';
        const scopusFacetItemTestId = 'facet-filter-nested-item-indexed-in-scopus';
        const scopusClearFacetItemTestId = 'clear-facet-filter-nested-item-indexed-in-scopus';

        // expand Listed in
        act(() => {
            fireEvent.click(getByTestId('clickable-facet-category-indexed-in'));
        });

        expect(getByTestId(scieFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scieClearFacetItemTestId)).not.toBeInTheDocument();
        expect(getByTestId(scopusFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scopusClearFacetItemTestId)).not.toBeInTheDocument();

        // clicks on scie facet
        act(() => {
            fireEvent.click(getByTestId(scieFacetItemTestId));
        });

        expect(getByTestId(scieClearFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scopusClearFacetItemTestId)).not.toBeInTheDocument();

        // clicks on scopus facet
        act(() => {
            fireEvent.click(getByTestId(scopusFacetItemTestId));
        });

        expect(getByTestId(scieClearFacetItemTestId)).toBeVisible();
        expect(getByTestId(scopusClearFacetItemTestId)).toBeVisible();
    });

    it('should render reset button', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });
        const facetItemTestId = 'facet-filter-nested-item-listed-in-cwts';
        const clearFacetItemTestId = 'clear-facet-filter-nested-item-listed-in-cwts';

        // expand Listed in
        act(() => {
            fireEvent.click(getByTestId('clickable-facet-category-listed-in'));
        });

        expect(getByTestId(facetItemTestId)).toBeVisible();
        expect(queryByTestId(clearFacetItemTestId)).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(facetItemTestId));
        });

        expect(getByTestId(clearFacetItemTestId)).toBeVisible();

        // reset the active filters
        act(() => {
            fireEvent.click(getByTestId('reset-facet-filters'));
        });

        expect(queryByTestId(clearFacetItemTestId)).not.toBeInTheDocument();
    });

    it('should hide the reset button when removing the last active filter', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });

        // make sure the reset facet filter button is NOT visible
        expect(queryByTestId(resetFacetFiltersButtonId)).not.toBeInTheDocument();
        // 1. activate on facet filter
        const cwtsFacetFilterTestId = 'facet-filter-nested-item-listed-in-cwts';
        const clearCwtsFacetFilterTestId = 'clear-facet-filter-nested-item-listed-in-cwts';
        // expand the facet parent
        act(() => {
            fireEvent.click(getByTestId('clickable-facet-category-listed-in'));
        });
        // make sure the filter is not active
        expect(getByTestId(cwtsFacetFilterTestId)).toBeVisible();
        expect(queryByTestId(clearCwtsFacetFilterTestId)).not.toBeInTheDocument();
        // make the filter active
        act(() => {
            fireEvent.click(getByTestId(cwtsFacetFilterTestId));
        });
        expect(getByTestId(clearCwtsFacetFilterTestId)).toBeVisible();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();

        // 2. activate a second facet filter
        const scieFacetFilterTestId = 'facet-filter-nested-item-indexed-in-scie';
        const clearScieFacetFilterTestId = 'clear-facet-filter-nested-item-indexed-in-scie';
        // expand the facet parent
        act(() => {
            fireEvent.click(getByTestId('clickable-facet-category-indexed-in'));
        });
        // make sure the filter is not active
        expect(getByTestId(scieFacetFilterTestId)).toBeVisible();
        expect(queryByTestId(clearScieFacetFilterTestId)).not.toBeInTheDocument();
        // make the filter active
        act(() => {
            fireEvent.click(getByTestId(scieFacetFilterTestId));
        });
        expect(getByTestId(clearScieFacetFilterTestId)).toBeVisible();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();

        // deactivate the first filter
        act(() => {
            fireEvent.click(getByTestId(clearCwtsFacetFilterTestId));
        });
        expect(queryByTestId(clearCwtsFacetFilterTestId)).not.toBeInTheDocument();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();
        // deactivate the second filter
        act(() => {
            fireEvent.click(getByTestId(clearScieFacetFilterTestId));
        });
        expect(queryByTestId(clearScieFacetFilterTestId)).not.toBeInTheDocument();
        // make sure the reset facet filter button is NOT visible
        expect(queryByTestId(resetFacetFiltersButtonId)).not.toBeInTheDocument();
    });
});
