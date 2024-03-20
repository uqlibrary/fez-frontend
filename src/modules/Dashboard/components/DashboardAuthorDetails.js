import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.white.main,
}));

export const DashboardAuthorDetails = ({ title, familyName, givenName, orgUnits, positions }) => {
    const isCasualPosition = position => position.indexOf('Casual ') > -1;

    /**
     * Hide roles that include the word 'Casual', where multiple roles are currently displayed,
     * and at least one does not include the word 'Casual'
     * If all appointments include the word 'Casual' we will need to display all roles.
     */
    const areAllCasualPositions = React.useMemo(() => {
        if (!positions || positions.length === 0) {
            return false;
        }

        return (
            positions.filter(position => {
                return isCasualPosition(position);
            }).length === positions.length
        );
    }, [positions]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <StyledTypography variant={'h6'}>
                    {title}&nbsp;{givenName}&nbsp;{familyName}
                </StyledTypography>
            </Grid>
            {/* Author Name/Positions/OrgUnits */}
            <Grid item xs={12}>
                {positions &&
                    positions.length > 0 &&
                    positions.map(
                        (item, index) =>
                            ((!areAllCasualPositions && !isCasualPosition(item)) || areAllCasualPositions) && (
                                <StyledTypography key={index} variant={'caption'} component={'span'}>
                                    <b>{item}</b>
                                    {orgUnits && orgUnits.length > 0 && orgUnits[index] && `, ${orgUnits[index]}`}
                                </StyledTypography>
                            ),
                    )}
            </Grid>
        </Grid>
    );
};
DashboardAuthorDetails.propTypes = {
    title: PropTypes.string,
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    orgUnits: PropTypes.array,
    positions: PropTypes.array,
};
export default DashboardAuthorDetails;
