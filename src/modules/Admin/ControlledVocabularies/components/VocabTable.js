import React from 'react';

import PropTypes from 'prop-types';
import VocabDataRow from './VocabDataRow';
import Grid from '@mui/material/Grid';

export const VocabTable = ({ records, labels }) => {
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-primary-header">
                <Grid item sm={1}>
                    {''}
                </Grid>
                <Grid item xs={12} sm={7} md={9}>
                    {labels.title}
                </Grid>
                <Grid item xs={12} sm={3} md={1}>
                    {labels.external_id}
                </Grid>
                <Grid item xs={12} sm={1}>
                    {labels.actions}
                </Grid>
            </Grid>
            {/* Data Row */}
            <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-primary-body">
                {records.map(row => (
                    <VocabDataRow key={row.cvo_id} row={row} />
                ))}
            </Grid>
        </Grid>
    );
};
VocabTable.propTypes = {
    records: PropTypes.array,
    labels: PropTypes.object,
};
export default VocabTable;
