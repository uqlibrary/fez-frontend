import { filterComponentProps } from './utils';

describe('utils', () => {
    it('filterComponentProps returns expected textfield result', () => {
        const inputTextField = {
            invalid1: 1,
            id: 1,
            name: 1,
            label: 1,
            value: 1,
            onChange: 1,
            inputProps: 1,
            InputLabelProps: 1,
            fullWidth: 1,
            error: 1,
            onClick: 1,
            invalid2: 1,
        };
        const expectedTextfield = {
            id: 1,
            name: 1,
            label: 1,
            value: 1,
            onChange: 1,
            inputProps: 1,
            InputLabelProps: 1,
            fullWidth: 1,
            error: 1,
            onClick: 1,
        };

        expect(filterComponentProps(inputTextField)).toEqual(expectedTextfield);
    });

    it('filterComponentProps returns expected checkbox result', () => {
        const inputCheckbox = {
            invalid1: 1,
            checked: 1,
            invalid2: 1,
        };
        const expectedCheckbox = {
            checked: 1,
        };

        expect(filterComponentProps({ type: 'checkbox', ...inputCheckbox })).toEqual(expectedCheckbox);
    });

    it('filterComponentProps returns expected result when invalid type passed', () => {
        const inputCheckbox = {
            invalid1: 1,
            checked: 1,
            invalid2: 1,
        };

        expect(filterComponentProps({ type: 'invalid', ...inputCheckbox })).toEqual(inputCheckbox);
    });
});
