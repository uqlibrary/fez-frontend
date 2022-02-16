import React from 'react';
import { useHistory, useLocation } from 'react-router';
import deparam from 'can-deparam';
import param from 'can-param';
import { pathConfig } from '../../config';
export const useCommunityCollectionsSearch = (path = pathConfig.communityCollections.communityListUrl) => {
    const history = useHistory();
    const location = useLocation();
    const searchQueryParams = deparam(location.search.substr(1));

    const journalSearchQueryParams = {
        ...searchQueryParams,
        // activeFacets: {
        //     filters: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.filters) || {},
        //     ranges: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.ranges) || {},
        //     ...(searchQueryParams.activeFacets &&
        //     searchQueryParams.activeFacets.filters &&
        //     searchQueryParams.activeFacets.filters.hasOwnProperty('showFavouritedOnly')
        //         ? { filters: { showFavouritedOnly: searchQueryParams.activeFacets.showFavouritedOnly === 'true' } }
        //         : {}),
        // },
    };

    const handleSearch = searchQuery => {
        history.push({
            pathname: path,
            search: param(searchQuery),
            state: {
                source: 'code',
            },
        });
    };

    return {
        journalSearchQueryParams,
        locationKey: location.key,
        handleSearch,
    };
};
export const useCommunityCollectionsSearchControls = (onSearch, journalSearchQueryParams) => {
    // const dispatch = useDispatch();
    const updateSemaphore = React.useRef(false);

    // const handleExport = exportFormat => {
    //     dispatch(
    //         exportJournals({
    //             ...journalSearchQueryParams,
    //             ...exportFormat,
    //         }),
    //     );
    // };

    const pageSizeChanged = pageSize => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            pageSize: pageSize,
            page: 1,
        });
    };

    const pageChanged = page => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            page: page,
        });
    };

    const sortByChanged = (sortBy, sortDirection) => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            sortBy: sortBy,
            sortDirection: sortDirection,
        });
    };
    return { pageSizeChanged, pageChanged, sortByChanged };
};
