import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import { ThirdPartyLookupForm } from './ThirdPartyLookupForm';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

function setup(testProps) {
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
    return rtlRender(<ThirdPartyLookupForm {...props} />);
}

describe('Component ThirdPartyLookupForm', () => {
    it('should display form in minimised view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should show form with non-minimised form', () => {
        const { container } = setup({ isMinimised: false });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('should submit if fields are valid', () => {
        const submitMock = jest.fn();
        const actionMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: actionMock,
            },
            localeform: {
                apiType: 'incites',
                lookupLabel: 'Incites',
                tip: 'tip 1',
                primaryField: {
                    heading: 'UTs',
                    fromAria: 'primaryField',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                secondaryField: {
                    heading: 'UTs',
                    fromAria: 'secondaryField',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            },
        };
        const { getByRole } = setup({ ...props });
        // wrapper.instance()._handleSubmitLookup = submitMock;

        expect(getByRole('textbox', { name: 'primaryField' })).toBeInTheDocument();
        expect(getByRole('textbox', { name: 'secondaryField' })).toBeInTheDocument();

        fireEvent.change(getByRole('textbox', { name: 'primaryField' }), { target: { value: 'blah' } });
        fireEvent.change(getByRole('textbox', { name: 'secondaryField' }), { target: { value: 'blah' } });

        expect(getByRole('textbox', { name: 'primaryField' }).value).toEqual('blah');
        expect(getByRole('textbox', { name: 'secondaryField' }).value).toEqual('blah');

        fireEvent.click(getByRole('button', { name: 'Submit to Incites' }));
        expect(submitMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledTimes(1);
    });

    it('should submit if fields are valid where no secondary field is required', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: jest.fn(),
            },
            localeform: {
                apiType: 'incites',
                lookupLabel: 'Incites',
                tip: 'Tip 2',
                primaryField: {
                    heading: 'UTs',
                    fromAria: 'primaryField',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            },
        };
        const { getByRole } = setup({ ...props });

        expect(getByRole('textbox', { name: 'primaryField' })).toBeInTheDocument();
        fireEvent.change(getByRole('textbox', { name: 'primaryField' }), { target: { value: 'blah' } });
        expect(getByRole('textbox', { name: 'primaryField' }).value).toEqual('blah');

        fireEvent.click(getByRole('button', { name: 'Submit to Incites' }));
        expect(submitMock).toHaveBeenCalledTimes(1);
    });

    it('should toggle nested items on click', () => {
        const { container, getByRole, queryByRole, getByTestId } = setup({});

        expect(container).toMatchSnapshot(); // starts minimised by default

        expect(getByTestId('minimise-toggle')).toBeInTheDocument();
        fireEvent.click(getByTestId('minimise-toggle'));
        expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(container).toMatchSnapshot();

        fireEvent.click(getByTestId('minimise-toggle')); // close the block again
        expect(queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should not submit if no primary field is entered', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: jest.fn(),
            },
        };
        const { getByRole } = setup({ ...props });

        expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        fireEvent.click(getByRole('button', { name: 'Submit' }));

        expect(submitMock).not.toHaveBeenCalled();
    });

    it('should not submit if ENTER was not the key pressed', () => {
        const submitMock = jest.fn();
        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock,
            actions: {
                loadThirdPartyResults: jest.fn(),
            },
            localeform: {
                primaryField: {
                    heading: 'UTs',
                    fromAria: 'primaryField',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
            },
        };
        const { getByRole } = setup({ ...props });
        fireEvent.change(getByRole('textbox', { name: 'primaryField' }), { target: { value: 'blah' } });

        // MUI Button only reacts to space keyup and keydown and enter key
        expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();

        // These will do nothing as there are no onKeyDown nor onKeyUp listeners and button is not submit type
        fireEvent.keyDown(getByRole('button', { name: 'Submit' }), { key: ' ', code: 'Space' });
        fireEvent.keyUp(getByRole('button', { name: 'Submit' }), { key: ' ', code: 'Space' });
        expect(submitMock).not.toHaveBeenCalled();

        fireEvent.keyPress(getByRole('button', { name: 'Submit' }), { key: 'Enter', keyCode: 13 });
        expect(submitMock).toHaveBeenCalledTimes(1);
    });
    /*
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

        const button = wrapper.find('ForwardRef(Button)');
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

        const textFields = wrapper.find('ForwardRef(TextField)');
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

        const button = wrapper.find('ForwardRef(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(submitMock).toHaveBeenCalledTimes(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    */
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
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
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
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
