import { isNumber } from './PartialDateForm';

const locale = {
    minNumberCharCode: 48,
    maxNumberCharCode: 57,
};

const partialDateForm = event => isNumber(locale)(event);

describe('PartialDateForm unit tests', () => {
    it('should check if pressed key charCode 39 is numeric key or not and prevent default event', () => {
        const test = jest.fn();
        const event = {
            charCode: 39,
            preventDefault: test,
        };
        partialDateForm(event);
        expect(test).toHaveBeenCalled();
    });

    it('should check if pressed key charCode 59 is numeric key or not and prevent default event', () => {
        const test = jest.fn();
        const event = {
            charCode: 59,
            preventDefault: test,
        };
        partialDateForm(event);
        expect(test).toHaveBeenCalled();
    });

    it('should check if pressed key is within range and default event is not prevented', () => {
        const test = jest.fn();
        const event = {
            charCode: 50,
            preventDefault: test,
        };
        partialDateForm(event);
        expect(test).not.toHaveBeenCalled();
    });
});
