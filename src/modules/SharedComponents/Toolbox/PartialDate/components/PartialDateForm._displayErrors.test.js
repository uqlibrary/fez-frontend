import { PartialDateForm, STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE } from './PartialDateForm';

const validationMessage = {
    date: 'Invalid date',
    day: 'Invalid day',
    month: 'Enter a month',
    year: 'Invalid year',
    yearRequired: 'Year required',
    future: 'Date must be before now',
};

const props = {
    classes: {
        fakeTitle: {},
    },
    locale: {
        validationMessage,
    },
};

const partialAllowedDateForm = new PartialDateForm({
    ...props,
    allowPartial: true,
});
const partialNotAllowedDateForm = new PartialDateForm({
    ...props,
    allowPartial: false,
});
const futureNotAllowedDateForm = new PartialDateForm({
    ...props,
    disableFuture: true,
});

describe('PartialDateForm unit tests', () => {
    it('should display validation error on first load when allowed partial', () => {
        partialAllowedDateForm._displayErrors({ day: null, month: null, year: null }, STATUS_INVALID, true, true);
        expect(partialAllowedDateForm.errors).toMatchObject({ date: validationMessage.yearRequired });
    });

    it('should not display validation error if year is present and allowed partial', () => {
        partialAllowedDateForm._displayErrors({ day: null, month: null, year: 2015 }, STATUS_VALID);
        expect(partialAllowedDateForm.errors).toMatchObject({});
    });

    it('shouldnt display validation message on day if its invalid, month and year not touched and partial ok', () => {
        partialAllowedDateForm._displayErrors({ day: 32, month: null, year: null }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({});
    });

    it("should display validation message on day if it's invalid, year touched and allowed partial", () => {
        partialAllowedDateForm._displayErrors({ day: 32, month: null, year: NaN }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({ date: validationMessage.year });
    });

    it('should display validation message on year field touched if allowed partial', () => {
        partialAllowedDateForm._displayErrors({ day: 25, month: null, year: NaN }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({ year: '' });
        partialAllowedDateForm._displayErrors({ day: null, month: null, year: 'a' }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({ date: validationMessage.year });
    });

    it('should display prompt to select a month if valid day and year present for partial', () => {
        partialAllowedDateForm._displayErrors({ day: 29, month: null, year: 2015 }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({ date: validationMessage.month });
    });

    it('should display prompt for required year if valid day and year present for partial', () => {
        partialAllowedDateForm._displayErrors({ day: null, month: null, year: 'blah' }, STATUS_INVALID);
        expect(partialAllowedDateForm.errors).toMatchObject({ date: validationMessage.year });
    });

    it('should not display any validation message on year present if partial not allowed', () => {
        partialNotAllowedDateForm._displayErrors({ day: null, month: null, year: 2015 }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({});
    });

    it('should display validation message on month if invalid month (-1) selected if partial not allowed', () => {
        partialNotAllowedDateForm._displayErrors({ day: null, month: -1, year: 2015 }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.date });
    });

    it('should not validate date on focus and blur on year field if partial not allowed', () => {
        partialNotAllowedDateForm._displayErrors({ day: 25, month: null, year: NaN }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.year });
    });

    it('should display validation message on day on touched day field if partial not allowed', () => {
        partialNotAllowedDateForm._displayErrors({ day: NaN, month: null, year: 2015 }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.day });
    });

    it('should not display any validation message if valid day, month, year present if partial not allowed', () => {
        partialNotAllowedDateForm._displayErrors({ day: 10, month: 2, year: 2015 }, STATUS_VALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({});
    });

    it('should display validation message on day if invalid day and valid month, year present for non-partial', () => {
        partialNotAllowedDateForm._displayErrors({ day: 29, month: 1, year: 2015 }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.date });
    });

    it('should display prompt to select a month if valid day and year present for non partial', () => {
        partialNotAllowedDateForm._displayErrors({ day: 29, month: null, year: 2015 }, STATUS_INVALID);
        expect(partialNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.month });
    });

    // future
    it('should display validation message on day if future date entered if not allowed future', () => {
        futureNotAllowedDateForm._displayErrors({ day: 29, month: 1, year: 2018 }, STATUS_FUTURE_DATE);
        expect(futureNotAllowedDateForm.errors).toMatchObject({ date: validationMessage.future });
    });

    it('should not display validation message on day if current date entered if not allowed future', () => {
        futureNotAllowedDateForm._displayErrors({ day: 30, month: 5, year: 2017 }, STATUS_VALID);
        expect(futureNotAllowedDateForm.errors).toMatchObject({});
    });

    it('should not display validation message on day if past date entered if not allowed future', () => {
        futureNotAllowedDateForm._displayErrors({ day: 29, month: 1, year: 2015 }, STATUS_VALID);
        expect(futureNotAllowedDateForm.errors).toMatchObject({});
    });
});
