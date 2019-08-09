import DateRange from './DateRange';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: testProps.onChange || jest.fn(),
        value: testProps.value || { from: null, to: null },
        open: testProps.open || null,
        onToggle: testProps.onToggle || jest.fn(),
        ...testProps,
    };
    return getElement(DateRange, props, isShallow);
}

describe('Date range ', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with values set', () => {
        const wrapper = setup({ value: { from: 2010, to: 2016 } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.facetsYearCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        });
    });

    it('should set state values via props', () => {
        const wrapper = setup({ value: { from: 2010, to: 2015 }, defaultValue: { from: null, to: null } });
        expect(wrapper.state().from).toEqual(2010);
        expect(wrapper.state().to).toEqual(2015);
        expect(wrapper.state().isActive).toBeTruthy();

        wrapper.instance().componentWillReceiveProps({ value: { to: null, from: null } });
        expect(wrapper.state().from).toEqual(null);
        expect(wrapper.state().to).toEqual(null);
        expect(wrapper.state().isActive).toBeFalsy();

        wrapper.instance().componentWillReceiveProps({ value: { to: 2010, from: null } });
        expect(wrapper.state().from).toEqual(null);
        expect(wrapper.state().to).toEqual(2010);
        expect(wrapper.state().isActive).toBeTruthy();
    });

    it('should call onChange when year range is reset', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onChange: testFn, value: { from: 2010, to: 2018 } });
        wrapper.instance().removeDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({ from: null, to: null });
    });

    it('should not call onChange year range is not set', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onChange: testFn, value: { from: null, to: null } });
        wrapper.instance().removeDateRange();
        wrapper.update();
        expect(testFn).not.toHaveBeenCalled();
    });


    it('should not call onChange year range is set', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onChange: testFn, defaultValue: { from: 2000, to: 2010 } });

        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({ from: 2000, to: 2010 });

        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({ from: 2000, to: 2010 });
    });

    it('should not call onChange year range is set', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onChange: testFn });
        wrapper.instance().setValue('from')({ target: { value: null } });
        wrapper.instance().setValue('to')({ target: { value: '2015' } });
        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({ from: null, to: 2015 });

        wrapper.instance().setValue('from')({ target: { value: 2000 } });
        wrapper.instance().setValue('to')({ target: { value: null } });
        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({ from: 2000, to: null });
    });
});
