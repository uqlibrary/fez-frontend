import {ContributorForm} from './ContributorForm';
import ConnectedContributorForm from './ContributorForm';
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
        locale: {
            descriptionStep1: 'Step 1 description',
        },
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
        const testFunction = jest.fn((value, cb) => {
            expect(cb({aut_org_username: 'test'})).toBeTruthy();
        });
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

    it('should not add contributor if key is not Enter', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn
        });
        wrapper.setState({
            nameAsPublished: 'testing'
        });
        wrapper.instance()._addContributor({key: 'Esc'});
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter but name as published is empty string', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn
        });
        wrapper.setState({
            nameAsPublished: ''
        });
        wrapper.instance()._addContributor({key: 'Enter'});
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter, name as published is set but creator role is empty', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn,
            showRoleInput: true
        });
        wrapper.setState({
            nameAsPublished: 'test',
            creatorRole: ''
        });
        wrapper.instance()._addContributor({key: 'Enter'});
        expect(onAddFn).not.toBeCalled();
    });

    it('should set creator role', () => {
        const wrapper = setup({
            showRoleInput: true
        });
        wrapper.find('Connect(WithStyles(AutoCompleteAsyncField))').props().onChange('test');
        expect(wrapper.state().creatorRole).toEqual('test');
    });

    it('should handle affiliation change', () => {
        const wrapper = setup({
            isNtro: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('OrgAffilicationTypeSelector').props().onAffiliationChange({target: {value: 'UQ'}});
        expect(wrapper.state().affiliation).toEqual('UQ');
        expect(wrapper.state().showIdentifierLookup).toBeTruthy();

        wrapper.find('OrgAffilicationTypeSelector').props().onAffiliationChange({target: {value: 'Non-UQ'}});
        expect(wrapper.state().affiliation).toEqual('Non-UQ');
        expect(wrapper.state().showIdentifierLookup).toBeFalsy();
    });

    it('should show error regarding affiliation type selector', () => {
        const wrapper = setup({
            isNtro: true,
            required: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show error regarding name field', () => {
        const wrapper = setup({
            required: true,
            isContributorAssigned: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display org affiliation selector if affiliation is NotUQ', () => {
        const wrapper = setup({});
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(0);
        wrapper.setState({
            affiliation: 'NotUQ'
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(1);

        wrapper.find('NonUqOrgAffiliationFormSection').props().onOrgAffiliationChange({target: {value: 'test'}});
        expect(wrapper.state().orgaff).toEqual('test');

        wrapper.find('NonUqOrgAffiliationFormSection').props().onOrgTypeChange({target: {value: 'testing'}});
        expect(wrapper.state().orgtype).toEqual('testing');
    });

    it('should disable button', () => {
        const wrapper = setup({
            disabled: false,
            showRoleInput: true
        });
        wrapper.setState({
            nameAsPublished: 'test',
            creatorRole: 'role',
            affiliation: 'NotUQ',
            orgaff: ''
        });
        expect(wrapper.find('WithStyles(Button)').props().disabled).toBeTruthy();
    });

    it('should render connected component', () => {
        const wrapper = getElement(ConnectedContributorForm, {onAdd: jest.fn()}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show contributor assignment', () => {
        const wrapper = setup({
            showContributorAssignment: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
