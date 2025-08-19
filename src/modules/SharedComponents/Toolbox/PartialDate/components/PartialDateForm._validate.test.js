import { validate, STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, MONTH_UNSELECTED } from './PartialDateForm';

const partialAllowedDateForm = (allowPartial = true) => ({ day, month, year }) =>
    validate({ state: { day, month, year }, allowPartial });
const partialNotAllowedDateForm = (allowPartial = false) => ({ day, month, year }) =>
    validate({ state: { day, month, year }, allowPartial });
const futureAllowedDateForm = (disableFuture = false) => ({ day, month, year }) =>
    validate({ state: { day, month, year }, disableFuture });
const futureNotAllowedDateForm = (disableFuture = true) => ({ day, month, year }) =>
    validate({ state: { day, month, year }, disableFuture });
const partialFutureNotAllowedDateForm = (allowPartial = true, disableFuture = true) => ({ day, month, year }) =>
    validate({ state: { day, month, year }, allowPartial, disableFuture });

describe('PartialDateForm unit tests', () => {
    /**
     * Test validate with allowPartial: true
     */
    it('should validate date on year supplied if allowed partial', () => {
        expect(partialAllowedDateForm()({ day: null, month: null, year: 2015 })).toEqual(STATUS_VALID);
    });

    it('should validate date on year supplied with unselected month if allowed partial', () => {
        expect(partialAllowedDateForm()({ day: null, month: MONTH_UNSELECTED, year: 2015 })).toEqual(STATUS_VALID);
    });

    it('should not validate date on day supplied but year is null if allowed partial', () => {
        expect(partialAllowedDateForm()({ day: 25, month: null, year: null })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on year field if allowed partial', () => {
        expect(partialAllowedDateForm()({ day: 25, month: null, year: NaN })).toEqual(STATUS_INVALID);
    });

    it('should not validate a completely invalid date if allowed partial', () => {
        // month 3 is April in moment
        expect(partialAllowedDateForm()({ day: 31, month: 3, year: 2017 })).toEqual(STATUS_INVALID);
    });

    /**
     * Test validate with allowPartial: false
     */
    it('should not validate date on year supplied if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: null, month: null, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on year supplied but invalid month value (-1) if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: null, month: -1, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on day supplied but year is null if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: 25, month: null, year: null })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on year field if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: 25, month: null, year: NaN })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on day field if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: NaN, month: null, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on invalid month selected if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: null, month: -1, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should validate date on day, month, year supplied if not allowed partial', () => {
        expect(partialNotAllowedDateForm()({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    it('should not validate a completely invalid date if not allowed partial', () => {
        // month: 3 is april in moment
        expect(partialNotAllowedDateForm()({ day: 31, month: 3, year: 2017 })).toEqual(STATUS_INVALID);
    });

    /**
     * Test validate with disableFuture: true
     * current date is set to 2017 with MockDate.set('6/30/2017'); in test.setup.js
     */
    it('should block future date if not allowed future date', () => {
        expect(futureNotAllowedDateForm()({ day: 10, month: 2, year: 2018 })).toEqual(STATUS_FUTURE_DATE);
    });
    it('should allow current date if not allowed future date', () => {
        // month: 5 is june in moment
        expect(futureNotAllowedDateForm()({ day: 30, month: 5, year: 2017 })).toEqual(STATUS_VALID);
    });
    it('should allow past date if not allowed future date', () => {
        expect(futureNotAllowedDateForm()({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    /**
     * Test validate with disableFuture: false
     */
    it('should allow future date if allowed future date', () => {
        expect(futureAllowedDateForm()({ day: 10, month: 2, year: 2018 })).toEqual(STATUS_VALID);
    });
    it('should allow current date if allowed future date', () => {
        // month: 5 is june in moment
        expect(futureAllowedDateForm()({ day: 30, month: 5, year: 2017 })).toEqual(STATUS_VALID);
    });
    it('should allow past date if allowed future date', () => {
        expect(futureAllowedDateForm()({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    /**
     * partial future dates
     */
    it('should not allow partial future date if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm()({ day: null, month: null, year: 2018 })).toEqual(STATUS_FUTURE_DATE);
    });
    it('should allow partial past date if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm()({ day: null, month: null, year: 2015 })).toEqual(STATUS_VALID);
    });
    it('should allow partial current year if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm()({ day: null, month: null, year: 2017 })).toEqual(STATUS_VALID);
    });
});
