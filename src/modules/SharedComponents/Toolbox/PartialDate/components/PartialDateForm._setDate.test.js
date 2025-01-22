import { PartialDateForm } from './PartialDateForm';

const validationMessages = {
    validationMessage: {
        day: 'Invalid day',
        month: 'Invalid month',
        year: 'Invalid year',
    },
};

const partialAllowedDateForm = new PartialDateForm({
    allowPartial: true,
    locale: validationMessages,
    dateFormat: 'YYYY-MM-DD',
    partialDateFieldId: 'test',
});
const partialNotAllowedDateForm = new PartialDateForm({
    allowPartial: false,
    locale: validationMessages,
    dateFormat: 'YYYY-MM-DD',
    partialDateFieldId: 'test',
});

const states = [
    { day: null, month: null, year: 2015 },
    { day: null, month: -1, year: 2015 },
    { day: 25, month: null, year: null },
    { day: 25, month: null, year: NaN },
    { day: NaN, month: null, year: 2015 },
    { day: '', month: null, year: 2015 },
    { day: 10, month: 2, year: 2015 },
    { day: 32, month: 2, year: 2015 },
];

const partialAllowedDateExpected = ['2015-01-01', '2015-01-01', '', '', '2015-01-01', '2015-01-01', '2015-03-10', ''];

const partialNotAllowedDateExpected = ['', '', '', '', '', '', '2015-03-10', ''];

describe('PartialDateForm unit tests', () => {
    it('should get formatted date from given state if allowed partial', () => {
        states.map((state, index) => {
            expect(partialAllowedDateForm._setDate(state)).toBe(partialAllowedDateExpected[index]);
        });
    });

    it('should get formatted date from given state if not allowed partial', () => {
        states.map((state, index) => {
            expect(partialNotAllowedDateForm._setDate(state)).toBe(partialNotAllowedDateExpected[index]);
        });
    });
});
