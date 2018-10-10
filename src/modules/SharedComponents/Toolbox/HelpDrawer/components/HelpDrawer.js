import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    paper: {
        width: 260,
        paddingTop: 40,
        paddingRight: 40,
        paddingLeft: 40,
        paddingBottom: 0,
        maxHeight: '100%'
    },
    title: {
        color: theme.palette.primary.main
    },
    button: {
        float: 'right',
        marginBottom: 60
    }
});

export class HelpDrawer extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.any.isRequired,
        hide: PropTypes.func.isRequired,
        buttonLabel: PropTypes.string,
        classes: PropTypes.object
    };
    static defaultProps = {
        buttonLabel: 'OK'
    };

    render() {
        const {classes, title, text, buttonLabel, open, hide} = this.props;
        return (
            <Drawer
                classes={{paper: classes.paper}}
                open={open}
                anchor="right"
                onClose={hide}>
                <Grid container spacing={40}>
                    <Grid item xs={12}>
                        <Typography key={'title'} component={'span'} variant={'h5'} className={classes.title}>{title}</Typography>
                        <Typography key={'text'} component={'span'} variant="body1">{text}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" className={classes.button} children={buttonLabel} onClick={hide} />
                    </Grid>
                </Grid>
            </Drawer>
        );
    }
}

export default withStyles(styles, {withTheme: true})(HelpDrawer);
