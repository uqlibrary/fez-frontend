import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

export class InlineLoader extends React.Component {
    static propTypes = {
        message: PropTypes.string,
        classes: PropTypes.object,
        loaderId: PropTypes.string,
        ariaLabel: PropTypes.string,
    };

    static defaultProps = {
        message: 'Loading',
        ariaLabel: 'Loading',
    };

    render() {
        const { loaderId, message, ariaLabel } = this.props;
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
                    <Hidden smUp>
                        <Grid item xs />
                    </Hidden>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <CircularProgress size={18} thickness={2} color="primary" aria-label={ariaLabel} />
                    </Grid>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <Typography color={'primary'} variant={'h5'} component={'span'} style={{ fontSize: '1.33rem' }}>
                            {message}
                        </Typography>
                    </Grid>
                    <Hidden smUp>
                        <Grid item xs />
                    </Hidden>
                </Grid>
            </div>
        );
    }
}

export default withStyles(null, { withTheme: true })(InlineLoader);
