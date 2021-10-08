import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import FacetFilterListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterListItem';
import FacetFilterNestedListItem from 'modules/SharedComponents/PublicationsList/components/FacetsFilter/FacetFilterNestedListItem';
import locale from 'locale/components';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';

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
                key={index}
                index={index}
                onFacetClick={handleFacetClick(facetCategory.facetTitle, item.key)}
                isActive={isActive}
                primaryText={`${item.title} (${item.count})`}
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

const getFacetsToDisplay = (rawFacets, excludeFacetsList, renameFacetsList, lookupFacetsList) => {
    const facetsToDisplay = [];
    Object.keys(rawFacets).forEach(key => {
        const rawFacet = rawFacets[key];
        const rawFacetLookup = rawFacets[`${key} (lookup)`];

        // ignore facet if it has no data or is in exclude list
        if (
            key.indexOf('(lookup)') >= 0 ||
            (excludeFacetsList && excludeFacetsList.indexOf(key) >= 0) ||
            (rawFacet.buckets && rawFacet.buckets.length === 0)
        ) {
            return;
        }

        // construct facet object to display, if facet has a lookup - get display name from lookup,
        // if facet key has a rename record, then use that
        const facetToDisplay = {
            title: renameFacetsList[key] || key,
            facetTitle: lookupFacetsList[key] || key,
            facets: rawFacet.buckets.map((item, index) => {
                const facetValue =
                    rawFacetLookup && rawFacetLookup.buckets.length > index
                        ? rawFacetLookup.buckets[index].key
                        : item.key;
                return {
                    title: facetValue,
                    key: lookupFacetsList[key] ? facetValue : item.key,
                    count: item.doc_count,
                };
            }),
        };

        facetsToDisplay.push(facetToDisplay);
    });
    return facetsToDisplay;
};

const isFacetFilterActive = (activeFacetsFilters, category, value) => {
    return activeFacetsFilters.hasOwnProperty(category) && isNaN(activeFacetsFilters[category])
        ? activeFacetsFilters[category] === value
        : parseInt(activeFacetsFilters[category], 10) === value;
};

const getHasActiveFilters = (activeFacetsFilters, activeFacetsRanges, showFavouritedOnly, excludeFacetsList) =>
    Object.keys(activeFacetsFilters).filter(filter => !excludeFacetsList.includes(filter)).length > 0 ||
    Object.keys(activeFacetsRanges).length > 0 ||
    !!showFavouritedOnly;

export const JournalSearchFacetsFilter = ({
    facetsData,
    activeFacets,
    excludeFacetsList,
    renameFacetsList,
    lookupFacetsList,
    disabled,
    onFacetsChanged,
}) => {
    const [isFacetFilterClicked, setIsFacetFilterClicked] = useState(false);
    const [activeFacetsFilters, setActiveFacetsFilters] = useState({ ...activeFacets.filters });
    const [activeFacetsRanges] = useState({ ...activeFacets.ranges });
    const [showFavouritedOnly] = useState(!!activeFacets.showFavouritedOnly);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    useEffect(() => {
        if (isFacetFilterClicked) {
            onFacetsChanged({
                filters: activeFacetsFilters,
                ranges: activeFacetsRanges,
                showFavouritedOnly: showFavouritedOnly,
            });
        }

        return () => setIsFacetFilterClicked(false);
    }, [isFacetFilterClicked, activeFacetsFilters, activeFacetsRanges, showFavouritedOnly, onFacetsChanged]);

    const facetsToDisplay = getFacetsToDisplay(facetsData, excludeFacetsList, renameFacetsList, lookupFacetsList);

    const _handleFacetClick = (category, facet) => () => {
        const newActiveFacetsFilters = { ...activeFacetsFilters };

        if (isFacetFilterActive(newActiveFacetsFilters, category, facet)) {
            delete newActiveFacetsFilters[category];
        } else {
            newActiveFacetsFilters[category] = facet;
        }
        setIsFacetFilterClicked(true);
        setActiveFacetsFilters(newActiveFacetsFilters);
        setHasActiveFilters(
            getHasActiveFilters(newActiveFacetsFilters, activeFacetsRanges, showFavouritedOnly, excludeFacetsList),
        );
    };

    if (facetsToDisplay.length === 0 && !hasActiveFilters) {
        return <span id="empty-facet-filters" className="facetsFilter empty" />;
    }
    return (
        <StandardRighthandCard title={locale.components.journalSearch.journalFacetsFilter.title}>
            <div className="facetsFilter" id="facets-filter" data-testid="facets-filter">
                <List component="nav" dense>
                    {facetsToDisplay.map(item => {
                        return (
                            <FacetFilterListItem
                                id={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                                key={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                                title={item.title}
                                disabled={disabled}
                                nestedItems={
                                    <JournalFacetFilterNestedListItemsList
                                        facetCategory={item}
                                        disabled={disabled}
                                        activeFacets={{
                                            filters: activeFacetsFilters,
                                            ranges: activeFacetsRanges,
                                            showFavouritedOnly,
                                        }}
                                        handleFacetClick={_handleFacetClick}
                                        isFacetFilterActive={isFacetFilterActive}
                                    />
                                }
                            />
                        );
                    })}
                </List>
            </div>
        </StandardRighthandCard>
    );
};

JournalSearchFacetsFilter.propTypes = {
    facetsData: PropTypes.object,
    activeFacets: PropTypes.object,
    initialFacets: PropTypes.object,
    excludeFacetsList: PropTypes.array,
    renameFacetsList: PropTypes.object,
    lookupFacetsList: PropTypes.object,
    disabled: PropTypes.bool,
    showFavouritedFilter: PropTypes.bool,
    onFacetsChanged: PropTypes.func,
};

JournalSearchFacetsFilter.defaultProps = {
    excludeFacetsList: [],
    renameFacetsList: {},
    lookupFacetsList: {},
    showFavouritedFilter: false,
};

export default React.memo(JournalSearchFacetsFilter);
