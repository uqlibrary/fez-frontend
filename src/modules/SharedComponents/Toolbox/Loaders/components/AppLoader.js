import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    appLoader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(((theme.palette || {}).primary || {}).gradient || {}).diagonal,
        width: '100%',
        height: '100%',
        textAlign: 'center !important',
    },
    white: {
        color: ((theme.palette || {}).white || {}).main,
        fontWeight: (theme.typography || {}).fontWeightLight,
    },
    spaceBetween: {
        margin: '16px 0',
    },
    logo: {
        width: 200,
    },
});

export class AppLoader extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        logoImage: PropTypes.string,
        logoText: PropTypes.string,
        classes: PropTypes.object,
    };

    render() {
        const { classes, title, logoImage, logoText } = this.props;
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={classes.appLoader}
            >
                <Grid item className={classes.spaceBetween}>
                    <CircularProgress size={80} thickness={1} className={classes.white} />
                </Grid>
                <Grid item className={classes.spaceBetween}>
                    {logoImage && <div className={`${logoImage} ${classes.logo}`} alt={logoText} />}
                </Grid>
                <Grid item className={classes.spaceBetween}>
                    <Typography variant={'h6'} className={classes.white}>
                        {title}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AppLoader);
