import React from 'react';

import PropTypes from 'prop-types';
// import VocabDataRow from './VocabDataRow';
import Grid from '@mui/material/Grid';
import locale from 'locale/components';

const txt = locale.components.controlledVocabulary;
const labels = txt.columns.labels;

export const VocabTableChild = ({ parentRow }) => {
    return (
        <Grid container spacing={0}>
            <Grid item md={12}>
                Title: {parentRow.cvo_title}
            </Grid>
            <Grid item md={12}>
                Key: {parentRow.cvo_id}
            </Grid>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ fontWeight: 400 }} data-testid="vocab-child-header">
                <Grid item md={1}>
                    {''}
                </Grid>
                <Grid item md={8} sm={6} xs={6}>
                    {labels.title}
                </Grid>
                <Grid item md={1} xs={2} sm={2}>
                    {labels.license}
                </Grid>
                <Grid item md={1} xs={2} sm={2}>
                    {labels.external_id}
                </Grid>
                <Grid item md={1}>
                    {labels.actions}
                </Grid>
            </Grid>
            {/* Data Row */}
            {/* <Grid container sx={{ paddingTop: '10px' }} data-testid="vocab-child-body">
                {records.map(row => (
                    <VocabDataRow key={row.cvo_id} row={row} />
                ))}
            </Grid> */}
        </Grid>
    );
};
VocabTableChild.propTypes = {
    // records: PropTypes.array,
    parentRow: PropTypes.object,
};
export default VocabTableChild;
