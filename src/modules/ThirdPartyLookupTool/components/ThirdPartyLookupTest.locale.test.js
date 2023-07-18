import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import { ThirdPartyLookupTool } from './ThirdPartyLookupTool';
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

function setup(testProps) {
    const props = {
        ...testProps,
        actions: testProps.actions || {},
    };
    return rtlRender(<ThirdPartyLookupTool {...props} />);
}

describe('Component ThirdPartyLookupTool', () => {
    it('should render a form ready for input', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should set state with submitted data', () => {
        const loadResultMock = jest.fn();
        const { container, getByRole } = setup({ actions: { loadThirdPartyResults: loadResultMock } });

        expect(getByRole('textbox', { name: 'primaryValue' }).value).toEqual('');
        expect(getByRole('textbox', { name: 'secondaryValue' }).value).toEqual('');

        expect(container).toMatchSnapshot();

        fireEvent.change(getByRole('textbox', { name: 'primaryValue' }), { target: { value: 'a value' } });
        fireEvent.change(getByRole('textbox', { name: 'secondaryValue' }), { target: { value: 'another value' } });

        expect(getByRole('button', { name: 'Submit to Incites' })).toBeInTheDocument();
        fireEvent.click(getByRole('button', { name: 'Submit to Incites' }));

        expect(getByRole('textbox', { name: 'primaryValue' }).value).toEqual('a value');
        expect(getByRole('textbox', { name: 'secondaryValue' }).value).toEqual('another value');

        expect(loadResultMock).toBeCalled();
    });

    it('renders loading screen while loading data', () => {
        const { container } = setup({ loadingResults: true });
        expect(container).toMatchSnapshot();
    });

    it('renders a results screen', () => {
        const { container } = setup({ lookupResults: ['blah blah blah'] });
        expect(container).toMatchSnapshot();
    });
});
