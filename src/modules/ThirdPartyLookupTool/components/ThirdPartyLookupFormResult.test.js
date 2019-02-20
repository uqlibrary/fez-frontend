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
        actions: testProps.actions || {},
        locale: testProps.locale || locale.components.thirdPartyLookupTools
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

        const testProps = {
            actions: {
                clearThirdPartyLookup: mockCallback
            }
        };
        const wrapper = setup({...testProps});

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // test just for coverage of the 'else' of a function existance check of fn clearThirdPartyLookup
    it('should have coverage when the clear function is not setup', () => {
        const mockCallback = jest.fn();

        const testProps = {
            actions: {}
        };
        const wrapper = setup({...testProps});

        const button = wrapper.find('WithStyles(Button)');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(0);
    });

    it('should display the secondary field when required', () => {
        const testProps = {localeform: {
            lookupLabel: 'label 10',
            primaryField: {
                heading: 'pf heading 10',
            },
            secondaryField: {
                heading: 'sf heading 10',
                reportInOutput: true,  // <---- value defines point of test
            }
        }};
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders api data when no second field provided', () => {
        const testProps = {localeform: {
                lookupLabel: 'label 9',
                primaryField: {
                    heading: 'pf heading 9',
                },
            }};
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not display the secondary field if reportInOutput is not specifically turned on', () => {
        const testProps = {localeform: {
                lookupLabel: 'label 8',
                primaryField: {
                    heading: 'PF 8',
                },
            }};
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should use defaults when locale values are not provided', () => {
        const testProps = {locale: {}};
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display a blank when the response is blank', () => {
        const testProps = {
            lookupResults: [],
            locale: {}
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show locale-defined message when no results', () => {
        const testProps = {
            lookupResults: [],
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
