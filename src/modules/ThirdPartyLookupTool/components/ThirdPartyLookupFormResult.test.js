import React from 'react';
import { rtlRender, fireEvent, WithReduxStore } from 'test-utils';
import { ThirdPartyLookupFormResult } from './ThirdPartyLookupFormResult';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const requiredProps = {
    primaryValue: 'dummy UT',
    formDisplay: {
        apiType: 'apiType',
        lookupLabel: 'Test Form',
        primaryFieldHeading: 'primary heading',
        secondaryFieldHeading: 'secondary heading',
    },
    locale: {
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

function setup(testProps) {
    const props = {
        lookupResults: testProps.lookupResults || [{ IS_INTERNATIONAL_COLLAB: '0' }],
        primaryValue: testProps.primaryValue || requiredProps.primaryValue,
        secondaryValue: testProps.secondaryValue || '123456789',
        formDisplay: testProps.formDisplay || requiredProps.formDisplay,
        actions: testProps.actions || {},
        locale: testProps.locale || requiredProps.locale,
    };

    return rtlRender(
        <WithReduxStore>
            <ThirdPartyLookupFormResult {...props} />
        </WithReduxStore>,
    );
}

describe('Component ThirdPartyLookupFormResult', () => {
    it('should renders with defaults', () => {
        const { container } = rtlRender(
            <WithReduxStore>
                <ThirdPartyLookupFormResult {...requiredProps} />
            </WithReduxStore>,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders api data', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should clear results via clear button', () => {
        const mockCallback = jest.fn();

        const { getByRole } = setup({
            actions: {
                clearThirdPartyLookup: mockCallback,
            },
        });
        fireEvent.click(getByRole('button', { name: /New Test Search/i }));

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // test just for coverage of the 'else' of a function existance check of fn clearThirdPartyLookup
    it('should have coverage when the clear function is not setup', () => {
        const mockCallback = jest.fn();
        const { getByRole } = setup({ actions: {} });

        fireEvent.click(getByRole('button', { name: /New Test Search/i }));

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
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('renders api data when no second field provided', () => {
        const testProps = {
            formDisplay: {
                apiType: 'apiType 9',
                lookupLabel: 'label 9',
                primaryFieldHeading: 'pf heading 9',
            },
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
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
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('should use defaults when locale values are not provided', () => {
        const { container } = setup({ locale: {} });
        expect(container).toMatchSnapshot();
    });

    it('should display a blank when the response is blank', () => {
        const { container } = setup({ lookupResults: [], locale: {} });
        expect(container).toMatchSnapshot();
    });

    it('should show locale-defined message when no results', () => {
        const { container } = setup({ lookupResults: [] });
        expect(container).toMatchSnapshot();
    });
});
