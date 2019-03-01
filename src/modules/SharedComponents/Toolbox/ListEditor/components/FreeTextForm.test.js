import {FreeTextForm} from './FreeTextForm';

function setup(testProps, isShallow = true) {
    const props = {
        onAdd: jest.fn(),
        disabled: false,
        locale: {
            inputFieldLabel: 'Item name',
            inputFieldHint: 'Please type the item name',
            addButtonLabel: 'Add'
        },
        classes: {
            remindToAdd: ''
        },
        errorText: 'This field is required',
        normalize: value => value,
        ...testProps
    };
    return getElement(FreeTextForm, props, isShallow);
}

describe('FreeTextForm tests ', () => {
    it('rendering active form', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering disabled form', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('adding item method is called', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdd: testMethod });
        wrapper.setState({itemName: 'one'});
        wrapper.instance().addItem({});
        expect(testMethod).toBeCalled;
    });

    it('adding item method is not called on disabled form', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ disabled: true, onAdd: testMethod });
        wrapper.setState({itemName: 'one'});
        wrapper.instance().addItem({});
        expect(testMethod).not.toBeCalled;
    });

    it('setting state', () => {
        const wrapper = setup({ });
        expect(wrapper.state().itemName).toBeFalsy();
        wrapper.instance().onNameChanged({target:{value: 'one'}});
        expect(wrapper.state().itemName).toEqual('one');
    });

    it('rendering reminder to add input', () => {
        const isValid = jest.fn(() => false);
        const wrapper = setup({});
        wrapper.setProps({isValid: isValid, locale: {remindToAdd: 'reminder text',addButtonLabel: 'Add'}, remindToAdd: true});
        wrapper.setState({itemName: 'one'});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not add item if state is not set', () => {
        const wrapper = setup({});
        wrapper.instance().addItem({key: 'Enter'});
    });

    it('should focus on textField', () => {
        const focusFn = jest.fn();
        const wrapper = setup({
            isValid: jest.fn(() => true)
        });
        wrapper.instance().textField = {
            focus: focusFn
        };
        wrapper.setState({itemName: 'one'});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().addItem({key: 'Enter'});
        expect(focusFn).toHaveBeenCalled();
    });

    it('should display error about input length', () => {
        const wrapper = setup({
            maxInputLength: 3
        });
        wrapper.setState({itemName: 'test'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
