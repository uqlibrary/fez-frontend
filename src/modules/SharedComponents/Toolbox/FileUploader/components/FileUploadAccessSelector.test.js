import FileUploadAccessSelector from './FileUploadAccessSelector';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(FileUploadAccessSelector, props, isShallow);
}

describe('Component FileUploadAccessSelector', () => {
    it('should render with default setup', () => {
        const onChangeTestFn = jest.fn();
        const props = {onChange: onChangeTestFn};
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._onChange({}, 0, 2);
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith(2);
    });

    it('should render with value', () => {
        const onChangeTestFn = jest.fn();
        const props = {onChange: onChangeTestFn, value: 1};
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._onChange({}, 0, 2);
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith(2);
    });

    it('should render access condition disabled if disabled flag is set', () => {
        const props = {disabled: true};
        const wrapper = setup({...props}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render access condition disabled if disabled flag is set and with value', () => {
        const props = {disabled: true, value: 2};
        const wrapper = setup({...props}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
