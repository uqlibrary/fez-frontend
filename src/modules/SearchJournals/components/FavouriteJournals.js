import React from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import { FavouriteJournalsInterface } from './FavouriteJournalsInterface';
import FavouriteJournalList from './FavouriteJounalList';
import { favouriteJournals } from '../../../actions';

export const FavouriteJournals = () => {
    const dispatch = useDispatch();
    const txt = locale.components.journalSearch;
    React.useEffect(() => {
        dispatch(favouriteJournals());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
