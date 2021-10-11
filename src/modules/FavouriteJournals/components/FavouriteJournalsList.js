import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsListPaging, PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';

export const FavouriteJournalsList = ({ total, journals, loading, error }) => {
    const txt = locale.components.favouriteJournals.favouriteJournalsList;

    if (!loading && !error && total === undefined && journals === undefined) {
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

    if (!total && !journals?.length) {
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
                    pagingData={{ total: 5 }}
                    sortBy="created_date"
                    sortDirection="Desc"
                    pageSize={10}
                />
            </Grid>
            {total > 20 && (
                <Grid item xs={12}>
                    <PublicationsListPaging
                        pagingData={{ from: 1, to: 20, total: 100, per_page: 10, current_page: 1 }}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <JournalsList journals={journals} isSelectable={false} />
            </Grid>
        </>
    );
};

FavouriteJournalsList.propTypes = {
    error: PropTypes.object,
    total: PropTypes.number,
    journals: PropTypes.array,
    loading: PropTypes.bool,
};

export default React.memo(FavouriteJournalsList);
