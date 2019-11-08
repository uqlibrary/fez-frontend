import { FileUploadEmbargoDate } from './FileUploadEmbargoDate';
import FileUploadEmbargoDateWithStyles from './FileUploadEmbargoDate';

function setup(testProps = {}) {
    const props = {
        minDate: new Date('2016'),
        classes: {
            input: '',
        },
        ...testProps,
    };

    return getElement(FileUploadEmbargoDate, props);
}

describe('Component FileUploadEmbargoDate', () => {
    it('should render with default setup', () => {
        const wrapper = setup({ value: '2016' });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance()._onChange();
    });

    it('should render with no supplied date', () => {
        const wrapper = setup({
            minDate: new Date('2016'),
            classes: {
                input: '',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with default setup with styles', () => {
        const wrapper = getElement(FileUploadEmbargoDateWithStyles, {
            minDate: new Date('2016'),
            value: '2016',
            classes: {
                input: '',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const wrapper = setup({ disabled: true, value: '2016' });
        expect(toJson(wrapper)).toMatchSnapshot();
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

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._onChange('Sat Feb 10 2018 00:00:00 GMT+1000 (AEST)');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(onDateChangedTestFn).toHaveBeenCalled();
    });

    it('should display the clear field', () => {
        const wrapper = setup({ canBeCleared: true, value: '2016' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
