import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import ColumnTitle from '../partials/ColumnTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

export const UserFieldData = ({ userFieldDataId, label, helperText, type, ...props }) => {
    return (
        <React.Fragment>
            <Grid item xs={2}>
                <Grid container justify="flex-end">
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

UserFieldData.defaultProps = {
    type: 'text',
};

export default React.memo(UserFieldData);
