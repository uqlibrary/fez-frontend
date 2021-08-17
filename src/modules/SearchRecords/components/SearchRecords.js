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
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
    FacetsFilter,
} from 'modules/SharedComponents/PublicationsList';

import { locale } from 'locale';
import { RecordsSelectorContext } from 'context';
import { userIsAdmin, userIsResearcher } from 'hooks';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';
import { pathConfig } from 'config';

/**
 * Parse provided query string and return active filters, facets etc
 * @returns object
 */
const parseSearchQueryStringFromUrl = (searchQuery, canBulkExport, isUnpublishedBufferPage) => {
    const providedSearchQuery = deparam(searchQuery);

    if (providedSearchQuery.hasOwnProperty('activeFacets')) {
        providedSearchQuery.activeFacets = {
            filters: providedSearchQuery.activeFacets.filters || {},
            ranges: providedSearchQuery.activeFacets.ranges || /* istanbul ignore next */ {},
            ...(providedSearchQuery.activeFacets.hasOwnProperty('showOpenAccessOnly')
                ? { showOpenAccessOnly: providedSearchQuery.activeFacets.showOpenAccessOnly === 'true' }
                : /* istanbul ignore next */ {}),
        };
    } else {
        providedSearchQuery.activeFacets = {
            filters: {},
            ranges: {},
        };
    }

    const pageSize = parseInt(providedSearchQuery.pageSize, 10);
    /* istanbul ignore if */
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

    providedSearchQuery.page =
        (providedSearchQuery.page && /* istanbul ignore next */ parseInt(providedSearchQuery.page, 10)) || 1;

    return providedSearchQuery;
};

