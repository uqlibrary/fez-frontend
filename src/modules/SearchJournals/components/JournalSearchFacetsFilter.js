import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import FacetFilterListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterListItem';
import FacetFilterNestedListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterNestedListItem';
import locale from 'locale/components';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { useActiveFacetFilters, useJournalSearch } from '../hooks';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import { sanitiseId } from 'helpers/general';

export const JournalFacetFilterNestedListItemsList = React.memo(function FacetFilterNestedListItemsList({
    facetCategory,
    disabled,
    activeFacets,
    handleFacetClick,
    isFacetFilterActive,
}) {
    return facetCategory.facets.map((item, index) => {
        const isActive = isFacetFilterActive(activeFacets.filters, facetCategory.facetTitle, item.key);
        return (
            <FacetFilterNestedListItem
                facet={facetCategory.facetTitle}
                key={index}
                index={index}
                onFacetClick={handleFacetClick(facetCategory.facetTitle, item.key)}
                isActive={isActive}
                primaryText={item.count ? `${item.title} (${item.count})` : `${item.title}`}
                disabled={disabled}
            />
        );
    });
});

JournalFacetFilterNestedListItemsList.propTypes = {
    facetCategory: PropTypes.object,
    disabled: PropTypes.bool,
    activeFacets: PropTypes.object,
    handleFacetClick: PropTypes.func,
    isFacetFilterActive: PropTypes.func,
};

/**
 * ShowFavouritedOnly is the key recognised by API - case sensitive
 */
export const showFavouritedOnlyFacet = {
    title: 'Favourite Journals',
    facetTitle: 'ShowFavouritedOnly',
    facets: [
        {
            title: 'Show journals favourited',
            key: 'ShowFavouritedOnly',
        },
    ],
};

