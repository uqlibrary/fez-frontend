import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';
import { filterNonValidKeywords, useJournalSearch, useSelectedKeywords } from '../hooks';
import { searchJournals } from 'actions';
import locale from 'locale/components';
import deparam from 'can-deparam';
import { useHistory } from 'react-router';

const areKeywordsDifferent = (keywords, anotherKeywords) => {
    const keywordsNames = Object.keys(keywords || {});
    const anotherKeywordsNames = Object.keys(anotherKeywords || {});
    return (
        keywordsNames.filter(keyword => !anotherKeywordsNames.includes(keyword)).length > 0 ||
        anotherKeywordsNames.filter(keyword => !keywordsNames.includes(keyword)).length > 0
    );
};

export const SearchJournals = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { journalSearchQueryParams, handleSearch } = useJournalSearch();
    const initialKeywords = React.useRef(filterNonValidKeywords(journalSearchQueryParams?.keywords || {}));
    const {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    } = useSelectedKeywords(journalSearchQueryParams?.keywords);
    const [showInputControls, setShowInputControls] = React.useState(!hasAnySelectedKeywords);
    const fromHandleKeywordDelete = React.useRef(false);

    const handleKeywordDeleteDecorator = keyword => {
        handleKeywordDelete(keyword);
        fromHandleKeywordDelete.current = true;
    };

    /**
     * Setting selected keywords would re-render this page which should run effect to:
     *  - Set url query string params
     *  - Call load journal list action
     */
    const handleSearchJournalsClick = React.useCallback(() => {
        setShowInputControls(false);
        setSelectedKeywords(selectedKeywords);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     * Effect to Keep keywords update when the forward and back browser buttons are used
     * once a given search is made and keywords are selected
     */
    React.useEffect(() => {
        return history.listen(location => {
            // in case the
            if (history.action !== 'POP') {
                return;
            }

            // get current search query
            const searchQueryParams = deparam(location.search.substr(1));
            const keywordsFromUrl = filterNonValidKeywords(searchQueryParams?.keywords);
            if (!Object.keys(keywordsFromUrl).length || !areKeywordsDifferent(keywordsFromUrl, selectedKeywords)) {
                return;
            }

            // if there are differences between selectedKeywords state variable
            // and the current search query keywords, update the state
            setSelectedKeywords(searchQueryParams.keywords);
            setShowInputControls(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     *  Hide search input controls if there aren't any selected keywords
     */
    React.useEffect(() => {
        if (!hasAnySelectedKeywords) {
            setShowInputControls(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAnySelectedKeywords]);

    /**
     * Run this effect whenever keywords are changed
     */
    React.useEffect(() => {
        // if we land on this page via a url with keywords, bail
        if (!areKeywordsDifferent(initialKeywords.current, selectedKeywords)) {
            return;
        }
        // otherwise, update the query search
        handleSearch({
            // make sure history reflects resetting facets filter, paging and sorting when keywords are removed
            ...(fromHandleKeywordDelete.current ? {} : journalSearchQueryParams),
            keywords: selectedKeywords,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     * Run this effect whenever url search query parameters are changed
     *  -  This should run everytime any parameter has changed (keywords, facets, page, pageSize etc)
     */
    React.useEffect(() => {
        if (showInputControls || !hasAnySelectedKeywords) {
            fromHandleKeywordDelete.current = false;
            return;
        }

        // reset facets filter, paging and sorting when keywords are removed
        if (fromHandleKeywordDelete.current) {
            delete journalSearchQueryParams.activeFacets;
            delete journalSearchQueryParams.page;
            delete journalSearchQueryParams.pageSize;
            delete journalSearchQueryParams.sortBy;
            delete journalSearchQueryParams.sortDirection;
        }

        // add a delay when keywords are being removed
        // to avoid unnecessary load on the API
        dispatch(searchJournals(journalSearchQueryParams, fromHandleKeywordDelete.current ? 1200 : 0));
        fromHandleKeywordDelete.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInputControls, hasAnySelectedKeywords, JSON.stringify(journalSearchQueryParams)]);

    const txt = locale.components.searchJournals;
    return (
        <StandardPage
            title={txt.journalSearchInterface.title}
            id="journal-search-page"
            data-testid="journal-search-page"
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <JournalSearchInterface
                        onSearch={handleSearchJournalsClick}
                        handleKeywordDelete={handleKeywordDeleteDecorator}
                        {...{
                            selectedKeywords,
                            setSelectedKeywords,
                            handleKeywordAdd,
                            hasAnySelectedKeywords,
                            showInputControls,
                        }}
                    />
                </Grid>
                <Grid item xs>
                    {!showInputControls && <JournalSearchResult onSearch={handleSearch} />}
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
