import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';

export const JournalComparisonList = ({ journals }) => {
    if (!journals || (!!journals && journals.length === 0)) {
        return 'No journals found';
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs sm md={12}>
                <StandardCard noHeader>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <PublicationsListSorting
                                canUseExport
                                pagingData={{ total: 5 }}
                                sortBy="created_date"
                                sortDirection="Desc"
                                pageSize={10}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <JournalsList journals={journals} />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};

JournalComparisonList.propTypes = {
    journals: PropTypes.array.isRequired,
};

export default React.memo(JournalComparisonList);
