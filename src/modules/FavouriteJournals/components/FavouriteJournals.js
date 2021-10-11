import React from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { retrieveFavouriteJournals } from '../../../actions';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import { pathConfig } from '../../../config';

export const FavouriteJournals = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const txt = locale.components.favouriteJournals;
    const handleReturnToSearchClick = () => history.push(pathConfig.journals.search);
    React.useEffect(() => {
        dispatch(retrieveFavouriteJournals());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <FavouriteJournalsList />
                                <Grid container spacing={2} justify="flex-end" style={{ paddingTop: 20 }}>
                                    <Grid item xs="auto">
                                        <Button
                                            variant="contained"
                                            children={txt.buttons.returnToSearch.title}
                                            aria-label={txt.buttons.returnToSearch.aria}
                                            type="submit"
                                            color="primary"
                                            onClick={handleReturnToSearchClick}
                                            id="return-to-search-results-button"
                                            data-testid="return-to-search-results-button"
                                        />
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
