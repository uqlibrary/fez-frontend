import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Cards = ({ title, children, classes }) => {
    return (
        <Grid container spacing={0} sx={{ mt: '8px' }} className={`${classes?.card} AdminCard`}>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Box
                                component={'hr'}
                                sx={{
                                    opacity: 0.1,
                                    border: 0,
                                    borderTop: '1px solid',
                                    borderTopColor: 'primary.main',
                                }}
                                className={classes?.divider}
                            />
                        </Grid>
                        <Grid item xs={'auto'} sx={{ ml: '-4px' }} className={classes?.titlePortion}>
                            <Typography
                                component={'h4'}
                                sx={{
                                    opacity: 0.85,
                                    color: 'primary.main',
                                    fontSize: 'fontSize',
                                    fontWeight: 500,
                                }}
                                className={classes?.title}
                            >
                                &nbsp;{title}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    );
};
Cards.propTypes = {
    title: PropTypes.any,
    children: PropTypes.any,
    classes: PropTypes.object,
};

export default React.memo(Cards);
