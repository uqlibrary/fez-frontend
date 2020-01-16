import ContributorForm from './ContributorForm';
import { AFFILIATION_TYPE_NOT_UQ } from 'config/general';

function setup(testProps = {}) {
    const props = {
        onSubmit: jest.fn(),
        showIdentifierLookup: false,
        showRoleInput: false,
        isNtro: false,
        disabled: false,
        locale: {
            descriptionStep1: 'Step 1 description',
        },
        ...testProps,
    };
    return getElement(ContributorForm, props);
}

describe('Component ContributorForm', () => {
    it('should render display name field only', () => {
        const wrapper = setup();
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
        expect(wrapper.state().contributor.nameAsPublished).toEqual('J. Smith');
    });

    it('should call event handler on submit if all checks pass', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
                uqUsername: '',
            },
        });
        const event = {
            key: 'Enter',
        };
        wrapper.instance()._onSubmit(event);
        expect(testFn).toBeCalledWith({
            nameAsPublished: 'Firstname Lastname',
            affiliation: 'UQ',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
            creatorRole: '',
            uqIdentifier: '',
            uqUsername: '',
        });
    });

    it('should add contributor if nameAsPublished is not empty and role from the dropdown is selected', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
        });
        wrapper.instance()._onNameChanged({ target: { value: 'test' } });
        wrapper.instance()._onRoleChanged('Co-investigator');
        expect(testFn).toHaveBeenCalled();
    });

    it('should not add contributor if key is not Enter', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn,
        });
        wrapper.setState({
            contributor: {
                nameAsPublished: 'testing',
            },
        });
        wrapper.instance()._onSubmit({ key: 'Esc' });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter but name as published is empty string', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn,
        });
        wrapper.setState({
            contributor: {
                nameAsPublished: '',
            },
        });
        wrapper.instance()._onSubmit({ key: 'Enter' });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter, name as published is set but creator role is empty', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn,
            showRoleInput: true,
        });
        wrapper.setState({
            contributor: {
                nameAsPublished: 'test',
                creatorRole: '',
            },
        });
        wrapper.instance()._onSubmit({ key: 'Enter' });
        expect(onAddFn).not.toBeCalled();
    });

    it(
        'should not add contributor if key is Enter, affiliation is not UQ, ' +
            'and orgaff and orgtype props are empty strings',
        () => {
            const onAddFn = jest.fn();
            const wrapper = setup({
                onAdd: onAddFn,
            });
            wrapper.setState({
                contributor: {
                    nameAsPublished: 'test',
                    affiliation: AFFILIATION_TYPE_NOT_UQ,
                    orgaff: '',
                    orgtype: '',
                },
            });
            wrapper.instance()._onSubmit({ key: 'Enter' });
            expect(onAddFn).not.toBeCalled();
        },
    );

    it('should set creator role', () => {
        const wrapper = setup({
            showRoleInput: true,
        });
        wrapper
            .find('Connect(WithStyles(AutoCompleteAsyncField))')
            .props()
            .onChange('test');
        expect(wrapper.state().contributor.creatorRole).toEqual('test');
    });

    it('should handle affiliation change', () => {
        const wrapper = setup({
            isNtro: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('OrgAffilicationTypeSelector')
            .props()
            .onAffiliationChange({ target: { value: 'UQ' } });
        expect(wrapper.state().contributor.affiliation).toEqual('UQ');

        wrapper
            .find('OrgAffilicationTypeSelector')
            .props()
            .onAffiliationChange({ target: { value: 'Non-UQ' } });
        expect(wrapper.state().contributor.affiliation).toEqual('Non-UQ');
    });

    it('should show error regarding affiliation type selector', () => {
        const wrapper = setup({
            isNtro: true,
            required: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show error regarding name field', () => {
        const wrapper = setup({
            required: true,
            isContributorAssigned: false,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display org affiliation selector if affiliation is NotUQ', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(0);
        wrapper.setState({
            contributor: {
                nameAsPublished: '',
                affiliation: AFFILIATION_TYPE_NOT_UQ,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('NonUqOrgAffiliationFormSection').length).toBe(1);

        wrapper
            .find('NonUqOrgAffiliationFormSection')
            .props()
            .onOrgAffiliationChange({ target: { value: 'test' } });
        expect(wrapper.state().contributor.orgaff).toEqual('test');

        wrapper
            .find('NonUqOrgAffiliationFormSection')
            .props()
            .onOrgTypeChange({ target: { value: 'testing' } });
        expect(wrapper.state().contributor.orgtype).toEqual('testing');
    });

    it('should disable button', () => {
        const wrapper = setup({
            disabled: false,
            showRoleInput: true,
        });
        wrapper.setState({
            nameAsPublished: 'test',
            creatorRole: 'role',
            affiliation: AFFILIATION_TYPE_NOT_UQ,
            orgaff: '',
        });
        expect(wrapper.find('WithStyles(Button)').props().disabled).toBeTruthy();
    });

    it('should not disable button', () => {
        const wrapper = setup({
            disabled: false,
            showRoleInput: true,
        });
        wrapper.setState({
            contributor: {
                nameAsPublished: 'test',
                creatorRole: 'role',
                affiliation: AFFILIATION_TYPE_NOT_UQ,
                orgaff: 'test',
                orgtype: 'test',
            },
        });
        expect(wrapper.find('WithStyles(Button)').props().disabled).toBeFalsy();
    });

    it('should show contributor assignment', () => {
        const wrapper = setup({
            showContributorAssignment: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render narrower grid at md breakpoint if showIdentifierLookup is true', () => {
        const wrapper = setup({
            showRoleInput: true,
            showIdentifierLookup: true,
        });
        expect(
            wrapper
                .find('#creatorRoleField')
                .parent()
                .prop('md'),
        ).toBe(3);
    });

    it('should process prop updates', () => {
        const contributor1 = { nameAsPublished: 'value1' };
        const contributor2 = { nameAsPublished: 'value2' };

        const wrapper = setup({
            contributor: contributor1,
        });
        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            contributor: contributor2,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(componentWillReceiveProps).toHaveBeenCalled();
    });

    it('should be able to set uqIdentifier on the contributor object', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
        });
        wrapper.instance()._onUQIdentifierSelected({ aut_id: 111, aut_org_username: 'uqtest' });
        expect(testFn).toBeCalledWith({
            affiliation: '',
            creatorRole: '',
            nameAsPublished: '',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '111',
            aut_id: 111,
            aut_org_username: 'uqtest',
            uqUsername: 'uqtest',
        });
    });

    it('should be able to set nameAsPublished on the contributor object from selected author', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
        });
        wrapper.instance()._onUQIdentifierSelected({
            aut_id: 111,
            aut_lname: 'Test',
            aut_fname: 'Testing',
            aut_org_username: 'uqtest',
        });
        expect(testFn).toBeCalledWith({
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Test, Testing',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '111',
            aut_id: 111,
            aut_lname: 'Test',
            aut_fname: 'Testing',
            aut_org_username: 'uqtest',
            uqUsername: 'uqtest',
        });
    });

    it('should set state properly when UQ identifier is cleared', () => {
        const wrapper = setup({});
        const testFn = jest.fn();
        wrapper.instance()._onSubmit = testFn;

        const initialState = wrapper.state();
        const { uqUsername, ...rest } = initialState.contributor;

        const expected = {
            ...initialState,
            contributor: {
                ...rest,
                uqIdentifier: '0',
                orgaff: 'Missing',
                authorId: 0,
                affiliation: 'NotUQ',
            },
        };

        wrapper.instance()._onUQIdentifierCleared();

        expect(wrapper.state()).toEqual(expected);
        expect(testFn).toHaveBeenCalledTimes(1);
        expect(uqUsername).toBe('');
    });

    it('should clear contributor form on cancellation from edit', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
        });
        wrapper.instance()._onCancel();
        expect(testFn).toBeCalledWith({
            nameAsPublished: 'Firstname Lastname',
            affiliation: 'UQ',
            orgaff: '',
            orgtype: '',
            creatorRole: '',
        });
    });

    it('should not submit contributor form if admin user is adding dataset', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onSubmit: testFn,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
            canEdit: true,
            showRoleInput: true,
        });
        wrapper.instance()._onUQIdentifierSelected({
            aut_id: 1,
            aut_org_username: 'uqtest',
        });
        expect(testFn).not.toBeCalledWith();
    });
});
