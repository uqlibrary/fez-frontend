import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import deparam from 'can-deparam';
import param from 'can-param';
import { exportJournals } from '../../actions';
import { pathConfig } from '../../config';

export const useJournalSearchInterfaceState = initialState => {
    const [showKeywordsBrowser, setKeywordsBrowserVisibility] = React.useState(initialState);
    const [showJournalSearchInput, setJournalSearchInputVisibility] = React.useState(initialState);
    const [showButtons, setButtonsVisibility] = React.useState(initialState);

    const toggleKeywordsBrowser = () => setKeywordsBrowserVisibility(on => !on);
    const toggleJournalSearchInput = () => setJournalSearchInputVisibility(on => !on);
    const toggleButtons = () => setButtonsVisibility(on => !on);

    return {
        showKeywordsBrowser,
        showJournalSearchInput,
        showButtons,
        toggleJournalSearchInput,
        toggleKeywordsBrowser,
        toggleButtons,
    };
};

export const useSelectedKeywords = (initialKeywords = {}) => {
    const [selectedKeywords, setSelectedKeywords] = React.useState(initialKeywords);

    const getKeywordKey = keyword => `${keyword.type}-${keyword.text.replace(/ /g, '-')}`;

    const handleKeywordAdd = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => ({
                ...prevSelectedKeywords,
                [getKeywordKey(keyword)]: { ...keyword, id: getKeywordKey(keyword) },
            })),
        [],
    );

    const handleKeywordDelete = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => {
                const newSelectedKeywords = { ...prevSelectedKeywords };
                delete newSelectedKeywords[keyword.id];
                return { ...newSelectedKeywords };
            }),
        [],
    );

    const hasAnySelectedKeywords = Object.values(selectedKeywords).length > 0;

    return {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    };
};

export const useSelectedJournals = (state = {}) => {
    const [selectedJournals, setSelectedJournals] = React.useState(state);

    const clearSelectedJournals = () => setSelectedJournals({});
    const handleSelectedJournalsChange = React.useCallback(e => {
        if (e.target.checked) {
            setSelectedJournals(current => {
                const selected = { ...current };
                selected[e.target.value] = true;
                return selected;
            });
            return;
        }

        setSelectedJournals(current => {
            const selected = { ...current };
            delete selected[e.target.value];
            return selected;
        });
    }, []);

    const countSelectedJournals = () => Object.values(selectedJournals).length;

    return {
        selectedJournals,
        setSelectedJournals,
        clearSelectedJournals,
        handleSelectedJournalsChange,
        countSelectedJournals,
    };
};

export const useJournalSearch = (path = pathConfig.journals.search) => {
    const history = useHistory();
    const location = useLocation();
    const searchQueryParams = deparam(location.search.substr(1));
    const journalSearchQueryParams = {
        ...searchQueryParams,
        activeFacets: {
            filters: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.filters) || {},
            ranges: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.ranges) || {},
            ...(searchQueryParams.activeFacets && searchQueryParams.activeFacets.hasOwnProperty('showFavouritedOnly')
                ? { showFavouritedOnly: searchQueryParams.activeFacets.showFavouritedOnly === 'true' }
                : {}),
        },
    };

    const handleSearch = searchQuery => {
        history.push({
            pathname: path,
            search: param(searchQuery),
        });
    };

    return {
        journalSearchQueryParams,
        locationKey: location.key,
        handleSearch,
    };
};

export const useJournalSearchControls = (onSearch, journalSearchQueryParams) => {
    const dispatch = useDispatch();
    const updateSemaphore = React.useRef(false);

    const handleExport = exportFormat => {
        dispatch(
            exportJournals({
                ...journalSearchQueryParams,
                ...exportFormat,
            }),
        );
    };

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

    const facetsChanged = activeFacets => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            activeFacets: { ...activeFacets },
            page: 1,
        });
    };

    return { handleExport, pageSizeChanged, pageChanged, sortByChanged, facetsChanged };
};
