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
            if (activeFacets[category] === facet) {
                delete activeFacets[category];
            } else {
                activeFacets[category] = facet;
            }
        } else {
            activeFacets[category] = facet;
        }
        this.props.facetsFunction(activeFacets);
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
                className={activeFacets[item.aggregation] === subitem.key ? 'facetsLink active' : 'facetsLink'}
                primaryText={`${subitem.display_name} (${subitem.doc_count})`}
                onClick={this.handleFacetClick.bind(this, item.aggregation, subitem.key)}
                leftIcon={activeFacets[item.aggregation] === subitem.key ? <NavigationClose/> : null}
            />
        ));
    };

    transformRawData = (facetsData, aggregations, omitCategory) => {
        console.log('DATA BEFORE TRANSFORM -------> ' + JSON.stringify(facetsData));
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
        console.log('DATA AFTER TRANSFORM -------> ' + JSON.stringify(aggregations));
    };

    render() {
        const txt = locale.components.facetsFilter;
        const aggregations = [];
        const facetsData = this.props.facetsData; // Data from API, list of facets for current displayed publications
        const activeFacets = this.props.activeFacets; // From store, facets that are active
        const omitCategory = this.props.omitCategory; // prop of array category items to hide
        this.transformRawData(facetsData, aggregations, omitCategory);

        return (
            <div className="facetsFilter">
                <List>
                    {aggregations.map((item, index) => (
                        <div key={index}>
                            <ListItem primaryText={item.aggregation}
                                open={activeFacets[item.aggregation] && true}
                                disabled={activeFacets[item.aggregation] && true}
                                className={!activeFacets[item.aggregation] ? 'facetsCategory' : 'facetsCategory active'}
                                primaryTogglesNestedList
                                key={index}
                                nestedItems={this.getNestedListItems(item)}
                            />
                        </div>
                    ))}
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

export default FacetsFilter;
