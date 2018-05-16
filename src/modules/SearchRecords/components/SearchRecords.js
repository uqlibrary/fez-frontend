import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardRighthandCard} from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import {SearchComponent} from 'modules/SharedComponents/SearchComponent';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';

import {
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
    FacetsFilter
} from 'modules/SharedComponents/PublicationsList';

import {locale} from 'locale';

class SearchRecords extends PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object,
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        publicationsListPagingData: PropTypes.object,
        loadingSearch: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };

        this.state = {
            // check if search has results
            // facets filtering might return no results, but facets should still be visible
            // hasResults: !props.loadingSearch && props.publicationsList.length > 0,
            ...this.initState,
            ...this.props.searchQuery
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ...newProps.searchQuery
        });
    }

    pageSizeChanged = (pageSize) => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1
            },
            this.updateSearch
        );
    }

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            },
            this.updateSearch
        );
    }

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection
            },
            this.updateSearch
        );
    }

    facetsChanged = (activeFacets) => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1
            },
            this.updateSearch
        );
    }

    updateSearch = () => {
        this.props.actions.searchEspacePublications({...this.props.searchQuery, ...this.state});
    }

    render() {
        const txt = locale.pages.searchRecords;
        const pagingData = this.props.publicationsListPagingData;
        const hasSearchParams = !!this.props.searchQuery && this.props.searchQuery.constructor === Object && Object.keys(this.props.searchQuery).length > 0;

        return (
            <StandardPage className="page-search-records" title={txt.title}>
                <StandardCard>
                    <SearchComponent showAdvancedSearchButton/>
                </StandardCard>
                {
                    // first time loading my publications - account hasn't been loaded or any my publications haven't been loaded
                    !hasSearchParams && this.props.loadingSearch &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                <div className="columns">
                    {
                        // no results to display
                        hasSearchParams && !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                        <div className="column">
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </div>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        ((hasSearchParams && this.props.loadingSearch) || (!!this.props.publicationsList && this.props.publicationsList.length > 0)) &&
                        <div className="column">
                            <StandardCard>
                                {
                                    pagingData && pagingData.to && pagingData.from && pagingData.total &&
                                    <span>
                                        {txt.recordCount
                                            .replace('[recordsTotal]', pagingData.total)
                                            .replace('[recordsFrom]', pagingData.from)
                                            .replace('[recordsTo]', pagingData.to)}
                                    </span>
                                }
                                <PublicationsListSorting
                                    sortBy={this.state.sortBy}
                                    sortDirection={this.state.sortDirection}
                                    pageSize={this.state.pageSize}
                                    pagingData={pagingData}
                                    onSortByChanged={this.sortByChanged}
                                    onPageSizeChanged={this.pageSizeChanged}
                                    disabled={this.props.loadingSearch} />
                                <PublicationsListPaging
                                    loading={this.props.loadingSearch}
                                    pagingData={pagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingSearch} />
                                {
                                    this.props.loadingSearch &&
                                    <div className="is-centered"><InlineLoader message={txt.loadingPagingMessage}/></div>
                                }
                                {
                                    !this.props.loadingSearch && this.props.publicationsList && this.props.publicationsList.length > 0 &&
                                    <PublicationsList publicationsList={this.props.publicationsList} />
                                }
                                <PublicationsListPaging
                                    loading={this.props.loadingSearch}
                                    pagingData={pagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingSearch} />
                            </StandardCard>
                        </div>
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.publicationsListFacets && Object.keys(this.props.publicationsListFacets).length > 0)
                            || (this.state.activeFacets && this.state.activeFacets.filters && Object.keys(this.state.activeFacets.filters).length > 0)
                            || (this.state.activeFacets && this.state.activeFacets.ranges && Object.keys(this.state.activeFacets.ranges).length > 0)
                            || (this.state.activeFacets && !!this.state.activeFacets.showOpenAccessOnly)) &&
                        <div className="column is-3 is-hidden-mobile">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.publicationsListFacets}
                                    onFacetsChanged={this.facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    disabled={this.props.loadingSearch}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList}
                                    showOpenAccessFilter />
                            </StandardRighthandCard>
                        </div>
                    }
                </div>

            </StandardPage>
        );
    }
}

export default SearchRecords;
