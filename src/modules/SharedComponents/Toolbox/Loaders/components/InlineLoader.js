import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const InlineLoader = ({ message = 'Loading', loaderId, ariaLabel = 'Loading' }) => {
    return (
        <div style={{ padding: 8 }}>
            <Grid
                container
                direction={'row'}
                spacing={1}
                justifyContent="center"
                alignItems="center"
                alignContent={'center'}
                id={loaderId}
                data-testid={loaderId}
            >
                <Grid item xs sx={{ display: { xs: 'block', sm: 'none' } }} />

                <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                    <CircularProgress size={18} thickness={2} color="primary" aria-label={ariaLabel} />
                </Grid>
                <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                    <Typography color={'primary'} variant={'h5'} component={'span'} style={{ fontSize: '1.33rem' }}>
                        {message}
                    </Typography>
                </Grid>
                <Grid item xs sx={{ display: { xs: 'block', sm: 'none' } }} />
            </Grid>
        </div>
    );
};
InlineLoader.propTypes = {
    message: PropTypes.string,
    loaderId: PropTypes.string,
    ariaLabel: PropTypes.string,
};

export default React.memo(InlineLoader);
