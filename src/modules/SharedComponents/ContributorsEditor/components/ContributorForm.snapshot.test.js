import {ContributorForm} from './ContributorForm';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {authorsSearch} from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        authorsList: testProps.authorsList || [],
        onAdd: testProps.onAdd || jest.fn(),
        showIdentifierLookup: testProps.showIdentifierLookup || false,
        actions: testProps.actions || {},
        disabled: testProps.disabled || false
    };
    return getElement(ContributorForm, props, isShallow);
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('Component ContributorForm', () => {

    it('rendering display name field only', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering display name field and identifier field', () => {
        const wrapper = setup({ showIdentifierLookup: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('loads authors when value is changed', () => {
        const testFunction = jest.fn();
        const wrapper = setup({showIdentifierLookup: true, actions: { searchAuthors: testFunction }});
        wrapper.instance()._onUQIdentifierChanged('smith');
        expect(testFunction).toBeCalled();
    });

    it('sets display name of a contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, actions: { searchAuthors: testFunction } });
        expect(wrapper.state.nameAsPublished).toBeFalsy();
        wrapper.instance()._onNameChanged({}, 'J. Smith');
        expect(wrapper.state().nameAsPublished).toEqual('J. Smith');
    });

    it('selects author identifier, calls add contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, onAdd: testFunction });
        wrapper.instance()._onUQIdentifierSelected(authorsSearch.data[0], 0);
        expect(testFunction).toBeCalled();
    });
});
