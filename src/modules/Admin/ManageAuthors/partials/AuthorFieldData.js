import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import ColumnTitle from '../partials/ColumnTitle';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormContext } from 'react-hook-form';

export const AuthorFieldData = ({ authorFieldDataId, label, helperText, ...props }) => {
    const {
        formState: { isValidating },
    } = useFormContext();

    return (
        <React.Fragment>
            <Grid item xs={2}>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <ColumnTitle title={label} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
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
            <Grid item xs={3}>
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
