jest.dontMock('./PartialDateForm');

import React from 'react';
import PartialDateForm from './PartialDateForm';

const partialAllowedDateForm = new PartialDateForm({ allowPartial: true });
const partialNotAllowedDateForm = new PartialDateForm({ allowPartial: false });

describe('PartialDateForm unit tests', () => {
    /**
     * Test _validate with allowPartial: true
     */
    it('should validate date on year present if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: null, month: null, year: 2015 })).toBeTruthy();
    });

    it('should not validate date on year present but invalid month value (-1) if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: null, month: -1, year: 2015 })).toBeFalsy();
    });

    it('should not validate date on day present but year is null if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: 25, month: null, year: null })).toBeFalsy();
    });

    it('should not validate date on focus and blur on year field if allowed partial', () => {
        expect(partialAllowedDateForm._validate({ day: 25, month: null, year: NaN })).toBeFalsy();
    });

    /**
     * Test _validate with allowPartial: false
     */
    it('should not validate date on year present if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: null, year: 2015 })).toBeFalsy();
    });

    it('should not validate date on year present but invalid month value (-1) if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: -1, year: 2015 })).toBeFalsy();
    });

    it('should not validate date on day present but year is null if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 25, month: null, year: null })).toBeFalsy();
    });

    it('should not validate date on focus and blur on year field if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 25, month: null, year: NaN })).toBeFalsy();
    });

    it('should not validate date on focus and blur on day field if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: NaN, month: null, year: 2015 })).toBeFalsy();
    });

    it('should not validate date on invalid month selected if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: null, month: -1, year: 2015 })).toBeFalsy();
    });

    it('should validate date on day, month, year present if not allowed partial', () => {
        expect(partialNotAllowedDateForm._validate({ day: 10, month: 2, year: 2015 })).toBeTruthy();
    });
});

