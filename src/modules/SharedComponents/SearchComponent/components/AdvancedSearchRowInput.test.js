import AdvancedSearchRowInput from './AdvancedSearchRowInput';

function setup(testProps, isShallow = true){
    const props = {
        children: jest.fn(),
        inputField: {
            type: 'TextField',
            validation: [],
            hint: 'Field hint'
        },
        classes: {},
        ...testProps
    };

    return getElement(AdvancedSearchRowInput, props, isShallow);
}

describe('AdvancedSearchRowInput', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given children function', () => {
        const childrenFn = jest.fn(() => 'Testing');
        const wrapper = setup({children: childrenFn});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given children with component and props', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "aria-label": undefined,
                "autoComplete": "search",
                "error": false,
                "errorText": undefined,
                "hideLabel": true,
                "id": "textfield",
                "label": undefined,
                "placeholder": "Field hint",
                'onChange': inputProps.onChange
            });
        });
        setup({
            children: childrenFn,
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render given children with component and props and show error', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "aria-label": undefined,
                "autoComplete": "search",
                "error": true,
                "errorText": "Must be at least 10 characters",
                "hideLabel": true,
                "id": "textfield",
                "label": undefined,
                "placeholder": "This is hint for text input",
                'onChange': inputProps.onChange
            });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'TextField',
                hint: 'This is hint for text input',
                validation: ['minLength10']
            },
            value: 'Test',
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render given children function with input component and props and display error for maxLength9', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps.errorText).toEqual('Must be 9 characters or less');
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'AuthorIdLookup',
                hint: 'Add an author id',
                validation: ['required', 'maxLength9']
            },
            value: 'uqtestuser',
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render error text for required rule', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps.errorText).toEqual('This field is required');
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'ContributorIdLookup',
                validation: ['required', 'maxLength9']
            },
            value: undefined,
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct error message for publisher lookup field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps.errorText).toEqual('This field is required');
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'PublisherLookup',
                validation: ['required']
            },
            value: null,
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct input props for publisher lookup field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "allowFreeText": true,
                "aria-label": "Type a publisher to search for",
                "error": false,
                "errorText": undefined,
                "floatingLabelText": "Type a publisher to search for",
                "hideLabel": true,
                "hintText": "Add your publisher",
                "label": undefined,
                "onChange": inputProps.onChange,
                "value": "Test",
            });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'PublisherLookup',
                validation: ['required'],
                ariaLabel: 'Type a publisher to search for',
                title: 'Publisher lookup',
                hint: 'Add your publisher'
            },
            value: 'Test',
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct input props for org unit lookup field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "allowFreeText": true,
                "aria-label": "Type a org unit to search for",
                "error": false,
                "errorText": undefined,
                "floatingLabelText": "Type a org unit to search for",
                "hideLabel": true,
                "hintText": "Add your org unit",
                "label": undefined,
                "onChange": inputProps.onChange,
                "value": "Test",
            });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'OrgUnitLookup',
                validation: ['required'],
                ariaLabel: 'Type a org unit to search for',
                title: 'Org unit lookup',
                hint: 'Add your org unit'
            },
            value: 'Test',
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct input props for thesis type select field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "aria-label": "Select multiple thesis types to search for",
                "error": false,
                "errorText": undefined,
                "hintText": "Select as many thesis types as you want",
                "label": undefined,
                "onChange": inputProps.onChange,
                "autoWidth": false,
                "displayEmpty": true,
                "hideLabel": true,
                "multiple": true,
                "selectedValue": [],
                "style": {"marginTop": 0}
            });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['required'],
                ariaLabel: 'Select multiple thesis types to search for',
                title: 'Thesis type',
                multiple: true,
                hint: 'Select as many thesis types as you want'
            },
            value: [],
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct input props for collection lookup field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "aria-label": "Select multiple collections to search for",
                "error": false,
                "errorText": undefined,
                "hintText": "Select as many genres as you want",
                "label": undefined,
                "onChange": inputProps.onChange,
                "autoWidth": false,
                "displayEmpty": true,
                "hideLabel": true,
                "multiple": true,
                "selectedValue": [],
                "errorHint": undefined,
                "loadingHint": undefined,
                "style": {"marginTop": 0}
            });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'CollectionsLookup',
                validation: ['required'],
                ariaLabel: 'Select multiple collections to search for',
                title: 'Genre type',
                multiple: true,
                hint: 'Select as many genres as you want'
            },
            value: [],
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should render correct input props for publication status field', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({
                "aria-label": "Select status to search for",
                "error": false,
                "errorText": undefined,
                "hintText": "Select status you want",
                "label": undefined,
                "onChange": inputProps.onChange,
                "autoWidth": false,
                "displayEmpty": false,
                "hideLabel": true,
                "selectedValue": [],
                "style": {"marginTop": 0}
        });
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'StatusLookup',
                validation: ['required'],
                ariaLabel: 'Select status to search for',
                title: 'Status',
                multiple: false,
                hint: 'Select status you want',
                isUnpublishedField: true
            },
            value: [],
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should not render any props to children function if field is not in the list', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            expect(inputProps).toEqual({});
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'StrangeLookup',
                validation: ['required'],
            },
            value: 'test',
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should call componentWillReceiveProps life cycle method', () => {
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            inputProps.error
                ? expect(inputProps.errorText).toEqual('This field is required')
                : expect(inputProps.errorText).toEqual(undefined);
        });
        const wrapper = setup({
            children: childrenFn,
            inputField: {
                type: 'TextField',
                validation: ['required']
            },
            value: null,
            onChange: jest.fn()
        });
        expect(childrenFn).toHaveBeenCalled();
        wrapper.setProps({value: 'test'});
        expect(childrenFn).toHaveBeenCalled();
    });

    it('should call onChange from input props for TextField', () => {
        const onChangeFn = jest.fn((value) => expect(value).toEqual('Testing'));
        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('TextFieldWrapper').simulate('change', {target: {value: 'Testing'}});
            expect(onChangeFn).toHaveBeenCalled();
        });
        setup({
            children: childrenFn,
            inputField: {
                type: 'TextField',
                validation: ['required']
            },
            value: null,
            onChange: onChangeFn
        });
    });

    it('should call onChange from input props for AuthorIdLookup for numeric value', () => {
        const onChangeFn = jest.fn((id, value) => {
            expect(id).toEqual('1234');
            expect(value).toEqual('Test value');
        });

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('AuthorIdField').simulate('change', {id: '1234', value: 'Test value'});
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
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

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('AuthorIdField').simulate('change', {id: 'test', value: 'Test value'});
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
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

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('OrgUnitNameField').simulate('change', {id: '1245', value: 'Test Value'});
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
            inputField: {
                type: 'OrgUnitLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for StatusLookup field', () => {
        const onChangeFn = jest.fn((value) => {
            expect(value).toEqual('Test Value');
        });

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('UnpublishedStatusField').simulate('change', 'Test Value');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
            inputField: {
                type: 'StatusLookup',
                validation: ['required'],
            },
            value: null,
            onChange: onChangeFn,
        });
    });

    it('should call onChange from input props for CollectionsLookup field', () => {
        const onChangeFn = jest.fn((value) => {
            expect(value).toEqual('Test Value');
        });

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('CollectionsSelectField').simulate('change', 'Test Value');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
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

        const childrenFn = jest.fn((InputComponent, inputProps) => {
            const wrapper = getElement(InputComponent, inputProps, true, true);
            expect(toJson(wrapper)).toMatchSnapshot();
            wrapper.find('ThesisSubtypeField').simulate('change', 'Test');
            expect(onChangeFn).toHaveBeenCalled();
        });

        setup({
            children: childrenFn,
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['required'],
            },
            value: [],
            onChange: onChangeFn,
        });
    });
});
