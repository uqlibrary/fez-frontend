import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const moment = require('moment');

class PartialDateForm extends Component {
    static propTypes = {
        locale: PropTypes.object,
        onChange: PropTypes.func,
        dateFormat: PropTypes.string,
        allowPartial: PropTypes.bool,
        disabled: PropTypes.bool,
        months: PropTypes.array,
        className: PropTypes.string,
        floatingTitle: PropTypes.string.isRequired,
        floatingTitleRequired: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            dayLabel: 'Day',
            monthLabel: 'Month',
            yearLabel: 'Year',
            validationMessage: {
                day: 'Invalid day',
                month: 'Invalid month',
                year: 'Invalid year'
            },
            minNumberCharCode: 48,
            maxNumberCharCode: 57
        },
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        dateFormat: 'YYYY-MM-DD',
        allowPartial: false,
        floatingTitle: 'Enter a date',
        floatingTitleRequired: false,
        className: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            day: null,
            month: null,
            year: null
        };
        this.errors = {};
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) this.props.onChange(this._setDate(nextState));
    }

    _validate = (state) => {
        let valid;
        const {day, month, year} = state;

        if (this.props.allowPartial) {
            valid = !isNaN(year) && year !== null && moment(state).isValid();
        } else {
            valid = moment(state).isValid() && !isNaN(day) && day !== null && !isNaN(year) && year !== null && month !== null;
        }

        return valid;
    };

    _displayErrors = (state, valid) => {
        const {day, month, year} = state;
        const {locale} = this.props;

        this.errors.year = isNaN(year) ? locale.validationMessage.year : '';

        if (this.props.allowPartial) {
            this.errors.month = (year && month < 0) ? locale.validationMessage.month : '';
            this.errors.day = (day && year && month > -1 && !valid) ? locale.validationMessage.day : '';
        } else {
            this.errors.month = month < 0 ? locale.validationMessage.month : '';
            this.errors.day = (isNaN(day) || ((month !== null || month > -1) && year && !valid)) ? locale.validationMessage.day : '';
        }
    };

    _setDate = (date) => {
        const valid = this._validate(date);

        this._displayErrors(date, valid);

        if (valid) {
            if (this.props.allowPartial) {
                date.month = date.month < 0 ? 0 : date.month;
            }
            return moment(date).format(this.props.dateFormat);
        }
        return '';
    };

    _isNumber = (event) => {
        if (event.charCode < this.props.locale.minNumberCharCode || event.charCode > this.props.locale.maxNumberCharCode) {
            event.preventDefault();
        }
    };

    _onDateChanged = (key) => {
        return (event, index, value) => {
            this.setState({
                [key]: parseInt(event.target.value === undefined ? value : event.target.value, 10)
            });
        };
    };

    render() {
        const {locale, months, className} = this.props;
        const renderMonths = months.map((month, index) =>
            <MenuItem key={index} value={index} primaryText={month}/>
        );
        return (
            <div className="columns is-multiline is-gapless-mobile">
                <div className={this.props.floatingTitleRequired ? ('column is-12 dateTitle required') : ('column is-12 dateTitle')}>
                    {this.props.floatingTitle}
                </div>
                <div className="column">
                    <TextField
                        name="day"
                        type="text"
                        maxLength="2"
                        className={!this.props.allowPartial && className ? className : null}
                        fullWidth
                        disabled={this.props.disabled}
                        errorText={this.errors.day}
                        onKeyPress={this._isNumber}
                        onChange={this._onDateChanged('day')}
                        onBlur={!this.props.allowPartial ? this._onDateChanged('day') : undefined}
                        hintText={locale.dayLabel}
                    />
                </div>
                <div className="column">
                    <SelectField
                        name="month"
                        dropDownMenuProps={{animated: false}}
                        fullWidth
                        disabled={this.props.disabled}
                        value={this.state.month}
                        className={!this.props.allowPartial && className ? className : null}
                        hintText={locale.monthLabel}
                        errorText={this.errors.month}
                        onChange={this._onDateChanged('month')}>
                        <MenuItem key={-1} value={-1} primaryText=""/>
                        {renderMonths}
                    </SelectField>
                </div>
                <div className="column">
                    <TextField
                        name="year"
                        type="text"
                        fullWidth
                        className={className + ' mui-long-labels-fix'}
                        maxLength="4"
                        disabled={this.props.disabled}
                        hintText={locale.yearLabel}
                        errorText={this.errors.year}
                        onKeyPress={this._isNumber}
                        onChange={this._onDateChanged('year')}
                        onBlur={this._onDateChanged('year')}
                    />
                </div>
            </div>
        );
    }
}


export default PartialDateForm;
