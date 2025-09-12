import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsListPaging, PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';

export const FavouriteJournalsList = ({
    journalsList,
    loading,
    error,
    onSelectionChange,
    onToggleSelectAll,
    onExport,
    onSortByChange,
    onPageChange,
    onPageSizeChange,
    selected,
    isAllSelected,
    journalSearchQueryParams,
}) => {
    const txt = locale.components.favouriteJournals.favouriteJournalsList;

    if (!loading && !error && journalsList?.total !== 0 && !journalsList?.data) {
        return <div id="favourite-journals-list-nothing" data-testid="favourite-journals-list-nothing" />;
    }

    if (loading) {
        return (
            <Grid id="favourite-journals-list-loading" data-testid="favourite-journals-list-loading" size={12}>
                <InlineLoader message={txt.loading} />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid id="favourite-journals-list-error" data-testid="favourite-journals-list-error" size={12}>
                <Alert {...error} />
            </Grid>
        );
    }

    if (!journalsList.total) {
        return (
            <Grid id="favourite-journals-list-empty" data-testid="favourite-journals-list-empty" size={12}>
                {txt.empty}
            </Grid>
        );
    }

    return (
        <>
            <Grid size={12}>
                <PublicationsListSorting
                    canUseExport
                    exportData={locale.components.searchJournals.export}
                    pagingData={journalsList}
                    sortingData={locale.components.searchJournals.sorting}
                    sortBy={(journalSearchQueryParams && journalSearchQueryParams.sortBy) || 'score'}
                    sortDirection={(journalSearchQueryParams && journalSearchQueryParams.sortDirection) || 'Desc'}
                    onExportPublications={onExport}
                    onSortByChanged={onSortByChange}
                    onPageSizeChanged={onPageSizeChange}
                    pageSize={journalsList?.per_page}
                />
            </Grid>
            <Grid size={12}>
                <PublicationsListPaging
                    disabled={loading}
                    loading={loading}
                    pagingData={journalsList}
                    onPageChanged={onPageChange}
                    pagingId="search-journals-paging-top"
                />
            </Grid>
            <Grid size={12}>
                <JournalsList
                    journals={journalsList?.data}
                    onSelectionChange={onSelectionChange}
                    onToggleSelectAll={onToggleSelectAll}
                    selected={selected}
                    isAllSelected={isAllSelected}
                />
            </Grid>
            <Grid size={12}>
                <PublicationsListPaging
                    disabled={loading}
                    loading={loading}
                    pagingData={journalsList}
                    onPageChanged={onPageChange}
                    pagingId="search-journals-paging-bottom"
                />
            </Grid>
        </>
    );
};

FavouriteJournalsList.propTypes = {
    error: PropTypes.object,
    journalsList: PropTypes.object,
    loading: PropTypes.bool,
    onSelectionChange: PropTypes.func,
    onToggleSelectAll: PropTypes.func,
    onExport: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onSortByChange: PropTypes.func,
    journalSearchQueryParams: PropTypes.object,
    selected: PropTypes.object,
    isAllSelected: PropTypes.bool,
};

export default React.memo(FavouriteJournalsList);
