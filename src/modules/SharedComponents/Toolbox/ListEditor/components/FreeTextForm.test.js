import {FreeTextFormClass} from './FreeTextForm';
import FreeTextForm from './FreeTextForm';

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
        theme: {},
        errorText: 'This field is required',
        normalize: value => value,
        // isValid: jest.fn(() => ''),
        ...testProps
    };
    return getElement(FreeTextFormClass, props, isShallow);
}

describe('FreeTextForm tests ', () => {
    it('rendering active form', () => {
        const wrapper1 = setup({});
        expect(toJson(wrapper1)).toMatchSnapshot();
        const wrapper2 = setup({
            errorText: '',
            maxInputLength: 5
        });
        wrapper2.instance().setState({itemName: '123456'});
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('rendering active form full mount', () => {
        const wrapper = getElement(FreeTextForm, {
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
            theme: {},
            errorText: 'This field is required',
            normalize: value => value,
        }, false);
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
        const wrapper = setup({
            disabled: true,
            onAdd: testMethod
        });
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
        const wrapper = setup({});
        wrapper.setProps({
            locale: {
                remindToAdd: 'reminder text',
                addButtonLabel: 'Add'
            },
            remindToAdd: true,
            isValid: jest.fn(() => false)
        });
        wrapper.setState({itemName: 'one'});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not add item if state is not set', () => {
        const wrapper = setup({});
        wrapper.instance().addItem({key: 'Enter'});
        expect(wrapper.instance().props.onAdd).not.toBeCalled();
    });

    it('should not fire onAdd when itemName is empty', () => {
        const testFn = jest.fn();
        const wrapper = setup({isValid: () => '', onAdd: testFn, disabled: false});
        wrapper.setState({itemName: ''});

        wrapper.instance().addItem({key: 'Space'});
        expect(testFn).not.toHaveBeenCalled();
    });

    it('should not fire onAdd when disabled', () => {
        const testFn = jest.fn();
        const wrapper = setup({isValid: () => '', onAdd: testFn, disabled: true});
        wrapper.setState({itemName: 'Test'});
        wrapper.instance().addItem({key: 'Enter'});
        expect(testFn).not.toHaveBeenCalled();
    });

    it('should not fire onAdd when itemName is empty', () => {
        const testFn = jest.fn();
        const wrapper = setup({isValid: () => '', onAdd: testFn, disabled: false});
        wrapper.setState({itemName: ''});
        wrapper.instance().addItem({key: 'Enter'});
        expect(testFn).not.toHaveBeenCalled();
    });

    it('should fire onAdd when itemName is valid and Enter is pressed', () => {
        const testFn = jest.fn();
        const wrapper = setup({isValid: () => '', onAdd: testFn, disabled: false});
        wrapper.setState({itemName: 'Test'});
        wrapper.instance().addItem({key: 'Enter'});
        expect(testFn).toHaveBeenCalledWith('Test');
    });

    it('should fire onAdd when itemName is valid and Enter is pressed', () => {
        const testFn = jest.fn();
        const wrapper = setup({onAdd: testFn, disabled: false});
        wrapper.setState({itemName: ''});
        wrapper.instance().addItem({key: 'Enter'});
        expect(testFn).not.toHaveBeenCalled();
    });

    it('should fire ref focus when all is OK', () => {
        const testFn = jest.fn();
        const refFn = jest.fn();
        const wrapper = setup({isValid: () => '', onAdd: testFn, disabled: false});
        wrapper.setState({itemName: 'Test'});
        wrapper.instance().textField = {focus: refFn};
        wrapper.instance().addItem({key: 'Enter'});
        expect(refFn).toHaveBeenCalled();
    });

    it('should display error about input length', () => {
        const wrapper = setup({
            maxInputLength: 3
        });
        wrapper.setState({itemName: 'test'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
