import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui-pickers/DatePicker';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Event from '@material-ui/icons/Event';
import {GENERIC_DATE_FORMAT} from 'config/general';


export class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date),
        classes: PropTypes.object
    };

    static defaultProps = {
        value: new Date(),
        minDate: new Date()
    };

    _onChange = (value) => {
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        const {classes} = this.props;
        const inputProps = {
            disableUnderline: true,
            classes: {
                root: classes.input
            }
        };

        return (
            <DatePicker
                format={GENERIC_DATE_FORMAT}
                minDate={this.props.minDate}
                value={this.props.value}
                onChange={this._onChange}
                disabled={this.props.disabled}
                InputProps={inputProps}
                keyboard
                allowKeyboardControl
                autoOk
                leftArrowIcon={<KeyboardArrowLeft/>}
                rightArrowIcon={<KeyboardArrowRight/>}
                keyboardIcon={<Event/>}
            />
        );
    }
}

const styles = () => ({
    input: {
        fontSize: 14,
        fontWeight: 400
    }
});

export default withStyles(styles)(FileUploadEmbargoDate);
