import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const JournalTemplate = ({ option }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1" color="textPrimary">
                    {option?.jnl_title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                    {option?.fez_journal_issn?.map(issn => issn.jnl_issn).join(', ')}
                </Typography>
            </Grid>
        </Grid>
    );
};

JournalTemplate.propTypes = {
    option: PropTypes.object,
};

export default React.memo(JournalTemplate);
