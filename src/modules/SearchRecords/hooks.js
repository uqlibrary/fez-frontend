import { useHistory, useLocation } from 'react-router';
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

/**
 * @param searchFields
 * @return {string[]}
 */
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

/**
 * @param showOpenAccessOnly
 * @return Object
 */
export const queryParamsDefaults = showOpenAccessOnly => ({
    activeFacets: {
        filters: {},
        ranges: {},
        showOpenAccessOnly: showOpenAccessOnly,
    },
    advancedSearchFields: [],
    bulkExportSelected: false,
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
export const getQueryParams = (showOpenAccessOnly, queryString, canBulkExport, isUnpublishedBufferPage) => ({
    ...queryParamsDefaults(showOpenAccessOnly),
    ...parseSearchQueryStringFromUrl(queryString, canBulkExport, isUnpublishedBufferPage),
});

/**
 * @param activeFacets
 * @param canBulkExport
 * @param isUnpublishedBufferPage
 * @return Object
 */
export const useQueryStringParams = (showOpenAccessOnly, canBulkExport, isUnpublishedBufferPage) => {
    const history = useHistory();
    const location = useLocation();

    const queryParams = getQueryParams(
        showOpenAccessOnly,
        location.search.substr(1),
        canBulkExport,
        isUnpublishedBufferPage,
    );

    const updateQueryString = queryParams => {
        console.log('updateQueryString:' + param(queryParams));
        history.push({
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
 * @param searchQueryParams
 * @param updateQueryParamsState
 * @param actions
 * @return Object
 */
export const useSearchRecordsControls = (searchQueryParams, updateQueryParamsState, actions) => {
    const pageSizeChanged = pageSize => {
        updateQueryParamsState({
            ...searchQueryParams,
            pageSize,
            page: 1,
        });
    };

    const pageChanged = page => {
        updateQueryParamsState({
            ...searchQueryParams,
            page,
        });
    };

    const sortByChanged = (sortBy, sortDirection) => {
        updateQueryParamsState({
            ...searchQueryParams,
            sortBy,
            sortDirection,
        });
    };

    const facetsChanged = activeFacets => {
        updateQueryParamsState({
            ...searchQueryParams,
            activeFacets,
            page: 1,
        });
    };

    const handleExport = exportFormat =>
        actions.exportEspacePublications({
            ...searchQueryParams,
            ...exportFormat,
        });

    const handleFacetExcludesFromSearchFields = searchFields => {
        !!searchFields &&
            updateQueryParamsState({
                ...searchQueryParams,
                advancedSearchFields: getAdvancedSearchFields(searchFields),
            });
    };

    return {
        pageSizeChanged,
        pageChanged,
        sortByChanged,
        facetsChanged,
        handleExport,
        handleFacetExcludesFromSearchFields,
    };
};
