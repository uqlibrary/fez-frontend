import { _displayErrors, STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE } from './PartialDateForm';

const validationMessage = {
    date: 'Invalid date',
    day: 'Invalid day',
    month: 'Enter a month',
    year: 'Invalid year',
    yearRequired: 'Year required',
    future: 'Date must be before now',
};

const setError = jest.fn();
const displayErrors = (state, validationStatus, allowPartial = true, required = false) => {
    _displayErrors({
        state,
        setError,
        validationStatus,
        allowPartial,
        locale: { validationMessage },
        clearable: true,
        isRequired: required,
    });
};

describe('PartialDateForm unit tests', () => {
    it('should display validation error on first load when allowed partial', () => {
        displayErrors({ day: null, month: null, year: null }, STATUS_INVALID, true, true);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.yearRequired);
    });

    it('should not display validation error if year is present and allowed partial', () => {
        displayErrors({ day: null, month: null, year: 2015 }, STATUS_VALID);
        expect(setError).toHaveBeenLastCalledWith('');
    });

    it('shouldnt display validation message on day if its invalid, month and year not touched and partial ok', () => {
        displayErrors({ day: 32, month: -1, year: null }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith('');
    });

    it("should display validation message on day if it's invalid, year touched and allowed partial", () => {
        displayErrors({ day: 32, month: null, year: NaN }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.year);
    });

    it('should display validation message on year field touched if allowed partial', () => {
        displayErrors({ day: 25, month: -1, year: NaN }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.year); // was '' but suspect mistake
        displayErrors({ day: null, month: -1, year: 'a' }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.year);
    });

    it('should display prompt to select a month if valid day and year present for partial', () => {
        displayErrors({ day: 29, month: null, year: 2015 }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.month);
    });

    it('should display prompt for required year if valid day and year present for partial', () => {
        displayErrors({ day: null, month: null, year: 'blah' }, STATUS_INVALID);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.year);
    });

    it('should not display any validation message on year present if partial not allowed', () => {
        displayErrors({ day: null, month: null, year: 2015 }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith('');
    });

    it('should display validation message on month if invalid month (-1) selected if partial not allowed', () => {
        displayErrors({ day: 25, month: -1, year: 2015 }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.month);
    });

    it('should not validate date on focus and blur on year field if partial not allowed', () => {
        displayErrors({ day: 25, month: null, year: NaN }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.year);
    });

    it('should display validation message on day on touched day field if partial not allowed', () => {
        displayErrors({ day: NaN, month: null, year: 2015 }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.day);
    });

    it('should not display any validation message if valid day, month, year present if partial not allowed', () => {
        displayErrors({ day: 10, month: 2, year: 2015 }, STATUS_VALID, false);
        expect(setError).toHaveBeenLastCalledWith('');
    });

    it('should display validation message on day if invalid day and valid month, year present for non-partial', () => {
        displayErrors({ day: 29, month: 1, year: 2015 }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.date);
    });

    it('should display prompt to select a month if valid day and year present for non partial', () => {
        displayErrors({ day: 29, month: null, year: 2015 }, STATUS_INVALID, false);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.month);
    });

    // future
    it('should display validation message on day if future date entered if not allowed future', () => {
        displayErrors({ day: 29, month: 1, year: 2018 }, STATUS_FUTURE_DATE);
        expect(setError).toHaveBeenLastCalledWith(validationMessage.future);
    });

    it('should not display validation message on day if current date entered if not allowed future', () => {
        displayErrors({ day: 30, month: 5, year: 2017 }, STATUS_VALID);
        expect(setError).toHaveBeenLastCalledWith('');
    });

    it('should not display validation message on day if past date entered if not allowed future', () => {
        displayErrors({ day: 29, month: 1, year: 2015 }, STATUS_VALID);
        expect(setError).toHaveBeenLastCalledWith('');
    });
});
