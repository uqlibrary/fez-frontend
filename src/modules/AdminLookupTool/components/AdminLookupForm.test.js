import {AdminLookupForm} from './AdminLookupForm';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(AdminLookupForm, props, isShallow);
}

describe('Component AdminLookupForm', () => {
    it('renders incites', () => {
        const wrapper = setup({});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders api data', () => {
        const testFunction = jest.fn();
        const wrapper = setup({
            lookupResults: {"data":[{"IS_INTERNATIONAL_COLLAB":"0"}]}, // lookupResults.data
        });
        // wrapper.instance().shouldComponentUpdate = testFunction;
        wrapper.setProps({"localeform":{"tip":"View raw output we receive from Incites via their API","invalidText":"","fromHint":"","lookupType":"incites","primaryField":{"heading":"UTs","fromAria":"","tip":"","inputPlaceholder":"Enter one or more UTs, separated by a comma"},"lookupLabel":"Incites","bottomTip":"","submitButtonLabel":"Submit to Incites","resultsLabel":"Results"}});
//        expect(testFunction).toBeCalledWith({"tip":"View raw output we receive from Incites via their API","invalidText":"","fromHint":"","lookupType":"incites","primaryField":{"heading":"UTs","fromAria":"","tip":"","inputPlaceholder":"Enter one or more UTs, separated by a comma"},"lookupLabel":"Incites","bottomTip":"","submitButtonLabel":"Submit to Incites","resultsLabel":"Results"});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
