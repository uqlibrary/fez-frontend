import OpenAccessFilter from './OpenAccessFilter';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn() || testProps.onChange,
        value: testProps.value || true,
        open: null || testProps.open,
        ...testProps
    };
    return getElement(OpenAccessFilter, props, isShallow);
}

describe('OpenAccessFilter ', () => {

    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render selected component', () => {
        const wrapper = setup({value: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onChange if value has changed', () => {
        const propMethod = jest.fn();
        const wrapper = setup({value: true, onChange: propMethod});
        wrapper.instance().toggleFilter();
        expect(propMethod).toBeCalledWith(false);
    });

    it('should set state when component receives new props', () => {
        const propMethod = jest.fn();
        const wrapper = setup({value: true, onChange: propMethod});
        wrapper.instance().componentWillReceiveProps({value: false});
        expect(wrapper.instance().state.isActive).toEqual(false);
    });
});
