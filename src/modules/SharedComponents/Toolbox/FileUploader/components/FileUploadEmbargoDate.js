import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';
import { GENERIC_DATE_FORMAT } from 'config/general';

export class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        canBeCleared: PropTypes.bool,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        minDate: PropTypes.instanceOf(Date),
        onChange: PropTypes.func,
        value: PropTypes.string,
        fileUploadEmbargoDateId: PropTypes.string,
    };

    static defaultProps = {
        // minDate: new Date(),
        canBeCleared: false,
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
            <KeyboardDatePicker
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
                {...(this.props.canBeCleared ? { clearable: true } : {})}
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
