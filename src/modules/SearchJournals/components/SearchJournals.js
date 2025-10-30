import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/GridLegacy';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';
import { filterNonValidKeywords, useJournalSearch, useSelectedKeywords } from '../hooks';
import { clearJournalSearchKeywords, searchJournals } from 'actions';
import locale from 'locale/components';
import deparam from 'can-deparam';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useLocation } from 'react-router-dom';

export const KEYWORD_ALL_JOURNALS = { type: 'Keyword', text: 'all journals' };
export const KEYWORD_ALL_JOURNALS_ID = `${KEYWORD_ALL_JOURNALS.type}-${KEYWORD_ALL_JOURNALS.text.replace(/ /g, '-')}`;

export const areKeywordsDifferent = (keywords = {}, anotherKeywords = {}) => {
    const keywordsNames = Object.keys(keywords);
    const anotherKeywordsNames = Object.keys(anotherKeywords);
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
    const initialKeywords = React.useRef(filterNonValidKeywords(journalSearchQueryParams?.keywords || {}));
    const { selectedKeywords, setSelectedKeywords, handleKeywordAdd, handleKeywordDelete, hasAnySelectedKeywords } =
        useSelectedKeywords(journalSearchQueryParams?.keywords);
    const [showInputControls, setShowInputControls] = React.useState(!hasAnySelectedKeywords);
    const fromHandleKeywordDelete = React.useRef(false);
    const fromHandleKeywordClear = React.useRef(false);
    const fromHandleAllJournals = React.useRef(false);
    const [showingAllJournals, setShowingAllJournals] = React.useState(false);
    const allJournalsPageRefresh = React.useRef(!!initialKeywords.current[KEYWORD_ALL_JOURNALS_ID]);

    /**
     * On mount, check if we're arriving from a page refresh and
     * need to run the All Journals search - indicated
     * by the state of "showingAllJournals" being false while
     * the 'all keywords' keyword is actually in the URL
     */
    React.useEffect(() => {
        if (!!allJournalsPageRefresh.current) {
            setShowingAllJournals(true);
        }
        return () => dispatch(clearJournalSearchKeywords());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            setSelectedKeywords({});
            setShowInputControls(true);
            return;
        }

        if (!areKeywordsDifferent(keywordsFromUrl, selectedKeywords)) {
            return;
        }

        // if there are differences between selectedKeywords state variable
        // and the current search query keywords, update the state
        setSelectedKeywords(searchQueryParams.keywords);
        setShowInputControls(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

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
        // reset facets filter, paging and sorting when keywords are removed
        // or the All Journals button is pressed for the first time
        if (fromHandleKeywordDelete.current || fromHandleKeywordClear.current || fromHandleAllJournals.current) {
            delete journalSearchQueryParams.activeFacets;
            delete journalSearchQueryParams.page;
            delete journalSearchQueryParams.pageSize;
            delete journalSearchQueryParams.sortBy;
            delete journalSearchQueryParams.sortDirection;
        }

        if (showingAllJournals || allJournalsPageRefresh.current) {
            fromHandleAllJournals.current = false;
            delete journalSearchQueryParams.keywords;

            !!allJournalsPageRefresh && (allJournalsPageRefresh.current = false);
        }

        // add a delay when keywords are being removed
        // to avoid unnecessary load on the API
        lastRequest && clearTimeout(lastRequest);
        lastRequest = setTimeout(
            () => dispatch(searchJournals(journalSearchQueryParams)),
            fromHandleKeywordDelete.current ? 1200 : 0,
        );
        fromHandleKeywordDelete.current = fromHandleKeywordClear.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInputControls, hasAnySelectedKeywords, JSON.stringify(journalSearchQueryParams)]);

    const txt = locale.components.searchJournals;
    return (
        <StandardPage title={txt.journalSearchInterface.title} standardPageId="journal-search-page">
            <Grid container spacing={3}>
                {!!showInputControls && (
                    <Grid item xs>
                        <StandardCard noHeader standardCardId="journal-search-intro-card">
                            {txt.journalSearchInterface.intro}
                        </StandardCard>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <JournalSearchInterface
                        onSearch={handleSearchJournalsClick}
                        onSearchAll={handleSearchAllJournalsClick}
                        handleKeywordDelete={handleKeywordDeleteDecorator}
                        handleKeywordReset={handleKeywordResetClick}
                        browseAllJournals={showingAllJournals}
                        {...{
                            selectedKeywords,
                            handleKeywordAdd,
                            hasAnySelectedKeywords,
                            showInputControls,
                        }}
                    />
                </Grid>
                <Grid item xs>
                    {!showInputControls && (
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
