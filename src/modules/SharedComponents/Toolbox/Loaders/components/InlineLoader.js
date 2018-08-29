import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    text: {
        color: theme.palette.secondary.main,
        margin: '0 24px'
    },
});

export class InlineLoader extends React.Component {
    static propTypes = {
        message: PropTypes.string,
        classes: PropTypes.object
    };

    static defaultProps = {
        message: 'Loading'
    };

    render() {
        const {classes} = this.props;
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item>
                    <CircularProgress size={32} thickness={1} color="primary"/>
                </Grid>
                <Grid item>
                    <Typography className={classes.text} variant={'headline'}>{this.props.message}</Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(InlineLoader);
