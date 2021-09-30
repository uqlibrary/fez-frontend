import React from 'react';

import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import { FavouriteJournalsInterface } from './FavouriteJournalsInterface';
import FavouriteJournalList from './FavouriteJounalList';

export const FavouriteJournals = () => {
    const txt = locale.components.journalSearch;
    return (
        <StandardPage
            title={txt.favouriteJournalsInterface.title}
            id="journal-search-page"
            data-testid="journal-search-page"
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    <FavouriteJournalList />
                </Grid>
                <Grid item xs={12}>
                    <FavouriteJournalsInterface />
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(FavouriteJournals);
