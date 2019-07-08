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
                            fromAria: '',
                            tip: '',
                            inputPlaceholder: 'Enter one or more UTs separated by a comma e.g. 000455548800001',
                        },
                        secondaryField: {
                            heading: 'API Key',
                            fromAria: '',
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

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        actions: testProps.actions || {},
    };
    return getElement(ThirdPartyLookupTool, props, isShallow);
}

describe('Component ThirdPartyLookupTool', () => {
    it('should render a form ready for input', () => {
        const wrapper = setup({});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state with submitted data', () => {
        const wrapper = setup({ actions: {} });
        expect(wrapper.state().primaryValue).toEqual('');
        expect(wrapper.state().secondaryValue).toEqual('');
        expect(wrapper.state().formDisplay).toEqual({});

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().recordInputs('a value', 'another value', { test: '123' });
        wrapper.update();

        expect(wrapper.state().primaryValue).toEqual('a value');
        expect(wrapper.state().secondaryValue).toEqual('another value');
        expect(wrapper.state().formDisplay).toEqual({ test: '123' });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading data', () => {
        const wrapper = setup({ loadingResults: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders a results screen', () => {
        const testprops = {
            lookupResults: ['blah blah blah'],
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
