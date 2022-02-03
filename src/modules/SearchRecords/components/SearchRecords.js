import React from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';
import deparam from 'can-deparam';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { SearchComponent } from 'modules/SharedComponents/SearchComponent';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import {
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
    FacetsFilter,
} from 'modules/SharedComponents/PublicationsList';
import { BulkExport } from 'modules/BulkExport';

import { locale } from 'locale';
import { RecordsSelectorContext } from 'context';
import { userIsAdmin, userIsResearcher } from 'hooks';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';
import { pathConfig } from 'config';

/**
 * Parse provided query string and return active filters, facets etc
 * @returns object
 */
export const parseSearchQueryStringFromUrl = (searchQuery, canBulkExport, isUnpublishedBufferPage) => {
    const providedSearchQuery = deparam(searchQuery);

    if (providedSearchQuery.hasOwnProperty('activeFacets')) {
        providedSearchQuery.activeFacets = {
            filters: providedSearchQuery.activeFacets.filters || {},
            ranges: providedSearchQuery.activeFacets.ranges || {},
            ...(providedSearchQuery.activeFacets.hasOwnProperty('showOpenAccessOnly')
                ? { showOpenAccessOnly: providedSearchQuery.activeFacets.showOpenAccessOnly === 'true' }
                : {}),
        };
    } else {
        providedSearchQuery.activeFacets = {
            filters: {},
            ranges: {},
        };
    }

    const pageSize = parseInt(providedSearchQuery.pageSize, 10);

    if (canBulkExport && pageSize === PUB_SEARCH_BULK_EXPORT_SIZE) {
        providedSearchQuery.bulkExportSelected = true;
        providedSearchQuery.pageSize = PUB_SEARCH_BULK_EXPORT_SIZE;
    } else {
        providedSearchQuery.bulkExportSelected = false;
        providedSearchQuery.pageSize = locale.components.sorting.recordsPerPage.indexOf(pageSize) < 0 ? 20 : pageSize;
    }

    providedSearchQuery.sortDirection =
        locale.components.sorting.sortDirection.indexOf(providedSearchQuery.sortDirection) < 0
            ? locale.components.sorting.sortDirection[0]
            : providedSearchQuery.sortDirection;

    providedSearchQuery.sortBy =
        locale.components.sorting.sortBy.map(sortBy => sortBy.value).indexOf(providedSearchQuery.sortBy) < 0
            ? locale.components.sorting.sortBy[1].value
            : providedSearchQuery.sortBy;

    if (!isUnpublishedBufferPage && !!providedSearchQuery.searchQueryParams) {
        delete providedSearchQuery.searchQueryParams.rek_status;
        delete providedSearchQuery.searchQueryParams.rek_created_date;
        delete providedSearchQuery.searchQueryParams.rek_updated_date;
    }

    providedSearchQuery.page = (providedSearchQuery.page && parseInt(providedSearchQuery.page, 10)) || 1;

    return providedSearchQuery;
};

export const getAdvancedSearchFields = searchFields => {
    const excludesFromLocale = locale.pages.searchRecords.facetsFilter.excludeFacetsList;
    // Iterate the searchfields and add their map from locale into the excluded facets array
    const importedFacetExcludes = [];
    searchFields.map(searchFieldItem => {
        if (searchFieldItem.searchField) {
            const fieldType = locale.components.searchComponent.advancedSearch.fieldTypes[searchFieldItem.searchField];
            if (fieldType.map) {
                importedFacetExcludes.push(fieldType.map);
            }
        }
    });
    return excludesFromLocale.concat(importedFacetExcludes);
};

