import React from 'react';

import { emptyFacets, facets } from 'mock/data/testing/facets';
import JournalSearchFacetsFilter, {
    getFacetsToDisplay,
    resetFacetFiltersButtonId,
    showFavouritedOnlyFacet,
} from './JournalSearchFacetsFilter';

import { screen, fireEvent, render, userEvent, WithReduxStore, WithRouter } from 'test-utils';

import * as hooks from '../hooks';
import { useLocation } from 'react-router';
import param from 'can-param';
import kebabCase from 'lodash/kebabCase';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useLocation: jest.fn(() => ({ pathname: '/', search: '' })),
}));

const setup = ({ filters = {}, onFacetsChangedHandler: clickHandler = undefined }, renderMethod = render) => {
    const { activeFacets = [], facets = {} } = filters;
    const testProps = {
        key: 'journal-search-facets-filter',
        activeFacets: { ...activeFacets },
        facetsData: { ...facets },
        onFacetsChanged: clickHandler || undefined,
        disabled: false,
    };

    return renderMethod(
        <WithRouter>
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
    afterEach(() => {
        useLocation.mockClear();
    });

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

            fireEvent.click(getByTestId(categoryId));

            facet.buckets.forEach(item => {
                const title = key.endsWith('quartile') ? `Q${item.key}` : item.key;
                const count = item.doc_count || undefined;
                const nestedItemLabel = count ? `${title} (${count})` : title;
                expect(queryByText(nestedItemLabel)).toBeInTheDocument();
            });

            fireEvent.click(getByTestId(categoryId));
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

            fireEvent.click(getByTestId(categoryId));

            // Finally, repeat previous check this time to determine the
            // nested items *are* now present in the component.
            item.facets.forEach(facet => {
                const nestedItemLabel = facet.count ? `${facet.title} (${facet.count})` : `${facet.title}`;
                expect(getByText(nestedItemLabel)).toBeInTheDocument();
            });

            // click again to remove item from DOM to avoid any
            // ID collisions with the next iterations
            fireEvent.click(getByTestId(categoryId));
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
            fireEvent.click(getByTestId(categoryId));

            item.facets.forEach(facet => {
                const nestedButtonId = `facet-filter-nested-item-${getIdText(`${item.facetTitle}-${facet.title}`)}`;

                fireEvent.click(getByTestId(nestedButtonId));

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
                fireEvent.click(getByTestId(nestedButtonId));
            });

            // click category again to remove
            // nested items from DOM before next iteration
            // to avoid ID collisions
            fireEvent.click(getByTestId(categoryId));
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
            fireEvent.click(getByTestId(categoryId));

            item.facets.forEach(facet => {
                const idText = getIdText(`${item.facetTitle}-${facet.title}`);
                const nestedButtonId = `facet-filter-nested-item-${idText}`;
                const nestedClearButtonId = `clear-facet-filter-nested-item-${idText}`;

                // should not be in the document to begin with
                expect(queryByTestId(nestedClearButtonId)).not.toBeInTheDocument();

                fireEvent.click(getByTestId(nestedButtonId));

                const nestedButton = getByTestId(nestedClearButtonId);
                expect(nestedButton).toBeInTheDocument();

                fireEvent.click(getByTestId(nestedButtonId));

                // and finally, should be gone again
                expect(queryByTestId(nestedClearButtonId)).not.toBeInTheDocument();
            });

            // click category again to remove
            // nested items from DOM before next iteration
            fireEvent.click(getByTestId(categoryId));
        });
    });

    it('should clear active facets when keywords change', () => {
        const testFacetChangeFn = jest.fn();
        const testQueryPart =
            '?keywords%5BTitle-Testing%5D%5Btype%5D=Title&keywords%5BTitle-Testing%5D%5Btext%5D=Testing&keywords%5BTitle-Testing%5D%5Bid%5D=Title-Testing&keywords%5BKeyword-testing%5D%5Btype%5D=Keyword&keywords%5BKeyword-testing%5D%5Btext%5D=testing&keywords%5BKeyword-testing%5D%5Bid%5D=Keyword-testing&activeFacets%5Bfilters%5D%5BListed+in%5D%5B%5D=CWTS&activeFacets%5Bfilters%5D%5BIndexed+in%5D%5B%5D=Scopus&activeFacets%5Bfilters%5D%5BEmbargo%5D%5B%5D=12+months&page=1';
        const testQueryPartNoKeywords =
            '?keywords%5BTitle-Testing%5D%5Btype%5D=Title&keywords%5BTitle-Testing%5D%5Btext%5D=Testing&keywords%5BTitle-Testing%5D%5Bid%5D=Title-Testing';

        useLocation.mockImplementationOnce(() => ({
            pathname: '/',
            search: testQueryPart,
        }));

        const mockActiveFiltersRef = jest.spyOn(hooks, 'useActiveFacetFilters');
        const nestedClearButtonId = 'clear-facet-filter-nested-item';

        const { getByTestId, queryByTestId, rerender } = setup({ ...facets, testFacetChangeFn });
        expect(getByTestId(`${nestedClearButtonId}-listed-in-cwts`)).toBeVisible();
        expect(getByTestId(`${nestedClearButtonId}-indexed-in-scopus`)).toBeVisible();
        // not in the mock api response
        expect(queryByTestId(`${nestedClearButtonId}-embargo-12-months`)).not.toBeInTheDocument();

        expect(mockActiveFiltersRef).toHaveBeenCalledWith({
            Embargo: ['12 months'],
            'Indexed in': ['Scopus'],
            'Listed in': ['CWTS'],
        });

        useLocation.mockImplementationOnce(() => ({
            pathname: '/',
            search: testQueryPartNoKeywords,
        }));

        // simulate comp is rerendered when change in query string
        setup({ ...facets, testFacetChangeFn }, rerender);

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
        fireEvent.click(getByTestId('clickable-facet-category-indexed-in'));

        expect(getByTestId(scieFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scieClearFacetItemTestId)).not.toBeInTheDocument();
        expect(getByTestId(scopusFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scopusClearFacetItemTestId)).not.toBeInTheDocument();

        // clicks on scie facet
        fireEvent.click(getByTestId(scieFacetItemTestId));

        expect(getByTestId(scieClearFacetItemTestId)).toBeVisible();
        expect(queryByTestId(scopusClearFacetItemTestId)).not.toBeInTheDocument();

        // clicks on scopus facet
        fireEvent.click(getByTestId(scopusFacetItemTestId));

        expect(getByTestId(scieClearFacetItemTestId)).toBeVisible();
        expect(getByTestId(scopusClearFacetItemTestId)).toBeVisible();
    });

    it('should render reset button', () => {
        const testFacetChangeFn = jest.fn();
        const { getByTestId, queryByTestId } = setup({ ...facets, onFacetsChangedHandler: testFacetChangeFn });
        const facetItemTestId = 'facet-filter-nested-item-listed-in-cwts';
        const clearFacetItemTestId = 'clear-facet-filter-nested-item-listed-in-cwts';

        // expand Listed in
        fireEvent.click(getByTestId('clickable-facet-category-listed-in'));

        expect(getByTestId(facetItemTestId)).toBeVisible();
        expect(queryByTestId(clearFacetItemTestId)).not.toBeInTheDocument();

        fireEvent.click(getByTestId(facetItemTestId));

        expect(getByTestId(clearFacetItemTestId)).toBeVisible();

        // reset the active filters
        fireEvent.click(getByTestId('reset-facet-filters'));

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
        fireEvent.click(getByTestId('clickable-facet-category-listed-in'));
        // make sure the filter is not active
        expect(getByTestId(cwtsFacetFilterTestId)).toBeVisible();
        expect(queryByTestId(clearCwtsFacetFilterTestId)).not.toBeInTheDocument();
        // make the filter active
        fireEvent.click(getByTestId(cwtsFacetFilterTestId));
        expect(getByTestId(clearCwtsFacetFilterTestId)).toBeVisible();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();

        // 2. activate a second facet filter
        const scieFacetFilterTestId = 'facet-filter-nested-item-indexed-in-scie';
        const clearScieFacetFilterTestId = 'clear-facet-filter-nested-item-indexed-in-scie';
        // expand the facet parent
        fireEvent.click(getByTestId('clickable-facet-category-indexed-in'));
        // make sure the filter is not active
        expect(getByTestId(scieFacetFilterTestId)).toBeVisible();
        expect(queryByTestId(clearScieFacetFilterTestId)).not.toBeInTheDocument();
        // make the filter active
        fireEvent.click(getByTestId(scieFacetFilterTestId));
        expect(getByTestId(clearScieFacetFilterTestId)).toBeVisible();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();

        // deactivate the first filter
        fireEvent.click(getByTestId(clearCwtsFacetFilterTestId));
        expect(queryByTestId(clearCwtsFacetFilterTestId)).not.toBeInTheDocument();
        // make sure the reset facet filter button is visible
        expect(queryByTestId(resetFacetFiltersButtonId)).toBeInTheDocument();
        // deactivate the second filter
        fireEvent.click(getByTestId(clearScieFacetFilterTestId));
        expect(queryByTestId(clearScieFacetFilterTestId)).not.toBeInTheDocument();
        // make sure the reset facet filter button is NOT visible
        expect(queryByTestId(resetFacetFiltersButtonId)).not.toBeInTheDocument();
    });

    describe('`Open search: accepted version`', () => {
        const availableFacets = {
            filters: {
                facets: {
                    ...facets.filters.facets,
                    'Open access: accepted version': {
                        doc_count_error_upper_bound: 0,
                        sum_other_doc_count: 0,
                        buckets: [
                            {
                                key: '12 month embargo via repository',
                                doc_count: 22,
                            },
                            {
                                key: '18 month embargo via repository',
                                doc_count: 2,
                            },
                            {
                                key: '6 month embargo via repository',
                                doc_count: 0,
                            },
                            {
                                key: 'Immediate access via repository',
                                doc_count: 8,
                            },
                        ],
                    },
                },
            },
        };

        const onFacetsChangedHandler = jest.fn();
        const activate = async option =>
            await userEvent.click(
                screen.getByTestId(`facet-filter-nested-item-open-access-accepted-version-${kebabCase(option)}`),
            );
        const deactivate = async option =>
            await userEvent.click(
                screen.getByTestId(`clear-facet-filter-nested-item-open-access-accepted-version-${kebabCase(option)}`),
            );
        const assertActiveValues = (...expected) =>
            expect(onFacetsChangedHandler).toHaveBeenCalledWith({
                filters: !!expected.length
                    ? {
                          'Open access: accepted version': [...expected],
                      }
                    : {},
                ranges: {},
            });

        afterEach(() => onFacetsChangedHandler.mockReset());
        describe('when empty', () => {
            const expandCategory = async () =>
                await userEvent.click(screen.getByTestId('expand-more-facet-category-open-access-accepted-version'));

            it('should allow selecting single value', async () => {
                setup({ ...availableFacets, onFacetsChangedHandler });

                await expandCategory();
                await activate('Immediate access via repository');
                assertActiveValues('Immediate access via repository');
            });

            it('should allow selecting range', async () => {
                setup({ ...availableFacets, onFacetsChangedHandler });

                await expandCategory();
                await activate('12 month embargo via repository');
                assertActiveValues(
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
            });

            it('should select all when selecting range head', async () => {
                setup({ ...availableFacets, onFacetsChangedHandler });

                await expandCategory();
                await activate('18 month embargo via repository');
                assertActiveValues(
                    '18 month embargo via repository',
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
            });
        });

        describe('with active values', () => {
            const mockActiveValues = (...values) => {
                useLocation.mockImplementationOnce(() => ({
                    pathname: '/',
                    search: `?${param({
                        activeFacets: {
                            filters: {
                                'Open access: accepted version': values,
                            },
                        },
                    })}`,
                }));
            };

            it('should allow selecting single value', async () => {
                mockActiveValues('Immediate access via repository');
                setup({ ...availableFacets, onFacetsChangedHandler });

                await activate('6 month embargo via repository');
                assertActiveValues('6 month embargo via repository', 'Immediate access via repository');
            });

            it('should allow selecting range', async () => {
                mockActiveValues('Immediate access via repository');
                setup({ ...availableFacets, onFacetsChangedHandler });

                await activate('12 month embargo via repository');
                assertActiveValues(
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
            });

            it('should select all when selecting range head', async () => {
                mockActiveValues('Immediate access via repository');
                setup({ ...availableFacets, onFacetsChangedHandler });

                await activate('18 month embargo via repository');
                assertActiveValues(
                    '18 month embargo via repository',
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
            });

            it('should allow deselecting single value', async () => {
                mockActiveValues(
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
                setup({ ...availableFacets, onFacetsChangedHandler });

                await deactivate('12 month embargo via repository');
                assertActiveValues('6 month embargo via repository', 'Immediate access via repository');
            });

            it('should allow deselecting range', async () => {
                mockActiveValues(
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
                setup({ ...availableFacets, onFacetsChangedHandler });

                await deactivate('6 month embargo via repository');
                assertActiveValues('Immediate access via repository');
            });

            it('should deselect all when deselecting range tail', async () => {
                mockActiveValues(
                    '12 month embargo via repository',
                    '6 month embargo via repository',
                    'Immediate access via repository',
                );
                setup({ ...availableFacets, onFacetsChangedHandler });

                await deactivate('Immediate access via repository');
                assertActiveValues();
            });
        });
    });
});
