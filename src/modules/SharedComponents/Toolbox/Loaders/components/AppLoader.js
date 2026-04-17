import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import Box from '@mui/material/Box';

const StyledGrid = styled(Grid)(({ theme }) => ({
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    ...theme.palette.primary.gradient.diagonal,
    width: '100%',
    height: '100%',
    textAlign: 'center !important',
}));

export const AppLoader = ({ title, logoImage, logoText }) => {
    return (
        <StyledGrid container spacing={0} sx={{}}>
            <Grid item m={'16px 0'}>
                <CircularProgress size={80} thickness={1} sx={{ color: 'white.main', fontWeight: 'fontWeightLight' }} />
            </Grid>
            <Grid item m={'16px 0'}>
                {logoImage && <Box className={`${logoImage}`} sx={{ width: '200px' }} alt={logoText} />}
            </Grid>
            <Grid item m={'16px 0'}>
                <Typography variant={'h6'} sx={{ color: 'white.main', fontWeight: 'fontWeightLight' }}>
                    {title}
                </Typography>
            </Grid>
        </StyledGrid>
    );
};
AppLoader.propTypes = {
    title: PropTypes.string.isRequired,
    logoImage: PropTypes.string,
    logoText: PropTypes.string,
};

export default React.memo(AppLoader);
