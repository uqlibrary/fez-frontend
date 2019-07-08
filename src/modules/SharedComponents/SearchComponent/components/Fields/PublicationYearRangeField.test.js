import { PublicationYearRangeField, styles } from './PublicationYearRangeField';
import locale from 'locale/components';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        updateYearRangeFilter: jest.fn(),
        classes: {},
        ...testProps,
    };
    return getElement(PublicationYearRangeField, props, isShallow);
}

describe('Component PublicationYearRangeField', () => {
    it('should render as expected', () => {
        const props = {
            'className': 'advancedSearchYearFilter',
            'yearFilter': {
                'from': 1999,
                'invalid': false,
                'to': 2001,
            },
            'disabled': false,
        };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render help text when needed', () => {
        const wrapper = setup({
            invalid: true,
        });
        expect(
            wrapper.find('TextField').first()
                .prop('helperText')
        ).toMatchSnapshot();
    });

    it('should return values as expect for a valid setValue', () => {
        const setValueMock = jest.fn();
        const updateMock = jest.fn();
        const props = { updateYearRangeFilter: updateMock, 'className': 'advancedSearchYearFilter', 'yearFilter': { 'from': 1999, 'invalid': false, 'to': 2001 }, 'disabled': false };
        const wrapper = setup({ ...props });
        wrapper.instance().setValue = setValueMock;
        expect(wrapper.instance().props.yearFilter.from).toEqual(1999);
        wrapper.find('#from').simulate('change', { target: { value: 1000 } });
        expect(updateMock).toBeCalledWith({ 'from': 1000, 'invalid': false, 'to': 2001 });
    });

    it('should return values as expect for an invalid setValue', () => {
        const setValueMock = jest.fn();
        const updateMock = jest.fn();
        const props = { updateYearRangeFilter: updateMock, 'className': 'advancedSearchYearFilter', 'yearFilter': { 'from': 1999, 'invalid': false, 'to': 2001 }, 'disabled': false };
        const wrapper = setup({ ...props });
        wrapper.instance().setValue = setValueMock;
        expect(wrapper.instance().props.yearFilter.from).toEqual(1999);

        wrapper.find('#from').simulate('change', { target: { value: 'hello100' } });
        expect(updateMock).toBeCalledWith({ 'from': 100, 'invalid': false, 'to': 2001 });

        wrapper.find('#from').simulate('change', { target: { value: '100hello' } });
        expect(updateMock).toBeCalledWith({ 'from': 100, 'invalid': false, 'to': 2001 });

        wrapper.find('#from').simulate('change', { target: { value: '1100' } });
        expect(updateMock).toBeCalledWith({ 'from': 1100, 'invalid': false, 'to': 2001 });

        wrapper.find('#from').simulate('change', { target: { value: '' } });
        expect(updateMock).toBeCalledWith({ 'from': 100, 'invalid': false, 'to': 2001 });
    });

    it('should test invalid year properly', () => {
        const wrapper = setup({});
        const test = wrapper.instance().isInvalidYear;
        expect(test({ from: 1, to: 0 })).toBe(true);
        expect(test({ from: 10000, to: 10001 })).toBe(true);
        expect(test({ from: 1, to: 10000 })).toBe(true);
        expect(test({ from: 1, to: 2 })).toBe(false);
    });

    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                caption: {
                    test1: 'test1',
                    test2: 'test2',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});
