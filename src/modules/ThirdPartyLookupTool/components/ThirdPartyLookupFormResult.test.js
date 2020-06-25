import { ThirdPartyLookupFormResult } from './ThirdPartyLookupFormResult';

function setup(testProps, isShallow = true) {
    const props = {
        lookupResults: testProps.lookupResults || [{ IS_INTERNATIONAL_COLLAB: '0' }],
        primaryValue: testProps.primaryValue || 'dummy UT',
        secondaryValue: testProps.secondaryValue || '123456789',
        formDisplay: testProps.formDisplay || {
            apiType: 'apiType',
            lookupLabel: 'Test Form',
            primaryFieldHeading: 'primary heading',
            secondaryFieldHeading: 'secondary heading',
        },
        actions: testProps.actions || {},
        locale: testProps.locale || {
            title: 'Test Tool Display',
            loadingMessage: 'Loading test Form',
            tooltip: {
                show: 'Show test form for',
                hide: 'Hide test form for',
            },
            resultsLabel: 'Test Results',
            noResultsFound: {
                text: 'No test results found',
            },
            clearButtonLabel: 'New Test Search',
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

        const testProps = {
            actions: {
                clearThirdPartyLookup: mockCallback,
            },
        };
        const wrapper = setup({ ...testProps });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // test just for coverage of the 'else' of a function existance check of fn clearThirdPartyLookup
    it('should have coverage when the clear function is not setup', () => {
        const mockCallback = jest.fn();

        const testProps = {
            actions: {},
        };
        const wrapper = setup({ ...testProps });

        const button = wrapper.find('WithStyles(ForwardRef(Button))');
        expect(button.length).toEqual(1);
        button.simulate('click');

        expect(mockCallback).not.toBeCalled();
    });

    it('should display the secondary field when required', () => {
        const testProps = {
            formDisplay: {
                apiType: 'type 10',
                lookupLabel: 'label 10',
                primaryFieldHeading: 'pf heading 10',
                secondaryFieldHeading: 'sf heading 10',
                reportSecondaryFieldInOutput: true, // <---- value defines point of test
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders api data when no second field provided', () => {
        const testProps = {
            formDisplay: {
                apiType: 'apiType 9',
                lookupLabel: 'label 9',
                primaryFieldHeading: 'pf heading 9',
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not display the secondary field if reportInOutput is not specifically turned on', () => {
        const testProps = {
            formDisplay: {
                apiType: 'apiType 8',
                lookupLabel: 'label 8',
                primaryFieldHeading: 'PF 8',
                secondaryFieldHeading: 'SF 8',
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should use defaults when locale values are not provided', () => {
        const testProps = { locale: {} };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display a blank when the response is blank', () => {
        const testProps = {
            lookupResults: [],
            locale: {},
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
