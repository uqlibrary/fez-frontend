import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { SearchComponent } from 'modules/SharedComponents/SearchComponent';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import {
    FacetsFilter,
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
} from 'modules/SharedComponents/PublicationsList';
import { BulkExport } from 'modules/BulkExport';
import { locale } from 'locale';
import { RecordsSelectorContext } from 'context';

import { userIsAdmin, userIsResearcher, userIsAuthor } from 'hooks';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from 'config/general';
import { getAdvancedSearchFields, getQueryParams, useQueryStringParams, useSearchRecordsControls } from '../hooks';
import hash from 'hash-sum';
import ImageGallery from 'modules/SharedComponents/ImageGallery/ImageGallery';

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
    publicationsListDefaultView,
    searchLoading,
    searchLoadingError,
    searchQuery,
}) => {
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();

    const isResearcher = userIsResearcher();
    const canBulkExport = isResearcher || isAdmin;
    const { queryParams, updateQueryString } = useQueryStringParams(
        history,
        location,
        searchQuery?.activeFacets?.showOpenAccessOnly === 'true',
        canBulkExport,
        isUnpublishedBufferPage,
    );
    const queryParamsHash = hash(queryParams);
    const [searchParams, setSearchParams] = useState(queryParams);

    const {
        pageSizeChanged,
        pageChanged,
        sortByChanged,
        facetsChanged,
        handleExport,
        displayRecordsAsChanged,
    } = useSearchRecordsControls(queryParams, updateQueryString, actions);
    const handleFacetExcludesFromSearchFields = searchFields => {
        !!searchFields &&
            setSearchParams({
                ...queryParams,
                advancedSearchFields: getAdvancedSearchFields(searchFields),
            });
    };

    /**
     * Effect to handle initial render
     */
    React.useEffect(() => {
        actions.searchEspacePublications(queryParams);
        return actions.clearSearchQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Effect handle history updates:
     * - it will save the state of the URI's query params
     * - it will dispatch a request to the API on changes
     */
    React.useEffect(() => {
        return history.listen(location => {
            // we can't use location.state to send state around,
            // as state changes are async and might not be up-to-date
            const queryParams = getQueryParams(
                location.search.substr(1),
                canBulkExport,
                isUnpublishedBufferPage,
                searchQuery?.activeFacets?.showOpenAccessOnly === 'true',
            );
            setSearchParams(queryParams);
            actions.searchEspacePublications(queryParams);
            actions.clearSearchQuery();
            actions.resetExportPublicationsStatus();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParamsHash]);

    const txt = locale.pages.searchRecords;
    const pagingData = publicationsListPagingData;
    const isLoadingOrExporting = searchLoading || exportPublicationsLoading;
    const hasSearchParams = !!location.search;
    const alertProps = searchLoadingError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(locale.global.errorMessages.generic),
    };
    const initSortingData = locale.components.sorting;
    const displayLookup = searchParams.displayRecordsAs ?? publicationsListDefaultView?.lookup ?? null;
    const newSortingData = initSortingData.sortBy.filter(option =>
        option.exclude ? option.exclude.some(item => item !== displayLookup) : true,
    );
    const sortingData = { ...initSortingData, sortBy: newSortingData };

    const SelectRecordView = publicationsList => {
        switch (displayLookup) {
            case 'image-gallery':
                return <ImageGallery publicationsList={publicationsList} security={{ isAdmin, isAuthor }} />;
            case 'auto':
            case 'standard':
            default:
                return (
                    <PublicationsList
                        publicationsList={publicationsList}
                        showAdminActions={isAdmin || isUnpublishedBufferPage}
                        showUnpublishedBufferFields={isUnpublishedBufferPage}
                        showImageThumbnails
                        security={{ isAdmin, isAuthor }}
                    />
                );
        }
    };

    return (
        <StandardPage className="page-search-records">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard className="searchComponent" noHeader standardCardId="search-records-queries">
                        <SearchComponent
                            activeFacets={searchParams.activeFacets}
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
                            <Grid container spacing={2} justifyContent="space-between">
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
                                            exportPublications={handleExport}
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
                                        onExportPublications={handleExport}
                                        onPageSizeChanged={pageSizeChanged}
                                        onSortByChanged={sortByChanged}
                                        onDisplayRecordsAsChanged={displayRecordsAsChanged}
                                        pageSize={searchParams.pageSize}
                                        pagingData={pagingData}
                                        sortBy={searchParams.sortBy}
                                        sortDirection={searchParams.sortDirection}
                                        displayRecordsAs={searchParams.displayRecordsAs}
                                        sortingData={sortingData}
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
                                        <Grid container justifyContent={'center'}>
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
                                            {SelectRecordView(publicationsList)}
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
                                    activeFacets={searchParams.activeFacets}
                                    disabled={isLoadingOrExporting}
                                    excludeFacetsList={
                                        (searchParams.advancedSearchFields &&
                                            searchParams.advancedSearchFields.length &&
                                            searchParams.advancedSearchFields) ||
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
    publicationsListDefaultView: PropTypes.object,
    searchLoading: PropTypes.bool,
    searchLoadingError: PropTypes.bool,
    searchQuery: PropTypes.object,
};

export default SearchRecords;
