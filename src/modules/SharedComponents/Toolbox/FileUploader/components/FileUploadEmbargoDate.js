import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';

const moment = require('moment');

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

    constructor(props) {
        super(props);
        this.datePickerRef = null;
    }

    _onChange = (event, value) => {
        if (this.props.onChange) this.props.onChange(value);
    };

    _onKeyPress = () => {
        this.datePickerRef.openDialog();
    };

    formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    }

    render() {
        return (
            <div tabIndex={0} onKeyPress={this._onKeyPress}>
                <DatePicker
                    className="embargo-date-picker requiredField"
                    firstDayOfWeek={0}
                    formatDate={this.formatDate}
                    autoOk
                    minDate={this.props.minDate}
                    value={this.props.value}
                    id={'accessDatePicker'}
                    onChange={this._onChange}
                    disabled={this.props.disabled}
                    ref={(datePicker) => (this.datePickerRef = datePicker)}
                />
            </div>
        );
    }
}
