import deparam from 'can-deparam';
import { locale } from '../../../../locale';
import { useDispatch } from 'react-redux';
import { COMMUNITY_COLLECTION_BULK_EXPORT_SIZE } from '../../../../config/general';

/**
 * Parse provided query string and return active filters, facets etc
 * @returns object
 */
export const parseSearchQueryStringFromUrl = queryString => {
    if (!queryString.length) {
        return {};
    }

    const providedSearchQuery = deparam(queryString);

    const pageSize = parseInt(providedSearchQuery.pageSize, 10);
    if (pageSize === COMMUNITY_COLLECTION_BULK_EXPORT_SIZE) {
        providedSearchQuery.bulkExportSelected = true;
        providedSearchQuery.pageSize = COMMUNITY_COLLECTION_BULK_EXPORT_SIZE;
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

    providedSearchQuery.page = (providedSearchQuery.page && parseInt(providedSearchQuery.page, 10)) || 1;
    return providedSearchQuery;
};

/**
 * @param showOpenAccessOnly
 * @return Object
 */
export const queryParamsDefaults = () => ({
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
export const getQueryParams = queryString => ({
    ...queryParamsDefaults(),
    ...parseSearchQueryStringFromUrl(queryString),
});

/**
 * @param activeFacets
 * @param canBulkExport
 * @param isUnpublishedBufferPage
 * @return Object
 */
export const useQueryStringParams = location => {
    const queryParams = getQueryParams(location.search.substr(1));

    return {
        queryParams: queryParams,
    };
};

/**
 * @param queryParams
 * @param actions
 * @return Object
 */
export const useCommunityCollectionControls = (queryParams, actions) => {
    const dispatch = useDispatch();
    const handleCommunityExport = exportFormat =>
        dispatch(
            actions.exportCommunityRecords({
                ...queryParams,
                ...exportFormat,
            }),
        );
    const handleCollectionExport = exportFormat =>
        dispatch(
            actions.exportCollectionRecords({
                ...queryParams,
                ...exportFormat,
            }),
        );
    return {
        handleCommunityExport,
        handleCollectionExport,
    };
};
