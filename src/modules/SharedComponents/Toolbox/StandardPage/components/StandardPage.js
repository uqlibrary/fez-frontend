import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const StyledGrid = styled(Grid)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '24px auto',
    width: '90%',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        margin: '12px auto',
    },
}));

const StyledPageTitle = styled(Typography)(({ theme }) => ({
    // Semantic h2 (matches the component): use the DS h2 scale rather than the smaller h4/h5.
    ...theme.typography.h2,
    overflowWrap: 'break-word !important',
    maxWidth: 1200,
    width: '90%',
    margin: '12px auto',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        margin: '0 auto 12px auto',
    },
}));

// Keeps the page title in the heading outline for screen readers on pages that have no visible title.
const visuallyHidden = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
};

export const StandardPage = ({ title, hideTitle = false, help, children, standardPageId }) => {
    return (
        <Grid container className="StandardPage" id={standardPageId} data-testid={standardPageId}>
            {title && (
                <Grid size={12} sx={hideTitle ? visuallyHidden : undefined}>
                    <StyledPageTitle
                        color="primary"
                        component="h2"
                        id="page-title"
                        data-analyticsid="page-title"
                        data-testid="page-title"
                    >
                        {title}
                    </StyledPageTitle>
                </Grid>
            )}
            {help && (
                <Box sx={{ position: 'absolute', right: '30px' }}>
                    <HelpIcon {...help} />
                </Box>
            )}
            <Grid size={12} />
            <StyledGrid>{children}</StyledGrid>
        </Grid>
    );
};

StandardPage.propTypes = {
    title: PropTypes.any,
    hideTitle: PropTypes.bool,
    help: PropTypes.object,
    children: PropTypes.any,
    standardPageId: PropTypes.string,
};

export default StandardPage;
