import {AdminLookupForm} from './AdminLookupForm';
import {locale} from 'locale';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        isMinimised: false !== testProps.isMinimised,
        localeform: testProps.localeform || locale.components.adminLookupTools.forms.incites,
        sendInputsToResultComponent: testProps.sendInputsToResultComponent || jest.fn(),
        actions: testProps.actions || {
            loadAdminLookup: jest.fn()
        }
    };
    return getElement(AdminLookupForm, props, isShallow);
}

describe('Component AdminLookupForm', () => {

    it('should display form in minimised view', () => {
        const props = {};
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show form with non-minimised form', () => {
        const props = {
            isMinimised: false
        };
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display form without a secondary field', () => {
        const props = {
            isMinimised: false,
            localeform: {
                lookupType: 'incites',
                lookupLabel: 'Incites',
                tip: 'View raw output we receive from Incites via their API',
                primaryField: {
                    heading: 'UTs',
                    fromAria: '',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            }};
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should return values as expected for a valid submit button click', () => {
        const submitMock = jest.fn();

        const props = {
            isMinimised: false,
            sendInputsToResultComponent: submitMock
        };
        const wrapper = setup({...props});
        wrapper.instance()._handleSubmitLookup = submitMock;

        const textFields = wrapper.find('TextField');
        expect(textFields.length).toEqual(2);

        textFields.forEach(field => {
            field.simulate('change', {target: {name: field.props().className, value: 'blah'}});
        });

        // confirm the entered values of the fields made it into state
        expect(wrapper.state()).toEqual({isMinimised: false, primaryValue: 'blah',secondaryValue: 'blah'});

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        // clicking the button class the passed in function
        expect(submitMock).toHaveBeenCalledTimes(1);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle nested items on click', () => {
        const wrapper = setup({}); // starts minimised by default

        const button = wrapper.find('WithStyles(IconButton)');
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
            sendInputsToResultComponent: submitMock
        };
        const wrapper = setup({...props});
        wrapper.instance()._handleSubmitLookup = submitMock;

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(toJson(wrapper)).toMatchSnapshot(); // still on form page
    });
});
