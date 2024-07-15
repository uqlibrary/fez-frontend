import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from 'actions';

import Grid from '@mui/material/Grid';
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
import { PUB_SEARCH_BULK_EXPORT_SIZE, COLLECTION_VIEW_TYPE } from 'config/general';
import { getQueryParams, useQueryStringParams, useSearchRecordsControls } from '../hooks';
import hash from 'hash-sum';
import ImageGallery from 'modules/SharedComponents/ImageGallery/ImageGallery';
import { useNavigate, useLocation } from 'react-router-dom';
import { pathConfig } from 'config/pathConfig';

/*
a method to ensure we only use the view type strings as
defined in general.js. This is used both by the code when loading
a result directly, and when the user changes the display type via
the UI - which also updates the querystring, hence the need for
a normalised value there
*/
export const normaliseDisplayLookup = raw => {
    if (!!!raw) return COLLECTION_VIEW_TYPE[0].value;

    return (
        COLLECTION_VIEW_TYPE.filter(viewType => viewType.id === raw || viewType.value === raw)?.[0]?.value ??
        COLLECTION_VIEW_TYPE[0].value
    );
};
const SearchRecords = ({ canUseExport = true, isAdvancedSearch, publicationsListDefaultView, searchQuery }) => {
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isUnpublishedBufferPage = location.pathname === pathConfig.admin.unpublished;

    const isResearcher = userIsResearcher();
    const canBulkExport = isResearcher || isAdmin;
    const { queryParams, updateQueryString } = useQueryStringParams(
        navigate,
        location,
        searchQuery?.activeFacets?.showOpenAccessOnly === 'true',
        canBulkExport,
        isUnpublishedBufferPage,
    );

    const {
        publicationsList,
        publicationsListPagingData,
        publicationsListFacets,
        searchLoading,
        searchLoadingError,
    } = useSelector(state => state.get('searchRecordsReducer'));
    const { exportPublicationsLoading } = useSelector(state => state.get('exportPublicationsReducer'));
    const { account, author } = useSelector(state => state.get('accountReducer'));

    const queryParamsHash = hash(queryParams);
    const [searchParams, setSearchParams] = useState(queryParams);
    const [userSelectedDisplayAs, setUserSelectedDisplayAs] = React.useState(null);

    React.useEffect(() => {
        // This effect ensures the change to display type in the UI, followed by search term text change,
        // maintains the user chosen display preference in the results.
        if (!!userSelectedDisplayAs && userSelectedDisplayAs !== queryParams.displayRecordsAs) {
            updateQueryString({ ...queryParams, displayRecordsAs: userSelectedDisplayAs });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParamsHash]);

    const {
        pageSizeChanged,
        pageChanged,
        sortByChanged,
        facetsChanged,
        handleExport,
        displayRecordsAsChanged,
    } = useSearchRecordsControls(queryParams, updateQueryString, actions);

    /**
     * Handle the user changing the Display As view type via the UI.
     * This function saves the user choice to state and then forwards
     * that choice on to the function defined in useSearchRecordsControls.
     * The state value is used as a user-choice override for any other
     * displayAs values coming from either the URL or any Collection record
     * being searched upon.
     * @param {string} displayAs - the string value of the selected option
     */
    const onDisplayRecordsAsChanged = displayAs => {
        setUserSelectedDisplayAs(displayAs === 'auto' ? /* istanbul ignore next */ null : displayAs);
        displayRecordsAsChanged(displayAs);
    };

    /**
     * Effect to handle initial render
     */
    React.useEffect(() => {
        // actions.searchEspacePublications(queryParams);
        return dispatch(actions.clearSearchQuery());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Effect handle history updates:
     * - it will save the state of the URI's query params
     * - it will dispatch a request to the API on changes
     */
    React.useEffect(() => {
        // Don't mess with location if the user is clicking a link to view record details.
        // PT #182603156
        /* istanbul ignore else */
        if (!location.pathname.startsWith('/view/')) {
            // we can't use location.state to send state around,
            // as state changes are async and might not be up-to-date
            const queryParams = getQueryParams(
                location.search.substr(1),
                canBulkExport,
                isUnpublishedBufferPage,
                searchQuery?.activeFacets?.showOpenAccessOnly === 'true',
            );
            setSearchParams({ ...queryParams });
            dispatch(actions.searchEspacePublications(queryParams));
            dispatch(actions.clearSearchQuery());
            dispatch(actions.resetExportPublicationsStatus());
        }
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

    const displayLookup = normaliseDisplayLookup(
        userSelectedDisplayAs ??
            (searchParams.displayRecordsAs === 'auto' ? null : searchParams.displayRecordsAs) ??
            publicationsListDefaultView?.id ??
            null,
    );
    const newSortingData = initSortingData.sortBy.filter(option =>
        option.exclude ? option.exclude.some(item => item !== displayLookup) : true,
    );
    const sortingData = { ...initSortingData, sortBy: newSortingData };

    const SelectRecordView = publicationsList => {
        switch (displayLookup) {
            case 'image-gallery':
                return (
                    <ImageGallery
                        publicationsList={publicationsList}
                        security={{ isAdmin: !!isAdmin, isAuthor: !!isAuthor, author, account }}
                    />
                );
            case 'auto':
            case 'standard':
            default:
                return (
                    <PublicationsList
                        publicationsList={publicationsList}
                        showAdminActions={isAdmin || isUnpublishedBufferPage}
                        showUnpublishedBufferFields={isUnpublishedBufferPage}
                        showImageThumbnails
                        security={{ isAdmin, isAuthor, author, account }}
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
                            isAdmin={isAdmin}
                            isAdvancedSearch={isAdvancedSearch}
                            isUnpublishedBufferPage={isUnpublishedBufferPage}
                            searchLoading={searchLoading}
                            showAdvancedSearchButton
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
                                            disabled={isLoadingOrExporting}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <PublicationsListSorting
                                        showDisplayAs
                                        canUseExport={canUseExport}
                                        disabled={isLoadingOrExporting}
                                        onExportPublications={handleExport}
                                        onPageSizeChanged={pageSizeChanged}
                                        onSortByChanged={sortByChanged}
                                        onDisplayRecordsAsChanged={onDisplayRecordsAsChanged}
                                        pageSize={searchParams.pageSize}
                                        pagingData={pagingData}
                                        sortBy={searchParams.sortBy}
                                        sortDirection={searchParams.sortDirection}
                                        displayRecordsAs={displayLookup}
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
                    <Grid
                        item
                        md={3}
                        id="refine-results-facets"
                        data-testid="refine-results-facets"
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                            <FacetsFilter
                                activeFacets={searchParams.activeFacets}
                                disabled={isLoadingOrExporting}
                                excludeFacetsList={locale.pages.searchRecords.facetsFilter.excludeFacetsList}
                                facetsData={publicationsListFacets}
                                lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                onFacetsChanged={facetsChanged}
                                renameFacetsList={txt.facetsFilter.renameFacetsList}
                                showOpenAccessFilter
                            />
                        </StandardRighthandCard>
                    </Grid>
                )}
            </Grid>
        </StandardPage>
    );
};

SearchRecords.propTypes = {
    canUseExport: PropTypes.bool,
    isAdvancedSearch: PropTypes.bool,
    publicationsListDefaultView: PropTypes.object,
    searchQuery: PropTypes.object,
};

export default SearchRecords;
