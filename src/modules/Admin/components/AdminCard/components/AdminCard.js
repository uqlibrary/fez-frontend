import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const StyledRule = styled('hr')(({ theme }) => ({
    opacity: 0.1,
    border: 0,
    borderTop: `1px solid ${theme.palette.primary.main}`,
}));
const StyledTitle = styled(Typography)(({ theme }) => ({
    opacity: 0.85,
    color: theme.palette.primary.main,
    fontSize: theme.typography.fontSize,
    fontWeight: 500,
}));

export class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        children: PropTypes.any,
    };
    render() {
        const { title, children } = this.props;
        return (
            <Grid container spacing={0} sx={{ mt: '8px' }} className={'AdminCard'}>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <StyledRule />
                            </Grid>
                            <Grid item xs={'auto'} sx={{ ml: '-4px' }}>
                                <StyledTitle component={'h4'} color={'primary'}>
                                    &nbsp;{title}
                                </StyledTitle>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

export const AdminCard = props => <Cards {...props} />;
export default AdminCard;
