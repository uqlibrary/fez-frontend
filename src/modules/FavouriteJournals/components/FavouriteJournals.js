import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import { pathConfig } from '../../../config';
import { BackToSearchButton } from '../../SharedComponents/JournalsCommonButtons';
import { removeFromFavourites, retrieveFavouriteJournals } from '../../../actions';
import { useSelectedJournals } from '../../SearchJournals/hooks';
import { LoadingButton } from '../../SharedComponents/LoadingButton';

export const FavouriteJournals = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const txt = locale.components.favouriteJournals;
    const {
        selectedJournals,
        clearSelectedJournals,
        handleSelectedJournalsChange,
        countSelectedJournals,
    } = useSelectedJournals();

    const response = useSelector(state => state.get?.('favouriteJournalsReducer').response);
    const loading = useSelector(state => state.get?.('favouriteJournalsReducer').loading);
    const error = useSelector(state => state.get?.('favouriteJournalsReducer').error);
    const removing = useSelector(state => state.get?.('favouriteJournalsReducer').remove.loading);

    const handleReturnToSearchClick = () => history.push(pathConfig.journals.search);
    const handleRemoveFromFavouritesClick = () =>
        dispatch(removeFromFavourites(Object.keys(selectedJournals)))
            .then(() => clearSelectedJournals({}))
            .then(() => dispatch(retrieveFavouriteJournals()));

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
                                <Grid container spacing={2}>
                                    <FavouriteJournalsList
                                        total={response?.total}
                                        journals={response?.data}
                                        loading={loading}
                                        error={error}
                                        selected={selectedJournals}
                                        onSelectionChange={handleSelectedJournalsChange}
                                    />
                                </Grid>
                                <Grid style={{ paddingTop: !!response?.total ? 20 : 25 }} item xs={12}>
                                    <Grid container spacing={2}>
                                        {!!response?.total && (
                                            <Grid item xs="auto">
                                                <LoadingButton
                                                    variant="contained"
                                                    type="submit"
                                                    color="primary"
                                                    id="remove-from-favourites"
                                                    data-testid="remove-from-favourites"
                                                    disabled={!!removing || countSelectedJournals() < 1}
                                                    loading={removing}
                                                    aria-label={txt.buttons.removeFromFavourites.aria}
                                                    children={txt.buttons.removeFromFavourites.title}
                                                    onClick={handleRemoveFromFavouritesClick}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs="auto">
                                            <BackToSearchButton
                                                children={txt.buttons.returnToSearch.title}
                                                aria-label={txt.buttons.returnToSearch.aria}
                                                onClick={handleReturnToSearchClick}
                                            />
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
