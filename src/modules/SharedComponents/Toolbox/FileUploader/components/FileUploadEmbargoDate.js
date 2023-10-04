import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import withStyles from '@mui/styles/withStyles';
import { GENERIC_DATE_FORMAT } from 'config/general';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        minDate: PropTypes.instanceOf(Date),
        onChange: PropTypes.func,
        value: PropTypes.string,
        fileUploadEmbargoDateId: PropTypes.string,
    };

    _onChange = value => {
        /* istanbul ignore else */
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        const { classes } = this.props;
        const inputProps = {
            disableUnderline: true,
            classes: {
                root: classes.input,
            },
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
                    renderInput={params => <TextField {...params} variant="standard" />}
                />
            </LocalizationProvider>
        );
    }
}

const styles = () => ({
    input: {
        fontSize: 14,
        fontWeight: 400,
    },
});

export default withStyles(styles)(FileUploadEmbargoDate);
