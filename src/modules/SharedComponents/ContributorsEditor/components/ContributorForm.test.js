import React from 'react';
import ContributorForm from './ContributorForm';
import { rtlRender, withRedux, fireEvent, waitForElement } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onSubmit: jest.fn(),
        showIdentifierLookup: false,
        showRoleInput: false,
        isNtro: false,
        disabled: false,
        locale: {
            descriptionStep1: 'Step 1 description',
            addButton: 'Add author',
            nameAsPublishedLabel: 'Please enter author name',
        },
        ...testProps,
    };
    return rtlRender(withRedux()(<ContributorForm {...props} />));
}

describe('Component ContributorForm', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render display name field only', () => {
        const { getByTestId } = setup();
        expect(getByTestId('name-as-published')).toBeInTheDocument();
    });

    it('should render display name field and identifier field', () => {
        const { getByTestId } = setup({ showIdentifierLookup: true });
        expect(getByTestId('name-as-published')).toBeInTheDocument();
        expect(getByTestId('identifier-field')).toBeInTheDocument();
    });

    it('should render display name field and role field', () => {
        const { getByTestId } = setup({ showRoleInput: true });
        expect(getByTestId('name-as-published')).toBeInTheDocument();
        expect(getByTestId('creator-role-field')).toBeInTheDocument();
    });

    it('should render NTRO fields', () => {
        const { getByTestId, getByLabelText } = setup({ isNtro: true });
        expect(getByTestId('name-as-published')).toBeInTheDocument();
        expect(getByLabelText('Org affiliation')).toBeInTheDocument();
        expect(getByTestId('identifier-field')).toBeInTheDocument();
    });

    it('should call event handler on submit if all checks pass', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
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

        fireEvent.click(getByTestId('submit-author'));

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
        const { getByTestId, getByText, getByRole } = setup({
            onSubmit: testFn,
            showRoleInput: true,
        });
        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'Test Author' } });
        fireEvent.click(getByTestId('creator-role-field'));
        const list = waitForElement(() => getByRole('presentation'));
        fireEvent.click(getByText('Co-investigator'), list);
        expect(testFn).toHaveBeenCalledWith({
            affiliation: '',
            creatorRole: 'Co-investigator',
            nameAsPublished: 'Test Author',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '',
            uqUsername: '',
        });
    });

    it('should not add contributor if "Enter" is not pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
        });

        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'Test Author' } });
        fireEvent.keyDown(getByTestId('name-as-published'), { key: 'Esc', code: 27 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if "Enter" is pressed but name as published is empty', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
        });

        fireEvent.keyDown(getByTestId('name-as-published'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if "Enter" is pressed, name as published is set but creator role is empty', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
            showRoleInput: true,
        });
        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'Test Author' } });
        fireEvent.keyDown(getByTestId('name-as-published'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter, affiliation is not UQ, and orgaff and orgtype props are empty strings', () => {
        const onAddFn = jest.fn();
        const { getByTestId, getByText } = setup({
            onAdd: onAddFn,
            isNtro: true,
        });

        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'Test Author' } });
        fireEvent.mouseDown(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText('Not UQ'));
        fireEvent.keyDown(getByTestId('name-as-published'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should handle affiliation change', () => {
        const { getByTestId, getByText } = setup({
            isNtro: true,
        });

        fireEvent.mouseDown(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText('Not UQ'));
        expect(getByText('Not UQ')).toBeInTheDocument();

        fireEvent.click(getByText('UQ'));
        expect(getByText('UQ')).toBeInTheDocument();
    });

    it('should show affiliation type selector in error state', () => {
        const { getByTestId } = setup({
            isNtro: true,
            required: true,
        });
        expect(getByTestId('org-affiliation-selector-label')).toHaveClass('Mui-error');
    });

    it('should show error regarding name field', () => {
        const { getByTestId } = setup({
            required: true,
            isContributorAssigned: false,
        });
        expect(getByTestId('name-as-published-label')).toHaveClass('Mui-error');
    });

    it('should display org affiliation selector if affiliation is NotUQ', () => {
        const { getByTestId, getByText } = setup({ isNtro: true });

        fireEvent.mouseDown(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText('Not UQ'));

        expect(getByTestId('org-affiliation-name-label')).toHaveClass('Mui-error');
        expect(getByTestId('org-affiliation-type-label')).toHaveClass('Mui-error');

        fireEvent.change(getByTestId('org-affiliation-name'), { target: { value: 'test' } });
        expect(getByTestId('org-affiliation-name-label')).not.toHaveClass('Mui-error');

        fireEvent.mouseDown(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('NGO'));
        expect(getByTestId('org-affiliation-type-label')).not.toHaveClass('Mui-error');

        expect(getByTestId('submit-author').disabled).toBeTruthy();

        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'testing' } });
        expect(getByTestId('submit-author').disabled).toBeFalsy();
    });

    // it('should disable button for NTRO 2', () => {
    //     const wrapper = setup({
    //         disabled: false,
    //         showRoleInput: false,
    //         isNtro: true,
    //     });
    //     wrapper.setState({
    //         contributor: {
    //             nameAsPublished: 'test',
    //             creatorRole: 'role',
    //             affiliation: AFFILIATION_TYPE_NOT_UQ,
    //             orgaff: 'test',
    //             orgtype: '',
    //         },
    //     });
    //     expect(wrapper.find('WithStyles(Button)').props().disabled).toBeTruthy();
    // });

    // it('should not disable the button if work is not NTRO', () => {
    //     const wrapper = setup({
    //         disabled: false,
    //         showRoleInput: false,
    //         isNtro: false,
    //     });
    //     wrapper.setState({
    //         contributor: {
    //             nameAsPublished: 'test',
    //             creatorRole: '',
    //             affiliation: '',
    //             orgaff: '',
    //             orgtype: '',
    //         },
    //     });
    //     expect(wrapper.find('WithStyles(Button)').props().disabled).toBeFalsy();
    // });

    // it('should be disable the button', () => {
    //     const wrapper = setup({
    //         disabled: true,
    //         showRoleInput: false,
    //     });
    //     wrapper.setState({
    //         contributor: {
    //             nameAsPublished: 'test',
    //             creatorRole: '',
    //             affiliation: '',
    //             orgaff: '',
    //             orgtype: '',
    //         },
    //     });
    //     expect(wrapper.find('WithStyles(Button)').props().disabled).toBeTruthy();
    // });

    // it('should show contributor assignment', () => {
    //     const wrapper = setup({
    //         showContributorAssignment: true,
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render narrower grid at md breakpoint if showIdentifierLookup is true', () => {
    //     const wrapper = setup({
    //         showRoleInput: true,
    //         showIdentifierLookup: true,
    //     });
    //     expect(
    //         wrapper
    //             .find('#creatorRoleField')
    //             .parent()
    //             .prop('md'),
    //     ).toBe(3);
    // });

    // it('should process prop updates', () => {
    //     const contributor1 = { nameAsPublished: 'value1' };
    //     const contributor2 = { nameAsPublished: 'value2' };

    //     const wrapper = setup({
    //         contributor: contributor1,
    //     });
    //     const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');

    //     expect(toJson(wrapper)).toMatchSnapshot();

    //     wrapper.setProps({
    //         contributor: contributor2,
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    //     expect(componentWillReceiveProps).toHaveBeenCalled();
    // });

    // it('should be able to set uqIdentifier on the contributor object', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         onSubmit: testFn,
    //     });
    //     wrapper.instance()._onUQIdentifierSelected({ aut_id: 111, aut_org_username: 'uqtest' });
    //     expect(testFn).toBeCalledWith({
    //         affiliation: '',
    //         creatorRole: '',
    //         nameAsPublished: '',
    //         orgaff: '',
    //         orgtype: '',
    //         uqIdentifier: '111',
    //         aut_id: 111,
    //         aut_org_username: 'uqtest',
    //         uqUsername: 'uqtest - 111',
    //     });
    // });

    // it('should be able to set nameAsPublished on the contributor object from selected author', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         onSubmit: testFn,
    //     });
    //     wrapper.instance()._onUQIdentifierSelected({
    //         aut_id: 111,
    //         aut_lname: 'Test',
    //         aut_fname: 'Testing',
    //         aut_org_username: 'uqtest',
    //     });
    //     expect(testFn).toBeCalledWith({
    //         affiliation: '',
    //         creatorRole: '',
    //         nameAsPublished: 'Test, Testing',
    //         orgaff: '',
    //         orgtype: '',
    //         uqIdentifier: '111',
    //         aut_id: 111,
    //         aut_lname: 'Test',
    //         aut_fname: 'Testing',
    //         aut_org_username: 'uqtest',
    //         uqUsername: 'uqtest - 111',
    //     });
    // });

    // it('should be able to set nameAsPublished on the contributor object from selected author', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         onSubmit: testFn,
    //     });
    //     wrapper.instance()._onUQIdentifierSelected({
    //         aut_id: 111,
    //         aut_lname: 'Test',
    //         aut_fname: 'Testing',
    //         aut_student_username: 'uqtest',
    //     });
    //     expect(testFn).toBeCalledWith({
    //         affiliation: '',
    //         creatorRole: '',
    //         nameAsPublished: 'Test, Testing',
    //         orgaff: '',
    //         orgtype: '',
    //         uqIdentifier: '111',
    //         aut_id: 111,
    //         aut_lname: 'Test',
    //         aut_fname: 'Testing',
    //         aut_student_username: 'uqtest',
    //         uqUsername: 'uqtest - 111',
    //     });
    // });

    // it('should set state properly when UQ identifier is cleared', () => {
    //     const wrapper = setup({});
    //     const testFn = jest.fn();
    //     wrapper.instance()._onSubmit = testFn;

    //     const initialState = wrapper.state();
    //     const { uqUsername, ...rest } = initialState.contributor;

    //     const expected = {
    //         ...initialState,
    //         contributor: {
    //             ...rest,
    //             uqIdentifier: '0',
    //             orgaff: 'Missing',
    //             affiliation: '',
    //             uqUsername: '',
    //         },
    //     };

    //     wrapper.instance()._onUQIdentifierCleared();

    //     expect(wrapper.state()).toEqual(expected);
    //     expect(testFn).toHaveBeenCalledTimes(1);
    //     expect(uqUsername).toBe('');
    // });

    // it('should clear contributor form on cancellation from edit', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         onSubmit: testFn,
    //         contributor: {
    //             nameAsPublished: 'Firstname Lastname',
    //             affiliation: 'UQ',
    //             orgaff: '',
    //             orgtype: '',
    //             creatorRole: '',
    //         },
    //     });
    //     wrapper.instance()._onCancel();
    //     expect(testFn).toBeCalledWith({
    //         nameAsPublished: 'Firstname Lastname',
    //         affiliation: 'UQ',
    //         orgaff: '',
    //         orgtype: '',
    //         creatorRole: '',
    //     });
    // });

    // it('should clear contributor form on clearing from UQ ID but should not submit for admins', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         canEdit: true,
    //         onSubmit: testFn,
    //         showRoleInput: true,
    //         contributor: {
    //             nameAsPublished: 'Firstname Lastname',
    //             affiliation: 'UQ',
    //             orgaff: '',
    //             orgtype: '',
    //             creatorRole: '',
    //         },
    //     });
    //     wrapper.instance()._onUQIdentifierCleared();
    //     expect(testFn).not.toBeCalledWith();
    // });

    // it('should not submit contributor form if admin user is adding dataset', () => {
    //     const testFn = jest.fn();
    //     const wrapper = setup({
    //         onSubmit: testFn,
    //         contributor: {
    //             nameAsPublished: 'Firstname Lastname',
    //             affiliation: 'UQ',
    //             orgaff: '',
    //             orgtype: '',
    //             creatorRole: '',
    //         },
    //         canEdit: true,
    //         showRoleInput: true,
    //     });
    //     wrapper.instance()._onUQIdentifierSelected({
    //         aut_id: 1,
    //         aut_org_username: 'uqtest',
    //     });
    //     expect(testFn).not.toBeCalledWith();
    // });
});
