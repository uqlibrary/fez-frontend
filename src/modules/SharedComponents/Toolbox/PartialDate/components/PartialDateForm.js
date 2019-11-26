import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// MUI 1
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';

const moment = require('moment');

const styles = theme => ({
    fakeTitle: {
        color: theme.palette.secondary.main,
        marginTop: -32,
    },
    hideLabel: {
        position: 'absolute',
        left: -10000,
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
    },
});

export const STATUS_VALID = 1; // user entered a valid date
export const STATUS_INVALID = 2; // user entered an invalid date
export const STATUS_FUTURE_DATE = 3; // the date entered is valid but in the future, when prop disableFuture is

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
        hasError: PropTypes.string,
        disableFuture: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            dayLabel: 'Day',
            monthLabel: 'Month',
            yearLabel: 'Year',
            validationMessage: {
                day: 'Invalid day',
                month: 'Invalid month',
                year: 'Invalid year',
                future: 'Date must be before now',
            },
            minNumberCharCode: 48,
            maxNumberCharCode: 57,
        },
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        dateFormat: 'YYYY-MM-DD',
        allowPartial: false,
        floatingTitle: 'Enter a date',
        floatingTitleRequired: false,
        className: '',
        disableFuture: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            day: null,
            month: null,
            year: null,
        };
        this.errors = { day: '', month: '', year: '' };
    }

    componentDidMount() {
        this._setDate({ day: '', month: '', year: '' });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) {
            this.props.onChange(this._setDate(nextState));
        }
    }

    /**
     * validate the entered date field
     * @param state
     * @returns {int} returns one of STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, defined above
     * @private
     */
    _validate = state => {
        let validationStatus;
        const { day, month, year } = state;

        if (this.props.allowPartial) {
            validationStatus = !!year && moment(state).isValid() ? STATUS_VALID : STATUS_INVALID;
        } else {
            validationStatus =
                !!day && month !== null && !!year && moment(state).isValid() ? STATUS_VALID : STATUS_INVALID;
        }

        if (validationStatus === STATUS_VALID && !!this.props.disableFuture) {
            if (!!this.props.allowPartial) {
                const yearNow = moment().year();
                if (state.year > yearNow) {
                    return STATUS_FUTURE_DATE;
                }
            } else {
                const dateNow = moment();
                if (!moment(state).isSameOrBefore(dateNow)) {
                    return STATUS_FUTURE_DATE;
                }
            }
        }

        return validationStatus;
    };

    _displayErrors = (state, validationStatus) => {
        const { day, month, year } = state;
        const { locale } = this.props;

        this.errors.year =
            (this.props.floatingTitleRequired && this.props.allowPartial && !year && 'Year required') ||
            (!!year && isNaN(year) && locale.validationMessage.year) ||
            '';

        if (this.props.allowPartial) {
            this.errors.day =
                day && year && month > -1 && validationStatus !== STATUS_VALID ? locale.validationMessage.day : '';
        } else {
            this.errors.month = month < 0 ? locale.validationMessage.month : '';
            if (validationStatus === STATUS_INVALID) {
                this.errors.day =
                    (isNaN(day) && !!this.props.required) || ((month !== null || month > -1) && year)
                        ? locale.validationMessage.day
                        : '';
            } else if (validationStatus === STATUS_FUTURE_DATE) {
                this.errors.day = locale.validationMessage.future;
            } else {
                this.errors.day = '';
            }
        }
    };

    _setDate = date => {
        const validationStatus = this._validate(date);

        this._displayErrors(date, validationStatus);

        return validationStatus === STATUS_VALID ? moment(date).format(this.props.dateFormat) : '';
    };

    _isNumber = event => {
        if (
            event.charCode < this.props.locale.minNumberCharCode ||
            event.charCode > this.props.locale.maxNumberCharCode
        ) {
            event.preventDefault();
        }
    };

    _onDateChanged = key => {
        return (event, index, value) => {
            this.setState({
                [key]: parseInt(event.target.value === undefined ? value : event.target.value, 10),
            });
        };
    };

    render() {
        const { locale, months } = this.props;
        const renderMonths = months.map((month, index) => (
            <MenuItem key={index} value={index}>
                {month}
            </MenuItem>
        ));
        const isError = this.errors.day || this.errors.month || this.errors.year || this.props.hasError || '';
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <InputLabel error={!!isError} shrink required={this.props.required} style={{ zoom: '0.75' }}>
                        {this.props.floatingTitle}
                    </InputLabel>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={16} style={{ marginTop: -12 }}>
                        <Grid item xs={4}>
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
                                inputProps={{ label: 'day', maxLength: 2 }}
                            />
                            {isError && <FormHelperText error>{isError}</FormHelperText>}
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                style={{ width: '100%' }}
                                name="month"
                                id="month"
                                error={!!isError}
                                disabled={this.props.disabled}
                                value={this.state.month === null ? -1 : this.state.month}
                                placeholder={locale.monthLabel}
                                onChange={this._onDateChanged('month')}
                                inputProps={{ label: 'month', maxLength: 2 }}
                            >
                                <MenuItem key={-1} value={-1} disabled={!this.props.allowPartial}>
                                    Month
                                </MenuItem>
                                {renderMonths}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
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
                                inputProps={{ label: 'year', maxLength: 4 }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(PartialDateForm);
