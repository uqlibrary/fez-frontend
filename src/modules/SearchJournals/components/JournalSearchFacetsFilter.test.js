import React from 'react';

import { facets, emptyFacets } from 'mock/data/testing/facets';
import JournalSearchFacetsFilter from './JournalSearchFacetsFilter';

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

const showFavouritedOnlyFacet = {
    title: 'Favourite Journals',
    facetTitle: 'ShowFavouritedOnly',
    facets: [
        {
            title: 'Show journals favourited',
            key: 'ShowFavouritedOnly',
        },
    ],
};

// from JournalSearchFacetsFilter.js
const getFacetsToDisplay = (rawFacets, renameFacetsList) => {
    const facetsToDisplay = [];
    Object.keys(rawFacets).forEach(key => {
        const rawFacet = rawFacets[key];
        // construct facet object to display, if facet has a lookup - get display name from lookup,
        // if facet key has a rename record, then use that
        const facetToDisplay = {
            title: renameFacetsList[key] || key,
            facetTitle: key,
            facets: rawFacet.buckets.map(item => {
                return {
                    title: key.endsWith('quartile') ? `Q${item.key}` : item.key,
                    key: item.key,
                    count: item.doc_count,
                };
            }),
        };
        facetsToDisplay.push(facetToDisplay);
    });

    // add show favourite only facet
    facetsToDisplay.push(showFavouritedOnlyFacet);
    return facetsToDisplay;
};

describe('Search Journals Facets component', () => {
    it('should render facet categories that match the data provided', () => {
        const { getByTestId } = setup(facets);

        // construct array of facet information
        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        // iterate the provided test data and ensure each key text exists in the document
        facetsToDisplay.forEach(item => {
            // create the ID for this facet category - taken from JournalSearchFacetFilter.js
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            // check if the category element by ID is in document
            expect(getByTestId(categoryId)).toBeInTheDocument();

            // check if the category element has the correct category text
            expect(getByTestId(categoryId)).toHaveTextContent(item.title);
        });
    });

    it('should render favourite facets if no facets are provided by the api', () => {
        const { getByText } = setup(emptyFacets);

        // check if the category element by ID is in document
        expect(getByText('Favourite Journals')).toBeInTheDocument();
    });

    it('should, when each facet category is clicked, render facet category nested list items with correct labels', () => {
        const { getByTestId, getByText, queryByText } = setup(facets);

        // construct array of facet information
        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        // loop through each facet category
        facetsToDisplay.forEach(item => {
            // create the ID for this facet category - taken from JournalSearchFacetFilter.js
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            // sanity check category element ID is in document
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
            // nested items are now present in the component.
            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;
                expect(getByText(nestedItemLabel)).toBeInTheDocument();
            });

            // click again to remove item from DOM to avoid any
            // collisions with the next iterations
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });

    it('should have the click handler of each nested list item receive expected parameters', () => {
        // set up a test function and pass to the setup method so
        // we can test this function gets called later
        const testFacetChangeFn = jest.fn();
        const { getByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });

        // construct array of facet information
        const facetsToDisplay = getFacetsToDisplay(facets.filters.facets, {});

        facetsToDisplay.forEach(item => {
            // create the ID for this facet category - taken from JournalSearchFacetFilter.js
            const categoryId = `facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`;

            // sanity check category element ID is in document
            expect(getByTestId(categoryId)).toBeInTheDocument();

            // click (expand) each category one at a time to
            // dynamicaly populate the nested items.
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });

            // Each facet category has one or more nested list items, which
            // we need to iterate and simulate a click event so that
            // we can interrogate the received parameters
            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;

                const nestedButtonId = `facet-filter-nested-item-${nestedItemLabel.replace(/ /g, '-').toLowerCase()}`;

                // Fire the click event on this nested list item
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
                                : [item.facetTitle.endsWith('quartile') ? Number(facet.title.substr(1)) : facet.title],
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
            act(() => {
                fireEvent.click(getByTestId(categoryId));
            });
        });
    });
});
