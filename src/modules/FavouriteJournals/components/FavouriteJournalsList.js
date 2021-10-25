import React from 'react';
import Grid from '@material-ui/core/Grid';
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
    onExport,
    onSortByChange,
    onPageChange,
    onPageSizeChange,
    selected,
    journalSearchQueryParams,
}) => {
    const txt = locale.components.favouriteJournals.favouriteJournalsList;

    if (!loading && !error && journalsList?.total !== 0 && !journalsList?.data) {
        return <div id="favourite-journals-list-nothing" />;
    }

    if (loading) {
        return (
            <Grid id="favourite-journals-list-loading" item xs={12}>
                <InlineLoader message={txt.loading} />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid id="favourite-journals-list-error" item xs={12}>
                <Alert {...error} />
            </Grid>
        );
    }

    if (!journalsList.total) {
        return (
            <Grid id="favourite-journals-list-empty" item xs={12}>
                {txt.empty}
            </Grid>
        );
    }

    return (
        <>
            <Grid item xs={12}>
                <PublicationsListSorting
                    canUseExport
                    exportData={txt.export}
                    pagingData={journalsList}
                    sortingData={txt.sorting}
                    sortBy={(journalSearchQueryParams && journalSearchQueryParams.sortBy) || 'score'}
                    sortDirection={(journalSearchQueryParams && journalSearchQueryParams.sortDirection) || 'Desc'}
                    onExportPublications={onExport}
                    onSortByChanged={onSortByChange}
                    onPageSizeChanged={onPageSizeChange}
                    /* eslint-disable-next-line camelcase */
                    pageSize={journalsList?.per_page}
                />
            </Grid>
            <Grid item xs={12}>
                <PublicationsListPaging
                    disabled={loading}
                    loading={loading}
                    pagingData={journalsList}
                    onPageChanged={onPageChange}
                    pagingId="search-journals-paging-top"
                />
            </Grid>
            <Grid item xs={12}>
                <JournalsList journals={journalsList?.data} onSelectionChange={onSelectionChange} selected={selected} />
            </Grid>
            <Grid item xs={12}>
                <PublicationsListPaging
                    disabled={loading}
                    loading={loading}
                    pagingData={journalsList}
                    onPageChanged={onPageChange}
                    pagingId="search-journals-paging-top"
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
    onExport: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onSortByChange: PropTypes.func,
    journalSearchQueryParams: PropTypes.object,
    selected: PropTypes.object,
};

export default React.memo(FavouriteJournalsList);
