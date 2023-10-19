import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.white.main,
}));

export class DashboardAuthorDetails extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        familyName: PropTypes.string,
        givenName: PropTypes.string,
        orgUnits: PropTypes.array,
        positions: PropTypes.array,
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
        const areAllCasualPositions = this.areAllCasualPositions(this.props.positions);
        return (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <StyledTypography variant={'h6'}>
                        {this.props.title}&nbsp;{this.props.givenName}&nbsp;{this.props.familyName}
                    </StyledTypography>
                </Grid>
                {/* Author Name/Positions/OrgUnits */}
                <Grid item xs={12}>
                    {this.props.positions &&
                        this.props.positions.length > 0 &&
                        this.props.positions.map(
                            (item, index) =>
                                ((!areAllCasualPositions && !this.isCasualPosition(item)) || areAllCasualPositions) && (
                                    <StyledTypography key={index} variant={'caption'} component={'span'}>
                                        <b>{item}</b>
                                        {this.props.orgUnits &&
                                            this.props.orgUnits.length > 0 &&
                                            this.props.orgUnits[index] &&
                                            `, ${this.props.orgUnits[index]}`}
                                    </StyledTypography>
                                ),
                        )}
                </Grid>
            </Grid>
        );
    }
}

export default DashboardAuthorDetails;
