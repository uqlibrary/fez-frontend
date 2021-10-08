import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import { locale } from '../../../locale';

export const JournalComparisonList = ({ journals }) => {
    const txt = locale.components.journalComparison.list;
    if (!journals || (!!journals && journals.length === 0)) {
        return txt.empty;
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
    journals: PropTypes.array,
};

export default React.memo(JournalComparisonList);