export const getFacetsToDisplay = (rawFacets, renameFacetsList) => {
    const facetsToDisplay = [];
    rawFacets &&
        Object.keys(rawFacets)
            .sort()
            .forEach(key => {
                const rawFacet = rawFacets[key];
                // construct facet object to display, if facet has a lookup - get display name from lookup,
                // if facet key has a rename record, then use that.
                // Note use of Number.isFinite - will convert any *actual* numeric values to string
                const facetToDisplay = {
                    title: renameFacetsList[key] || key,
                    facetTitle: key,
                    facets: rawFacet.buckets.map(item => {
                        return {
                            title: key.endsWith('quartile') ? `Q${item.key}` : item.key,
                            key: Number.isFinite(item.key) ? String(item.key) : item.key,
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

const isFacetFilterActive = (activeFacetsFilters, category, value) => {
    if (activeFacetsFilters.hasOwnProperty(category)) {
        return (
            (Array.isArray(activeFacetsFilters[category]) && activeFacetsFilters[category].includes(value)) ||
            category === showFavouritedOnlyFacet.facetTitle
        );
    }
    return false;
};

/**
 * @param {}
 * @return {{}}
 */
export const filterOutNonActiveFacets = facets =>
    Object.keys(facets)
        .filter(key => {
            /* istanbul ignore else */
            if (Array.isArray(facets[key])) {
                return facets[key].length;
            }
            /* istanbul ignore next */
            return facets[key];
        })
        .reduce((filtered, key) => {
            filtered[key] = facets[key];
            return filtered;
        }, {});

export const resetFacetFiltersButtonId = 'reset-facet-filters';

export const JournalSearchFacetsFilter = ({ facetsData, renameFacetsList = {}, disabled, onFacetsChanged }) => {
    const { journalSearchQueryParams } = useJournalSearch();
    const activeFiltersQuerystringPart = JSON.stringify(journalSearchQueryParams.activeFacets?.filters);
    const prevActiveFiltersQuerystringPart = useRef(activeFiltersQuerystringPart);
    const keywordsQuerystringPart = JSON.stringify(journalSearchQueryParams.keywords);
    const prevKeywordsQuerystringPart = useRef(keywordsQuerystringPart);
    const [isFacetFilterClicked, setIsFacetFilterClicked] = useState(false);
    const [activeFacetsFilters, setActiveFacetsFilters] = useActiveFacetFilters({
        ...journalSearchQueryParams.activeFacets?.filters,
    });
    const [activeFacetsRanges] = useState({ ...journalSearchQueryParams.activeFacets?.ranges });

    /**
     * This effect takes care of making the facets filter UI reflect updates made to the activeFacets part
     * of the querystring.
     *
     * The reason why using useState above is not enough can be found
     * in here https://stackoverflow.com/a/58877875/1463121
     */
    useEffect(() => {
        if (activeFiltersQuerystringPart === prevActiveFiltersQuerystringPart.current) {
            return;
        }

        setActiveFacetsFilters({ ...journalSearchQueryParams.activeFacets?.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFiltersQuerystringPart]);

    /**
     * This effect takes care of resetting the facets filter whenever a keyword is removed
     */
    useEffect(() => {
        if (keywordsQuerystringPart === prevKeywordsQuerystringPart.current) {
            return;
        }

        setActiveFacetsFilters({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywordsQuerystringPart]);

    useEffect(() => {
        if (isFacetFilterClicked) {
            onFacetsChanged({
                filters: activeFacetsFilters,
                ranges: activeFacetsRanges,
            });
        }

        return () => setIsFacetFilterClicked(false);
    }, [isFacetFilterClicked, activeFacetsFilters, activeFacetsRanges, onFacetsChanged]);

    const facetsToDisplay = getFacetsToDisplay(facetsData, renameFacetsList);

    const _handleFacetClick = (category, facet) => () => {
        let newActiveFacetsFilters = { ...activeFacetsFilters };
        // remove facet filter
        if (isFacetFilterActive(newActiveFacetsFilters, category, facet)) {
            if (category === showFavouritedOnlyFacet.facetTitle) {
                delete newActiveFacetsFilters[category];
            } else {
                newActiveFacetsFilters[category] = newActiveFacetsFilters[category].filter(item => item !== facet);
            }
            newActiveFacetsFilters = filterOutNonActiveFacets(newActiveFacetsFilters);

            // support multi select e.g. index in
        } else if (newActiveFacetsFilters.hasOwnProperty(category)) {
            newActiveFacetsFilters[category].push(facet);

            // add an active facet filter
        } else {
            newActiveFacetsFilters[category] = category === showFavouritedOnlyFacet.facetTitle ? true : [facet];
        }

        setIsFacetFilterClicked(true);
        setActiveFacetsFilters(newActiveFacetsFilters);
    };

    const _handleResetClick = () => {
        setActiveFacetsFilters({});
        setIsFacetFilterClicked(true);
    };

    return (
        <StandardRighthandCard
            title={locale.components.searchJournals.journalFacetsFilter.title}
            help={locale.components.searchJournals.journalFacetsFilter.help}
            testId="journal-search-facets"
        >
            <div className="facetsFilter" id="facets-filter" data-testid="facets-filter">
                <List component="nav" dense>
                    {facetsToDisplay.map(item => {
                        const id = sanitiseId(`facet-category-${item.facetTitle}`);
                        return (
                            <FacetFilterListItem
                                id={id}
                                key={id}
                                title={item.title}
                                disabled={disabled}
                                isActive={activeFacetsFilters.hasOwnProperty(item.facetTitle)}
                                nestedItems={
                                    <JournalFacetFilterNestedListItemsList
                                        facetCategory={item}
                                        disabled={disabled}
                                        activeFacets={{
                                            filters: activeFacetsFilters,
                                            ranges: activeFacetsRanges,
                                        }}
                                        handleFacetClick={_handleFacetClick}
                                        isFacetFilterActive={isFacetFilterActive}
                                    />
                                }
                            />
                        );
                    })}
                </List>
                {activeFacetsFilters && Object.keys(activeFacetsFilters).length > 0 && (
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                arial-label="rest facet filters"
                                id={resetFacetFiltersButtonId}
                                data-analyticsid={resetFacetFiltersButtonId}
                                data-testid={resetFacetFiltersButtonId}
                                onClick={_handleResetClick}
                            >
                                {locale.components.searchJournals.journalFacetsFilter.resetButtonText}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </div>
        </StandardRighthandCard>
    );
};

JournalSearchFacetsFilter.propTypes = {
    facetsData: PropTypes.object,
    initialFacets: PropTypes.object,
    renameFacetsList: PropTypes.object,
    disabled: PropTypes.bool,
    showFavouritedFilter: PropTypes.bool,
    onFacetsChanged: PropTypes.func,
};

export default React.memo(JournalSearchFacetsFilter);
