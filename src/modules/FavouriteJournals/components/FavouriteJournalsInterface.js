import React from 'react';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import locale from 'locale/components';
import { useHistory } from 'react-router';

export const FavouriteJournalsInterface = () => {
    const history = useHistory();
    const txt = locale.components.favouriteJournals;
    return (
        <StandardCard style={{ padding: 16 }} noHeader id="journal-search-card" data-testid="journal-search-card">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item xs="auto">
                            <Button
                                variant="contained"
                                children={txt.favouriteJournalsInterface.buttons.returnToSearch.title}
                                aria-label={txt.favouriteJournalsInterface.buttons.returnToSearch.aria}
                                type="submit"
                                color="primary"
                                onClick={() => history.goBack()}
                                id="journal-search-button"
                                data-testid="journal-search-button"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(FavouriteJournalsInterface);
