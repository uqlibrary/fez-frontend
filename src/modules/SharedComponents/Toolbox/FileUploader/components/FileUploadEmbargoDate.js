import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui-pickers/DatePicker';
import { withStyles } from '@material-ui/core/styles';


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
        minDate: new Date('yesterday')
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
                autoOk
                format="DD/MM/YYYY"
                minDate={this.props.minDate}
                value={this.props.value}
                onChange={this._onChange}
                disabled={this.props.disabled}
                InputProps={inputProps}
            />
        );
    }
}

const styles = () => ({
    input: {
        fontSize: 14,
        fontWeight: 600
    }
});

export default withStyles(styles)(FileUploadEmbargoDate);
