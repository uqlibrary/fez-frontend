import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { JournalsList } from 'modules/SharedComponents/JournalsList';

export const JournalComparisonList = ({ journals }) => {
    if (!journals || (!!journals && journals.length === 0)) {
        return 'No journals found';
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <JournalsList journals={journals} isSelectable={false} />
            </Grid>
        </Grid>
    );
};

JournalComparisonList.propTypes = {
    journals: PropTypes.array.isRequired,
};

export default React.memo(JournalComparisonList);
