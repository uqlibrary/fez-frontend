import {ContributorForm} from './ContributorForm';
import {authorsSearch} from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        authorsList: [],
        onAdd: jest.fn(),
        showIdentifierLookup: false,
        showRoleInput: false,
        isNtro: false,
        actions: {},
        disabled: false,
        ...testProps,
    };
    return getElement(ContributorForm, props, isShallow);
}

describe('Component ContributorForm', () => {
    it('should render display name field only', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render display name field and identifier field', () => {
        const wrapper = setup({ showIdentifierLookup: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render display name field and role field', () => {
        const wrapper = setup({ showRoleInput: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render NTRO fields', () => {
        const wrapper = setup({ isNtro: true });
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
        wrapper.instance()._onNameChanged({target: {value: 'J. Smith'}});
        expect(wrapper.state().nameAsPublished).toEqual('J. Smith');
    });

    it('selects author identifier, calls add contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, onAdd: testFunction });
        wrapper.instance()._onUQIdentifierSelected(authorsSearch.data[0], 0);
        expect(testFunction).toBeCalled();
    });
});
