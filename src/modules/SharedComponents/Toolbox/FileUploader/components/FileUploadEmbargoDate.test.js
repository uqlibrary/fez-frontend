import { FileUploadEmbargoDate } from './FileUploadEmbargoDate';
import FileUploadEmbargoDateWithStyles from './FileUploadEmbargoDate';

function setup(testProps = {}) {
    const props = {
        minDate: new Date('2016'),
        value: new Date('2016'),
        classes: {
            input: '',
        },
        ...testProps,
    };

    return getElement(FileUploadEmbargoDate, props);
}

describe('Component FileUploadEmbargoDate', () => {
    it('should render with default setup', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance()._onChange();
    });

    it('should render with default setup with styles', () => {
        const wrapper = getElement(FileUploadEmbargoDateWithStyles, {
            minDate: new Date('2016'),
            value: new Date('2016'),
            classes: {
                input: '',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const wrapper = setup({ disabled: true });
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
        };

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._onChange('Sat Feb 10 2018 00:00:00 GMT+1000 (AEST)');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(onDateChangedTestFn).toHaveBeenCalled();
    });
});
