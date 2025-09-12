import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';

import { publicationTypes } from 'config';
import { locale } from 'locale';
import DateRange from './DateRange';
import OpenAccessFilter from './OpenAccessFilter';
import FacetFilterListItem from './FacetFilterListItem';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

export const FacetFilterNestedListItemsList = React.memo(function FacetFilterNestedListItemsList({
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
                primaryText={`${item.title} (${item.count})`}
                disabled={disabled}
            />
        );
    });
});

FacetFilterNestedListItemsList.propTypes = {
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
                if (key === 'Display type') {
                    return {
                        title: (publicationTypes()[rawFacet.buckets[index].key] || { name: 'Unknown' }).name,
                        key: item.key,
                        count: item.doc_count,
                    };
                } else {
                    const facetValue =
                        rawFacetLookup && rawFacetLookup.buckets.length > index
                            ? rawFacetLookup.buckets[index].key
                            : item.key;
                    return {
                        title: facetValue,
                        key: lookupFacetsList[key] ? facetValue : item.key,
                        count: item.doc_count,
                    };
                }
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

const getHasActiveFilters = (activeFacetsFilters, activeFacetsRanges, showOpenAccessOnly, excludeFacetsList) =>
    Object.keys(activeFacetsFilters).filter(filter => !excludeFacetsList.includes(filter)).length > 0 ||
    Object.keys(activeFacetsRanges).length > 0 ||
    !!showOpenAccessOnly;

export const FacetsFilter = ({
    facetsData = {},
    activeFacets = {},
    initialFacets,
    excludeFacetsList = [],
    renameFacetsList = {},
    lookupFacetsList = {},
    disabled,
    showOpenAccessFilter = false,
    onFacetsChanged,
}) => {
    const [activeFacetsFilters, setActiveFacetsFilters] = useState({
        ...(activeFacets.filters || {}),
        ...((initialFacets || {}).filters || {}),
    });

    const [activeFacetsRanges, setActiveFacetsRanges] = useState({
        ...(activeFacets.ranges || {}),
    });

    const [showOpenAccessOnly, setShowOpenAccessOnly] = useState(!!activeFacets.showOpenAccessOnly);

    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    useEffect(() => {
        setActiveFacetsFilters({
            ...activeFacets.filters,
            ...((initialFacets || {}).filters || {}),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFacets.filters]);

    const onFacetClick = props => {
        onFacetsChanged({
            filters: activeFacetsFilters,
            ranges: activeFacetsRanges,
            showOpenAccessOnly: showOpenAccessOnly,
            ...props,
        });
    };
    const { yearPublishedCategory, yearPublishedFacet, resetButtonText, openAccessFilter } =
        locale.components.facetsFilter;

    const facetsToDisplay = getFacetsToDisplay(facetsData, excludeFacetsList, renameFacetsList, lookupFacetsList);

    const dataRangeValueProps = activeFacetsRanges.hasOwnProperty(yearPublishedCategory)
        ? {
              value: activeFacetsRanges[yearPublishedCategory],
              isActive: true,
          }
        : { isActive: false };

    const _handleFacetClick = (category, facet) => () => {
        const newActiveFacetsFilters = { ...activeFacetsFilters };

        if (isFacetFilterActive(newActiveFacetsFilters, category, facet)) {
            delete newActiveFacetsFilters[category];
        } else {
            newActiveFacetsFilters[category] = facet;
        }

        setActiveFacetsFilters(newActiveFacetsFilters);
        setHasActiveFilters(
            getHasActiveFilters(newActiveFacetsFilters, activeFacetsRanges, showOpenAccessOnly, excludeFacetsList),
        );
        onFacetClick({
            filters: newActiveFacetsFilters,
        });
    };

    const _handleOpenAccessFilter = isActive => {
        setShowOpenAccessOnly(!!isActive);
        setHasActiveFilters(
            getHasActiveFilters(activeFacetsFilters, activeFacetsRanges, !!isActive, excludeFacetsList),
        );

        onFacetClick({
            showOpenAccessOnly: !!isActive,
        });
    };

    const _handleYearPublishedRangeFacet = (category, range, isActive) => {
        const newActiveFacetsRanges = { ...activeFacetsRanges };

        if (!isActive) {
            delete newActiveFacetsRanges[category];
        } else {
            newActiveFacetsRanges[category] = range;
        }

        setActiveFacetsRanges(newActiveFacetsRanges);
        setHasActiveFilters(
            getHasActiveFilters(activeFacetsFilters, newActiveFacetsRanges, !!showOpenAccessOnly, excludeFacetsList),
        );

        onFacetClick({
            ranges: newActiveFacetsRanges,
        });
    };

    const _handleResetClick = () => {
        setActiveFacetsFilters({
            ...((initialFacets || {}).filters || {}),
        });
        setActiveFacetsRanges({});
        setShowOpenAccessOnly(false);
        setHasActiveFilters(false);

        onFacetClick({
            filters: {
                ...((initialFacets || {}).filters || {}),
            },
            ranges: {},
            showOpenAccessOnly: false,
        });
    };

    if (facetsToDisplay.length === 0 && !hasActiveFilters) {
        return <span id="empty-facet-filters" data-testid="empty-facet-filters" className="facetsFilter empty" />;
    }
    return (
        <div className="facetsFilter" id="facets-filter" data-testid="facets-filter">
            <List component="nav" dense>
                {facetsToDisplay.map(item => {
                    // const isActive = this.state.activeFacets.filters.hasOwnProperty(item.title);
                    return (
                        <FacetFilterListItem
                            id={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                            key={`facet-category-${item.facetTitle.replace(/ /g, '-').toLowerCase()}`}
                            title={item.title}
                            disabled={disabled}
                            isActive={activeFacetsFilters.hasOwnProperty(item.facetTitle)}
                            nestedItems={
                                <FacetFilterNestedListItemsList
                                    facetCategory={item}
                                    disabled={disabled}
                                    activeFacets={{
                                        filters: activeFacetsFilters,
                                        ranges: activeFacetsRanges,
                                        showOpenAccessOnly,
                                    }}
                                    handleFacetClick={_handleFacetClick}
                                    isFacetFilterActive={isFacetFilterActive}
                                />
                            }
                        />
                    );
                })}
                {excludeFacetsList.indexOf('Published year range') === -1 && (
                    <DateRange
                        {...dataRangeValueProps}
                        disabled={disabled}
                        onChange={_handleYearPublishedRangeFacet}
                        locale={yearPublishedFacet}
                        category={yearPublishedCategory}
                    />
                )}
                {showOpenAccessFilter && (
                    <OpenAccessFilter
                        isActive={showOpenAccessOnly}
                        disabled={disabled}
                        locale={openAccessFilter}
                        onChange={_handleOpenAccessFilter}
                    />
                )}
            </List>
            {hasActiveFilters && (
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Button variant="contained" onClick={_handleResetClick}>
                            {resetButtonText}
                        </Button>
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

FacetsFilter.propTypes = {
    facetsData: PropTypes.object,
    activeFacets: PropTypes.object,
    initialFacets: PropTypes.object,
    excludeFacetsList: PropTypes.array,
    renameFacetsList: PropTypes.object,
    lookupFacetsList: PropTypes.object,
    disabled: PropTypes.bool,
    showOpenAccessFilter: PropTypes.bool,
    onFacetsChanged: PropTypes.func,
};

export default React.memo(FacetsFilter);
