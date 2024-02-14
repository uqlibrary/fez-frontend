import Immutable from 'immutable';
import { validate } from './AdminPanelContainer';

describe('AdminPanelContainer', () => {
    it('validate function returns expected results', () => {
        const input1 = Immutable.Map({
            cvo_title: null,
        });
        expect(validate(input1)).toEqual({ cvo_title: 'Required' });

        const input2 = Immutable.Map({
            cvo_title: 'abc',
        });
        expect(validate(input2)).toEqual({});

        const input3a = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: null,
        });
        expect(validate(input3a)).toEqual({});

        const input3b = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: undefined,
        });
        expect(validate(input3b)).toEqual({});

        const input3c = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: '',
        });
        expect(validate(input3c)).toEqual({});

        const input4 = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: 'abc',
        });
        expect(validate(input4)).toEqual({ cvo_order: 'Must be a number' });

        const input5a = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: -1,
        });
        expect(validate(input5a)).toEqual({ cvo_order: 'Must be a whole number above zero' });
        const input5b = Immutable.Map({
            cvo_title: 'abc',
            cvo_order: 1.1,
        });
        expect(validate(input5b)).toEqual({ cvo_order: 'Must be a whole number above zero' });
    });
});