export const SearchRecords = ({
    searchQuery,
    publicationsList,
    publicationsListFacets,
    publicationsListPagingData,
    exportPublicationsLoading,
    canUseExport,
    searchLoading,
    searchLoadingError,
    isAdvancedSearch,
    isUnpublishedBufferPage,
    location,
    history,
    actions,
}) => {
    const [state, setState] = React.useState({
        page: 1,
        pageSize: 20,
        sortBy: locale.components.sorting.sortBy[1].value,
        sortDirection: locale.components.sorting.sortDirection[0],
        activeFacets: {
            filters: {},
            ranges: {},
            ...{
                ...(((searchQuery || {}).activeFacets || {}).showOpenAccessOnly === 'true'
                    ? /* istanbul ignore next */ { showOpenAccessOnly: true }
                    : {}),
            },
        },
        advancedSearchFields: [],
        bulkExportSelected: false,
    });

    const successConfirmationBox = React.useRef(null);
    const updateSemaphore = React.useRef(false);

    const isAdmin = userIsAdmin();
    const isResearcher = userIsResearcher();

    React.useEffect(() => {
        if (!!location && location.search.indexOf('?') >= 0) {
            setState(
                parseSearchQueryStringFromUrl(
                    location.search.substr(1),
                    isResearcher || isAdmin,
                    isUnpublishedBufferPage,
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, isResearcher, isAdmin]);

    React.useEffect(() => {
        // handle browser back button - set state from location/dispatch action for this state
        /* istanbul ignore if */
        if (history.action === 'POP' && /* istanbul ignore next */ location.pathname === pathConfig.records.search) {
            if (location.state) {
                setState(
                    parseSearchQueryStringFromUrl(
                        param(location.state),
                        isResearcher || isAdmin,
                        isUnpublishedBufferPage,
                    ),
                );
            }

            actions.searchEspacePublications(state);
        } else {
            !!location.search &&
                location.search.length > 1 &&
                setState(
                    parseSearchQueryStringFromUrl(
                        location.search.substr(1),
                        isResearcher || isAdmin,
                        isUnpublishedBufferPage,
                    ),
                );
        }

        return actions.clearSearchQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, history.action]);

    const updateSearch = () => {
        actions.searchEspacePublications({ ...searchQuery, ...state });
    };

    const updateHistoryAndSearch = () => {
        history.push({
            pathname:
                location.pathname === pathConfig.admin.unpublished
                    ? /* istanbul ignore next */ pathConfig.admin.unpublished
                    : pathConfig.records.search,
            search: param(state),
            state,
        });
        if (state.pageSize !== PUB_SEARCH_BULK_EXPORT_SIZE) {
            updateSearch();
        }
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

    /* istanbul ignore next */
    const facetsChanged = activeFacets => {
        updateSemaphore.current = true;
        setState({
            ...state,
            activeFacets,
            page: 1,
        });
    };

    const _setSuccessConfirmation = ref => {
        successConfirmationBox.current = ref;
    };

    const handleExportPublications = exportFormat => {
        const exportResponse = actions.exportEspacePublications({
            ...exportFormat,
            ...state,
            pageSize: state.bulkExportSelected
                ? /* istanbul ignore next */ PUB_SEARCH_BULK_EXPORT_SIZE
                : state.pageSize,
        });

        state.bulkExportSelected &&
            /* istanbul ignore next */
            !!exportResponse &&
            /* istanbul ignore next */
            exportResponse.then(
                /* istanbul ignore next */ () => {
                    successConfirmationBox.current.showConfirmation();
                },
            );

        return exportResponse;
    };

    /* istanbul ignore next */
    const handleFacetExcludesFromSearchFields = searchFields => {
        const excludesFromLocale = locale.pages.searchRecords.facetsFilter.excludeFacetsList;
        // Iterate the searchfields and add their map from locale into the excluded facets array
        if (searchFields) {
            const importedFacetExcludes = [];
            Object.keys(searchFields).map(key => {
                if (searchFields[key].searchField) {
                    const fieldType =
                        locale.components.searchComponent.advancedSearch.fieldTypes[searchFields[key].searchField];
                    if (fieldType.map) {
                        importedFacetExcludes.push(fieldType.map);
                    }
                }
            });
            setState({
                ...state,
                advancedSearchFields: excludesFromLocale.concat(importedFacetExcludes),
            });
        }
    };

    const txt = locale.pages.searchRecords;
    const pagingData = publicationsListPagingData;
    const isLoadingOrExporting = searchLoading || exportPublicationsLoading;
    const hasSearchParams = !!searchQuery && searchQuery.constructor === Object && Object.keys(searchQuery).length > 0;
    const alertProps = searchLoadingError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(locale.global.errorMessages.generic),
    };
    const confirmationLocale = locale.components.sorting.bulkExportConfirmation;

    return (
        <StandardPage className="page-search-records">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard className="searchComponent" noHeader standardCardId="search-records-queries">
                        <SearchComponent
                            showAdvancedSearchButton
                            activeFacets={state.activeFacets}
                            searchLoading={searchLoading}
                            clearSearchQuery={actions.clearSearchQuery}
                            updateFacetExcludesFromSearchFields={handleFacetExcludesFromSearchFields}
                            isAdvancedSearch={isAdvancedSearch}
                            isAdmin={isAdmin}
                            isUnpublishedBufferPage={isUnpublishedBufferPage}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <ConfirmDialogBox locale={confirmationLocale} hideCancelButton onRef={_setSuccessConfirmation} />
                </Grid>
                {// first time loading search results
                !hasSearchParams && searchLoading && (
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
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
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
                                    {state.bulkExportSelected && (
                                        /* istanbul ignore next */ <span data-testid="search-bulk-export-size-message">
                                            {txt.bulkExportSizeMessage.replace(
                                                '[bulkExportSize]',
                                                PUB_SEARCH_BULK_EXPORT_SIZE,
                                            )}
                                        </span>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <PublicationsListSorting
                                        sortBy={state.sortBy}
                                        sortDirection={state.sortDirection}
                                        pageSize={state.pageSize}
                                        pagingData={pagingData}
                                        canUseExport={canUseExport}
                                        onSortByChanged={sortByChanged}
                                        onPageSizeChanged={pageSizeChanged}
                                        onExportPublications={handleExportPublications}
                                        disabled={isLoadingOrExporting}
                                        bulkExportSize={PUB_SEARCH_BULK_EXPORT_SIZE}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <PublicationsListPaging
                                        loading={isLoadingOrExporting}
                                        pagingData={pagingData}
                                        onPageChanged={pageChanged}
                                        disabled={isLoadingOrExporting || state.bulkExportSelected}
                                        pagingId="search-records-paging-top"
                                    />
                                </Grid>
                                {isLoadingOrExporting && (
                                    <Grid item xs={12}>
                                        <Grid container justify={'center'}>
                                            <Grid item xs={12}>
                                                <InlineLoader
                                                    message={
                                                        searchLoading
                                                            ? txt.loadingPagingMessage
                                                            : txt.exportPublicationsLoadingMessage
                                                    }
                                                    loaderId="search-records-page-loading"
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
                                                showAdminActions={isAdmin || isUnpublishedBufferPage}
                                                showUnpublishedBufferFields={isUnpublishedBufferPage}
                                                publicationsList={publicationsList}
                                            />
                                        </RecordsSelectorContext.Provider>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <PublicationsListPaging
                                        loading={isLoadingOrExporting}
                                        pagingData={pagingData}
                                        onPageChanged={pageChanged}
                                        disabled={isLoadingOrExporting || state.bulkExportSelected}
                                        pagingId="search-records-paging-bottom"
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
                {publicationsListFacets && Object.keys(publicationsListFacets).length !== 0 && (
                    <Hidden smDown>
                        <Grid item md={3}>
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={publicationsListFacets}
                                    onFacetsChanged={facetsChanged}
                                    activeFacets={state.activeFacets}
                                    disabled={isLoadingOrExporting}
                                    excludeFacetsList={
                                        (state.advancedSearchFields &&
                                            state.advancedSearchFields.length &&
                                            /* istanbul ignore next */
                                            state.advancedSearchFields) ||
                                        locale.pages.searchRecords.facetsFilter.excludeFacetsList
                                    }
                                    renameFacetsList={txt.facetsFilter.renameFacetsList}
                                    lookupFacetsList={txt.facetsFilter.lookupFacetsList}
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
    searchQuery: PropTypes.object,
    publicationsList: PropTypes.array,
    publicationsListFacets: PropTypes.object,
    publicationsListPagingData: PropTypes.object,
    exportPublicationsLoading: PropTypes.bool,
    canUseExport: PropTypes.bool,
    searchLoading: PropTypes.bool,
    searchLoadingError: PropTypes.bool,
    isAdvancedSearch: PropTypes.bool,
    isUnpublishedBufferPage: PropTypes.bool,

    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    actions: PropTypes.object,
};

export default SearchRecords;
