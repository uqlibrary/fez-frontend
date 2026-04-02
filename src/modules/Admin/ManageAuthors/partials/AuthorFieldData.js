import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import FormHelperText from '@mui/material/FormHelperText';
import ColumnTitle from '../partials/ColumnTitle';
import { useFormContext } from 'react-hook-form';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';

export const AuthorFieldData = ({ component: Component, displayLabelForMobileMode, ...rest }) => {
    const {
        formState: { isValidating },
    } = useFormContext();

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md')) || false;

    return (
        <React.Fragment>
            {!isMobileView && (
                <Grid item xs={3}>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <ColumnTitle title={rest.label} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {isMobileView && displayLabelForMobileMode && (
                <Grid item xs={12} md={6}>
                    <ColumnTitle title={rest.label} />
                </Grid>
            )}
            <Grid item xs={12} md={6}>
                <Component isValidating={isValidating} {...rest} />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormHelperText variant="outlined">{rest.helperText}</FormHelperText>
            </Grid>
        </React.Fragment>
    );
};

AuthorFieldData.propTypes = {
    component: PropTypes.instanceOf(React.Component),
    displayLabelForMobileMode: PropTypes.bool,
};

export default React.memo(AuthorFieldData);
