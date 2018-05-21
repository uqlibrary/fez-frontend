import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {publicationTypes} from 'config';
import {locale} from 'locale';
import {general} from 'config';
import {routes} from 'config';
import DateRange from './DateRange';
import OpenAccessFilter from './OpenAccessFilter';

export default class FacetsFilter extends PureComponent {
    static propTypes = {
        facetsData: PropTypes.object,
        onFacetsChanged: PropTypes.func,
        activeFacets: PropTypes.object,
        excludeFacetsList: PropTypes.array,
        renameFacetsList: PropTypes.object,
        disabled: PropTypes.bool,
        showOpenAccessFilter: PropTypes.bool,
        location: PropTypes.object
    };

    static defaultProps = {
        excludeFacetsList: [],
        renameFacetsList: {},
        showOpenAccessFilter: false
    };

    constructor(props) {
        super(props);

        // always keep props/state in sync
        this.state = {
            activeFacets: props.activeFacets,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeFacets: nextProps.activeFacets
        });
    }

    _handleFacetClick = (category, facet) => () => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            filters: {...this.state.activeFacets.filters},
            ranges: {...this.state.activeFacets.ranges},
            showOpenAccessOnly: !!this.state.activeFacets.showOpenAccessOnly
        };

        if (activeFacets.filters.hasOwnProperty(category) && activeFacets.filters[category] === facet) {
            delete activeFacets.filters[category];
        } else {
            activeFacets.filters[category] = facet;
        }

        this.setState({
            activeFacets: activeFacets
        }, () => {
            this.props.onFacetsChanged(this.state.activeFacets);
        });
    };

    _handleOpenAccessFilter = (isActive) => {
        if (this.props.disabled) {
            return;
        }

        this.setState({
            activeFacets: {
                ...this.state.activeFacets,
                showOpenAccessOnly: isActive
            }
        }, () => {
            this.props.onFacetsChanged(this.state.activeFacets);
        });
    };

    _handleYearPublishedRangeFacet = (category) => (range) => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            filters: {...this.state.activeFacets.filters},
            ranges: {...this.state.activeFacets.ranges},
            showOpenAccessOnly: !!this.state.activeFacets.showOpenAccessOnly
        };

        if (!range.to && !range.from) {
            delete activeFacets.ranges[category];
        } else {
            activeFacets.ranges[category] = range;
        }
        this.setState({
            activeFacets: activeFacets
        }, () => {
            this.props.onFacetsChanged(this.state.activeFacets);
        });
    };

    _handleResetClick = () => {
        if (this.props.location.pathname === routes.pathConfig.dataset.mine) {
            // wipe the facets, except for the hidden display type
            this.setState({
                activeFacets: {
                    filters: {'Display type': general.PUBLICATION_TYPE_DATA_COLLECTION},
                    ranges: {}
                }
            }, () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            });
        } else {
            this.setState({
                activeFacets: {
                    filters: {},
                    ranges: {}
                }
            }, () => {
                this.props.onFacetsChanged(this.state.activeFacets);
            });
        }
    };

    getNestedListItems = (facetCategory) => {
        return facetCategory.facets.map((item, index) => {
            const isActive = this.state.activeFacets.filters.hasOwnProperty(facetCategory.facetTitle) && this.state.activeFacets.filters[facetCategory.facetTitle] === item.key;
            return (
                <ListItem
                    key={index}
                    className={'facetsLink ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                    primaryText={`${item.title} (${item.count})`}
                    onClick={this._handleFacetClick(facetCategory.facetTitle, item.key)}
                    disabled={this.props.disabled}
                    leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null}/>
            );
        });
    };

    getFacetsToDisplay = (rawFacets, excludeFacetsList, renameFacetsList) => {
        const facetsToDisplay = [];
        Object.keys(rawFacets).forEach((key) => {
            const rawFacet = rawFacets[key];
            const rawFacetLookup = rawFacets[`${key} (lookup)`];

            // ignore facet if it has no data or is in exclude list
            if (key.indexOf('(lookup)') >= 0
                || excludeFacetsList && excludeFacetsList.indexOf(key) >= 0
                || (rawFacet.buckets && rawFacet.buckets.length === 0)) return;

            // construct facet object to display, if facet has a lookup - get display name from lookup, if facet key has a rename record, then use that
            const facetToDisplay = {
                title: renameFacetsList[key] || key,
                facetTitle: key,
                facets: rawFacet.buckets.map((item, index) => {
                    if (key === 'Display type') {
                        const publicationTypeIndex = publicationTypes().findIndex((publicationType) => {
                            return publicationType.id === rawFacet.buckets[index].key;
                        });
                        return {
                            title: publicationTypeIndex > -1 ? publicationTypes()[publicationTypeIndex].name : 'Unknown',
                            key: item.key,
                            count: item.doc_count
                        };
                    } else {
                        return {
                            title: rawFacetLookup && rawFacetLookup.buckets.length > index ? rawFacetLookup.buckets[index].key : item.key,
                            key: item.key,
                            count: item.doc_count
                        };
                    }
                })
            };

            facetsToDisplay.push(facetToDisplay);
        });
        return facetsToDisplay;
    };

    // We want to ignore the page-level filters (in this case 'Display type = 371')
    // while we check the client-filters (anything they have clicked on the page).
    // We may need to manage client-filters and page-filters separately at some point
    areClientFiltersAvailable() {
        if (this.props.location.pathname === routes.pathConfig.dataset.mine) {
            // on the 'My Dataset' page, we must remove the `display type` from the filters before we check it
            const localFilters = Object.assign({}, this.state.activeFacets.filters);
            if (Object.keys(localFilters).length > 0 &&
                localFilters.hasOwnProperty('Display type') &&
                localFilters['Display type'] === general.PUBLICATION_TYPE_DATA_COLLECTION) {
                delete localFilters['Display type'];

                // return true if there is any other filters in array
                return Object.keys(localFilters).length > 0;
            } else {
                // this shouldnt be reachable - if its a dataset page it should always be PUBLICATION_TYPE_DATA_COLLECTION type
                return Object.keys(this.state.activeFacets.filters).length > 0;
            }
        } else {
            return Object.keys(this.state.activeFacets.filters).length > 0;
        }
    }

    render() {
        const {yearPublishedCategory, yearPublishedFacet, resetButtonText} = locale.components.facetsFilter;
        const facetsToDisplay = this.getFacetsToDisplay(this.props.facetsData, this.props.excludeFacetsList, this.props.renameFacetsList);
        const hasActiveFilters =
            (this.areClientFiltersAvailable()
            || Object.keys(this.state.activeFacets.ranges).length > 0
            || !!this.state.activeFacets.showOpenAccessOnly);
        if (facetsToDisplay.length === 0 && !hasActiveFilters) return (<span className="facetsFilter empty" />);
        return (
            <div className="facetsFilter">
                <List>
                    {
                        facetsToDisplay.map((item, index) => {
                            const isActive = this.state.activeFacets.filters.hasOwnProperty(item.title);
                            return (
                                <ListItem
                                    primaryText={item.title}
                                    {...(this.state.activeFacets.filters[item.facetTitle] ? {open: true} : {})}
                                    disabled={this.props.disabled}
                                    className={'facetsCategory ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                                    primaryTogglesNestedList
                                    key={`key_facet_item_${index}`}
                                    nestedItems={this.getNestedListItems(item)} />
                            );
                        })
                    }
                    <DateRange
                        itemClassName="dateRange facetsCategory"
                        subitemClassName="dateRange facetsLink"
                        {...(this.state.activeFacets.ranges[yearPublishedCategory] ? {open: true} : {})}
                        value={this.state.activeFacets.ranges.hasOwnProperty(yearPublishedCategory) ? this.state.activeFacets.ranges[yearPublishedCategory] : {}}
                        disabled={this.props.disabled}
                        onChange={this._handleYearPublishedRangeFacet(yearPublishedCategory)}
                        locale={yearPublishedFacet}
                    />
                    {
                        this.props.showOpenAccessFilter &&
                        <OpenAccessFilter
                            itemClassName="facetsCategory openAccessOnly"
                            subitemClassName="facetsLink openAccessOnly"
                            {...(!!this.state.activeFacets.showOpenAccessOnly ? {open: true} : {})}
                            value={this.state.activeFacets.showOpenAccessOnly}
                            disabled={this.props.disabled}
                            onChange={this._handleOpenAccessFilter}
                        />
                    }
                </List>
                {
                    hasActiveFilters &&
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-tablet">
                            <FlatButton
                                fullWidth
                                disabled={this.props.disabled}
                                label={resetButtonText}
                                onClick={this._handleResetClick}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
