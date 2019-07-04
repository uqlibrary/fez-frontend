import DateRangeFieldWithStyles from './DateRangeField';
import { DateRangeField } from './DateRangeField';
import moment from 'moment';
import { GENERIC_DATE_FORMAT } from 'config/general';

function setup(testProps, isShallow = true) {
    const props = {
        searchKey: 'test_search_key',
        disabled: false,
        invalid: false,
        classes: {},
        locale: {},
        format: GENERIC_DATE_FORMAT,
        from: '',
        to: '',
        onChange: jest.fn(),
        disableFuture: false,
        ...testProps,
    };

    return getElement(DateRangeField, props, isShallow);
}

describe('DateRangeField component', () => {
    it('should render default view with styles', () => {
        const wrapper = getElement(DateRangeFieldWithStyles, { onChange: jest.fn() });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('TextField').props().disabled).toBeTruthy();
    });

    it('should render with future disabled', () => {
        const wrapper = setup({ disableFuture: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('DatePickerField')
            .map(datePickerField => expect(datePickerField.props().disableFuture).toBeTruthy());
    });

    it('should update on receiving new state', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setState({
            from: '01/01/1970',
            to: '01/01/1980',
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update date range value', () => {
        const wrapper = setup({});
        const componentWillUpdate = jest.spyOn(wrapper.instance(), 'componentWillUpdate');
        wrapper
            .find('DatePickerField')
            .get(0)
            .props.onChange('10/10/2010');
        wrapper.update();
        expect(componentWillUpdate).toHaveBeenCalled();
    });

    it('should update with error if "from" date is after "to" date', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({ onChange: onChangeFn });
        const componentWillUpdate = jest.spyOn(wrapper.instance(), 'componentWillUpdate');
        wrapper
            .find('DatePickerField')
            .get(0)
            .props.onChange(moment('10/10/2010', 'DD/MM/YYYY'));
        wrapper
            .find('DatePickerField')
            .get(1)
            .props.onChange(moment('09/10/2010', 'DD/MM/YYYY'));
        wrapper.update();
        expect(componentWillUpdate).toHaveBeenCalled();
        expect(onChangeFn).toHaveBeenCalled();
    });
});
