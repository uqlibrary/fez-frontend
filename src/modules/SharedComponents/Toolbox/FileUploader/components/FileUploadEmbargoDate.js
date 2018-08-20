import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui-pickers/DatePicker';


export default class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date)
    };

    static defaultProps = {
        value: new Date(),
        minDate: new Date()
    };

    _onChange = (value) => {
        if (this.props.onChange) this.props.onChange(value);
    };

    render() {
        return (
            <DatePicker
                autoOk
                format="DD/MM/YYYY"
                minDate={this.props.minDate}
                value={this.props.value}
                onChange={this._onChange}
                disabled={this.props.disabled}
            />
        );
    }
}
