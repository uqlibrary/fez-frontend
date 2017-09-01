import React from 'react';
import {locale} from 'config';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/RaisedButton';

class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        facetsFunction: PropTypes.func,
        omitCategory: PropTypes.array
    };

    static defaultProps = {
        facetsData: {},
        omitCategory: []
    };

    constructor(props) {
        super(props);
        this.state = {
            activeFacets: {},
            activeCategories: {}
        };

        this.handleActiveLinkClick = this.handleActiveLinkClick.bind(this);
        this.handleActiveCategoryClick = this.handleActiveCategoryClick.bind(this);
        this.handleClearAllClick = this.handleClearAllClick.bind(this);
    }

    // TODO: Add a lifecycle function to compare any activeFacets from this.state when/if we receive new facetsData

    // This handles when you click on a facet
    handleActiveLinkClick(e) {
        e.preventDefault();
        // If we clock with a mouse, and not keyboard, remove the :focus
        if(e.type === 'click') { e.target.blur(); }
        const activeFacets = {...this.state.activeFacets};
        const facet = e.target.dataset.facet;
        const category = e.target.dataset.category;

        if (activeFacets[category] !== undefined) {
            if (activeFacets[category].includes(facet)) {
                activeFacets[category] = activeFacets[category].filter(item => {
                    return item !== facet;
                });
                if (activeFacets[category].length === 0) {
                    delete activeFacets[category];
                }
            } else {
                activeFacets[category] = [facet];
            }
        } else {
            activeFacets[category] = [facet];
        }

        this.setState({
            activeFacets: activeFacets,
        }, () => {
            this.props.facetsFunction(this.state.activeFacets);
        });
    }

    // This just handles the accordion css style showing the facets list on a click
    handleActiveCategoryClick(e) {
        e.preventDefault();
        // If we clock with a mouse, and not keyboard, remove the :focus
        if(e.type === 'click') { e.target.blur(); }

        const activeCategories = {...this.state.activeCategories};
        const category = e.target.dataset.category;
        if (activeCategories[category] !== undefined) {
            if (activeCategories[category].includes('active')) {
                delete activeCategories[category];
            } else {
                activeCategories[category] = ['active'];
            }
        } else {
            activeCategories[category] = ['active'];
        }
        this.setState({
            activeCategories: activeCategories,
        });
    }

    // Click handler to clear all the active facets
    handleClearAllClick(e) {
        e.preventDefault();
        // Clear the array!
        this.setState({
            activeFacets: {},
            activeCategories: {},
        }, () => {
            this.props.facetsFunction(this.state.activeFacets);
        });
    }

    render() {
        const txt = locale.components.facetsFilter;
        const aggregations = [];
        const facetsData = this.props.facetsData;
        const omitCategory = this.props.omitCategory;

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
                    {aggregations.map((item, index) => (
                        <div key={index}>
                            <div className="facetsCategory">
                                <div className={this.state.activeCategories[item.aggregation] &&
                                    this.state.activeCategories[item.aggregation].includes('active') ?
                                    'facetsCategoryTitle active' : 'facetsCategoryTitle'}
                                data-category={item.aggregation}
                                tabIndex="0"
                                onClick={this.handleActiveCategoryClick}
                                onKeyPress={this.handleActiveCategoryClick}>
                                    {item.aggregation} <span style={{opacity: 0.5}}>({item.facets.length})</span>
                                </div>
                                <div
                                    className={this.state.activeCategories[item.aggregation]
                                        ? 'facetLinksList active'
                                        : 'facetLinksList'}>
                                    {item.facets.map((subitem, subindex) => (
                                        <div key={subindex}
                                            tabIndex={this.state.activeCategories[item.aggregation] ? 0 : -1}
                                            className={
                                                !this.state.activeFacets[item.aggregation] && 'facetListItems' ||
                                                this.state.activeFacets[item.aggregation] && !this.state.activeFacets[item.aggregation].includes('' + subitem.key) && 'facetListItems inactive' ||
                                                this.state.activeFacets[item.aggregation] && this.state.activeFacets[item.aggregation].includes('' + subitem.key) && 'facetListItems active'}
                                            onClick={this.handleActiveLinkClick}
                                            onKeyPress={this.handleActiveLinkClick}
                                            data-facet={subitem.key}
                                            data-category={item.aggregation}>
                                            {subitem.display_name} ({subitem.doc_count})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="columns">
                        <div className="column is-hidden-mobile" />
                        <div className="column is-narrow">
                            <FlatButton
                                fullWidth
                                label={txt.resetButtonText}
                                onClick={this.handleClearAllClick}/>
                        </div>
                    </div>
                </div>
                {/* Just for testing purposes */}
                {/* {window.location.href.indexOf('localhost') >= 1 &&*/}
                {/* <div style={{marginTop: 100}}>*/}
                {/* Active Facets:{JSON.stringify(this.state.activeFacets)}*/}
                {/* </div>*/}
                {/* }*/}
            </div>
        );
    }
}

export default FacetsFilter;
