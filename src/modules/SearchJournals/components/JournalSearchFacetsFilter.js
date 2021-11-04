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

const isFacetFilterActive = (activeFacetsFilters, category, value) => {
    if (activeFacetsFilters.hasOwnProperty(category)) {
        return (
            (Array.isArray(activeFacetsFilters[category]) && activeFacetsFilters[category].includes(value)) ||
            category === showFavouritedOnlyFacet.facetTitle
        );
    }
    return false;
};

const getHasActiveFilters = (activeFacetsFilters, activeFacetsRanges) =>
    Object.keys(activeFacetsFilters).length > 0 || Object.keys(activeFacetsRanges).length > 0;

export const JournalSearchFacetsFilter = ({
    facetsData,
    activeFacets,
    renameFacetsList,
    disabled,
    onFacetsChanged,
}) => {
    const [isFacetFilterClicked, setIsFacetFilterClicked] = useState(false);
    const [activeFacetsFilters, setActiveFacetsFilters] = useState({ ...activeFacets.filters });
    const [activeFacetsRanges] = useState({ ...activeFacets.ranges });
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    // set active facets once querystring gets update
    // the reason why using useState above is not enough can be found in
    // here https://stackoverflow.com/a/58877875/1463121
    useEffect(() => {
        setActiveFacetsFilters({ ...activeFacets.filters });
    }, [activeFacets.filters]);

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
        const newActiveFacetsFilters = { ...activeFacetsFilters };
        if (isFacetFilterActive(newActiveFacetsFilters, category, facet)) {
            if (category === showFavouritedOnlyFacet.facetTitle) {
                delete newActiveFacetsFilters[category];
            } else {
                newActiveFacetsFilters[category] = newActiveFacetsFilters[category].filter(item => item !== facet);
            }
        } else if (newActiveFacetsFilters.hasOwnProperty(category)) {
            newActiveFacetsFilters[category].push(facet);
        } else {
            newActiveFacetsFilters[category] = category === showFavouritedOnlyFacet.facetTitle ? true : [facet];
        }

        setIsFacetFilterClicked(true);
        setActiveFacetsFilters(newActiveFacetsFilters);
        setHasActiveFilters(getHasActiveFilters(newActiveFacetsFilters, activeFacetsRanges));
    };

    if (facetsToDisplay.length === 0 && !hasActiveFilters) {
        return <span id="empty-facet-filters" className="facetsFilter empty" />;
    }
    return (
        <StandardRighthandCard
            title={locale.components.journalSearch.journalFacetsFilter.title}
            help={locale.components.journalSearch.journalFacetsFilter.help}
        >
            <div className="facetsFilter" id="facets-filter" data-testid="facets-filter">
                <List component="nav" dense>
                    {facetsToDisplay.map(item => {
                        return (
                            <FacetFilterListItem
                                id={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                                key={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
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
            </div>
        </StandardRighthandCard>
    );
};

JournalSearchFacetsFilter.propTypes = {
    facetsData: PropTypes.object,
    activeFacets: PropTypes.object,
    initialFacets: PropTypes.object,
    renameFacetsList: PropTypes.object,
    disabled: PropTypes.bool,
    showFavouritedFilter: PropTypes.bool,
    onFacetsChanged: PropTypes.func,
};

JournalSearchFacetsFilter.defaultProps = {
    renameFacetsList: {},
    showFavouritedFilter: false,
};

export default React.memo(JournalSearchFacetsFilter);
