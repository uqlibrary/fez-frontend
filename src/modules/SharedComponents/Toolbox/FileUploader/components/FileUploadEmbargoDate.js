import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DatePicker from '@mui/lab/DatePicker';
import withStyles from '@mui/styles/withStyles';
import { GENERIC_DATE_FORMAT } from 'config/general';

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
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        const { classes } = this.props;
        const inputProps = {
            disableUnderline: true,
            classes: {
                root: classes.input,
            },
        };

        return (
            <DatePicker
                format={GENERIC_DATE_FORMAT}
                value={this.props.value ? new Date(this.props.value) : null}
                variant="inline"
                minDate={this.props.minDate}
                onChange={this._onChange}
                disabled={this.props.disabled}
                InputProps={inputProps}
                allowKeyboardControl
                autoOk
                data-testid={`${this.props.fileUploadEmbargoDateId}-input`}
            />
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
