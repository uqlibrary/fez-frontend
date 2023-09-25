import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const StyledGrid = styled(Grid)(({ theme }) => ({
    '&.MuiGrid-item': {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
        [theme.breakpoints.down('md')]: {
            margin: '12px auto',
        },
    },
}));

const StyledPageTitle = styled(Typography)(({ theme }) => ({
    ...theme.typography.h5,
    overflowWrap: 'break-word !important',
    maxWidth: 1200,
    width: '90%',
    margin: '12px auto',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        margin: '0 auto 12px auto',
    },
    [theme.breakpoints.up('sm')]: {
        ...theme.typography.h4,
    },
}));

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        help: PropTypes.object,
        children: PropTypes.any,
        standardPageId: PropTypes.string,
    };

    render() {
        const { title, children, help, standardPageId } = this.props;

        return (
            <Grid container className="StandardPage" id={standardPageId} data-testid={standardPageId}>
                {title && (
                    <Grid item xs>
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
                    <Box sx={{ position: 'relative', right: '10px' }}>
                        <HelpIcon {...help} />
                    </Box>
                )}
                <Grid item xs={12} />
                <StyledGrid item>{children}</StyledGrid>
            </Grid>
        );
    }
}
const StandardPage = props => <Page {...props} />;
export default StandardPage;
