import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import FormHelperText from '@mui/material/FormHelperText';
import ColumnTitle from '../partials/ColumnTitle';
import { useFormContext } from 'react-hook-form';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export const NameOverride = ({ value, onChange, name, ['data-testid']: dataTestId, ...rest }) => {
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
            {
                /* istanbul ignore next */ isMobileView && (
                    <Grid item xs={12} md={6}>
                        <ColumnTitle title={rest.label} />
                    </Grid>
                )
            }
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    control={
                        <Switch
                            data-testid={dataTestId}
                            name={name}
                            checked={value === 1}
                            onChange={/* istanbul ignore next */ e => onChange(e.target.checked ? 1 : 0)}
                        />
                    }
                    disabled={isValidating}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormHelperText variant="outlined">{rest.helperText}</FormHelperText>
            </Grid>
        </React.Fragment>
    );
};

NameOverride.propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
};

export default React.memo(NameOverride);
