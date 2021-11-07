import React from 'react';

import { facets, emptyFacets } from 'mock/data/testing/facets';
import JournalSearchFacetsFilter, { getFacetsToDisplay, showFavouritedOnlyFacet } from './JournalSearchFacetsFilter';

import { renderWithRouter, WithReduxStore, fireEvent, act } from 'test-utils';

const setup = ({ filters = {}, onFacetsChangedHandler: clickHandler = undefined }) => {
    const { activeFacets = [], facets = {} } = filters;
    const testProps = {
        key: 'journal-search-facets-filter',
        activeFacets: { ...activeFacets },
        facetsData: { ...facets },
        onFacetsChanged: clickHandler || undefined,
        disabled: false,
    };
    return renderWithRouter(
        <WithReduxStore>
            <JournalSearchFacetsFilter {...testProps} />
        </WithReduxStore>,
    );
};

describe('Search Journals Facets component', () => {
    it('should render facet categories that match the data provided', () => {
        const { getByTestId } = setup(facets);

        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            expect(getByTestId(categoryId)).toBeInTheDocument();

            expect(getByTestId(categoryId)).toHaveTextContent(item.title);
        });
    });

    it('should render favourite facets if no facets are provided by the api', () => {
        const { getByText } = setup(emptyFacets);

        expect(getByText('Favourite Journals')).toBeInTheDocument();
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

            // now click (expand) each category one at a time to
            // dynamicaly populate the nested items.
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
});
