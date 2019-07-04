import OpenAccessFilter from './OpenAccessFilter';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn(),
        isActive: true,
        open: null,
        locale: { displayTitle: 'Open access status' },
        onToggle: jest.fn(),
        ...testProps,
    };
    return getElement(OpenAccessFilter, props, isShallow);
}

describe('OpenAccessFilter ', () => {
    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render selected component', () => {
        const wrapper = setup({ isActive: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onChange if value has changed', () => {
        const propMethod = jest.fn();
        const wrapper = setup({ isActive: true, onChange: propMethod });
        wrapper.instance().updateFilter();
        expect(propMethod).toBeCalledWith(false);
    });
});
