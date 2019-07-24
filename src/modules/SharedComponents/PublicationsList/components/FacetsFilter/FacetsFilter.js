import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
        const isActive = isFacetFilterActive(activeFacets, facetCategory.facetTitle, item.key);
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

export default class FacetsFilter extends PureComponent {
    static propTypes = {
        facetsData: PropTypes.object,
        onFacetsChanged: PropTypes.func,
        activeFacets: PropTypes.object,
        initialFacets: PropTypes.object,
        excludeFacetsList: PropTypes.array,
        renameFacetsList: PropTypes.object,
        lookupFacetsList: PropTypes.object,
        disabled: PropTypes.bool,
        showOpenAccessFilter: PropTypes.bool,
    };

    static defaultProps = {
        excludeFacetsList: [],
        renameFacetsList: {},
        lookupFacetsList: {},
        showOpenAccessFilter: false,
    };

    constructor(props) {
        super(props);

        // always keep props/state in sync
        this.state = {
            activeFacets: {
                ...props.activeFacets,
                ...props.initialFacets,
            },
            hasActiveFilters: false,
            toggledFacets: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeFacets: nextProps.activeFacets,
        });
    }

    _handleFacetClick = (category, facet) => () => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            filters: { ...this.state.activeFacets.filters },
            ranges: { ...this.state.activeFacets.ranges },
            showOpenAccessOnly: !!this.state.activeFacets.showOpenAccessOnly,
        };

        if (this.isFacetFilterActive(activeFacets, category, facet)) {
            delete activeFacets.filters[category];
        } else {
            activeFacets.filters[category] = facet;
        }

        this.setState(
            {
                activeFacets: activeFacets,
                hasActiveFilters: this.hasActiveFilters(activeFacets),
            },
            () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            }
        );
    };

    _handleOpenAccessFilter = (isActive) => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            ...this.state.activeFacets,
            showOpenAccessOnly: isActive,
        };

        this.setState(
            {
                activeFacets,
                hasActiveFilters: this.hasActiveFilters(activeFacets),
            },
            () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            }
        );
    };

    _handleYearPublishedRangeFacet = (category) => (range) => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            filters: { ...this.state.activeFacets.filters },
            ranges: { ...this.state.activeFacets.ranges },
            showOpenAccessOnly: !!this.state.activeFacets.showOpenAccessOnly,
        };

        if (!range.to && !range.from) {
            delete activeFacets.ranges[category];
        } else {
            activeFacets.ranges[category] = range;
        }
        this.setState(
            {
                activeFacets: activeFacets,
                hasActiveFilters: this.hasActiveFilters(activeFacets),
            },
            () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            }
        );
    };

    _handleResetClick = () => {
        this.setState(
            {
                activeFacets: {
                    filters: {},
                    ranges: {},
                    ...(this.props.initialFacets || {}),
                },
            },
            () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            }
        );
    };

    isFacetFilterActive = (activeFacets, category, value) => {
        return activeFacets.filters.hasOwnProperty(category) && isNaN(activeFacets.filters[category])
            ? activeFacets.filters[category] === value
            : parseInt(activeFacets.filters[category], 10) === value;
    };

    getNestedListItems = (facetCategory) => {
        return facetCategory.facets.map((item, index) => {
            const isActive = this.isFacetFilterActive(this.state.activeFacets, facetCategory.facetTitle, item.key);
            return (
                <FacetFilterNestedListItem
                    key={index}
                    index={index}
                    onFacetClick={this._handleFacetClick(facetCategory.facetTitle, item.key)}
                    isActive={isActive}
                    primaryText={`${item.title} (${item.count})`}
                    disabled={this.props.disabled}
                />
            );
        });
    };

    getFacetsToDisplay = (rawFacets, excludeFacetsList, renameFacetsList, lookupFacetsList) => {
        const facetsToDisplay = [];
        Object.keys(rawFacets).forEach((key) => {
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
                            title: publicationTypes()[rawFacet.buckets[index].key].name || 'Unknown',
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

    toggleFacet = (item) => () => {
        this.setState({
            toggledFacets: {
                ...this.state.toggledFacets,
                [item]: !this.state.toggledFacets[item],
            },
        });
    };

    hasActiveFilters = (activeFacets) =>
        Object.keys(activeFacets.filters).filter((filter) => !this.props.excludeFacetsList.includes(filter)).length >
            0 ||
        Object.keys(activeFacets.ranges).length > 0 ||
        !!activeFacets.showOpenAccessOnly;

    render() {
        const {
            yearPublishedCategory,
            yearPublishedFacet,
            resetButtonText,
            openAccessFilter,
        } = locale.components.facetsFilter;
        const facetsToDisplay = this.getFacetsToDisplay(
            this.props.facetsData,
            this.props.excludeFacetsList,
            this.props.renameFacetsList,
            this.props.lookupFacetsList
        );

        if (facetsToDisplay.length === 0 && !this.state.hasActiveFilters) {
            return <span className="facetsFilter empty" />;
        }

        const dataRangeValueProps = this.state.activeFacets.ranges.hasOwnProperty(yearPublishedCategory)
            ? {
                value: this.state.activeFacets.ranges[yearPublishedCategory],
                isActive: true,
            }
            : {};

        return (
            <div className="facetsFilter">
                <List component="nav" dense>
                    {facetsToDisplay.map((item) => {
                        // const isActive = this.state.activeFacets.filters.hasOwnProperty(item.title);
                        return (
                            <FacetFilterListItem
                                id={`facet-category-${item.facetTitle.replace(' ', '-')}`}
                                key={`facet-category-${item.facetTitle.replace(' ', '-')}`}
                                facetTitle={item.title}
                                disabled={this.props.disabled}
                                onToggle={this.toggleFacet(item.facetTitle)}
                                open={this.state.toggledFacets[item.facetTitle]}
                            >
                                <FacetFilterNestedListItemsList
                                    facetCategory={item}
                                    disabled={this.props.disabled}
                                    activeFacets={this.state.activeFacets}
                                    handleFacetClick={this._handleFacetClick}
                                    isFacetFilterActive={this.isFacetFilterActive}
                                />
                            </FacetFilterListItem>
                        );
                    })}
                    {this.props.excludeFacetsList.indexOf('Published year range') === -1 && (
                        <DateRange
                            // value={
                            //     this.state.activeFacets.ranges.hasOwnProperty(yearPublishedCategory)
                            //         ? this.state.activeFacets.ranges[yearPublishedCategory]
                            //         : {}
                            // }
                            {...dataRangeValueProps}
                            disabled={this.props.disabled}
                            onChange={this._handleYearPublishedRangeFacet(yearPublishedCategory)}
                            locale={yearPublishedFacet}
                            onToggle={this.toggleFacet(yearPublishedCategory)}
                            open={this.state.toggledFacets[yearPublishedCategory]}
                        />
                    )}
                    {this.props.showOpenAccessFilter && (
                        <OpenAccessFilter
                            isActive={this.state.activeFacets.showOpenAccessOnly}
                            disabled={this.props.disabled}
                            locale={openAccessFilter}
                            onChange={this._handleOpenAccessFilter}
                            onToggle={this.toggleFacet(openAccessFilter.displayTitle)}
                            open={this.state.toggledFacets[openAccessFilter.displayTitle]}
                        />
                    )}
                </List>
                {this.state.hasActiveFilters && (
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button variant="contained" onClick={this._handleResetClick}>
                                {resetButtonText}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}
