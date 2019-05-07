import { ContributorForm, mapStateToProps } from './ContributorForm';
import ConnectedContributorForm from './ContributorForm';

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
        const wrapper = setup({ showIdentifierLookup: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render display name field and role field', () => {
        const wrapper = setup({ showRoleInput: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render NTRO fields', () => {
        const wrapper = setup({ isNtro: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('sets display name of a contributor ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showIdentifierLookup: true, actions: { searchAuthors: testFunction } });
        expect(wrapper.state.nameAsPublished).toBeFalsy();
        wrapper.instance()._onNameChanged({ target: { value: 'J. Smith' } });
        expect(wrapper.state().nameAsPublished).toEqual('J. Smith');
    });

    it('should call event handler on submit if all checks pass', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
        });
        const state = {
            nameAsPublished: 'Firstname Lastname',
            affiliation: 'UQ',
            orgaff: '',
            orgtype: '',
            creatorRole: '',
            contributor: {},
        };
        wrapper.setState(state);
        const event = {
            key: 'Enter'
        };
        wrapper.instance()._onSubmit(event);
        delete state.contributor;
        expect(testFn).toBeCalledWith({
            ...state,
            uqIdentifier: undefined,
        });
    });

    it('should not add contributor if key is not Enter', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn
        });
        wrapper.setState({
            nameAsPublished: 'testing'
        });
        wrapper.instance()._onSubmit({ key: 'Esc' });
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
        wrapper.instance()._onSubmit({ key: 'Enter' });
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
        wrapper.instance()._onSubmit({ key: 'Enter' });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter, affiliation is not UQ, and orgaff and orgtype props are empty strings', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn
        });
        wrapper.setState({
            nameAsPublished: 'test',
            affiliation: 'NOT UQ',
            orgaff: '',
            orgtype: ''
        });
        wrapper.instance()._onSubmit({ key: 'Enter' });
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

        wrapper.find('OrgAffilicationTypeSelector').props().onAffiliationChange({ target: { value: 'UQ' } });
        expect(wrapper.state().affiliation).toEqual('UQ');
        expect(wrapper.state().showIdentifierLookup).toBeTruthy();

        wrapper.find('OrgAffilicationTypeSelector').props().onAffiliationChange({ target: { value: 'Non-UQ' } });
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
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(0);
        wrapper.setState({
            affiliation: 'NotUQ'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(1);

        wrapper.find('NonUqOrgAffiliationFormSection').props().onOrgAffiliationChange({ target: { value: 'test' } });
        expect(wrapper.state().orgaff).toEqual('test');

        wrapper.find('NonUqOrgAffiliationFormSection').props().onOrgTypeChange({ target: { value: 'testing' } });
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

    it('should not disable button', () => {
        const wrapper = setup({
            disabled: false,
            showRoleInput: true
        });
        wrapper.setState({
            nameAsPublished: 'test',
            creatorRole: 'role',
            affiliation: 'NotUQ',
            orgaff: 'test',
            orgtype: 'test'
        });
        expect(wrapper.find('WithStyles(Button)').props().disabled).toBeFalsy();
    });

    it('should render connected component', () => {
        const wrapper = getElement(ConnectedContributorForm, { onAdd: jest.fn() }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show contributor assignment', () => {
        const wrapper = setup({
            showContributorAssignment: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should map state to props as expected', () => {
        const authorsList = [
            'test1',
            'test2'
        ];
        const testFunction = () => ({ authorsList });
        expect(mapStateToProps({
            get: testFunction
        })).toEqual({ authorsList });
        expect(mapStateToProps({
            get: () => false
        })).toEqual({
            authorsList: []
        });
    });

    it('should render narrower grid at md breakpoint if showIdentifierLookup is true', () => {
        const wrapper = setup({
            showRoleInput: true,
            showIdentifierLookup: true
        }, true);
        expect(wrapper.find('#creatorRoleField').parent().prop('md')).toBe(3);
    });

    it('should process prop updates', () => {
        const contributor1 = { test1: 'value1' };
        const contributor2 = { test1: 'value2' };
        const wrapper = setup({
            contributor: contributor1,
            test1: 'value1',
            test2: 'value3',
        });
        const before = wrapper.state();
        wrapper.instance().componentWillReceiveProps({
            contributor: contributor1,
            test2: 'value4',
        });
        expect(wrapper.state()).toEqual(before);

        wrapper.instance().componentWillReceiveProps({
            contributor: contributor2
        });
        expect(wrapper.state().contributor).toBe(contributor2);
        expect(wrapper.state().test1).toBe('value2');

        wrapper.instance().componentWillReceiveProps({});
        expect(wrapper.state().contributor).toEqual({});
    });

    it('should be able to save selected item object to contributor state', () => {
        const wrapper = setup({});
        const testFn = jest.spyOn(wrapper.instance(), '_onSubmit');
        wrapper.instance()._onUQIdentifierSelected({});
        expect(wrapper.state().contributor).toEqual({});
        expect(testFn).toBeCalled();
    });

    it('should clear uqIdentifier state if affiliation is changed to "NotUQ"', () => {
        const wrapper = setup({});
        wrapper.setState({
            uqIdentifier: '100'
        });
        wrapper.instance().handleAffiliationChange({
            target: {
                value: 'NotUQ'
            }
        });
        expect(wrapper.state().uqIdentifier).toBe('');
    });

});
