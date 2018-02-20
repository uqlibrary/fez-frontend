import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {publicationTypes} from 'config';
import {locale} from 'locale';
import DateRange from './DateRange';

export default class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        onFacetsChanged: PropTypes.func,
        activeFacets: PropTypes.object,
        excludeFacetsList: PropTypes.array,
        renameFacetsList: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        excludeFacetsList: [],
        renameFacetsList: {}
    };

    constructor(props) {
        super(props);

        // always keep props/state in sync
        this.state = {
            activeFacets: {...props.activeFacets},
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (JSON.stringify(nextState.activeFacets) !== JSON.stringify(this.state.activeFacets)
            && this.props.onFacetsChanged) {
            this.props.onFacetsChanged(nextState.activeFacets);
        }
    }

    _handleFacetClick = (yearPublishedCategory, facet) => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            ...this.state.activeFacets,
            filters: {...this.state.activeFacets.filters},
            ranges: {...this.state.activeFacets.ranges},
        };

        if (activeFacets.filters.hasOwnProperty(yearPublishedCategory) && activeFacets.filters[yearPublishedCategory] === facet) {
            delete activeFacets.filters[yearPublishedCategory];
        } else {
            activeFacets.filters[yearPublishedCategory] = facet;
        }
        this.setState({
            activeFacets: {...activeFacets}
        });
    };

    _handleYearPublishedRangeFacet = (yearPublishedCategory) => (from, to) => {
        if (this.props.disabled) {
            return;
        }

        const activeFacets = {
            ...this.state.activeFacets,
            filters: {...this.state.activeFacets.filters},
            ranges: {...this.state.activeFacets.ranges},
        };

        const parsedFromValue = parseInt(from, 10);
        const parsedToValue = parseInt(to, 10);
        const fromValueForEs = parsedFromValue > parsedToValue ? to : (from || '*');
        const toValueForEs = parsedToValue < parsedFromValue ? from : (to || '*');

        const facet = `[${fromValueForEs} TO ${toValueForEs}]`;

        if (activeFacets.ranges[yearPublishedCategory] === facet) {
            delete activeFacets.ranges[yearPublishedCategory];
            delete activeFacets[yearPublishedCategory];
        } else {
            activeFacets.ranges[yearPublishedCategory] = facet;
            activeFacets[yearPublishedCategory] = {
                from: fromValueForEs,
                to: toValueForEs
            };
        }
        this.setState({
            activeFacets: {...activeFacets}
        });
    };

    _handleResetClick = () => {
        this.setState({
            activeFacets: {
                filters: {},
                ranges: {}
            }
        });
    };

    getNestedListItems = (facetCategory) => {
        return facetCategory.facets.map((item, index) => {
            const isActive = this.state.activeFacets.filters.hasOwnProperty(facetCategory.facetTitle) && this.state.activeFacets.filters[facetCategory.facetTitle] === item.key;
            return (
                <ListItem
                    key={index}
                    className={'facetsLink ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                    primaryText={`${item.title} (${item.count})`}
                    onClick={() => (this._handleFacetClick(facetCategory.facetTitle, item.key))}
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

            // ignore facet if it has no data or is in exlude list
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

    render() {
        const {yearPublishedCategory, yearPublishedFacet, resetButtonText} = locale.components.facetsFilter;
        const facetsToDisplay = this.getFacetsToDisplay(this.props.facetsData, this.props.excludeFacetsList, this.props.renameFacetsList);
        const hasActiveFilters = (Object.keys(this.state.activeFacets.filters).length > 0 || Object.keys(this.state.activeFacets.ranges).length > 0);
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
                                    open={this.state.activeFacets.filters[item.title] && true}
                                    disabled={this.props.disabled}
                                    className={'facetsCategory ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                                    primaryTogglesNestedList
                                    key={`key_facet_item_${index}`}
                                    nestedItems={this.getNestedListItems(item)} />
                            );
                        })
                    }
                    {
                        <DateRange
                            open={this.state.activeFacets.ranges[yearPublishedCategory] && true}
                            value={this.state.activeFacets.hasOwnProperty(yearPublishedCategory) ? this.state.activeFacets[yearPublishedCategory] : {}}
                            disabled={this.props.disabled}
                            onChange={this._handleYearPublishedRangeFacet(yearPublishedCategory)}
                            locale={yearPublishedFacet}
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
                                label={resetButtonText}
                                onClick={this._handleResetClick}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
