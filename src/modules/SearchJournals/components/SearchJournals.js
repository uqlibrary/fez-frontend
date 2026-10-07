import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';
import { filterNonValidKeywords, useJournalSearch, useSelectedKeywords } from '../hooks';
import { clearJournalSearchKeywords, searchJournals } from 'actions';
import locale from 'locale/components';
import deparam from 'can-deparam';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useLocation } from 'react-router';

export const KEYWORD_ALL_JOURNALS = { type: 'Keyword', text: 'all journals' };
export const KEYWORD_ALL_JOURNALS_ID = `${KEYWORD_ALL_JOURNALS.type}-${KEYWORD_ALL_JOURNALS.text.replace(/ /g, '-')}`;

export const areKeywordsDifferent = (keywords = {}, anotherKeywords = {}) => {
    const keywordsNames = Object.keys(keywords).map(key => `${key}-${keywords[key]?.operand}`);
    const anotherKeywordsNames = Object.keys(anotherKeywords).map(key => `${key}-${anotherKeywords[key]?.operand}`);
    return (
        keywordsNames.filter(keyword => !anotherKeywordsNames.includes(keyword)).length > 0 ||
        anotherKeywordsNames.filter(keyword => !keywordsNames.includes(keyword)).length > 0
    );
};

let lastRequest;
export const SearchJournals = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { journalSearchQueryParams, handleSearch } = useJournalSearch();
    const {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordUpdate,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    } = useSelectedKeywords(journalSearchQueryParams?.keywords);
    const isBrowsingAllJournals = !!journalSearchQueryParams?.keywords?.[KEYWORD_ALL_JOURNALS_ID];
    const [showInputControls, setShowInputControls] = React.useState(!hasAnySelectedKeywords);
    const fromHandleKeywordDelete = React.useRef(false);
    const fromHandleKeywordClear = React.useRef(false);
    const fromHandleAllJournals = React.useRef(false);
    const fromLocationChange = React.useRef(false);
    const [showingAllJournals, setShowingAllJournals] = React.useState(isBrowsingAllJournals);

    const handleKeywordAddDecorator = keyword => handleKeywordAdd(keyword, isBrowsingAllJournals);

    const handleKeywordDeleteDecorator = keyword => {
        handleKeywordDelete(keyword);
        if (keyword.id === KEYWORD_ALL_JOURNALS_ID) setShowingAllJournals(false);
        fromHandleKeywordDelete.current = true;
    };

    /**
     * Reset keywords and any state for All Journals
     */
    const handleKeywordResetClick = () => {
        setSelectedKeywords({});
        setShowingAllJournals(false);

        fromHandleKeywordClear.current = true;
    };

    /**
     * Setting selected keywords would re-render this page which should run effect to:
     *  - Set url query string params
     *  - Call load journal list action
     */
    const handleSearchJournalsClick = React.useCallback(() => {
        dispatch(clearJournalSearchKeywords());
        setShowInputControls(false);
        setSelectedKeywords(selectedKeywords);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     * Show all Journals with a click of a button. Has to:
     * - set stage flag
     */
    const handleSearchAllJournalsClick = React.useCallback(() => {
        setShowInputControls(false);
        setShowingAllJournals(true);
        setSelectedKeywords({});
        handleKeywordAdd(KEYWORD_ALL_JOURNALS);
        fromHandleAllJournals.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // clear any pending requests onUnmount
    React.useEffect(() => () => lastRequest && clearTimeout(lastRequest), []);

    /**
     * Update states based on the query url
     *   - e.g. back/forward buttons click
     */
    React.useEffect(() => {
        // get current search query
        const searchQueryParams = deparam(location.search.substr(1));
        const keywordsFromUrl = filterNonValidKeywords(searchQueryParams?.keywords);

        // make sure selected keywords are cleared if previous page doesnt have any query params
        if (!Object.keys(keywordsFromUrl).length) {
            setSelectedKeywords(prevSelectedKeywords => {
                if (Object.keys(prevSelectedKeywords || {}).length > 0) {
                    fromLocationChange.current = true;
                    return {};
                }
                return prevSelectedKeywords;
            });
            setShowInputControls(true);
            setShowingAllJournals(false);
            return;
        }

        setShowingAllJournals(isBrowsingAllJournals);
        if (!areKeywordsDifferent(keywordsFromUrl, selectedKeywords)) {
            return;
        }

        // if there are differences between selectedKeywords state variable
        // and the current search query keywords, update the state
        fromLocationChange.current = true;
        setSelectedKeywords(searchQueryParams.keywords);
        setShowInputControls(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    /**
     *  Hide search input controls if there aren't any selected keywords
     */
    React.useEffect(() => {
        if (!hasAnySelectedKeywords) {
            setShowInputControls(true);
        }
    }, [hasAnySelectedKeywords]);

    /**
     * Run this effect whenever keywords are changed
     */
    React.useEffect(() => {
        if (fromLocationChange.current) {
            fromLocationChange.current = false;
            return;
        }

        // preview back/forward/refresh to add new history
        if (
            !Object.keys(selectedKeywords).length &&
            !fromHandleAllJournals.current &&
            !fromHandleKeywordClear.current &&
            !fromHandleKeywordDelete.current
        ) {
            return;
        }

        // otherwise, update the query search
        handleSearch(
            {
                // make sure history reflects resetting facets filter, paging and sorting when keywords are removed
                // or if All Journals has been clicked, or keyword clear button clicked
                ...(fromHandleAllJournals.current || fromHandleKeywordClear.current || fromHandleKeywordDelete.current
                    ? {}
                    : journalSearchQueryParams),
                keywords: selectedKeywords,
            },
            {
                scrollToTop: false,
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     * Run this effect whenever url search query parameters are changed
     *  -  This should run everytime any parameter has changed (keywords, facets, page, pageSize etc)
     */
    React.useEffect(() => {
        if (!showInputControls && !hasAnySelectedKeywords) {
            dispatch(clearJournalSearchKeywords());

            return;
        }
        if (showInputControls || !hasAnySelectedKeywords) {
            fromHandleKeywordDelete.current = false;
            fromHandleKeywordClear.current = false;
            fromHandleAllJournals.current = false;

            return;
        }

        // Don't search until the URL keywords match the selected keywords.
        if (areKeywordsDifferent(journalSearchQueryParams.keywords, selectedKeywords)) {
            return;
        }

        // reset facets filter, paging and sorting when keywords are removed
        // or the All Journals button is pressed for the first time
        const journalSearchQueryParamsSnapshot = { ...journalSearchQueryParams };
        if (fromHandleKeywordDelete.current || fromHandleKeywordClear.current || fromHandleAllJournals.current) {
            delete journalSearchQueryParamsSnapshot.activeFacets;
            delete journalSearchQueryParamsSnapshot.page;
            delete journalSearchQueryParamsSnapshot.pageSize;
            delete journalSearchQueryParamsSnapshot.sortBy;
            delete journalSearchQueryParamsSnapshot.sortDirection;
        }

        if (isBrowsingAllJournals) {
            delete journalSearchQueryParamsSnapshot.keywords;
        }

        // add a delay when keywords are being removed
        // to avoid unnecessary load on the API
        lastRequest && clearTimeout(lastRequest);
        lastRequest = setTimeout(
            () => dispatch(searchJournals(journalSearchQueryParamsSnapshot)),
            fromHandleKeywordDelete.current ? 1200 : 0,
        );
        fromHandleKeywordDelete.current = fromHandleKeywordClear.current = fromHandleAllJournals.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        showInputControls,
        hasAnySelectedKeywords,
        JSON.stringify(journalSearchQueryParams), // eslint-disable-line react-hooks/exhaustive-deps
        JSON.stringify(selectedKeywords), // eslint-disable-line react-hooks/exhaustive-deps
    ]);

    const txt = locale.components.searchJournals;
    // Safety net: no selected keywords means we are in the initial (search-input) view, full stop.
    // Deriving the render from this - rather than relying only on the async showInputControls effects -
    // makes the "showInputControls=false with no keywords" stuck-state impossible (it only ever arose
    // from an effect-ordering race under CI load; every normal false state has keywords).
    const shouldShowInputControls = showInputControls || !hasAnySelectedKeywords;
    return (
        <StandardPage title={txt.journalSearchInterface.title} standardPageId="journal-search-page">
            <Grid container spacing={3}>
                {!!shouldShowInputControls && (
                    <Grid size="grow">
                        <StandardCard noHeader standardCardId="journal-search-intro-card">
                            {txt.journalSearchInterface.intro}
                        </StandardCard>
                    </Grid>
                )}
                <Grid size={12}>
                    <JournalSearchInterface
                        onSearch={handleSearchJournalsClick}
                        onSearchAll={handleSearchAllJournalsClick}
                        handleKeywordDelete={handleKeywordDeleteDecorator}
                        handleKeywordReset={handleKeywordResetClick}
                        browseAllJournals={showingAllJournals}
                        {...{
                            selectedKeywords,
                            handleKeywordAdd: handleKeywordAddDecorator,
                            handleKeywordUpdate,
                            hasAnySelectedKeywords,
                            showInputControls: shouldShowInputControls,
                        }}
                    />
                </Grid>
                <Grid size="grow">
                    {!shouldShowInputControls && (
                        <JournalSearchResult
                            onSearch={handleSearch}
                            onSearchAll={handleSearchAllJournalsClick}
                            browseAllJournals={showingAllJournals}
                        />
                    )}
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
