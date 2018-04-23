jest.dontMock('./PartialDateForm');

import React from 'react';
import PartialDateForm from './PartialDateForm';

const locale = {
    minNumberCharCode: 48,
    maxNumberCharCode: 57
};

const partialDateForm = new PartialDateForm({ allowPartial: true, locale: locale });

describe('PartialDateForm unit tests', () => {
    it('should check if pressed key charCode 39 is numeric key or not and prevent default event', () => {
        const event = {
            charCode: 39,
            preventDefault: () => expect(true).toBeTruthy()
        };

        partialDateForm._isNumber(event);
    });

    it('should check if pressed key charCode 59 is numeric key or not and prevent default event', () => {
        const event = {
            charCode: 59,
            preventDefault: () => expect(true).toBeTruthy()
        };

        partialDateForm._isNumber(event);
    });
});
