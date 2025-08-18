import deparam from 'can-deparam';
import param from 'can-param';
import { pathConfig } from 'config';
import { locale } from '../../locale';
import { PUB_SEARCH_BULK_EXPORT_SIZE } from '../../config/general';

/**
 * Parse provided query string and return active filters, facets etc
 * @returns object
 */
export const parseSearchQueryStringFromUrl = (queryString, canBulkExport = false, isUnpublishedBufferPage = false) => {
    if (!queryString.length) {
        return {};
    }

    const providedSearchQuery = deparam(queryString);
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
        delete providedSearchQuery.bulkExportSelected;
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

/**
 * @param showOpenAccessOnly
 * @return Object
 */
export const queryParamsDefaults = showOpenAccessOnly => ({
    activeFacets: {
        filters: {},
        ranges: {},
        ...(showOpenAccessOnly ? { showOpenAccessOnly: true } : {}),
    },
    page: 1,
    pageSize: 20,
    sortBy: locale.components.sorting.sortBy[1].value,
    sortDirection: locale.components.sorting.sortDirection[0],
});

/**
 *
 * @param showOpenAccessOnly
 * @param queryString
 * @param canBulkExport
 * @param isUnpublishedBufferPage
 * @return Object
 */
export const getQueryParams = (queryString, canBulkExport, isUnpublishedBufferPage, showOpenAccessOnly) => ({
    ...queryParamsDefaults(showOpenAccessOnly),
    ...parseSearchQueryStringFromUrl(queryString, canBulkExport, isUnpublishedBufferPage),
});

/**
 * @param navigate
 * @param location
 * @param showOpenAccessOnly
 * @param canBulkExport
 * @param isUnpublishedBufferPage
 * @return Object
 */
export const useQueryStringParams = (
    navigate,
    location,
    showOpenAccessOnly,
    canBulkExport,
    isUnpublishedBufferPage,
) => {
    const queryParams = getQueryParams(
        location.search.substr(1),
        canBulkExport,
        isUnpublishedBufferPage,
        showOpenAccessOnly,
    );

    const updateQueryString = queryParams => {
        navigate({
            pathname:
                location.pathname === pathConfig.admin.unpublished
                    ? pathConfig.admin.unpublished
                    : pathConfig.records.search,
            search: param(queryParams),
        });
    };

    return {
        queryParams: queryParams,
        updateQueryString,
    };
};

/**
 * @param queryParams
 * @param updateQueryString
 * @param actions
 * @return Object
 */
export const useSearchRecordsControls = (queryParams, updateQueryString) => {
    const pageSizeChanged = pageSize => {
        updateQueryString({
            ...queryParams,
            pageSize,
            page: 1,
        });
    };

    const pageChanged = page => {
        updateQueryString({
            ...queryParams,
            page,
        });
    };

    const sortByChanged = (sortBy, sortDirection) => {
        updateQueryString({
            ...queryParams,
            sortBy,
            sortDirection,
        });
    };

    const facetsChanged = activeFacets => {
        updateQueryString({
            ...queryParams,
            activeFacets,
            page: 1,
        });
    };

    const displayRecordsAsChanged = displayRecordsAs => {
        updateQueryString({
            ...queryParams,
            displayRecordsAs,
        });
    };

    return {
        pageSizeChanged,
        pageChanged,
        sortByChanged,
        facetsChanged,
        displayRecordsAsChanged,
    };
};
