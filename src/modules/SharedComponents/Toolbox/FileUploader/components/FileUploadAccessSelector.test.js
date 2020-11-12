import { FileUploadAccessSelector } from './FileUploadAccessSelector';
import FileUploadAccessSelectorWithStyles from './FileUploadAccessSelector';

function setup(testProps = {}, args = {}) {
    const props = {
        classes: {
            selector: '',
        },
        ...testProps,
    };
    return getElement(FileUploadAccessSelector, props, args);
}

describe('Component FileUploadAccessSelector', () => {
    it('should render with default setup', () => {
        const onChangeTestFn = jest.fn();
        const props = { onChange: onChangeTestFn };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleChange(5);
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith(5);
    });

    it('should render with default setup for admin', () => {
        const onChangeTestFn = jest.fn();
        const props = { onChange: onChangeTestFn, isAdmin: true };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleChange(99);
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith(99);
    });

    it('should render with value', () => {
        const onChangeTestFn = jest.fn();
        const props = { onChange: onChangeTestFn, value: 1 };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().handleChange(5);
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith(5);
    });

    it('should render access condition disabled if disabled flag is set', () => {
        const props = { disabled: true };
        const wrapper = setup({ ...props }, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render access condition disabled if disabled flag is set and with value', () => {
        const props = { disabled: true, value: 1 };
        const wrapper = setup({ ...props }, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with styles', () => {
        const wrapper = getElement(FileUploadAccessSelectorWithStyles, {});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
