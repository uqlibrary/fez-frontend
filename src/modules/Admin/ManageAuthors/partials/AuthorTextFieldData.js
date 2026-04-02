import React from 'react';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { AuthorFieldData } from './AuthorFieldData';

export const AuthorTextFieldData = props => (
    <AuthorFieldData
        {...props}
        component={({ isValidating, authorFieldDataId, ...reset }) => (
            <TextField
                {...reset}
                label={reset.label}
                textFieldId={authorFieldDataId}
                fullWidth
                InputProps={{
                    style: {
                        fontSize: 14,
                        fontWeight: 400,
                    },
                    ...reset.InputProps,
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
                        ...(reset.error || { color: '#4085C6' }),
                        fontWeight: 400,
                    },
                }}
            />
        )}
    />
);

AuthorTextFieldData.propTypes = {};

export default React.memo(AuthorTextFieldData);
