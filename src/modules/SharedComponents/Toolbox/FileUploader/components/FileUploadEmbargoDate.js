import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GENERIC_DATE_FORMAT } from 'config/general';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { red } from '@mui/material/colors';

export class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
        minDate: PropTypes.instanceOf(Date),
        onChange: PropTypes.func,
        onKeyUp: PropTypes.func,
        value: PropTypes.string,
        fileUploadEmbargoDateId: PropTypes.string,
    };

    _onChange = value => {
        /* istanbul ignore else */
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        const inputProps = {
            disableUnderline: true,
            'data-analyticsid': `${this.props.fileUploadEmbargoDateId}-input`,
            'data-testid': `${this.props.fileUploadEmbargoDateId}-input`,
        };

        return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    value={this.props.value ? new Date(this.props.value) : null}
                    inputFormat={GENERIC_DATE_FORMAT}
                    minDate={this.props.minDate}
                    onChange={this._onChange}
                    disabled={this.props.disabled}
                    InputProps={inputProps}
                    renderInput={params => (
                        <TextField
                            {...params}
                            onKeyUpCapture={this.props.onKeyUp}
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
    }
}

export default FileUploadEmbargoDate;
