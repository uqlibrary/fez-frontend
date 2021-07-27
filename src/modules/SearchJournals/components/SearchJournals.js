import React from 'react';
import param from 'can-param';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';
import JournalSearchResult from './JournalSearchResult';
import JournalSearchFacetsFilter from './JournalSearchFacetsFilter';

import { pathConfig } from 'config/pathConfig';
import { useJournalSearchQueryParams, useSelectedKeywords } from '../hooks';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { searchJournals } from 'actions';
import locale from 'locale/components';

export const SearchJournals = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { journalSearchQueryParams, locationKey } = useJournalSearchQueryParams();
    const { selectedKeywords, setSelectedKeywords } = useSelectedKeywords(journalSearchQueryParams.keywords);

    /**
     * Handle search function on any type of update in search query
     *  -   Should handle keywords change
     *  -   Should handle paging change
     *  -   Should handle facets change
     * @param {Object} searchQuery common search query object (keywords, paging, facets etc.)
     * @returns void
     */
    const handleSearch = searchQuery => {
        history.push({
            pathname: pathConfig.journals.search,
            search: param(searchQuery),
        });
    };

    /**
     * Setting selected keywords would re-render this page which should run effect to:
     *  -   Set url query string params
     *  -   Call load journal list action
     * @param {Object} selectedKeywords selected keywords from JournalSearchInterface component
     */
    const handleSearchKeywords = selectedKeywords => {
        setSelectedKeywords(selectedKeywords);
    };

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
     *  -   This should run everytime any parameter has changed (keywords, facets, page, pageSize etc)
     * @todo    Handle facets, page, pageSize change
     * @todo    Call journal search action
     */
    React.useEffect(() => {
        if (!!journalSearchQueryParams.keywords && Object.values(journalSearchQueryParams.keywords).length > 0) {
            dispatch(searchJournals(journalSearchQueryParams));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalSearchQueryParams]);
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
                        onSearch={handleSearchKeywords}
                        initialSelectedKeywords={selectedKeywords}
                    />
                </Grid>
                <Grid item xs={9}>
                    <JournalSearchResult key={`journal-search-result-${locationKey}`} />
                </Grid>
                <Grid item xs={3}>
                    <StandardRighthandCard>
                        <JournalSearchFacetsFilter key={`journal-search-facets-filter-${locationKey}`} />
                    </StandardRighthandCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
