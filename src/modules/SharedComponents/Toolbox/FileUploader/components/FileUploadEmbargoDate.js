import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GENERIC_DATE_FORMAT } from 'config/general';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { red } from '@mui/material/colors';

export const FileUploadEmbargoDate = ({ disabled, minDate, onChange, onKeyUp, value, fileUploadEmbargoDateId }) => {
    const _onChange = value => {
        onChange?.(value);
    };

    const inputProps = {
        disableUnderline: true,
        'data-analyticsid': `${fileUploadEmbargoDateId}-input`,
        'data-testid': `${fileUploadEmbargoDateId}-input`,
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                value={value ? new Date(value) : null}
                inputFormat={GENERIC_DATE_FORMAT}
                minDate={minDate}
                onChange={_onChange}
                disabled={disabled}
                InputProps={inputProps}
                renderInput={params => (
                    <TextField
                        {...params}
                        onKeyUpCapture={onKeyUp}
                        variant="standard"
                        sx={{
                            '& .MuiInput-input': {
                                fontSize: 14,
                                fontWeight: 400,
                                ...(params.error ? { color: red[700] } : {}),
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};
FileUploadEmbargoDate.propTypes = {
    disabled: PropTypes.bool,
    minDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    value: PropTypes.string,
    fileUploadEmbargoDateId: PropTypes.string,
};

export default React.memo(FileUploadEmbargoDate);
