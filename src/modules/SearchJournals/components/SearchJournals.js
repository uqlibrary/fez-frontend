import React from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';
import { useJournalSearch, useSelectedKeywords } from '../hooks';
import { searchJournals } from 'actions';
import locale from 'locale/components';

export const SearchJournals = () => {
    const dispatch = useDispatch();
    const { journalSearchQueryParams, locationKey, handleSearch } = useJournalSearch();
    const {
        selectedKeywords,
        setSelectedKeywords,
        handleKeywordAdd,
        handleKeywordDelete,
        hasAnySelectedKeywords,
    } = useSelectedKeywords(journalSearchQueryParams.keywords);
    const [showInputControls, setShowInputControls] = React.useState(!hasAnySelectedKeywords);

    const handleKeywordDeleteAndResetSearchPageOption = keyword => {
        // reset all filter except keywords once a keyword is removed
        const { keywords } = journalSearchQueryParams;
        handleSearch({
            keywords,
        });
        handleKeywordDelete(keyword);
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
     *  Hide search input controls if there aren't any selected keywords
     */
    React.useEffect(() => {
        if (!hasAnySelectedKeywords) {
            setShowInputControls(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords, hasAnySelectedKeywords]);

    /**
     * Run this effect whenever keywords are changed
     */
    React.useEffect(() => {
        const searchQuery = { ...journalSearchQueryParams, keywords: selectedKeywords };
        handleSearch(searchQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeywords]);

    /**
     * Run this effect whenever url search query parameters are changed
     *  -  This should run everytime any parameter has changed (keywords, facets, page, pageSize etc)
     */
    React.useEffect(() => {
        if (!showInputControls && hasAnySelectedKeywords) {
            dispatch(searchJournals(journalSearchQueryParams));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInputControls, hasAnySelectedKeywords, journalSearchQueryParams]);
    const txt = locale.components.journalSearch;
    return (
        <StandardPage
            title={txt.journalSearchInterface.title}
            id="journal-search-page"
            data-testid="journal-search-page"
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <JournalSearchInterface
                        key={`journal-search-interface-${locationKey}`}
                        onSearch={handleSearchJournalsClick}
                        handleKeywordDelete={handleKeywordDeleteAndResetSearchPageOption}
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
                    {!showInputControls && (
                        <JournalSearchResult key={`journal-search-result-${locationKey}`} onSearch={handleSearch} />
                    )}
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
