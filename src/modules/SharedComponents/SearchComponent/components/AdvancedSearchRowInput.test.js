import React from 'react';
import AdvancedSearchRowInput from './AdvancedSearchRowInput';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        render: jest.fn(),
        inputField: {
            type: 'TextField',
            validation: [],
            hint: 'Field hint',
        },
        ...testProps,
    };

    return rtlRender(<AdvancedSearchRowInput {...props} />);
}

describe('AdvancedSearchRowInput', () => {
    it('should render given render function with component and props', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('TextField');
            expect(inputProps).toEqual({
                'aria-label': undefined,
                autoComplete: 'search',
                error: false,
                errorText: undefined,
                hideLabel: true,
                id: 'textfield',
                label: undefined,
                placeholder: 'Field hint',
                onChange: inputProps.onChange,
            });
        });
        setup({
            render: renderFn,
            onChange: jest.fn(),
        });
    });

    it('should render given render function with component and props and show error', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('TextField');
            expect(inputProps).toEqual({
                'aria-label': undefined,
                autoComplete: 'search',
                error: true,
                errorText: 'Must be at least 10 characters',
                hideLabel: true,
                id: 'textfield',
                label: undefined,
                placeholder: 'This is hint for text input',
                onChange: inputProps.onChange,
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'TextField',
                hint: 'This is hint for text input',
                validation: ['minLength10'],
            },
            value: 'Test',
            onChange: jest.fn(),
        });
    });

    it('should render given render function with input component and props and display error for maxLength9', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps.errorText).toEqual('Must be 9 characters or less');
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'AuthorIdLookup',
                hint: 'Add an author id',
                validation: ['required', 'maxLength9'],
            },
            value: 'uqtestuser',
            onChange: jest.fn(),
        });
    });

    it('should render error text for required rule', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps.errorText).toEqual('This field is required');
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'ContributorIdLookup',
                validation: ['required', 'maxLength9'],
            },
            value: undefined,
            onChange: jest.fn(),
        });
    });

    it('should render correct error message for publisher lookup field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps.errorText).toEqual('This field is required');
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'PublisherLookup',
                validation: ['required'],
            },
            value: null,
            onChange: jest.fn(),
        });
    });

    it('should render correct input props for publisher lookup field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps).toEqual({
                allowFreeText: true,
                'aria-label': 'Type a publisher to search for',
                error: false,
                errorText: undefined,
                floatingLabelText: 'Type a publisher to search for',
                hideLabel: true,
                hintText: 'Add your publisher',
                label: undefined,
                onChange: inputProps.onChange,
                value: 'Test',
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'PublisherLookup',
                validation: ['required'],
                ariaLabel: 'Type a publisher to search for',
                title: 'Publisher lookup',
                hint: 'Add your publisher',
            },
            value: 'Test',
            onChange: jest.fn(),
        });
    });

    it('should render correct input props for org unit lookup field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps).toEqual({
                allowFreeText: true,
                'aria-label': 'Type a org unit to search for',
                error: false,
                errorText: undefined,
                floatingLabelText: 'Type a org unit to search for',
                hideLabel: true,
                hintText: 'Add your org unit',
                label: undefined,
                onChange: inputProps.onChange,
                value: 'Test',
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'OrgUnitLookup',
                validation: ['required'],
                ariaLabel: 'Type a org unit to search for',
                title: 'Org unit lookup',
                hint: 'Add your org unit',
            },
            value: 'Test',
            onChange: jest.fn(),
        });
    });

    it('should render correct input props for thesis type select field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(GenericSelectField)');
            expect(inputProps).toEqual({
                'aria-label': 'Select multiple thesis types to search for',
                error: false,
                errorText: undefined,
                hintText: 'Select as many thesis types as you want',
                label: undefined,
                onChange: inputProps.onChange,
                autoWidth: false,
                displayEmpty: true,
                hideLabel: true,
                multiple: true,
                selectedValue: [],
                style: { marginTop: 0 },
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['required'],
                ariaLabel: 'Select multiple thesis types to search for',
                title: 'Thesis type',
                multiple: true,
                hint: 'Select as many thesis types as you want',
            },
            value: [],
            onChange: jest.fn(),
        });
    });

    it('should render correct input props for collection lookup field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(Component)');
            expect(inputProps).toEqual({
                'aria-label': 'Select multiple collections to search for',
                disableClearable: true,
                error: false,
                errorText: undefined,
                hintText: 'Select as many genres as you want',
                label: undefined,
                onChange: inputProps.onChange,
                selectedValue: [],
                style: { marginTop: 0 },
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'CollectionsLookup',
                validation: ['required'],
                ariaLabel: 'Select multiple collections to search for',
                title: 'Genre type',
                multiple: true,
                hint: 'Select as many genres as you want',
            },
            value: [],
            onChange: jest.fn(),
        });
    });

    it('should render correct input props for publication status field', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('Connect(GenericSelectField)');
            expect(inputProps).toEqual({
                'aria-label': 'Select status to search for',
                error: false,
                errorText: undefined,
                hintText: 'Select status you want',
                label: undefined,
                onChange: inputProps.onChange,
                autoWidth: false,
                displayEmpty: false,
                hideLabel: true,
                selectedValue: [],
                style: { marginTop: 0 },
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'StatusLookup',
                validation: ['required'],
                ariaLabel: 'Select status to search for',
                title: 'Status',
                multiple: false,
                hint: 'Select status you want',
                isUnpublishedField: true,
            },
            value: [],
            onChange: jest.fn(),
        });
    });

    it('should not render any props to children function if field is not in the list', () => {
        const renderFn = jest.fn((InputComponent, inputProps) => {
            expect(InputComponent.displayName).toEqual('TextField');
            expect(inputProps).toEqual({
                error: false,
                errorText: undefined,
            });
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'StrangeLookup',
                validation: ['required'],
            },
            value: 'test',
            onChange: jest.fn(),
        });
    });

    it('should call onChange from input props for TextField', () => {
        const onChangeFn = jest.fn(value => expect(value).toEqual('Testing'));
        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', { target: { value: 'Testing' } });
            expect(onChangeFn).toHaveBeenCalled();
        });
        setup({
            render: renderFn,
            inputField: {
                type: 'TextField',
                id: 'text-field',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for AuthorIdLookup for numeric value', () => {
        const onChangeFn = jest.fn((id, value) => {
            expect(id).toEqual('1234');
            expect(value).toEqual('Test value');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(Component)').simulate('change', { id: '1234', value: 'Test value' });
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'AuthorIdLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for AuthorIdLookup for non-numeric value', () => {
        const onChangeFn = jest.fn((id, value) => {
            expect(id).toEqual(0);
            expect(value).toEqual('');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(Component)').simulate('change', { id: 'test', value: 'Test value' });
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'AuthorIdLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for OrgUnitLookup field', () => {
        const onChangeFn = jest.fn((value, label) => {
            expect(value).toEqual('Test Value');
            expect(label).toEqual('Test Value');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(Component)').simulate('change', { id: '1245', value: 'Test Value' });
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'OrgUnitLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for StatusLookup field', () => {
        const onChangeFn = jest.fn(value => {
            expect(value).toEqual('Test Value');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(GenericSelectField)').simulate('change', 'Test Value');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'StatusLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for CollectionsLookup field', () => {
        const onChangeFn = jest.fn(value => {
            expect(value).toEqual('Test Value');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(Component)').simulate('change', 'Test Value');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'CollectionsLookup',
                validation: ['required'],
            },
            value: [],
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props from ThesisTypeLookup field', () => {
        const onChangeFn = jest.fn((value, label) => {
            expect(value).toEqual('Test');
            expect(label).toEqual('Test');
        });

        const renderFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, { requiresStore: true });
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('Connect(GenericSelectField)').simulate('change', 'Test');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            render: renderFn,
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['required'],
            },
            value: [],
            onChange: onChangeFn,
        });
    });
});
