import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {publicationTypes} from 'config';
import {locale} from 'locale';

export default class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        onFacetsChanged: PropTypes.func,
        activeFacets: PropTypes.object,
        excludeFacetsList: PropTypes.array,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        excludeFacetsList: []
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

    handleFacetClick = (category, facet) => {
        if (this.props.disabled) {
            return;
        }
        const activeFacets = {...this.state.activeFacets};
        if (activeFacets.hasOwnProperty(category) && activeFacets[category] === facet) {
            delete activeFacets[category];
        } else {
            activeFacets[category] = facet;
        }
        this.setState({
            activeFacets: {...activeFacets}
        });
    };

    handleResetClick = () => {
        this.setState({
            activeFacets: {}
        });
    }

    getNestedListItems = (facetCategory) => {
        const listItems = facetCategory.facets.map((item, index) => {
            const isActive = this.state.activeFacets.hasOwnProperty(facetCategory.title) && this.state.activeFacets[facetCategory.title] === item.key;
            return (
                <ListItem
                    key={index}
                    className={'facetsLink ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                    primaryText={`${item.title} (${item.count})`}
                    onClick={() => (this.handleFacetClick(facetCategory.title, item.key))}
                    disabled={this.props.disabled}
                    leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null}/>
            );
        });
        return listItems;
    };

    getFacetsToDisplay(rawFacets, excludeFacetsList) {
        const facetsToDisplay = [];
        Object.keys(rawFacets).forEach((key) => {
            const rawFacet = rawFacets[key];
            const rawFacetLookup = rawFacets[`${key} (lookup)`];

            // ignore facet if it has no data or is in exlude list
            if (key.indexOf('(lookup)') >= 0
                || excludeFacetsList && excludeFacetsList.indexOf(key) >= 0
                || (rawFacet.buckets && rawFacet.buckets.length === 0)) return;

            // construct facet object to display, if facet has a lookup - get display name from lookup
            const facetToDisplay = {
                title: key,
                facets: rawFacet.buckets.map((item, index) => {
                    if (key === 'Display type') {
                        const typeIndex = publicationTypes().findIndex((type) => {
                            return type.id === rawFacet.buckets[index].key;
                        });
                        return {
                            title: typeIndex > -1 ? publicationTypes()[typeIndex].name : 'Unknown',
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
    }

    render() {
        const txt = locale.components.facetsFilter;
        const facetsToDisplay = this.getFacetsToDisplay(this.props.facetsData, this.props.excludeFacetsList);
        if (facetsToDisplay.length === 0) return (<span className="facetsFilter empty" />);
        return (
            <div className="facetsFilter">
                <List>
                    {
                        facetsToDisplay.map((item, index) => {
                            const isActive = this.state.activeFacets.hasOwnProperty(item.title);
                            return (
                                <ListItem
                                    primaryText={item.title}
                                    open={this.state.activeFacets[item.title] && true}
                                    disabled={this.props.disabled}
                                    className={'facetsCategory ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                                    primaryTogglesNestedList
                                    key={index}
                                    nestedItems={this.getNestedListItems(item)} />
                            );
                        })
                    }
                </List>
                <div className="columns">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow-tablet">
                        <FlatButton
                            fullWidth
                            label={txt.resetButtonText}
                            onClick={this.handleResetClick}/>
                    </div>
                </div>
            </div>
        );
    }
}
