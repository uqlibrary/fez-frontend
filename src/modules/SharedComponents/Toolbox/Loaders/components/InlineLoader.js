import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        margin: '24px 0',
        width: '100%'
    },
    text: {
        alignText: 'center',
        color: theme.palette.primary.main,
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
            <div style={{padding: 8}}>
                <Grid container spacing={16} justify="center" alignItems="center" alignContent={'center'} className={classes.root}>
                    <Grid item xs={12} sm={'auto'} style={{textAlign: 'center'}}>
                        <CircularProgress size={24} thickness={2} color="primary"/>
                    </Grid>
                    <Grid item xs={12} sm style={{textAlign: 'center'}}>
                        <Typography color={'primary'} variant={'h6'} component={'span'}>{this.props.message}</Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(InlineLoader);
