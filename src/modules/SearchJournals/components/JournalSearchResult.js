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

export const JournalSearchResult = () => {
    const txt = locale.components.journalSearch.journalSearchResult;

    const journalsListLoading = useSelector(state => state.get('searchJournalsReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('searchJournalsReducer').journalsList);
    const journalsListLoaded = useSelector(state => state.get('searchJournalsReducer').journalsListLoaded);
    const journalsListError = useSelector(state => state.get('searchJournalsReducer').journalsListError);

    console.log(journalsListLoading, journalsList, journalsListLoaded, journalsListError);

    if (!journalsListLoaded) {
        return <div />;
    }

    if (!journalsList || (!!journalsList && journalsList.length === 0)) {
        return 'No journals found';
    }

    return (
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
                        pageSize={20}
                    />
                </Grid>
                <Grid item xs={12}>
                    <PublicationsListPaging
                        pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <JournalsList />
                </Grid>
                <Grid item xs={12}>
                    <PublicationsListPaging
                        pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }}
                    />
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(JournalSearchResult);
