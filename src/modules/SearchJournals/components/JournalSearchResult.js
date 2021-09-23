import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';
import { PublicationsListPaging } from 'modules/SharedComponents/PublicationsList';

import JournalsList from './JournalsList';
import locale from 'locale/components';
import { StandardRighthandCard } from '../../SharedComponents/Toolbox/StandardRighthandCard';
import JournalSearchFacetsFilter from './JournalSearchFacetsFilter';

export const JournalSearchResult = () => {
    const txt = locale.components.journalSearch.journalSearchResult;

    const journalsListLoading = useSelector(state => state.get('searchJournalsReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('searchJournalsReducer').journalsList);
    const journalsListLoaded = useSelector(state => state.get('searchJournalsReducer').journalsListLoaded);
    const journalsListError = useSelector(state => state.get('searchJournalsReducer').journalsListError);

    if (!journalsListLoaded) {
        return <div />;
    }

    if (!journalsList || (!!journalsList && journalsList.length === 0)) {
        return 'No journals found';
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs sm md={9}>
                <StandardCard noHeader>
                    <Grid container spacing={2}>
                        {!!journalsListLoading && (
                            <Grid item xs={12}>
                                <InlineLoader message={txt.loadingMessage} />
                            </Grid>
                        )}
                        {!!journalsListError && (
                            <Grid item xs={12}>
                                <Alert {...journalsListError} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <PublicationsListSorting
                                canUseExport
                                pagingData={{ total: 5 }}
                                sortBy="created_date"
                                sortDirection="Desc"
                                pageSize={10}
                            />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 10, current_page: 1 }}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <JournalsList journals={journalsList.data} />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </StandardCard>
            </Grid>
            <Grid item xs={3}>
                <StandardRighthandCard
                    title={locale.components.facetsFilter.title}
                    help={locale.components.facetsFilter.help}
                >
                    <JournalSearchFacetsFilter
                        key={'journal-search-facets-filter'}
                        facetsData={journalsList.filters.facets}
                    />
                </StandardRighthandCard>
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalSearchResult);
