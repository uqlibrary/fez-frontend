import React from 'react';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/RaisedButton';

class FacetsFilter extends React.Component {
    static propTypes = {
        facetsData: PropTypes.object,
        loadingFacetsData: PropTypes.bool,
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

    // This handles when you click on a facet
    handleActiveLinkClick(e) {
        e.preventDefault();

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
                activeFacets[category].push(facet);
            }
        } else {
            activeFacets[category] = [facet];
        }

        this.setState({
            activeFacets: activeFacets,
        }, () => {
            console.log('Current state of activeFacets: ' +
                JSON.stringify(this.state.activeFacets));
        });

        // Below is example of dispatching the new data to the API to re-render
        // this.props.actions.searchAuthors(newValue, (item) => { return !!item.aut_org_username; });
    }

    // This just handles the accordion css style showing the facets list on a click
    handleActiveCategoryClick(e) {
        e.preventDefault();

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
        }, () => {
            console.log('Current state of activeCategories: ' +
                JSON.stringify(this.state.activeCategories));
        });
    }

    // Click handler to clear all the active facets
    handleClearAllClick(e) {
        e.preventDefault();
        // Clear the array!
        this.setState({
            activeFacets: {},
            activeCategories: {},
        });
    }

    render() {
        const txt = locale.components.facetsFilter;

        const aggregationMap = {
            'ismemberof_mft': 'ismemberof_mt_lookup_exact',
            'subject_mi': 'subject_mi_lookup_exact',
            'display_type_i': 'display_type_i_lookup_exact',
            'scopus_doc_type_t_ft': 'scopus_doc_type_t_lookup_exact',
            'author_id_mi': 'author_id_mi_lookup_exact',
        };

        const aggregations = [];
        const facetsData = this.props.facetsData;
        if (!facetsData) return (<div />);
        Object.keys(facetsData).forEach(key => {
            // Filter out the lookup_exact items
            if (key.indexOf('_lookup_exact') === -1) {
                const o = facetsData[key];
                // Assign a lookup key if it matches in the aggregationsMap, otherwise return just the key
                const lookupItem = facetsData[aggregationMap[key] || key];
                // Push the new data into a new object
                aggregations.push({
                    aggregation: key,
                    display_name: o.display_name,
                    doc_count: o.sum_other_doc_count,
                    facets: o.buckets.map((bucket, index) => {
                        bucket.display_name = lookupItem.buckets[index].key;
                        return bucket;
                    }),
                });
            }
        });
        const sortedAggregations = aggregations.sort((a, b) => {
            return a.doc_count > b.doc_count ? -1 : 1;
        });

        return (
            <div className="facetsFilter">
                <div
                    className="columns is-gapless is-marginless is-paddingless facetsTitle">
                    <div className="column">
                        <h3 className="title is-5">{txt.title}</h3>
                    </div>
                    <div className="column is-narrow is-helpicon">
                        <HelpIcon
                            title={txt.help.title}
                            text={txt.help.text}
                            buttonLabel={txt.help.button}
                        />
                    </div>
                </div>
                <div className="facetsList body-2">
                    {sortedAggregations.map((item, index) => (
                        <div key={index}>
                            <div className="facetsCategory">
                                <div className="facetsCategoryTitle"
                                    data-category={item.display_name}
                                    tabIndex="0"
                                    onClick={this.handleActiveCategoryClick}
                                    onKeyPress={this.handleActiveCategoryClick}>
                                    {item.display_name}
                                </div>
                                <div
                                    className={this.state.activeCategories[item.display_name] &&
                                    this.state.activeCategories[item.display_name].includes(
                                        'active')
                                        ? 'facetLinksList active'
                                        : 'facetLinksList'}>
                                    {item.facets.map((subitem, subindex) => (
                                        <div key={subindex}
                                            tabIndex={this.state.activeCategories[item.display_name] &&
                                             this.state.activeCategories[item.display_name].includes(
                                                 'active') ? 0 : -1}
                                            className={this.state.activeFacets[item.display_name] &&
                                             this.state.activeFacets[item.display_name].includes('' +
                                                 subitem.key)
                                                ? 'facetListItems active'
                                                : 'facetListItems'}
                                            id="test"
                                            onClick={this.handleActiveLinkClick}
                                            onKeyPress={this.handleActiveLinkClick}
                                            data-facet={subitem.key}
                                            data-category={item.display_name}
                                        >
                                            {subitem.display_name}
                                            ({subitem.doc_count})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div>
                        <FlatButton
                            className="is-pulled-right"
                            label="Clear all"
                            onClick={this.handleClearAllClick}/>
                    </div>
                </div>
                {/* Just for testing purposes */}
                {window.location.href.indexOf('localhost') >= 1 &&
                <div style={{marginTop: 100}}>{JSON.stringify(
                    this.state.activeFacets)}</div>
                }
            </div>
        );
    }
}

export default FacetsFilter;
