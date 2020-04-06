import { ThirdPartyLookupForm } from './ThirdPartyLookupForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        localeform: testProps.localeform || {
            apiType: 'apiType',
            lookupLabel: 'Test Form',
            primaryField: {
                heading: 'UTs',
            },
            secondaryField: {
                heading: 'API Key',
            },
        },
        sendInputsToResultComponent: testProps.sendInputsToResultComponent || jest.fn(),
        actions: testProps.actions || {},
        locale: testProps.locale || {}, // locale.components.thirdPartyLookupTools,
    };
    return getElement(ThirdPartyLookupForm, props, isShallow);
}

describe('Component ThirdPartyLookupForm', () => {
    it('should display form in minimised view', () => {
        const props = {};
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show form with non-minimised form', () => {
        const props = {
            isMinimised: false,
        };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display form without a secondary field', () => {
        const props = {
            isMinimised: false,
            localeform: {
                apiType: 'incites',
                lookupLabel: 'Incites',
                tip: 'tip 1',
                primaryField: {
                    heading: 'UTs',
                    fromAria: '',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            },
        };
        const wrapper = setup({ ...props });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should submit if fields are valid', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
        };
        const wrapper = setup({ ...props });
        wrapper.instance()._handleSubmitLookup = submitMock;

        const textFields = wrapper.find('WithStyles(ForwardRef(TextField))');
        expect(textFields.length).toEqual(2);

        textFields.forEach(field => {
            field.simulate('change', { target: { name: field.props().className, value: 'blah' } });
        });

        // confirm the entered values of the fields made it into state
        expect(wrapper.state()).toEqual({
            formDisplay: {},
            isMinimised: false,
            primaryValue: 'blah',
            secondaryValue: 'blah',
        });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        // clicking the button class the passed in function
        expect(submitMock).toHaveBeenCalledTimes(1);
    });

    it('should submit if fields are valid where no secondary field is required', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            localeform: {
                apiType: 'incites',
                lookupLabel: 'Incites',
                tip: 'Tip 2',
                primaryField: {
                    heading: 'UTs',
                    fromAria: '',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            },
        };
        const wrapper = setup({ ...props });
        wrapper.instance()._handleSubmitLookup = submitMock;

        const primaryField = wrapper.find('.primaryValue');
        expect(primaryField.length).toEqual(1);
        primaryField.simulate('change', { target: { name: 'primaryValue', value: 'blah' } });

        // confirm the entered values of the fields made it into state
        expect(wrapper.state()).toEqual({
            formDisplay: {},
            isMinimised: false,
            primaryValue: 'blah',
            secondaryValue: '',
        });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(submitMock).toHaveBeenCalledTimes(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle nested items on click', () => {
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot(); // starts minimised by default

        const button = wrapper.find('WithStyles(ForwardRef(IconButton))');
        expect(button.length).toBe(1);

        button.simulate('click'); // open the block
        expect(toJson(wrapper)).toMatchSnapshot();

        button.simulate('click'); // close the block again
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not submit if no primary field is entered', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
        };
        const wrapper = setup({ ...props });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(wrapper.state()).toEqual({ formDisplay: {}, isMinimised: false, primaryValue: '', secondaryValue: '' });
        expect(submitMock).not.toHaveBeenCalled();
    });

    it('should not submit if ENTER was not the key pressed', () => {
        const testMethod = jest.fn();
        const testProps = {
            sendInputsToResultComponent: testMethod,
        };
        const wrapper = setup(testProps);

        wrapper.instance()._handleSubmitLookup({ key: 'a' });
        wrapper.update();

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should fire the lookup action', () => {
        const submitMock = jest.fn();

        const testMethod = () => {
            return true;
        };
        const testProps = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: testMethod,
            },
            localeform: {
                apiType: 'fire1',
                lookupLabel: 'Test Lookup Action Fired',
                tip: 'Tip 3',
                primaryField: {
                    heading: 'PF 1',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit 1',
            },
        };
        const wrapper = setup({ ...testProps });

        const primaryField = wrapper.find('.primaryValue');
        expect(primaryField.length).toEqual(1);
        primaryField.simulate('change', { target: { name: 'primaryValue', value: 'blah' } });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(submitMock).toHaveBeenCalledTimes(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fire the lookup action when there is a secondary field', () => {
        const submitMock = jest.fn();

        const testMethod = () => {
            return true;
        };
        const testProps = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: testMethod,
            },
            localeform: {
                apiType: 'fire7',
                lookupLabel: 'Test Lookup Action Fired7',
                tip: 'Tip 7',
                primaryField: {
                    heading: 'PF 7',
                },
                secondaryField: {
                    heading: 'SF 7',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit 7',
            },
        };
        const wrapper = setup({ ...testProps });

        const textFields = wrapper.find('WithStyles(ForwardRef(TextField))');
        expect(textFields.length).toEqual(2);
        textFields.forEach(field => {
            field.simulate('change', { target: { name: field.props().className, value: 'blah' } });
        });

        // confirm the entered values of the fields made it into state
        expect(wrapper.state()).toEqual({
            formDisplay: {},
            isMinimised: false,
            primaryValue: 'blah',
            secondaryValue: 'blah',
        });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(submitMock).toHaveBeenCalledTimes(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should use locale values when provided', () => {
        const testProps = {
            locale: {},
            localeform: {
                apiType: 'provided1',
                primaryField: {
                    heading: 'PF 2',
                    fromAria: 'aria pf2',
                    tip: 'Tip 2p',
                    inputPlaceholder: 'placeholder 2p',
                },
                secondaryField: {
                    heading: 'SF2',
                    fromAria: 'aria sf2',
                    tip: 'tip 2S',
                    inputPlaceholder: 'placeholder 2s',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit2',
            },
            isMinimised: false,
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should use defaults when locale values are not provided', () => {
        const testProps = {
            locale: {
                title: 'Test',
                tooltip: {
                    show: 'Test show',
                    hide: 'Test hide',
                },
            },
            localeform: {
                apiType: 'dummytest',
                primaryField: {
                    heading: 'PF3',
                },
                secondaryField: {
                    heading: 'SF3',
                },
                bottomTip: 'test bottom tip',
            },
            isMinimised: false,
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
