import React from 'react';
import Immutable from 'immutable';

import { rtlRender, fireEvent, WithReduxStore } from 'test-utils';
import { ThirdPartyLookupTool } from './ThirdPartyLookupTool';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    loadThirdPartyResults: jest.fn(() => jest.fn()),
}));

jest.mock('locale', () => ({
    locale: {
        components: {
            thirdPartyLookupTools: {
                display: {
                    title: 'Lookup Tools - view raw output from APIs',
                    loadingMessage: 'Loading',
                    tooltip: {
                        show: 'Show form for',
                        hide: 'Hide form for',
                    },
                    resultsLabel: 'Results',
                    noResultsFound: {
                        text: 'No results found',
                    },
                    clearButtonLabel: 'New Search',
                },
                forms: [
                    {
                        apiType: 'incites', // this value should match the 'type' in the path used in api
                        lookupLabel: 'Incites',
                        primaryField: {
                            heading: 'UTs',
                            fromAria: 'primaryValue',
                            tip: '',
                            inputPlaceholder: 'Enter one or more UTs separated by a comma e.g. 000455548800001',
                        },
                        secondaryField: {
                            heading: 'API Key',
                            fromAria: 'secondaryValue',
                            tip: 'Optional, a default key is provided. Limit: 1,000 queries per day',
                            inputPlaceholder: 'Enter API key',
                            reportInOutput: false, // determines if secondaryField will apear in the results page
                        },
                        bottomTip: '',
                        submitButtonLabel: 'Submit to Incites',
                        isMinimised: false, // set this to false when we have more than one form
                    },
                ],
            },
        },
    },
}));

function setup(testProps = {}, testState = {}) {
    const props = {
        ...testProps,
    };
    const state = {
        thirdPartyLookupToolReducer: {
            ...testState,
        },
    };

    return rtlRender(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <ThirdPartyLookupTool {...props} />
        </WithReduxStore>,
    );
}

describe('Component ThirdPartyLookupTool', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render a form ready for input', () => {
        const { container } = setup({}, { lookupResults: [] });
        expect(container).toMatchSnapshot();
    });

    it('should set state with submitted data', () => {
        const { container, getByRole } = setup({}, { lookupResults: [] });

        expect(getByRole('textbox', { name: 'primaryValue' }).value).toEqual('');
        expect(getByRole('textbox', { name: 'secondaryValue' }).value).toEqual('');

        expect(container).toMatchSnapshot();

        fireEvent.change(getByRole('textbox', { name: 'primaryValue' }), { target: { value: 'a value' } });
        fireEvent.change(getByRole('textbox', { name: 'secondaryValue' }), { target: { value: 'another value' } });

        expect(getByRole('button', { name: 'Submit to Incites' })).toBeInTheDocument();
        fireEvent.click(getByRole('button', { name: 'Submit to Incites' }));

        expect(getByRole('textbox', { name: 'primaryValue' }).value).toEqual('a value');
        expect(getByRole('textbox', { name: 'secondaryValue' }).value).toEqual('another value');

        expect(actions.loadThirdPartyResults).toHaveBeenCalled();
    });

    it('renders loading screen while loading data', () => {
        const { container } = setup({}, { loadingResults: true });
        expect(container).toMatchSnapshot();
    });

    it('renders a results screen', () => {
        const { container } = setup({}, { lookupResults: ['blah blah blah'] });
        expect(container).toMatchSnapshot();
    });
});
