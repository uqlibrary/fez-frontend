import React from 'react';
import {locale} from 'config';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        facetsFunction: PropTypes.func,
        activeFacets: PropTypes.object,
        omitCategory: PropTypes.array
    };

    static defaultProps = {
        facetsData: {},
        activeFacets: {},
        omitCategory: []
    };

    constructor(props) {
        super(props);
        this.handleResetClick = this.handleResetClick.bind(this);
    }

    handleFacetClick = (category, facet) => {
        const activeFacets = {...this.props.activeFacets};

        if (activeFacets[category] !== undefined) {
            if (activeFacets[category].includes(facet)) {
                delete activeFacets[category];
            } else{
                activeFacets[category] = facet;
            }
        } else {
            activeFacets[category] = facet;
        }
        this.setState({
            activeFacets: activeFacets
        }, () => {
            this.props.facetsFunction(this.state.activeFacets);
        });
    };

    handleResetClick = () => {
        this.setState({
            activeFacets: {}
        }, () => {
            this.props.facetsFunction(this.state.activeFacets);
        });
    }

    getNestedListItems = (item) => {
        const activeFacets = this.props.activeFacets;
        return item.facets.map((subitem, subindex) => (
            <ListItem key={subindex}
                primaryText={`${subitem.display_name} (${subitem.doc_count})`}
                onClick={this.handleFacetClick.bind(this, item.aggregation, subitem.key)}
                rightIcon={activeFacets[item.aggregation] === subitem.key ? <NavigationClose /> : null }
            />
        ));
    };

    render() {
        const txt = locale.components.facetsFilter;
        const aggregations = [];
        const facetsData = this.props.facetsData; // Data from API, list of facets for current displayed publications
        const activeFacets = this.props.activeFacets; // From store, facets that are active
        const omitCategory = this.props.omitCategory; // prop of array category items to hide

        // TODO: Refactor this into a function so there's less clutter
        Object.keys(facetsData).filter(key => key.indexOf('(lookup)') === -1 &&
            omitCategory.indexOf(key) === -1 &&
            facetsData[key].buckets.length !== 0).forEach(key => {
            const o = facetsData[key];
            const lookupItem = facetsData[`${key} (lookup)`] || o;
            aggregations.push({
                aggregation: key,
                display_name: o.display_name,
                facets: o.buckets.map((bucket, index) => {
                    bucket.display_name = lookupItem.buckets[index].key;
                    return bucket;
                }),
            });
        });

        // TODO: Do we sort the list?
        // const sortedAggregations = aggregations.sort((a, b) => {
        //     return a > b ? -1 : 1;
        // });

        return (
            <div className="facetsFilter">
                <div className="facetsList body-2">
                    <List>
                        {aggregations.map((item, index) => (
                            <div key={index}>
                                <ListItem primaryText={item.aggregation}
                                    open={activeFacets[item.aggregation] && true}
                                    primaryTogglesNestedList
                                    key={index}
                                    nestedItems={this.getNestedListItems(item, index)}
                                />
                            </div>
                        ))}
                    </List>
                </div>

                <div className="columns">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow">
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

export default FacetsFilter;
