import {AdminLookupFormResult} from './AdminLookupFormResult';
import {locale} from 'locale';
import PropTypes from "prop-types";
import React from "react";

function setup(testProps, isShallow = true) {
    const props = {
        lookupResults: testProps.lookupResults || [{"IS_INTERNATIONAL_COLLAB":"0"}],
        primaryValue: testProps.primaryValue || "dummy UT",
        secondaryValue: testProps.secondaryValue || "API Key",
        localeform: testProps.localeform || locale.components.adminLookupTools.forms.incites,
        actions: testProps.actions || {
            clearAdminLookup: jest.fn()
        },
    };
    return getElement(AdminLookupFormResult, props, isShallow);
}

describe('Component AdminLookupFormResult', () => {
    it('renders api data', () => {
        // const testFunction = jest.fn();
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should clear results via clear button', () => {
        const mockCallback = jest.fn();

        const props = {
            actions: {
                clearAdminLookup: mockCallback
            }
        };
        const wrapper = setup({...props});
        // wrapper.instance()._handleClear = mockCallback;

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});
