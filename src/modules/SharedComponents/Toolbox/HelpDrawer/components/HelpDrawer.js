import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const styles = theme => ({
    paper: {
        width: 320,
        padding: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(5),
        },
        paddingBottom: 0,
        maxHeight: '100%',
        boxSizing: 'border-box',
    },
    title: {
        color: theme.palette.primary.main,
    },
    button: {
        float: 'right',
        marginBottom: 60,
    },
});

export class HelpDrawer extends Component {
    static propTypes = {
        buttonLabel: PropTypes.string,
        classes: PropTypes.object,
        hide: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        text: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
    };
    static defaultProps = {
        buttonLabel: 'CLOSE',
    };

    render() {
        const { buttonLabel, classes, hide, open, text, title } = this.props;
        let indexedText = null;
        if (this.props.text && this.props.text.props && this.props.text.props.children) {
            indexedText = React.Children.map(this.props.text.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, { key: index });
                } else {
                    return child;
                }
            });
        }
        return (
            <Drawer classes={{ paper: classes.paper }} open={open} anchor="right" onClose={hide}>
                <Grid container spacing={5} id="help-drawer">
                    <Grid item xs={12}>
                        <Typography
                            className={classes.title}
                            component={'h3'}
                            data-testid="help-drawer-title"
                            id="help-drawer-title"
                            key={'title'}
                            variant={'h6'}
                        >
                            {title}
                        </Typography>
                        <Typography
                            component={'span'}
                            data-testid="help-drawer-message"
                            id={`help-drawer-text-${title.replace(/\s/g, '')}`}
                            key={'text'}
                            variant="body2"
                        >
                            {indexedText || text}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} id="help-drawer-button">
                        <Button
                            children={buttonLabel}
                            className={classes.button}
                            color="primary"
                            data-analyticsid="help-drawer-close"
                            data-testid="help-drawer-close"
                            onClick={hide}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HelpDrawer);
