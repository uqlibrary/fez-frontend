import React from 'react';

import PropTypes from 'prop-types';
import VocabDataRow from './VocabDataRow';
import Grid from '@mui/material/Grid';

export const VocabTable = ({ records, labels }) => {
    return (
        <Grid container spacing={0}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-primary-header">
                <Grid item md={1}>
                    {''}
                </Grid>
                <Grid item md={8} sm={6} xs={6} data-testid="vocab-primary-header-title">
                    {labels.title}
                </Grid>
                <Grid item md={1} xs={2} sm={2} data-testid="vocab-primary-header-license">
                    {labels.license}
                </Grid>
                <Grid item md={1} xs={2} sm={2} data-testid="vocab-primary-header-eid">
                    {labels.external_id}
                </Grid>
                <Grid item md={1} data-testid="vocab-primary-header-action">
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
    location: PropTypes.object,
    labels: PropTypes.object,
};
export default VocabTable;
