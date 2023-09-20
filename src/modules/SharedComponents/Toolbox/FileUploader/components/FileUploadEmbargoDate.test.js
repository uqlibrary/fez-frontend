import React from 'react';
import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        minDate: new Date('2016'),
        classes: {
            input: '',
        },
        ...testProps,
    };

    return rtlRender(<FileUploadEmbargoDate {...props} />);
}

describe('Component FileUploadEmbargoDate', () => {
    it('should render with default setup', () => {
        const { container } = setup({ value: '2016' });
        expect(container).toMatchSnapshot();
    });

    it('should render with no supplied date', () => {
        const { container } = setup({
            minDate: new Date('2016'),
            classes: {
                input: '',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const { container } = setup({ disabled: true, value: '2016' });
        expect(container).toMatchSnapshot();
    });

    it('should set correct date on date changed', () => {
        const onDateChangedTestFn = jest.fn();
        const props = {
            locale: {
                datePickerLocale: 'en-AU',
            },
            defaultConfig: {
                fileMetaKey: 'date',
                dateTimeFormat: global.Intl.DateTimeFormat,
                fieldName: 'accessDate',
            },
            onChange: onDateChangedTestFn,
            value: '2016',
        };

        const { container, getByRole } = setup(props);
        expect(container).toMatchSnapshot();

        fireEvent.change(getByRole('textbox'), { target: { value: '01/01/2018' } });
        expect(container).toMatchSnapshot();
        expect(onDateChangedTestFn).toHaveBeenCalled();
    });

    it('should display the clear field', () => {
        const { container } = setup({ canBeCleared: true, value: '2016' });
        expect(container).toMatchSnapshot();
    });
});
