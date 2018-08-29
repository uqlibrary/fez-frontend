import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// MUI 1
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import {withStyles} from '@material-ui/core/styles';

const moment = require('moment');

const styles = theme => ({
    fakeTitle: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        fontSize: 12,
        marginBottom: -100,
        marginTop: 0
    }
});

export class PartialDateForm extends Component {
    static propTypes = {
        locale: PropTypes.object,
        onChange: PropTypes.func,
        dateFormat: PropTypes.string,
        allowPartial: PropTypes.bool,
        disabled: PropTypes.bool,
        months: PropTypes.array,
        className: PropTypes.string,
        floatingTitle: PropTypes.string.isRequired,
        floatingTitleRequired: PropTypes.bool,
        classes: PropTypes.object,
        required: PropTypes.bool
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
        console.log(this.state);
        const {locale, months} = this.props;
        const renderMonths = months.map((month, index) =>
            <MenuItem key={index} value={index + 1}>{month}</MenuItem>
        );
        const {classes} = this.props;
        const isError = !!this.errors.day || !!this.errors.month || !!this.errors.year;
        return (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <Typography variant="subheading" classes={{subheading: classes.fakeTitle}}>{this.props.floatingTitle}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="day"
                        type="text"
                        maxLength="2"
                        fullWidth
                        disabled={this.props.disabled}
                        error={isError}
                        onKeyPress={this._isNumber}
                        onChange={this._onDateChanged('day')}
                        onBlur={!this.props.allowPartial ? this._onDateChanged('day') : undefined}
                        placeholder={locale.dayLabel}
                    />
                    {
                        isError &&
                        <FormHelperText error>Invalid date</FormHelperText>
                    }
                </Grid>
                <Grid item xs={4}>
                    <Select
                        style={{width: '100%'}}
                        name="month"
                        error={isError}
                        disabled={this.props.disabled}
                        value={this.state.month || -1}
                        placeholder={locale.monthLabel}
                        onChange={this._onDateChanged('month')}>
                        <MenuItem key={-1} value={-1} disabled>Month</MenuItem>
                        {renderMonths}
                    </Select>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        name="year"
                        type="text"
                        fullWidth
                        maxLength="4"
                        disabled={this.props.disabled}
                        placeholder={locale.yearLabel}
                        error={isError}
                        onKeyPress={this._isNumber}
                        onChange={this._onDateChanged('year')}
                        onBlur={this._onDateChanged('year')}
                    />
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(PartialDateForm);
