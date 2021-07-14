import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';
import { PublicationsListPaging } from 'modules/SharedComponents/PublicationsList';

import JournalsList from './JournalsList';
import locale from 'locale/components';

export const JournalSearchResult = () => {
    const txt = locale.components.journalSearch.journalSearchResult;

    const journalsListLoading = useSelector(state => state.get('journalReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('journalReducer').journalsList);
    const journalsListError = useSelector(state => state.get('journalReducer').journalsListError);

    if (journalsListLoading) {
        <InlineLoader message={txt.loadingMessage} />;
    }

    if (journalsListError) {
        <Alert {...journalsListError} />;
    }

    if (!journalsList || (!!journalsList && journalsList.length === 0)) {
        return 'No journals found';
    }

    return (
        <Grid container spacing={2}>
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
                <PublicationsListPaging pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }} />
            </Grid>
            <Grid item xs={12}>
                <JournalsList />
            </Grid>
            <Grid item xs={12}>
                <PublicationsListPaging pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }} />
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalSearchResult);
