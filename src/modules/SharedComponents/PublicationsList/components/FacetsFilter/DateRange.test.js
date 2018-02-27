import DateRange from './DateRange';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn() || testProps.onChange,
        value: {from: null, to: null} || testProps.value,
        open: null || testProps.open,
        ...testProps
    };
    return getElement(DateRange, props, isShallow);
}

describe('Date range ', () => {

    beforeEach(() => {
        // Set a mock date for account API
        const DATE_TO_USE = new Date('2016');
        const _Date = Date;
        global.Date = jest.fn(() => DATE_TO_USE);
        global.Date.UTC = _Date.UTC;
        global.Date.parse = _Date.parse;
        global.Date.now = _Date.now;
    });

    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with values set', () => {
        const wrapper = setup({value: {from: 2010, to: 2016}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.facetsYearCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        });
    });

    it('should set state values via props', () => {
        const wrapper = setup({value: {from: 2010, to: 2015}, defaultValue: {from: null, to: null}});
        expect(wrapper.state().from).toEqual(2010);
        expect(wrapper.state().to).toEqual(2015);
        expect(wrapper.state().isActive).toBeTruthy();

        wrapper.instance().componentWillReceiveProps({value: {to: null, from: null}});
        expect(wrapper.state().from).toEqual(null);
        expect(wrapper.state().to).toEqual(null);
        expect(wrapper.state().isActive).toBeFalsy();

        wrapper.instance().componentWillReceiveProps({value: {to: 2010, from: null}});
        expect(wrapper.state().from).toEqual(null);
        expect(wrapper.state().to).toEqual(2010);
        expect(wrapper.state().isActive).toBeTruthy();
    });

    it('should call onChange when year range is reset', () => {
        const testFn = jest.fn();
        const wrapper = setup({onChange: testFn, value: {from: 2010, to: 2018}});
        wrapper.instance().removeDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({from: null, to: null});
    });

    it('should not call onChange year range is not set', () => {
        const testFn = jest.fn();
        const wrapper = setup({onChange: testFn, value: {from: null, to: null}});
        wrapper.instance().removeDateRange();
        wrapper.update();
        expect(testFn).not.toHaveBeenCalled();
    });


    it('should not call onChange year range is set', () => {
        const testFn = jest.fn();
        const wrapper = setup({onChange: testFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({from: 2000, to: 2010});

        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({from: 2000, to: 2010});
    });

    it('should not call onChange year range is set', () => {
        const testFn = jest.fn();
        const wrapper = setup({onChange: testFn});
        wrapper.instance().setValue('from')({}, '');
        wrapper.instance().setValue('to')({}, '2015');
        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({from: null, to: 2015});

        wrapper.instance().setValue('from')({}, 2000);
        wrapper.instance().setValue('to')({}, '');
        wrapper.instance().setDateRange();
        wrapper.update();
        expect(testFn).toHaveBeenCalledWith({from: 2000, to: null});
    });
});
