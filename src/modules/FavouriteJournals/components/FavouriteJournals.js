import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useJournalSearch, useJournalSearchControls, useSelectedJournals } from '../../SearchJournals/hooks';
import { pathConfig } from '../../../config';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import { BackToSearchButton } from '../../SharedComponents/JournalsCommonButtons';
import { removeFromFavourites, retrieveFavouriteJournals } from '../../../actions';
import { LoadingButton } from '../../SharedComponents/LoadingButton';
import { useLocation } from 'react-router';

export const FavouriteJournals = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const txt = locale.components.favouriteJournals;
    // keep track of previous location, so we can go back to the search page correctly after re rendering this component
    const prevLocation = useRef(location.state?.prevLocation);

    const response = useSelector(state => state.get?.('favouriteJournalsReducer').response);
    const loading = useSelector(state => state.get?.('favouriteJournalsReducer').loading);
    const error = useSelector(state => state.get?.('favouriteJournalsReducer').error);
    const removing = useSelector(state => state.get?.('favouriteJournalsReducer').remove?.loading);

    const {
        selectedJournals,
        isAllSelected,
        handleSelectedJournalsChange,
        clearSelectedJournals,
        countSelectedJournals,
        handleToggleSelectAllJournals,
    } = useSelectedJournals({ available: response?.data });
    const { journalSearchQueryParams, handleSearch } = useJournalSearch(pathConfig.journals.favourites);
    /* istanbul ignore next */
    const { handleExport, pageSizeChanged, pageChanged, sortByChanged } = useJournalSearchControls(
        params => {
            handleSearch(params);
            clearSelectedJournals();
        },
        journalSearchQueryParams,
        true,
    );

    const handleRemoveFromFavouritesClick = () =>
        dispatch(removeFromFavourites(Object.keys(selectedJournals)))
            .then(() => clearSelectedJournals())
            .then(() => dispatch(retrieveFavouriteJournals(journalSearchQueryParams)));

    const { page, pageSize, sortBy, sortDirection } = journalSearchQueryParams;
    useEffect(() => {
        dispatch(retrieveFavouriteJournals({ page, pageSize, sortBy, sortDirection }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, sortBy, sortDirection]);
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <Grid container spacing={2}>
                                    <FavouriteJournalsList
                                        journalsList={response}
                                        loading={loading}
                                        error={error}
                                        selected={selectedJournals}
                                        isAllSelected={isAllSelected}
                                        onSelectionChange={handleSelectedJournalsChange}
                                        onToggleSelectAll={handleToggleSelectAllJournals}
                                        onExport={handleExport}
                                        onPageSizeChange={pageSizeChanged}
                                        onPageChange={pageChanged}
                                        onSortByChange={sortByChanged}
                                        journalSearchQueryParams={journalSearchQueryParams}
                                    />
                                </Grid>
                                <Grid style={{ paddingTop: !!response?.total ? 20 : 25 }} item xs={12}>
                                    <Grid container spacing={2}>
                                        {!!response?.total && (
                                            <Grid item xs={12} sm={6} md="auto">
                                                <LoadingButton
                                                    variant="contained"
                                                    type="submit"
                                                    color="primary"
                                                    id="remove-from-favourites-button"
                                                    data-testid="remove-from-favourites-button"
                                                    disabled={!!removing || countSelectedJournals() < 1}
                                                    loading={removing}
                                                    aria-label={txt.buttons.removeFromFavourites.aria}
                                                    children={txt.buttons.removeFromFavourites.title}
                                                    onClick={handleRemoveFromFavouritesClick}
                                                    fullWidth
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs={12} sm={6} md="auto">
                                            <BackToSearchButton
                                                children={txt.buttons.returnToSearch.title}
                                                aria-label={txt.buttons.returnToSearch.aria}
                                                prevLocation={prevLocation.current}
                                                fullWidth
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
