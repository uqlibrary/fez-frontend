import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

export const styles = theme => ({
    card: {
        marginTop: 8,
    },
    title: {
        marginLeft: -4,
        opacity: 0.66,
        color: theme.palette.primary.main,
        fontSize: theme.typography.fontSize,
    },
    divider: {
        opacity: 0.1,
        border: 0,
        borderTop: `1px solid ${theme.palette.primary.main}`,
    },
});

export class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        children: PropTypes.any,
        classes: PropTypes.object.isRequired,
    };
    render() {
        const { classes, title, children } = this.props;
        return (
            <Grid container spacing={0} className={`${classes.card} AdminCard`}>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <hr className={classes.divider} />
                            </Grid>
                            <Grid item xs={'auto'} className={classes.title}>
                                <Typography component={'h4'} color={'primary'}>
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
    }
}

const StyledCard = withStyles(styles, { withTheme: true })(Cards);
export const AdminCard = props => <StyledCard {...props} />;
export default AdminCard;
