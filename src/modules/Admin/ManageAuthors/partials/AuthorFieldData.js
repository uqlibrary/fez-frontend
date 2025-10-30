import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import FormHelperText from '@mui/material/FormHelperText';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import ColumnTitle from '../partials/ColumnTitle';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormContext } from 'react-hook-form';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/system';

export const AuthorFieldData = ({ authorFieldDataId, label, helperText, ...props }) => {
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
                            <ColumnTitle title={label} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid item xs={12} md={6}>
                <TextField
                    {...props}
                    label={label}
                    textFieldId={authorFieldDataId}
                    fullWidth
                    InputProps={{
                        style: {
                            fontSize: 14,
                            fontWeight: 400,
                        },
                        ...props.InputProps,
                        ...((isValidating && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CircularProgress
                                        size={18}
                                        thickness={2}
                                        color="primary"
                                        id="checking-existing-author-progress"
                                        data-testid="checking-existing-author-progress"
                                    />
                                </InputAdornment>
                            ),
                        }) ||
                            {}),
                    }}
                    InputLabelProps={{
                        style: {
                            ...(props.error || { color: '#4085C6' }),
                            fontWeight: 400,
                        },
                    }}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormHelperText variant="outlined">{helperText}</FormHelperText>
            </Grid>
        </React.Fragment>
    );
};

AuthorFieldData.propTypes = {
    authorFieldDataId: PropTypes.string,
    data: PropTypes.string,
    state: PropTypes.object,
    label: PropTypes.string,
    helperText: PropTypes.string,
    error: PropTypes.bool,
    InputProps: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(AuthorFieldData);
