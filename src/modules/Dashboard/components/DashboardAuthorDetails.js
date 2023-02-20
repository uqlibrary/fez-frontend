import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    authorDetails: {
        color: theme.palette.white.main,
    },
});

export class DashboardAuthorDetails extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        familyName: PropTypes.string,
        givenName: PropTypes.string,
        orgUnits: PropTypes.array,
        positions: PropTypes.array,
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    isCasualPosition(position) {
        return position.indexOf('Casual ') > -1;
    }

    /**
     * Hide roles that include the word 'Casual', where multiple roles are currently displayed,
     * and at least one does not include the word 'Casual'
     * If all appointments include the word 'Casual' we will need to display all roles.
     */
    areAllCasualPositions(positions) {
        if (!positions || positions.length === 0) {
            return false;
        }

        return (
            positions.filter(position => {
                return this.isCasualPosition(position);
            }).length === positions.length
        );
    }

    render() {
        const { classes } = this.props;
        const areAllCasualPositions = this.areAllCasualPositions(this.props.positions);
        return (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant={'h6'} className={classes.authorDetails}>
                        {this.props.title}&nbsp;{this.props.givenName}&nbsp;{this.props.familyName}
                    </Typography>
                </Grid>
                {/* Author Name/Positions/OrgUnits */}
                <Grid item xs={12}>
                    {this.props.positions &&
                        this.props.positions.length > 0 &&
                        this.props.positions.map(
                            (item, index) =>
                                ((!areAllCasualPositions && !this.isCasualPosition(item)) || areAllCasualPositions) && (
                                    <Typography
                                        key={index}
                                        variant={'caption'}
                                        component={'span'}
                                        className={classes.authorDetails}
                                    >
                                        <b>{item}</b>
                                        {this.props.orgUnits &&
                                            this.props.orgUnits.length > 0 &&
                                            this.props.orgUnits[index] &&
                                            `, ${this.props.orgUnits[index]}`}
                                    </Typography>
                                ),
                        )}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DashboardAuthorDetails);