const SearchRecords = ({
    actions,
    canUseExport,
    exportPublicationsLoading,
    history,
    isAdvancedSearch,
    isUnpublishedBufferPage,
    location,
    publicationsList,
    publicationsListFacets,
    publicationsListPagingData,
    searchLoading,
    searchLoadingError,
    searchQuery,
}) => {
    const isAdmin = userIsAdmin();
    const isResearcher = userIsResearcher();

    const [state, setState] = React.useState({
        activeFacets: {
            filters: {},
            ranges: {},
            ...{
                ...(((searchQuery || {}).activeFacets || {}).showOpenAccessOnly === 'true'
                    ? { showOpenAccessOnly: true }
                    : {}),
            },
        },
        advancedSearchFields: [],
        bulkExportSelected: false,
        page: 1,
        pageSize: 20,
        sortBy: locale.components.sorting.sortBy[1].value,
        sortDirection: locale.components.sorting.sortDirection[0],
        ...((!!location &&
            location.search.indexOf('?') >= 0 &&
            parseSearchQueryStringFromUrl(
                location.search.substr(1),
                isResearcher || isAdmin,
                isUnpublishedBufferPage,
            )) ||
            {}),
    });

    const updateSemaphore = React.useRef(false);

    React.useEffect(() => {
        if (!!location.search && location.search.length > 1) {
            updateSemaphore.current = true;
            setState(
                parseSearchQueryStringFromUrl(
                    location.search.substr(1),
                    isResearcher || isAdmin,
                    isUnpublishedBufferPage,
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        !!location.search &&
            location.search.length > 1 &&
            setState(
                parseSearchQueryStringFromUrl(
                    location.search.substr(1),
                    isResearcher || isAdmin,
                    isUnpublishedBufferPage,
                ),
            );

        actions.resetExportPublicationsStatus();

        return actions.clearSearchQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, history.action]);

    const updateSearch = () => {
        actions.searchEspacePublications({ ...searchQuery, ...state });
        actions.resetExportPublicationsStatus();
    };

    const updateHistoryAndSearch = () => {
        history.push({
            pathname:
                location.pathname === pathConfig.admin.unpublished
                    ? pathConfig.admin.unpublished
                    : pathConfig.records.search,
            search: param(state),
            state,
        });

        updateSearch();
    };

    React.useEffect(() => {
        updateSemaphore.current && updateHistoryAndSearch();
        updateSemaphore.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const pageSizeChanged = pageSize => {
        updateSemaphore.current = true;
        setState({
            ...state,
            pageSize,
            page: 1,
        });
    };

    const pageChanged = page => {
        updateSemaphore.current = true;
        setState({
            ...state,
            page,
        });
    };

    const sortByChanged = (sortBy, sortDirection) => {
        updateSemaphore.current = true;
        setState({
            ...state,
            sortBy,
            sortDirection,
        });
    };

    const facetsChanged = activeFacets => {
        updateSemaphore.current = true;
        setState({
            ...state,
            activeFacets,
            page: 1,
        });
    };

    const handleExportPublications = exportFormat =>
        actions.exportEspacePublications({
            ...state,
            ...exportFormat,
        });

    const handleFacetExcludesFromSearchFields = searchFields => {
        !!searchFields &&
            setState({
                ...state,
                advancedSearchFields: getAdvancedSearchFields(searchFields),
            });
    };

    const txt = locale.pages.searchRecords;
    const pagingData = publicationsListPagingData;
    const isLoadingOrExporting = searchLoading || exportPublicationsLoading;
    const hasSearchParams = !!location.search;
    const alertProps = searchLoadingError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(locale.global.errorMessages.generic),
    };

    return (
        <StandardPage className="page-search-records">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard className="searchComponent" noHeader standardCardId="search-records-queries">
                        <SearchComponent
                            activeFacets={state.activeFacets}
                            clearSearchQuery={actions.clearSearchQuery}
                            isAdmin={isAdmin}
                            isAdvancedSearch={isAdvancedSearch}
                            isUnpublishedBufferPage={isUnpublishedBufferPage}
                            searchLoading={searchLoading}
                            showAdvancedSearchButton
                            updateFacetExcludesFromSearchFields={handleFacetExcludesFromSearchFields}
                        />
                    </StandardCard>
                </Grid>
                {// first time loading search results
                searchLoading && (
                    <Grid item xs={12}>
                        <InlineLoader message={txt.loadingMessage} loaderId="search-records-loading" />
                    </Grid>
                )}
                {searchLoadingError && (
                    <Grid item xs={12}>
                        <Alert pushToTop {...alertProps} />
                    </Grid>
                )}
                {// no results to display
                hasSearchParams && !searchLoading && publicationsList && publicationsList.length === 0 && (
                    <Grid item xs={12}>
                        <StandardCard {...txt.noResultsFound}>{txt.noResultsFound.text}</StandardCard>
                    </Grid>
                )}
                {// results to display or loading if user is filtering/paging
                (exportPublicationsLoading ||
                    (hasSearchParams && searchLoading) ||
                    (!!publicationsList && publicationsList.length > 0)) && (
                    <Grid item xs sm md={9}>
                        <StandardCard noHeader standardCardId="search-records-results">
                            <Grid container spacing={2} justify="space-between">
                                <Grid item xs="auto">
                                    {pagingData && pagingData.to && pagingData.from && pagingData.total ? (
                                        <span>
                                            {txt.recordCount
                                                .replace('[recordsTotal]', pagingData.total)
                                                .replace('[recordsFrom]', pagingData.from)
                                                .replace('[recordsTo]', pagingData.to)}
                                        </span>
                                    ) : (
                                        <span>{txt.loadingPagingMessage}</span>
                                    )}
                                </Grid>
                                <Grid item xs="auto">
                                    {(isAdmin || isResearcher) && (
                                        <BulkExport
                                            exportPublications={handleExportPublications}
                                            locale={txt.bulkExport}
                                            pageSize={PUB_SEARCH_BULK_EXPORT_SIZE}
                                            totalMatches={publicationsListPagingData.total}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <PublicationsListSorting
                                        canUseExport={canUseExport}
                                        disabled={isLoadingOrExporting}
                                        onExportPublications={handleExportPublications}
                                        onPageSizeChanged={pageSizeChanged}
                                        onSortByChanged={sortByChanged}
                                        pageSize={state.pageSize}
                                        pagingData={pagingData}
                                        sortBy={state.sortBy}
                                        sortDirection={state.sortDirection}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <PublicationsListPaging
                                        disabled={isLoadingOrExporting}
                                        loading={isLoadingOrExporting}
                                        onPageChanged={pageChanged}
                                        pagingData={pagingData}
                                        pagingId="search-records-paging-top"
                                    />
                                </Grid>
                                {isLoadingOrExporting && (
                                    <Grid item xs={12}>
                                        <Grid container justify={'center'}>
                                            <Grid item xs={12}>
                                                <InlineLoader
                                                    loaderId="search-records-page-loading"
                                                    message={
                                                        searchLoading
                                                            ? txt.loadingPagingMessage
                                                            : txt.exportPublicationsLoadingMessage
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                                {!isLoadingOrExporting && publicationsList && publicationsList.length > 0 && (
                                    <Grid item xs={12}>
                                        <RecordsSelectorContext.Provider
                                            value={{
                                                records: publicationsList,
                                            }}
                                        >
                                            <PublicationsList
                                                publicationsList={publicationsList}
                                                showAdminActions={isAdmin || isUnpublishedBufferPage}
                                                showUnpublishedBufferFields={isUnpublishedBufferPage}
                                            />
                                        </RecordsSelectorContext.Provider>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <PublicationsListPaging
                                        disabled={isLoadingOrExporting}
                                        loading={isLoadingOrExporting}
                                        onPageChanged={pageChanged}
                                        pagingData={pagingData}
                                        pagingId="search-records-paging-bottom"
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
                {publicationsListFacets && Object.keys(publicationsListFacets).length !== 0 && (
                    <Hidden smDown>
                        <Grid item md={3} id="refine-results-facets" data-testid="refine-results-facets">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    activeFacets={state.activeFacets}
                                    disabled={isLoadingOrExporting}
                                    excludeFacetsList={
                                        (state.advancedSearchFields &&
                                            state.advancedSearchFields.length &&
                                            state.advancedSearchFields) ||
                                        locale.pages.searchRecords.facetsFilter.excludeFacetsList
                                    }
                                    facetsData={publicationsListFacets}
                                    lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                    onFacetsChanged={facetsChanged}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList}
                                    showOpenAccessFilter
                                />
                            </StandardRighthandCard>
                        </Grid>
                    </Hidden>
                )}
            </Grid>
        </StandardPage>
    );
};

SearchRecords.propTypes = {
    actions: PropTypes.object,
    canUseExport: PropTypes.bool,
    exportPublicationsLoading: PropTypes.bool,
    history: PropTypes.object.isRequired,
    isAdvancedSearch: PropTypes.bool,
    isUnpublishedBufferPage: PropTypes.bool,
    location: PropTypes.object.isRequired,
    publicationsList: PropTypes.array,
    publicationsListFacets: PropTypes.object,
    publicationsListPagingData: PropTypes.object,
    searchLoading: PropTypes.bool,
    searchLoadingError: PropTypes.bool,
    searchQuery: PropTypes.object,
};

export default SearchRecords;
