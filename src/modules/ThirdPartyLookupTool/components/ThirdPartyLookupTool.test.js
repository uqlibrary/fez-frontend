import {ThirdPartyLookupTool} from './ThirdPartyLookupTool';
import {routes} from "../../../../config";

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
        // const testAction = jest.fn();
        // const wrapper = setup({actions: {loadThirdPartyLookup: testAction}});
        const wrapper = setup({actions: {}});

        expect(wrapper.state().primaryValue).toEqual('');
        expect(wrapper.state().secondaryValue).toEqual('');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().recordInputs('a value', 'another value');
        wrapper.update();

        expect(wrapper.state().primaryValue).toEqual('a value');
        expect(wrapper.state().secondaryValue).toEqual('another value');

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading data', () => {
        const wrapper = setup({ loadingResults: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders a results screen', () => {
        const testprops = {
            lookupResults: ['blah blah blah']
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
