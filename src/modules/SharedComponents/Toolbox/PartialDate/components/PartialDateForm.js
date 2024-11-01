import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import FormHelperText from '@mui/material/FormHelperText';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';

import moment from 'moment';

export const STATUS_VALID = 1; // user entered a valid date
export const STATUS_INVALID = 2; // user entered an invalid date
export const STATUS_FUTURE_DATE = 3; // the date entered is valid but in the future, when prop disableFuture is

export const MONTH_UNSELECTED = -1;

export class PartialDateForm extends PureComponent {
    static propTypes = {
        locale: PropTypes.object,
        onChange: PropTypes.func,
        dateFormat: PropTypes.string,
        allowPartial: PropTypes.bool,
        disabled: PropTypes.bool,
        months: PropTypes.array,
        floatingTitle: PropTypes.string.isRequired,
        floatingTitleRequired: PropTypes.bool,
        required: PropTypes.bool,
        hasError: PropTypes.string,
        disableFuture: PropTypes.bool,
        input: PropTypes.object,
        meta: PropTypes.shape({
            initial: PropTypes.string,
        }),
        partialDateFormId: PropTypes.string.isRequired,
        clearable: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            dayLabel: 'Day',
            monthLabel: 'Month',
            yearLabel: 'Year',
            validationMessage: {
                date: 'Invalid date',
                day: 'Invalid day',
                month: 'Enter a month',
                year: 'Invalid year',
                yearRequired: 'Year required',
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
        disableFuture: false,
    };

    constructor(props) {
        super(props);
        const dateValue =
            // eslint-disable-next-line react/prop-types
            (props.value && moment(props.input.value)) ||
            (props.input && props.input.value && moment(props.input.value)) ||
            (props.meta && props.meta.initial && moment(props.meta.initial)) ||
            null;

        if (!!dateValue && dateValue.isValid() && !dateValue.isSame(PLACEHOLDER_ISO8601_ZULU_DATE)) {
            this.state = {
                day: dateValue.date(),
                month: dateValue.month(),
                year: dateValue.year(),
                setDate: this._setDate,
            };
        } else {
            this.state = {
                day: '',
                month: -1,
                year: '',
                setDate: this._setDate,
            };
        }
        this.errors = { day: '', month: '', year: '' };
    }

    static getDerivedStateFromProps(props, state) {
        props.onChange?.(state.setDate(state));
        return { ...state };
    }

    /**
     * validate the entered date field
     * @param state
     * @returns {int} returns one of STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, defined above
     * @private
     */
    _validate = state => {
        const { day: dayActual, month: monthActual, year } = state;
        // moment validation doesn't recognise -1 or empty string as a valid date
        const month = monthActual === MONTH_UNSELECTED ? null : monthActual;
        const day = isNaN(dayActual) || !dayActual ? null : dayActual;
        const hasRequired = !!year && (this.props.allowPartial || (!!day && month !== null));
        const momentDate = { ...state, month, day };
        const validationStatus = hasRequired && moment(momentDate).isValid() ? STATUS_VALID : STATUS_INVALID;

        if (validationStatus === STATUS_VALID && !!this.props.disableFuture) {
            if (!!this.props.allowPartial) {
                const yearNow = moment().year();
                if (year > yearNow) {
                    return STATUS_FUTURE_DATE;
                }
            } else {
                const dateNow = moment();
                if (!moment(momentDate).isSameOrBefore(dateNow)) {
                    return STATUS_FUTURE_DATE;
                }
            }
        }

        if (!this.props.allowPartial && !!this.props.clearable) {
            if (!year && !day && !month) {
                return STATUS_VALID;
            }
            if (
                !!year &&
                !!day &&
                month !== MONTH_UNSELECTED &&
                moment(momentDate).isValid() &&
                moment(momentDate).isSameOrBefore()
            ) {
                return STATUS_VALID;
            }
            if (!!year && !!day && month !== MONTH_UNSELECTED && !moment(momentDate).isValid()) {
                return STATUS_INVALID;
            }
            if (
                !!year &&
                !!day &&
                month !== MONTH_UNSELECTED &&
                moment(momentDate).isValid() &&
                moment(momentDate).isSameOrAfter()
            ) {
                return STATUS_INVALID;
            }
        }
        return validationStatus;
    };

    _displayErrors = (state, validationStatus, allowPartial, isRequired = '') => {
        const isRequiredHere = isRequired === '' ? this.props.required : isRequired;

        const { day, month, year } = state;
        const { locale } = this.props;
        const validMonthIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        /* istanbul ignore next */
        this.errors.date = (!!year && isNaN(year) && locale.validationMessage.year) || '';

        switch (validationStatus) {
            case STATUS_INVALID:
                this.errors.date =
                    // initial load of 'required' message for required date fields
                    /* istanbul ignore next */
                    (allowPartial &&
                        isRequiredHere &&
                        !year &&
                        !isNaN(year) &&
                        locale.validationMessage.yearRequired) ||
                    // initial load of 'required' message for required date fields
                    /* istanbul ignore next */
                    (isNaN(year) && locale.validationMessage.year) ||
                    // they've just typed in a nonsense number
                    // dont wait for date complete for the moment validation to kick in
                    ((isNaN(day) || (!!day && (day < 1 || day > 31))) && locale.validationMessage.day) ||
                    // // date fields initially blank // remove
                    // (year === null && this._isUnselected(month) && day === null && '') || // remove
                    // they've entered a day
                    /* istanbul ignore next */
                    (year === null && this._isUnselected(month) && !!day && '') ||
                    // they've entered a day and a month
                    /* istanbul ignore next */
                    (year === null && validMonthIndices.includes(month) && !!day && '') ||
                    // encourage them to select a month if the year and day are selected
                    /* istanbul ignore next */
                    (!!year && this._isUnselected(month) && !!day && locale.validationMessage.month) ||
                    locale.validationMessage.date;
                break;
            case STATUS_VALID:
                // cypress does not like more concise format (?!?) (integration tests didnt either?!?!?)
                if (!!year && validMonthIndices.includes(month) && !!day) {
                    // date complete for non-partial-entry
                    this.errors.date = '';
                } else if (allowPartial && !!year && this._isUnselected(month) && !day) {
                    // partial entry means they can get away with just a year
                    this.errors.date = '';
                } else if (!allowPartial && !!this.props.clearable && !year && !day && month === MONTH_UNSELECTED) {
                    this.errors.date = '';
                } else {
                    this.errors.date = locale.validationMessage.date;
                }
                break;
            case STATUS_FUTURE_DATE:
                this.errors.date = locale.validationMessage.future;
                break;
            /* istanbul ignore next */
            default:
                break;
        }
    };

    _isUnselected(month) {
        return month === MONTH_UNSELECTED || month === null;
    }

    _setDate = date => {
        const validationStatus = this._validate(date);

        this._displayErrors(date, validationStatus, this.props.allowPartial, this.props.required);

        // moment validation doesn't recognise -1 as a valid date.
        const month = date.month === MONTH_UNSELECTED ? null : date.month;
        const day = isNaN(date.day) || !date.day ? null : date.day;
        const momentDate = { ...date, month, day };

        return validationStatus === STATUS_VALID ? moment(momentDate).format(this.props.dateFormat) : '';
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
            if (event.target.value === '') {
                // allow the field to be cleared (otherwise it sets NaN, which fires the validation)
                this.setState({ [key]: '' });
            } else {
                this.setState({
                    [key]: parseInt(
                        event.target.value === undefined ? /* istanbul ignore next */ value : event.target.value,
                        10,
                    ),
                });
            }
        };
    };

