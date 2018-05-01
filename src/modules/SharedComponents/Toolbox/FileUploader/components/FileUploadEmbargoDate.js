import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';

export default class FileUploadEmbargoDate extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        dateTimeFormat: PropTypes.string,
        disabled: PropTypes.bool,
        value: PropTypes.instanceOf(Date),
        minDate: PropTypes.instanceOf(Date)
    };

    static defaultProps = {
        locale: {
            datePickerLocale: 'en-AU'
        },
        dateTimeFormat: global.Intl.DateTimeFormat,
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

    render() {
        const {datePickerLocale} = this.props.locale;
        const dateTimeFormat = this.props.dateTimeFormat;
        return (
            <div tabIndex={0} onKeyPress={this._onKeyPress}>
                <DatePicker
                    className="embargo-date-picker requiredField"
                    DateTimeFormat={dateTimeFormat}
                    firstDayOfWeek={0}
                    locale={datePickerLocale}
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
