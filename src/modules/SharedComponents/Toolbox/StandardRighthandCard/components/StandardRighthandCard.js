import React from 'react';
import PropTypes from 'prop-types';
import { HelpIcon } from '../../HelpDrawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    title: {
        minWidth: 1,
    },
    icon: {
        marginTop: -8,
    },
    divider: {
        marginTop: 6,
        marginBottom: 12,
    },
};

export class StandardRighthandCard extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        children: PropTypes.any,
        title: PropTypes.string,
        testId: PropTypes.string,
        help: PropTypes.shape({
            title: PropTypes.string,
            text: PropTypes.any,
            buttonLabel: PropTypes.string,
        }),
    };

    render() {
        const { classes, title, children, help, testId } = this.props;
        return (
            <Grid container {...(testId ? { 'data-testid': testId } : {})}>
                <Grid item xs className={classes.title}>
                    {title && (
                        <Typography variant={'h6'} color={'primary'}>
                            {title}
                        </Typography>
                    )}
                </Grid>
                {help && help.text && (
                    <Grid item className={classes.icon}>
                        <HelpIcon {...help} />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Divider className={classes.divider} />
                </Grid>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(StandardRighthandCard);
