import {ThirdPartyLookupFormResult} from './ThirdPartyLookupFormResult';
import {locale} from 'locale';
import PropTypes from "prop-types";
import React from "react";

function setup(testProps, isShallow = true) {
    const props = {
        lookupResults: testProps.lookupResults || [{"IS_INTERNATIONAL_COLLAB":"0"}],
        primaryValue: testProps.primaryValue || "dummy UT",
        secondaryValue: testProps.secondaryValue || "123456789",
        localeform: testProps.localeform || locale.components.thirdPartyLookupTools.forms.incites,
        actions: testProps.actions || {
            clearThirdPartyLookup: jest.fn()
        },
    };
    return getElement(ThirdPartyLookupFormResult, props, isShallow);
}

describe('Component ThirdPartyLookupFormResult', () => {
    it('renders api data', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should clear results via clear button', () => {
        const mockCallback = jest.fn();

        const props = {
            actions: {
                clearThirdPartyLookup: mockCallback
            }
        };
        const wrapper = setup({...props});
        // wrapper.instance()._handleClear = mockCallback;

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should display the secondary field when required', () => {
        const props = {localeform: {
                lookupType: 'incites',
                lookupLabel: 'Incites',
                tip: 'View raw output we receive from Incites via their API',
                primaryField: {
                    heading: 'UTs',
                    fromAria: '',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                secondaryField: {
                    heading: 'API Key',
                    fromAria: '',
                    tip: 'Optional, a default key is provided. Limit: 1,000 queries per day',
                    inputPlaceholder: 'Enter API key',
                    reportInOutput: true,  // <---- test value
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            }};
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders api data when no second field provided', () => {
        const props = {localeform: {
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
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not display the secondary field if reportInOutput is not specifically turned on', () => {
        const props = {localeform: {
                lookupType: 'incites',
                lookupLabel: 'Incites',
                tip: 'View raw output we receive from Incites via their API',
                primaryField: {
                    heading: 'UTs',
                    fromAria: '',
                    tip: '',
                    inputPlaceholder: 'Enter one or more UTs, separated by a comma',
                },
                secondaryField: {
                    heading: 'API Key',
                    fromAria: '',
                    tip: 'Optional, a default key is provided. Limit: 1,000 queries per day',
                    inputPlaceholder: 'Enter API key',
                },
                bottomTip: '',
                submitButtonLabel: 'Submit to Incites',
            }};
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
