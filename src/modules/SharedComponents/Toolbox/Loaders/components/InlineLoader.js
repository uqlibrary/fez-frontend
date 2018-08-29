import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    text: {
        fontWeight: theme.typography.fontWeightNormal,
        margin: '24px 0'
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
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item xs={12} justify={'center'}>
                    <CircularProgress size={60} thickness={1} color="primary"/>
                </Grid>
                <Grid item xs={12} justify={'center'}>
                    <Typography className={classes.text} variant={'title'}>{this.props.message}</Typography>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(InlineLoader);
