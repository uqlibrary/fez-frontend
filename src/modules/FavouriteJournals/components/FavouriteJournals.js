import React from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { favouriteJournals } from '../../../actions';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';

export const FavouriteJournals = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const txt = locale.components.favouriteJournals;
    const handleReturnToSearchClick = () => history.goBack();
    React.useEffect(() => {
        dispatch(favouriteJournals());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <Grid container spacing={2}>
                                    <FavouriteJournalsList />
                                    <Grid item xs={12} style={{ paddingTop: 20 }}>
                                        <Grid container spacing={2} justify="flex-end">
                                            <Grid item xs="auto">
                                                <Button
                                                    variant="contained"
                                                    children={txt.buttons.returnToSearch.title}
                                                    aria-label={txt.buttons.returnToSearch.aria}
                                                    type="submit"
                                                    color="primary"
                                                    onClick={handleReturnToSearchClick}
                                                    id="journal-search-button"
                                                    data-testid="journal-search-button"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(FavouriteJournals);