    render() {
        const { locale, months } = this.props;
        const renderMonths = months.map((month, index) => (
            <MenuItem key={index} value={index}>
                {month}
            </MenuItem>
        ));
        const isError = this.errors.date || this.props.hasError || '';
        return (
            <Grid container spacing={0} padding={0} id={this.props.partialDateFormId}>
                <Grid xs={12}>
                    <InputLabel error={!!isError} shrink required={this.props.required}>
                        {this.props.floatingTitle}
                    </InputLabel>
                </Grid>
                <Grid xs={12}>
                    <Grid container spacing={2} padding={0} style={{ marginTop: -12 }} flexWrap={'nowrap'}>
                        <Grid xs>
                            <TextField
                                variant="standard"
                                name="day"
                                id={`${this.props.partialDateFormId}-day`}
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('day')}
                                onBlur={!this.props.allowPartial ? this._onDateChanged('day') : undefined}
                                placeholder={locale.dayLabel}
                                inputProps={{
                                    label: 'day',
                                    maxLength: 2,
                                    id: `${this.props.partialDateFormId}-day-input`,
                                    'data-analyticsid': `${this.props.partialDateFormId}-day-input`,
                                    'data-testid': `${this.props.partialDateFormId}-day-input`,
                                }}
                                value={this.state.day}
                            />
                            {isError && <FormHelperText error>{isError}</FormHelperText>}
                        </Grid>
                        <Grid xs>
                            <Select
                                variant="standard"
                                id={`${this.props.partialDateFormId}-month`}
                                name="month"
                                fullWidth
                                error={!!isError}
                                disabled={this.props.disabled}
                                value={this.state.month === null ? /* istanbul ignore next */ -1 : this.state.month}
                                placeholder={locale.monthLabel}
                                onChange={this._onDateChanged('month')}
                                inputProps={{
                                    label: 'month',
                                    maxLength: 2,
                                    'data-analyticsid': `${this.props.partialDateFormId}-month-input`,
                                    'data-testid': `${this.props.partialDateFormId}-month-input`,
                                    id: `${this.props.partialDateFormId}-month-input`,
                                }}
                                SelectDisplayProps={{
                                    id: `${this.props.partialDateFormId}-month-select`,
                                    'data-analyticsid': `${this.props.partialDateFormId}-month-select`,
                                    'data-testid': `${this.props.partialDateFormId}-month-select`,
                                }}
                                MenuProps={{
                                    id: `${this.props.partialDateFormId}-month-options`,
                                    'data-analyticsid': `${this.props.partialDateFormId}-month-options`,
                                    'data-testid': `${this.props.partialDateFormId}-month-options`,
                                }}
                            >
                                <MenuItem key={-1} value={MONTH_UNSELECTED}>
                                    Month
                                </MenuItem>
                                {renderMonths}
                            </Select>
                        </Grid>
                        <Grid xs>
                            <TextField
                                variant="standard"
                                name="year"
                                id={`${this.props.partialDateFormId}-year`}
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                placeholder={locale.yearLabel}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('year')}
                                onBlur={this._onDateChanged('year')}
                                inputProps={{
                                    label: 'year',
                                    maxLength: 4,
                                    id: `${this.props.partialDateFormId}-year-input`,
                                    'data-analyticsid': `${this.props.partialDateFormId}-year-input`,
                                    'data-testid': `${this.props.partialDateFormId}-year-input`,
                                }}
                                value={this.state.year}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default PartialDateForm;
