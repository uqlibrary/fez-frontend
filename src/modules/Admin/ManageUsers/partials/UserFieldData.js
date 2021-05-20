import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import ColumnTitle from '../partials/ColumnTitle';

export const UserFieldData = ({ userFieldDataId, data, label, helperText, type, ...props }) => {
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
                        color={!!data ? 'primary' : 'secondary'}
                        inputProps={{
                            'data-testid': `${userFieldDataId}-input`,
                            id: `${userFieldDataId}-input`,
                        }}
                        checked={!!data}
                        onChange={e => props.onChange(e.target.name, e.target.checked ? 1 : 0)}
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
                        }}
                        InputLabelProps={{
                            style: {
                                ...(!props.error ? { color: '#4085C6' } : {}),
                                fontWeight: 400,
                            },
                        }}
                        value={data || ''}
                        onChange={e => props.onChange(e.target.name, e.target.value)}
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
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.bool,
    helperText: PropTypes.string,
    InputProps: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
};

UserFieldData.defaultProps = {
    type: 'text',
};

export default React.memo(UserFieldData);
