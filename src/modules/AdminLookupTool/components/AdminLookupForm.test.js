import {AdminLookupForm} from './AdminLookupForm';
import {locale} from 'locale';

function setup(testProps, isShallow = true) {
    const props = {
        isMinimised: testProps.isMinimised ? testProps.isMinimised : true,
        localeform: locale.components.adminLookupTools.forms.incites,
        sendInputsToResultComponent: jest.fn(),
        actions: {
            loadAdminLookup: jest.fn()
        },
    };
    return getElement(AdminLookupForm, props, isShallow);
}

describe('Component AdminLookupForm', () => {
    it('should display form in minimised view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show form with non-minimised form', () => {
        const wrapper = setup({isMinimised: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // wrapper.instance().componentWillReceiveProps({
    //     localeform: {lookupLabel: 'a label', primaryField: {heading: 'a heading', inputPlaceholder: 'placeholder', fromAria: 'aria'}},
    //     isMinimised: false,
    //     sendInputsToResultComponent: jest.fn()
    // });

    // it('should toggle nested items on click', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({_toggleMinimise: testFn});
    //     wrapper._toggleMinimise();
    //     expect(testFn).toBeCalled();
    // });

    // it('fires the dismissAction when clicking on the dismiss button', () => {
    //     const dismissFunc = jest.fn();
    //     const wrapper = setup({dismissAction: dismissFunc, allowDismiss: true});
    //     expect(wrapper.find('#dismiss').exists()).toBeTruthy();
    //     expect(wrapper.find('#dismiss')).toHaveLength(2);
    //     wrapper.find('#dismiss').at(0).simulate('click');
    //     expect(dismissFunc).toHaveBeenCalled();
    // });


// for formresults test
//     it('renders api data', () => {
//         const testFunction = jest.fn();
//         const wrapper = setup({
//             lookupResults: {"data":[{"IS_INTERNATIONAL_COLLAB":"0"}]}, // lookupResults.data
//         });
//         // wrapper.instance().shouldComponentUpdate = testFunction;
//         wrapper.setProps({"localeform":{"tip":"View raw output we receive from Incites via their API","invalidText":"","fromHint":"","lookupType":"incites","primaryField":{"heading":"UTs","fromAria":"","tip":"","inputPlaceholder":"Enter one or more UTs, separated by a comma"},"lookupLabel":"Incites","bottomTip":"","submitButtonLabel":"Submit to Incites","resultsLabel":"Results"}});
// //        expect(testFunction).toBeCalledWith({"tip":"View raw output we receive from Incites via their API","invalidText":"","fromHint":"","lookupType":"incites","primaryField":{"heading":"UTs","fromAria":"","tip":"","inputPlaceholder":"Enter one or more UTs, separated by a comma"},"lookupLabel":"Incites","bottomTip":"","submitButtonLabel":"Submit to Incites","resultsLabel":"Results"});
//         expect(toJson(wrapper)).toMatchSnapshot();
//     });
});
