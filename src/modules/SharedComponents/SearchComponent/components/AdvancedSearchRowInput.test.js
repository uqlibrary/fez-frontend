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
            expect(InputComponent.defaultProps.select).toEqual(false);
            expect(inputProps).toEqual({
                "aria-label": undefined,
                "autoComplete": "search",
                "error": false,
                "helperText": undefined,
                "label": null,
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
            expect(InputComponent.defaultProps.select).toEqual(false);
            expect(inputProps).toEqual({
                "aria-label": undefined,
                "autoComplete": "search",
                "error": true,
                "helperText": "Must be at least 10 characters",
                "label": null,
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
    })
});
