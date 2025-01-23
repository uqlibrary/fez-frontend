import { PartialDateForm, STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, MONTH_UNSELECTED } from './PartialDateForm';

const partialAllowedDateForm = new PartialDateForm({ allowPartial: true });
const partialNotAllowedDateForm = new PartialDateForm({ allowPartial: false });
const futureAllowedDateForm = new PartialDateForm({ disableFuture: false });
const futureNotAllowedDateForm = new PartialDateForm({ disableFuture: true });
const partialFutureNotAllowedDateForm = new PartialDateForm({ allowPartial: true, disableFuture: true });

describe('PartialDateForm unit tests', () => {
    /**
     * Test _validate with allowPartial: true
     */
    it('should validate date on year supplied if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: null, month: null, year: 2015 })).toEqual(STATUS_VALID);
    });

    it('should validate date on year supplied with unselected month if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: null, month: MONTH_UNSELECTED, year: 2015 })).toEqual(
            STATUS_VALID,
        );
    });

    it('should not validate date on day supplied but year is null if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: 25, month: null, year: null })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on year field if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: 25, month: null, year: NaN })).toEqual(STATUS_INVALID);
    });

    it('should not validate a completely invalid date if allowed partial', () => {
        // month 3 is April in moment
        expect(partialAllowedDateForm._validate({ day: 31, month: 3, year: 2017 })).toEqual(STATUS_INVALID);
    });

    /**
     * Test _validate with allowPartial: false
     */
    it('should not validate date on year supplied if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: null, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on year supplied but invalid month value (-1) if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: -1, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on day supplied but year is null if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 25, month: null, year: null })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on year field if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 25, month: null, year: NaN })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on focus and blur on day field if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: NaN, month: null, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should not validate date on invalid month selected if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: -1, year: 2015 })).toEqual(STATUS_INVALID);
    });

    it('should validate date on day, month, year supplied if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    it('should not validate a completely invalid date if not allowed partial', () => {
        // month: 3 is april in moment
        expect(partialNotAllowedDateForm._validate({ day: 31, month: 3, year: 2017 })).toEqual(STATUS_INVALID);
    });

    /**
     * Test _validate with disableFuture: true
     * current date is set to 2017 with MockDate.set('6/30/2017'); in test.setup.js
     */
    it('should block future date if not allowed future date', () => {
        expect(futureNotAllowedDateForm._validate({ day: 10, month: 2, year: 2018 })).toEqual(STATUS_FUTURE_DATE);
    });
    it('should allow current date if not allowed future date', () => {
        // month: 5 is june in moment
        expect(futureNotAllowedDateForm._validate({ day: 30, month: 5, year: 2017 })).toEqual(STATUS_VALID);
    });
    it('should allow past date if not allowed future date', () => {
        expect(futureNotAllowedDateForm._validate({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    /**
     * Test _validate with disableFuture: false
     */
    it('should allow future date if allowed future date', () => {
        expect(futureAllowedDateForm._validate({ day: 10, month: 2, year: 2018 })).toEqual(STATUS_VALID);
    });
    it('should allow current date if allowed future date', () => {
        // month: 5 is june in moment
        expect(futureAllowedDateForm._validate({ day: 30, month: 5, year: 2017 })).toEqual(STATUS_VALID);
    });
    it('should allow past date if allowed future date', () => {
        expect(futureAllowedDateForm._validate({ day: 10, month: 2, year: 2015 })).toEqual(STATUS_VALID);
    });

    /**
     * partial future dates
     */
    it('should not allow partial future date if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm._validate({ day: null, month: null, year: 2018 })).toEqual(
            STATUS_FUTURE_DATE,
        );
    });
    it('should allow partial past date if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm._validate({ day: null, month: null, year: 2015 })).toEqual(STATUS_VALID);
    });
    it('should allow partial current year if not allowed future date', () => {
        expect(partialFutureNotAllowedDateForm._validate({ day: null, month: null, year: 2017 })).toEqual(STATUS_VALID);
    });
});
