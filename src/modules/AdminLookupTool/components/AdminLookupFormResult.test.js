import {AdminLookupFormResult} from './AdminLookupFormResult';
import {locale} from 'locale';
import PropTypes from "prop-types";

function setup(testProps, isShallow = true) {
    const props = {
        lookupResults: [{"IS_INTERNATIONAL_COLLAB":"0"}],
        primaryValue: "dummy UT",
        secondaryValue: "API Key",
        localeform: locale.components.adminLookupTools.forms.incites,
        actions: {
            clearAdminLookup: jest.fn()
        },
    };
    return getElement(AdminLookupFormResult, props, isShallow);
}

describe('Component AdminLookupFormResult', () => {
    it('it renders api data', () => {
        const testFunction = jest.fn();
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // it('should reset lookup', () => {
    //     const testMethod = jest.fn();
    //     const wrapper = setup({_handleClear: testMethod});
    //
    //     wrapper.instance()._handleClear();
    //     expect(testMethod).toHaveBeenCalled();
    // });
});
