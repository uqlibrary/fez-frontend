import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const styles = theme => ({
    layoutCard: {
        '&.MuiGrid-item': {
            maxWidth: '1200px',
            margin: '24px auto',
            width: '90%',
            padding: 0,
            [theme.breakpoints.down('md')]: {
                margin: '12px auto',
            },
        },
    },
    layoutTitle: {
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
    },
    helpIcon: {
        position: 'relative',
        right: '10px',
    },
});

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        help: PropTypes.object,
        children: PropTypes.any,
        classes: PropTypes.object,
        standardPageId: PropTypes.string,
    };

    render() {
        const { classes, title, children, help, standardPageId } = this.props;

        return (
            <Grid container className="StandardPage" id={standardPageId} data-testid={standardPageId}>
                {title && (
                    <Grid item xs>
                        <Typography
                            className={classes.layoutTitle}
                            color="primary"
                            component="h2"
                            id="page-title"
                            data-analyticsid="page-title"
                            data-testid="page-title"
                        >
                            {title}
                        </Typography>
                    </Grid>
                )}
                {help && (
                    <div className={classes.helpIcon}>
                        <HelpIcon {...help} />
                    </div>
                )}
                <Grid item xs={12} />
                <Grid item className={classes.layoutCard}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

const StyledPage = withStyles(styles, { withTheme: true })(Page);
const StandardPage = props => <StyledPage {...props} />;
export default StandardPage;
