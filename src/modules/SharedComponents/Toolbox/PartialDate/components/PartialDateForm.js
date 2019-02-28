import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// MUI 1
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import {withStyles} from '@material-ui/core/styles';

const moment = require('moment');

const styles = theme => ({
    fakeTitle: {
        color: theme.palette.secondary.main,
        marginTop: -32
    },
    hideLabel: {
        position: 'absolute',
        left: -10000,
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden'
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
        required: PropTypes.bool,
        hasError: PropTypes.string
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
        this.errors = {day: '', month: '', year: ''};
    }

    componentDidMount() {
        this._setDate({day: '', month: '', year: ''});
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) this.props.onChange(this._setDate(nextState));
    }

    _validate = (state) => {
        let valid;
        const {day, month, year} = state;

        if (this.props.allowPartial) {
            valid = !!year && moment(state).isValid();
        } else {
            valid = !!day && !!month && !!year && moment(state).isValid() && !isNaN(day);
        }
        return valid;
    };

    _displayErrors = (state, valid) => {
        const {day, month, year} = state;
        const {locale} = this.props;

        this.errors.year = this.props.floatingTitleRequired && this.props.allowPartial && !year && 'Year required' || !!year && isNaN(year) && locale.validationMessage.year  || '';

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

        return valid ? moment(date).format(this.props.dateFormat) : '';
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
        const {locale, months} = this.props;
        const renderMonths = months.map((month, index) =>
            <MenuItem key={index} value={index}>{month}</MenuItem>
        );
        const isError = this.errors.day || this.errors.month || this.errors.year || this.props.hasError || '';
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <InputLabel error={!!isError} shrink required={this.props.required} style={{zoom: '0.75'}}>{this.props.floatingTitle}</InputLabel>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={16} style={{marginTop: -12}}>
                        <Grid item xs={4}>
                            <InputLabel htmlFor="day" className={this.props.classes.hideLabel}>Day</InputLabel>
                            <TextField
                                name="day"
                                id="day"
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('day')}
                                onBlur={!this.props.allowPartial ? this._onDateChanged('day') : undefined}
                                placeholder={locale.dayLabel}
                                inputProps={{label: 'day', maxLength: 2}}
                            />
                            {
                                isError &&
                                <FormHelperText error>{isError}</FormHelperText>
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel htmlFor="month" className={this.props.classes.hideLabel}>Month</InputLabel>
                            <Select
                                style={{width: '100%'}}
                                name="month"
                                id="month"
                                error={!!isError}
                                disabled={this.props.disabled}
                                value={this.state.month === null ? -1 : this.state.month}
                                placeholder={locale.monthLabel}
                                onChange={this._onDateChanged('month')}>
                                <MenuItem key={-1} value={-1} disabled>Month</MenuItem>
                                {renderMonths}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel htmlFor="year" className={this.props.classes.hideLabel}>Year</InputLabel>
                            <TextField
                                name="year"
                                id="year"
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                placeholder={locale.yearLabel}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('year')}
                                onBlur={this._onDateChanged('year')}
                                inputProps={{label: 'year', maxLength: 4}}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(PartialDateForm);
