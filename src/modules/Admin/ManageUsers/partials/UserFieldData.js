import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import ColumnTitle from '../partials/ColumnTitle';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

export const UserFieldData = ({ userFieldDataId, label, helperText, type = 'text', ...props }) => {
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
                {type === 'checkbox' && (
                    <Checkbox
                        {...props}
                        color={!!props.input.value ? 'primary' : 'secondary'}
                        checked={!!props.input.value}
                        inputProps={{
                            'data-analyticsid': `${userFieldDataId}-input`,
                            'data-testid': `${userFieldDataId}-input`,
                            id: `${userFieldDataId}-input`,
                        }}
                        onChange={event => props.input.onChange(event.target.checked ? 1 : 0)}
                    />
                )}
                {type === 'text' && (
                    <TextField
                        {...props}
                        label={label}
                        textFieldId={userFieldDataId}
                        fullWidth
                        InputProps={{
                            style: {
                                fontSize: 14,
                                fontWeight: 400,
                            },
                            ...props.InputProps,
                            ...((!!props.meta.asyncValidating && {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <CircularProgress
                                            size={18}
                                            thickness={2}
                                            color="primary"
                                            id="checking-existing-user-progress"
                                            data-testid="checking-existing-user-progress"
                                        />
                                    </InputAdornment>
                                ),
                            }) ||
                                {}),
                        }}
                        InputLabelProps={{
                            style: {
                                ...(!props.meta.error ? { color: '#4085C6' } : {}),
                                fontWeight: 400,
                            },
                        }}
                    />
                )}
            </Grid>
            <Grid item xs={3}>
                <FormHelperText variant="outlined">{helperText}</FormHelperText>
            </Grid>
        </React.Fragment>
    );
};

UserFieldData.propTypes = {
    userFieldDataId: PropTypes.string,
    input: PropTypes.object,
    onChange: PropTypes.func,
    meta: PropTypes.object,
    helperText: PropTypes.string,
    InputProps: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
};

export default React.memo(UserFieldData);
