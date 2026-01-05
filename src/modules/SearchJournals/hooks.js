import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import deparam from 'can-deparam';
import param from 'can-param';
import { exportJournals } from 'actions/journals';
import { pathConfig } from 'config';
import { getDefaultOperand } from 'helpers/journalSearch';
import { JOURNAL_SEARCH_OPERANDS } from 'config/general';

export const isValidKeyword = keyword =>
    typeof keyword === 'object' && keyword.id && keyword.type && keyword.text && keyword.operand
        ? JOURNAL_SEARCH_OPERANDS.includes(keyword.operand)
        : true;

export const filterNonValidKeywords = keywords => {
    if (typeof keywords !== 'object') {
        return {};
    }
    return Object.keys(keywords)
        .filter(name => {
            return isValidKeyword(keywords[name]);
        })
        .reduce((valid, name) => {
            valid[name] = keywords[name];
            return valid;
        }, {});
};

export const useSelectedKeywords = (initialKeywords = {}) => {
    const [selectedKeywords, setSelectedKeywords] = React.useState(filterNonValidKeywords(initialKeywords));

    const getKeywordKey = keyword =>
        keyword.cvoId ? `${keyword.type}-${keyword.cvoId}` : `${keyword.type}-${keyword.text.replace(/ /g, '-')}`;

    const handleKeywordAdd = React.useCallback(keyword => {
        setSelectedKeywords(prevSelectedKeywords => ({
            ...prevSelectedKeywords,
            [getKeywordKey(keyword)]: {
                ...keyword,
                id: getKeywordKey(keyword),
                operand: getDefaultOperand(keyword.type),
            },
        }));
    }, []);

    const handleKeywordDelete = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => {
                const newSelectedKeywords = { ...prevSelectedKeywords };
                delete newSelectedKeywords[keyword.id];
                return { ...newSelectedKeywords };
            }),
        [],
    );

    const handleKeywordUpdate = React.useCallback(
        keyword =>
            setSelectedKeywords(prevSelectedKeywords => {
                const newSelectedKeywords = { ...prevSelectedKeywords };
                newSelectedKeywords[keyword.id] = { ...keyword };
                return { ...newSelectedKeywords };
            }),
        [],
    );

    const hasAnySelectedKeywords = selectedKeywords && Object.values(selectedKeywords).length > 0;

    return {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordUpdate,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    };
};

export const useSelectedJournals = ({ state = {}, available = {} }) => {
    const [selectedJournals, setSelectedJournals] = React.useState(state);
    const [isAllSelected, setIsAllSelected] = React.useState(false);

    const countSelectedJournals = React.useCallback(() => Object.values(selectedJournals).length, [selectedJournals]);
    const clearSelectedJournals = React.useCallback(() => {
        setIsAllSelected(false);
        setSelectedJournals({});
    }, []);

    const handleToggleSelectAllJournals = React.useCallback(() => {
        if (isAllSelected) {
            clearSelectedJournals();
            return;
        }

        setSelectedJournals(
            available?.map(journal => ({ [journal.jnl_jid]: true })).reduce((all, item) => ({ ...all, ...item }), {}),
        );
        setIsAllSelected(true);
    }, [clearSelectedJournals, available, isAllSelected]);

    const handleSelectedJournalsChange = React.useCallback(
        e => {
            if (e.target.checked) {
                setSelectedJournals(current => {
                    const selected = { ...current };
                    selected[e.target.value] = true;
                    return selected;
                });
                // countSelectedJournals() + 1 because selectedJournals is not instantly updated
                // upon setSelectedJournals is called
                /* istanbul ignore else */
                if (available.length > 0 && available.length === countSelectedJournals() + 1) {
                    setIsAllSelected(true);
                }
                return;
            } else {
                setSelectedJournals(current => {
                    const selected = { ...current };
                    delete selected[e.target.value];
                    return selected;
                });
                setIsAllSelected(false);
            }
        },
        [available.length, countSelectedJournals],
    );

    return {
        selectedJournals,
        isAllSelected,
        handleSelectedJournalsChange,
        clearSelectedJournals,
        countSelectedJournals,
        handleToggleSelectAllJournals,
    };
};

/**
 * @typedef {{[p: string]: string, activeFacets: {ranges: (*|{}), filters: (*|{})}}} JournalSearchQueryParams
 * @param path
 * @return {{
 *   handleSearch: handleSearch,
 *   locationKey: *,
 *   journalSearchQueryParams: JournalSearchQueryParams
 * }}
 */
export const useJournalSearch = (path = pathConfig.journals.search) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchQueryParams = deparam(location.search.substr(1));

    Object.keys(searchQueryParams.keywords || {}).map(
        key =>
            (searchQueryParams.keywords[key].operand =
                searchQueryParams.keywords[key].operand ?? getDefaultOperand(searchQueryParams.keywords[key].type)),
    );

    const journalSearchQueryParams = {
        ...searchQueryParams,
        activeFacets: {
            filters: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.filters) || {},
            ranges: (searchQueryParams.activeFacets && searchQueryParams.activeFacets.ranges) || {},
        },
    };

    const handleSearch = (searchQuery, state = {}) => {
        navigate({ pathname: path, search: param(searchQuery) }, { state: state });
    };

    return {
        journalSearchQueryParams,
        locationKey: location.key,
        handleSearch,
    };
};

/**
 * @param onSearch {(params: JournalSearchQueryParams) = >void}
 * @param journalSearchQueryParams {JournalSearchQueryParams}
 * @param favourites
 * @param allJournals
 * @return {{
 *   pageChanged: pageChanged,
 *   handleExport: handleExport,
 *   facetsChanged: facetsChanged,
 *   pageSizeChanged: pageSizeChanged,
 *   sortByChanged: sortByChanged
 * }}
 */
export const useJournalSearchControls = (onSearch, journalSearchQueryParams, favourites, allJournals = false) => {
    const dispatch = useDispatch();
    const updateSemaphore = React.useRef(false);

    const handleExport = exportFormat => {
        dispatch(
            exportJournals(
                {
                    ...journalSearchQueryParams,
                    ...exportFormat,
                },
                favourites,
                allJournals,
            ),
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

export const useActiveFacetFilters = state => useState(state);
