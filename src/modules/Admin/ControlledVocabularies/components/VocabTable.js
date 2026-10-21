import React from 'react';

import PropTypes from 'prop-types';
import VocabDataRow from './VocabDataRow';
import Grid from '@mui/material/Grid';

export const VocabTable = ({ records, labels }) => {
    return (
        <Grid container spacing={0} sx={{ width: '100%' }}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ width: '100%', fontWeight: 400 }} data-testid="vocab-primary-header">
                <Grid size={{ sm: 1 }}>{''}</Grid>
                <Grid size={{ xs: 12, sm: 3, md: 4 }}>{labels.title}</Grid>
                <Grid size={{ xs: 12, sm: 4, md: 5 }}>{labels.desc}</Grid>
                <Grid size={{ xs: 12, sm: 3, md: 1 }}>{labels.external_id}</Grid>
                <Grid size={{ xs: 12, sm: 1 }}>{labels.actions}</Grid>
            </Grid>
            {/* Data Row */}
            <Grid container sx={{ width: '100%', paddingTop: '10px' }} data-testid="vocab-primary-body">
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
