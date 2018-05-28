import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardRighthandCard} from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import {SearchComponent} from 'modules/SharedComponents/SearchComponent';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {routes} from 'config';
import param from 'can-param';
import deparam from 'can-deparam';

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
        exportPublicationsLoading: PropTypes.bool,
        searchLoading: PropTypes.bool,
        searchLoadingError: PropTypes.bool,

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

        if (!!props.location && props.location.search.indexOf('?') >= 0) {
            const providedSearchQuery = this.parseSearchQueryStringFromUrl(props.location.search.substr(1));
            this.initState = {...this.initState, ...providedSearchQuery};
        }

        this.state = {
            // check if search has results
            // facets filtering might return no results, but facets should still be visible
            // hasResults: !props.searchLoading && props.publicationsList.length > 0,
            ...this.initState,
            ...this.props.searchQuery
        };
    }

    componentDidMount() {
        const {searchQueryParams} = this.state;
        if (!!searchQueryParams) {
            this.updateSearch();
        }
    }

    componentWillReceiveProps(newProps) {
        // handle browser back button - set state from location/dispatch action for this state
        if (
            this.props.location !== newProps.location &&
            newProps.history.action === 'POP' &&
            newProps.location.pathname === routes.pathConfig.records.search
        ) {
            this.setState({...(!!newProps.location.state ? newProps.location.state : this.state)}, () => {
                // only will be called when user clicks back on search records page
                this.props.actions.searchEspacePublications({...this.state});
            });
        } else {
            this.setState({
                ...newProps.searchQuery
            });
        }
    }

    /**
     * Parse provided query string and return active filters, facets etc
     * @returns object
     */
    parseSearchQueryStringFromUrl = (searchQuery) => {
        const providedSearchQuery = deparam(searchQuery);

        if (providedSearchQuery.hasOwnProperty('activeFacets')) {
            if (!providedSearchQuery.activeFacets.hasOwnProperty('filters')) {
                providedSearchQuery.activeFacets.filters = {};
            }

            if (!providedSearchQuery.activeFacets.hasOwnProperty('ranges')) {
                providedSearchQuery.activeFacets.ranges = {};
            }

            if (providedSearchQuery.activeFacets.hasOwnProperty('showOpenAccessOnly')) {
                providedSearchQuery.activeFacets.showOpenAccessOnly = (providedSearchQuery.activeFacets.showOpenAccessOnly === 'true');
            }
        }

        const pageSize = parseInt(providedSearchQuery.pageSize, 10);
        providedSearchQuery.pageSize = locale.components.sorting.recordsPerPage.indexOf(pageSize) < 0 ? 20 : pageSize;

        return providedSearchQuery;
    };

    pageSizeChanged = (pageSize) => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1
            },
            this.updateHistoryAndSearch
        );
    };

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            },
            this.updateHistoryAndSearch
        );
    };

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection
            },
            this.updateHistoryAndSearch
        );
    };

    facetsChanged = (activeFacets) => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1
            },
            this.updateHistoryAndSearch
        );
    };

    updateHistoryAndSearch = () => {
        this.props.history.push({
            pathname: `${routes.pathConfig.records.search}`,
            search: param(this.state),
            state: {...this.state}
        });
        this.updateSearch();
    };

    updateSearch = () => {
        this.props.actions.searchEspacePublications({...this.props.searchQuery, ...this.state});
    };

    render() {
        const txt = locale.pages.searchRecords;
        const pagingData = this.props.publicationsListPagingData;
        const isLoadingOrExporting = this.props.searchLoading || this.props.exportPublicationsLoading;
        const hasSearchParams = !!this.props.searchQuery && this.props.searchQuery.constructor === Object && Object.keys(this.props.searchQuery).length > 0;
        const alertProps = this.props.searchLoadingError && {...txt.errorAlert, message: txt.errorAlert.message(locale.global.errorMessages.generic)};
        return (
            <StandardPage className="page-search-records">
                <StandardCard className="search-component">
                    <SearchComponent className="search-body" />
                </StandardCard>
                {
                    // first time loading search results
                    !hasSearchParams && this.props.searchLoading &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                {
                    this.props.searchLoadingError &&
                    <Alert {...alertProps} />
                }
                {
                    !this.props.searchLoadingError &&
                    <div className="columns">
                        {
                            // no results to display
                            hasSearchParams &&
                            !this.props.searchLoading &&
                            this.props.publicationsList.length === 0 &&
                            <div className="column">
                                <StandardCard {...txt.noResultsFound}>
                                    {txt.noResultsFound.text}
                                </StandardCard>
                            </div>
                        }
                        {
                            // results to display or loading if user is filtering/paging
                            (
                                (hasSearchParams && this.props.searchLoading) ||
                                (!!this.props.publicationsList && this.props.publicationsList.length > 0)
                            ) &&
                            <div className="column">
                                <StandardCard>
                                    {
                                        pagingData && pagingData.to && pagingData.from && pagingData.total ?
                                            <span>
                                                {txt.recordCount
                                                    .replace('[recordsTotal]', pagingData.total)
                                                    .replace('[recordsFrom]', pagingData.from)
                                                    .replace('[recordsTo]', pagingData.to)}
                                            </span>
                                            :
                                            <span>{txt.loadingPagingMessage}</span>
                                    }
                                    <PublicationsListSorting
                                        sortBy={this.state.sortBy}
                                        sortDirection={this.state.sortDirection}
                                        pageSize={this.state.pageSize}
                                        pagingData={pagingData}
                                        location={this.props.location}
                                        onSortByChanged={this.sortByChanged}
                                        onPageSizeChanged={this.pageSizeChanged}
                                        onExportPublications={this.props.actions.exportEspacePublications}
                                        disabled={isLoadingOrExporting} />
                                    <PublicationsListPaging
                                        loading={isLoadingOrExporting}
                                        pagingData={pagingData}
                                        onPageChanged={this.pageChanged}
                                        disabled={isLoadingOrExporting} />
                                    {
                                        (isLoadingOrExporting) &&
                                        <div className="is-centered"><InlineLoader message={this.props.searchLoading ? txt.loadingPagingMessage : txt.exportPublicationsLoadingMessage}/></div>
                                    }
                                    {
                                        !isLoadingOrExporting && this.props.publicationsList && this.props.publicationsList.length > 0 &&
                                        <PublicationsList publicationsList={this.props.publicationsList} />
                                    }
                                    <PublicationsListPaging
                                        loading={isLoadingOrExporting}
                                        pagingData={pagingData}
                                        onPageChanged={this.pageChanged}
                                        disabled={isLoadingOrExporting} />
                                </StandardCard>
                            </div>
                        }
                        {
                            this.props.publicationsListFacets
                            && Object.keys(this.props.publicationsListFacets).length !== 0 &&
                            <div className="column is-3 is-hidden-mobile">
                                <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                    <FacetsFilter
                                        facetsData={this.props.publicationsListFacets}
                                        onFacetsChanged={this.facetsChanged}
                                        activeFacets={this.state.activeFacets}
                                        disabled={isLoadingOrExporting}
                                        excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                        renameFacetsList={txt.facetsFilter.renameFacetsList}
                                        showOpenAccessFilter/>
                                </StandardRighthandCard>
                            </div>
                        }
                    </div>
                }

            </StandardPage>
        );
    }
}

export default SearchRecords;
