import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { useJournalSearch, useJournalSearchControls, useSelectedJournals } from '../../SearchJournals/hooks';
import { pathConfig } from '../../../config';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { BackToSearchButton } from 'modules/SharedComponents/JournalsCommonButtons';
import { deleteListItems, loadListItems } from 'actions/journalUserLists';
import { LoadingButton } from 'modules/SharedComponents/LoadingButton';
import { useLocation, useParams } from 'react-router';
import { AppState } from '../../../reducer';
import ListSelect from 'modules/FavouriteJournals/components/ListSelect';
import { Box } from '@mui/material';

export const FavouriteJournals: React.FC = () => {
    const { id: listIdParam } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const txt = locale.components.favouriteJournals;
    // keep track of previous location, so we can go back to the search page correctly after re-rendering this component
    const prevLocation = useRef(location.state?.prevLocation);
    const [listId, setListId] = useState(listIdParam);

    const response = useSelector((state: AppState) => state.get?.('favouriteJournalsReducer').response);
    const loading = useSelector((state: AppState) => state.get?.('favouriteJournalsReducer').loading);
    const error = useSelector((state: AppState) => state.get?.('favouriteJournalsReducer').error);
    const removing = useSelector((state: AppState) => state.get?.('favouriteJournalsReducer').remove?.loading);

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

    const handleDeleteFavouritesClick = () =>
        dispatch(deleteListItems({ id: listId, ids: Object.keys(selectedJournals) }))
            .then(() => clearSelectedJournals())
            .then(() => dispatch(loadListItems({ id: listId, searchQuery: journalSearchQueryParams })));

    // handle listIdParam changes
    useEffect(() => {
        setListId(listIdParam);
    }, [listIdParam]);

    const { page, pageSize, sortBy, sortDirection } = journalSearchQueryParams;
    useEffect(() => {
        dispatch(loadListItems({ id: listId, searchQuery: { page, pageSize, sortBy, sortDirection } }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId, page, pageSize, sortBy, sortDirection]);

    /* istanbul ignore next */
    const handleListSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListId(String(event.target.value));
    };

    const Title = (
        <Grid container spacing={2} alignItems="center">
            {txt.title}:
            <Box component="span" sx={{ mb: -2, width: 300 }}>
                <ListSelect
                    value={listId}
                    disabled={loading}
                    //@ts-expect-error
                    onChange={handleListSelection}
                />
            </Box>
        </Grid>
    );

    return (
        <StandardPage title={Title} data-testid="journal-search-page">
            <Grid container spacing={3} sx={{ padding: 0 }}>
                <Grid size="grow">
                    <Grid container spacing={2} sx={{ padding: 0 }}>
                        <Grid size={12} sx={{ flexGrow: 1 }}>
                            <StandardCard noHeader>
                                <Grid container spacing={2} sx={{ padding: 0 }}>
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
                                <Grid style={{ paddingTop: response?.total ? 20 : 25 }} size={12}>
                                    <Grid container spacing={2} sx={{ padding: 0 }}>
                                        {!!response?.total && (
                                            <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                                                <LoadingButton
                                                    variant="contained"
                                                    type="submit"
                                                    color="primary"
                                                    id="remove-from-favourites-button"
                                                    data-testid="remove-from-favourites-button"
                                                    disabled={!!removing || countSelectedJournals() < 1}
                                                    loading={removing}
                                                    aria-label={txt.buttons.delete.aria}
                                                    children={txt.buttons.delete.title}
                                                    onClick={handleDeleteFavouritesClick}
                                                    fullWidth
                                                />
                                            </Grid>
                                        )}
                                        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                                            {!prevLocation.current && (
                                                <BackToSearchButton
                                                    children={txt.buttons.toJournalSearch.title}
                                                    aria-label={txt.buttons.toJournalSearch.aria}
                                                    fullWidth
                                                />
                                            )}
                                            {prevLocation.current && (
                                                <BackToSearchButton
                                                    children={txt.buttons.returnToSearch.title}
                                                    aria-label={txt.buttons.returnToSearch.aria}
                                                    prevLocation={prevLocation.current}
                                                    fullWidth
                                                />
                                            )}
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
