import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsListPaging, PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';

export const FavouriteJournalsList = () => {
    const txt = locale.components.favouriteJournals.favouriteJournalsList;

    const journals = useSelector(state => state.get('favouriteJournalsReducer').items);
    const loading = useSelector(state => state.get('favouriteJournalsReducer').loading);
    const loaded = useSelector(state => state.get('favouriteJournalsReducer').loaded);
    const error = useSelector(state => state.get('favouriteJournalsReducer').error);

    if (!loaded) {
        return <div />;
    }

    if (!journals || (!!journals && journals.length === 0)) {
        return (
            <Grid item xs={12}>
                No journals found
            </Grid>
        );
    }

    return (
        <>
            {!!loading && (
                <Grid item xs={12}>
                    <InlineLoader message={txt.loadingMessage} />
                </Grid>
            )}
            {!!error && (
                <Grid item xs={12}>
                    <Alert {...error} />
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
            {journals.length > 20 && (
                <Grid item xs={12}>
                    <PublicationsListPaging
                        pagingData={{ from: 1, to: 20, total: 100, per_page: 10, current_page: 1 }}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <JournalsList journals={journals.data} isSelectable={false} />
            </Grid>
        </>
    );
};

export default React.memo(FavouriteJournalsList);
