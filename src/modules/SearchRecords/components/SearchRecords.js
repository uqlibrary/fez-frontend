import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { SearchComponent } from 'modules/SharedComponents/SearchComponent';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { routes } from 'config';
import param from 'can-param';
import deparam from 'can-deparam';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import {
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
    FacetsFilter
} from 'modules/SharedComponents/PublicationsList';

import { locale } from 'locale';

class SearchRecords extends PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object,
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        publicationsListPagingData: PropTypes.object,
        exportPublicationsLoading: PropTypes.bool,
        canUseExport: PropTypes.bool,
        searchLoading: PropTypes.bool,
        searchLoadingError: PropTypes.bool,
        isAdvancedSearch: PropTypes.bool,
        isAdmin: PropTypes.bool,
        isUnpublishedBufferPage: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[1].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {}
            },
            advancedSearchFields: []
        };

        if (!!props.location && props.location.search.indexOf('?') >= 0) {
            const providedSearchQuery = this.parseSearchQueryStringFromUrl(
                props.location.search.substr(1)
            );
            this.initState = { ...this.initState, ...providedSearchQuery };
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
        const { searchQueryParams } = this.state;
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
            this.setState({ ...(!!newProps.location.state ? newProps.location.state : this.state) }, () => {
                // only will be called when user clicks back on search records page
                this.props.actions.searchEspacePublications({ ...this.state });
            });
        } else {
            this.setState({
                ...(
                    (
                        !!newProps.location.search
                        && newProps.location.search.length > 1
                        && this.parseSearchQueryStringFromUrl(
                            newProps.location.search.substr(1)
                        )
                    ) || {}
                )
            });
        }
    }

    componentWillUnmount() {
        this.props.actions.clearSearchQuery();
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
                providedSearchQuery.activeFacets.showOpenAccessOnly = (
                    providedSearchQuery.activeFacets.showOpenAccessOnly === 'true'
                );
            }
        } else {
            providedSearchQuery.activeFacets = {
                filters: {},
                ranges: {}
            };
        }

        const pageSize = parseInt(providedSearchQuery.pageSize, 10);
        providedSearchQuery.pageSize = locale.components.sorting.recordsPerPage.indexOf(
            pageSize
        ) < 0
            ? 20
            : pageSize;

        providedSearchQuery.sortDirection = locale.components.sorting.sortDirection.indexOf(
            providedSearchQuery.sortDirection
        ) < 0
            ? locale.components.sorting.sortDirection[0]
            : providedSearchQuery.sortDirection;

        providedSearchQuery.sortBy = locale.components.sorting.sortBy
            .map(sortBy => sortBy.value)
            .indexOf(providedSearchQuery.sortBy) < 0
            ? locale.components.sorting.sortBy[1].value
            : providedSearchQuery.sortBy;

        if (!this.props.isUnpublishedBufferPage && !!providedSearchQuery.searchQueryParams) {
            delete providedSearchQuery.searchQueryParams.rek_status;
            delete providedSearchQuery.searchQueryParams.rek_created_date;
            delete providedSearchQuery.searchQueryParams.rek_updated_date;
        }

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
            pathname: (
                this.props.location.pathname === routes.pathConfig.admin.unpublished
                    ? routes.pathConfig.admin.unpublished
                    : routes.pathConfig.records.search
            ),
            search: param(this.state),
            state: { ...this.state }
        });
        this.updateSearch();
    };

    updateSearch = () => {
        this.props.actions.searchEspacePublications({ ...this.props.searchQuery, ...this.state });
    };

    handleExportPublications = (exportFormat) => {
        this.props.actions.exportEspacePublications({ ...exportFormat, ...this.state });
    };

    handleFacetExcludesFromSearchFields = (searchFields) => {
        const excludesFromLocale = locale.pages.searchRecords.facetsFilter.excludeFacetsList;
        // Iterate the searchfields and add their map from locale into the excluded facets array
        if (searchFields) {
            const importedFacetExcludes = [];
            Object.keys(searchFields).map((key) => {
                if (searchFields[key].searchField) {
                    const fieldType = locale.components.searchComponent.advancedSearch.fieldTypes[searchFields[key].searchField];
                    if (fieldType.map) {
                        importedFacetExcludes.push(fieldType.map);
                    }
                }
            });
            this.setState({
                advancedSearchFields: excludesFromLocale.concat(importedFacetExcludes)
            });
        }
    };

    render() {
        const txt = locale.pages.searchRecords;
        const pagingData = this.props.publicationsListPagingData;
        const isLoadingOrExporting = this.props.searchLoading || this.props.exportPublicationsLoading;
        const hasSearchParams = !!this.props.searchQuery && this.props.searchQuery.constructor === Object && Object.keys(this.props.searchQuery).length > 0;
        const alertProps = this.props.searchLoadingError && { ...txt.errorAlert, message: txt.errorAlert.message(locale.global.errorMessages.generic) };
        return (
            <StandardPage className="page-search-records">
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <StandardCard className="searchComponent" noHeader>
                            <SearchComponent
                                className="search-body"
                                showAdvancedSearchButton
                                activeFacets={this.state.activeFacets}
                                facetsChanged={this.facetsChanged}
                                searchLoading={this.props.searchLoading}
                                clearSearchQuery={this.props.actions.clearSearchQuery}
                                updateFacetExcludesFromSearchFields={this.handleFacetExcludesFromSearchFields}
                                isAdvancedSearch={this.props.isAdvancedSearch}
                                isAdmin={this.props.isAdmin}
                                isUnpublishedBufferPage={this.props.isUnpublishedBufferPage}
                            />
                        </StandardCard>
                    </Grid>
                    {
                        // first time loading search results
                        !hasSearchParams && this.props.searchLoading &&
                        <Grid item xs={12}>
                            <InlineLoader message={txt.loadingMessage} />
                        </Grid>
                    }
                    {
                        this.props.searchLoadingError &&
                        <Grid item xs={12}>
                            <Alert pushToTop {...alertProps} />
                        </Grid>
                    }
                    {
                        // no results to display
                        hasSearchParams && !this.props.searchLoading &&
                        this.props.publicationsList.length === 0 &&
                        <Grid item xs={12}>
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </Grid>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        (
                            (hasSearchParams && this.props.searchLoading) ||
                            (!!this.props.publicationsList && this.props.publicationsList.length > 0)
                        ) &&
                        <Grid item xs sm md={9}>
                            <StandardCard noHeader>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        {
                                            pagingData &&
                                            pagingData.to &&
                                            pagingData.from &&
                                            pagingData.total
                                                ? <span>
                                                    {txt.recordCount
                                                        .replace('[recordsTotal]', pagingData.total)
                                                        .replace('[recordsFrom]', pagingData.from)
                                                        .replace('[recordsTo]', pagingData.to)}
                                                </span>
                                                :
                                                <span>{txt.loadingPagingMessage}</span>
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationsListSorting
                                            sortBy={this.state.sortBy}
                                            sortDirection={this.state.sortDirection}
                                            pageSize={this.state.pageSize}
                                            pagingData={pagingData}
                                            canUseExport={this.props.canUseExport}
                                            onSortByChanged={this.sortByChanged}
                                            onPageSizeChanged={this.pageSizeChanged}
                                            onExportPublications={this.handleExportPublications}
                                            disabled={isLoadingOrExporting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationsListPaging
                                            loading={isLoadingOrExporting}
                                            pagingData={pagingData}
                                            onPageChanged={this.pageChanged}
                                            disabled={isLoadingOrExporting}
                                        />
                                    </Grid>
                                </Grid>
                                {
                                    isLoadingOrExporting &&
                                    <Grid container justify={'center'}>
                                        <Grid item>
                                            <InlineLoader message={
                                                this.props.searchLoading
                                                    ? txt.loadingPagingMessage
                                                    : txt.exportPublicationsLoadingMessage
                                            } />
                                        </Grid>
                                    </Grid>
                                }
                                {
                                    !isLoadingOrExporting &&
                                    this.props.publicationsList &&
                                    this.props.publicationsList.length > 0 &&
                                    <div style={{ marginTop: 16 }}>
                                        <PublicationsList
                                            showUnpublishedBufferFields={this.props.isUnpublishedBufferPage}
                                            publicationsList={this.props.publicationsList}
                                        />
                                    </div>
                                }
                                <PublicationsListPaging
                                    loading={isLoadingOrExporting}
                                    pagingData={pagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={isLoadingOrExporting} />
                            </StandardCard>
                        </Grid>
                    }
                    {
                        this.props.publicationsListFacets
                        && Object.keys(this.props.publicationsListFacets).length !== 0 &&
                        <Hidden smDown>
                            <Grid item md={3}>
                                <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                    <FacetsFilter
                                        facetsData={this.props.publicationsListFacets}
                                        onFacetsChanged={this.facetsChanged}
                                        activeFacets={this.state.activeFacets}
                                        disabled={isLoadingOrExporting}
                                        excludeFacetsList={this.state.advancedSearchFields}
                                        renameFacetsList={txt.facetsFilter.renameFacetsList}
                                        lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                        showOpenAccessFilter
                                    />
                                </StandardRighthandCard>
                            </Grid>
                        </Hidden>
                    }
                </Grid>
            </StandardPage>
        );
    }
}

export default SearchRecords;
