import React from 'react';
import ContributorForm from './ContributorForm';
import { rtlRender, withRedux, fireEvent, waitForElement } from 'test-utils';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

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
        expect(getByTestId('submit-author').disabled).toBeTruthy();
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

    it('should show contributor assignment', () => {
        const { getByText } = setup({
            showContributorAssignment: true,
        });
        expect(getByText('Step 1 description')).toBeInTheDocument();
    });

    it('should be able to set uqIdentifier on the contributor object', async() => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            showIdentifierLookup: true,
            onSubmit: testFn,
        });

        fireEvent.change(getByTestId('name-as-published'), { target: { value: 'Testing, UqId' } });
        fireEvent.change(getByTestId('identifier-field'), { target: { value: 'christ' } });

        const list = await waitForElement(() => getByTestId('identifier-field-popup'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (mdcmar) ',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Testing, UqId',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '553',
            aut_id: 553,
            aut_org_username: 'mdcmar',
            aut_org_staff_id: '0002633',
            aut_org_student_id: null,
            aut_email: null,
            aut_display_name: 'Del Mar, Christopher B.',
            aut_fname: 'Christopher',
            aut_mname: 'Bernard',
            aut_lname: 'Del Mar',
            aut_title: 'Professor',
            aut_position: '',
            aut_homepage_link: '',
            aut_created_date: null,
            aut_update_date: '2010-10-08',
            aut_external_id: '0000041362',
            aut_ref_num: '',
            aut_researcher_id: null,
            aut_scopus_id: '',
            aut_mypub_url: '',
            aut_rid_password: null,
            aut_people_australia_id: null,
            aut_description: null,
            aut_orcid_id: null,
            aut_google_scholar_id: null,
            aut_rid_last_updated: null,
            aut_publons_id: null,
            aut_student_username: null,
            uqUsername: 'mdcmar - 553',
        });
    });

    it('should be able to set nameAsPublished on the contributor object from selected author', async() => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            showIdentifierLookup: true,
            onSubmit: testFn,
        });

        fireEvent.change(getByTestId('identifier-field'), { target: { value: 'christ' } });

        const list = await waitForElement(() => getByTestId('identifier-field-popup'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (mdcmar) ',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Del Mar, Christopher',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '553',
            aut_id: 553,
            aut_org_username: 'mdcmar',
            aut_org_staff_id: '0002633',
            aut_org_student_id: null,
            aut_email: null,
            aut_display_name: 'Del Mar, Christopher B.',
            aut_fname: 'Christopher',
            aut_mname: 'Bernard',
            aut_lname: 'Del Mar',
            aut_title: 'Professor',
            aut_position: '',
            aut_homepage_link: '',
            aut_created_date: null,
            aut_update_date: '2010-10-08',
            aut_external_id: '0000041362',
            aut_ref_num: '',
            aut_researcher_id: null,
            aut_scopus_id: '',
            aut_mypub_url: '',
            aut_rid_password: null,
            aut_people_australia_id: null,
            aut_description: null,
            aut_orcid_id: null,
            aut_google_scholar_id: null,
            aut_rid_last_updated: null,
            aut_publons_id: null,
            aut_student_username: null,
            uqUsername: 'mdcmar - 553',
        });
    });
    it('should be able to set uqUsername on the contributor object from selected author student username', async() => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, {
            data: [
                {
                    aut_id: 553,
                    aut_org_username: null,
                    aut_org_staff_id: '0002633',
                    aut_org_student_id: null,
                    aut_email: null,
                    aut_display_name: 'Del Mar, Christopher B.',
                    aut_fname: 'Christopher',
                    aut_mname: 'Bernard',
                    aut_lname: 'Del Mar',
                    aut_title: 'Professor',
                    aut_position: '',
                    aut_homepage_link: '',
                    aut_created_date: null,
                    aut_update_date: '2010-10-08',
                    aut_external_id: '0000041362',
                    aut_ref_num: '',
                    aut_researcher_id: null,
                    aut_scopus_id: '',
                    aut_mypub_url: '',
                    aut_rid_password: null,
                    aut_people_australia_id: null,
                    aut_description: null,
                    aut_orcid_id: null,
                    aut_google_scholar_id: null,
                    aut_rid_last_updated: null,
                    aut_publons_id: null,
                    aut_student_username: 'smdcmar',
                },
            ],
        });
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            showIdentifierLookup: true,
            onSubmit: testFn,
        });

        fireEvent.change(getByTestId('identifier-field'), { target: { value: 'christ' } });

        const list = await waitForElement(() => getByTestId('identifier-field-popup'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (smdcmar)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B.  (smdcmar)',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Del Mar, Christopher',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '553',
            aut_id: 553,
            aut_org_username: null,
            aut_org_staff_id: '0002633',
            aut_org_student_id: null,
            aut_email: null,
            aut_display_name: 'Del Mar, Christopher B.',
            aut_fname: 'Christopher',
            aut_mname: 'Bernard',
            aut_lname: 'Del Mar',
            aut_title: 'Professor',
            aut_position: '',
            aut_homepage_link: '',
            aut_created_date: null,
            aut_update_date: '2010-10-08',
            aut_external_id: '0000041362',
            aut_ref_num: '',
            aut_researcher_id: null,
            aut_scopus_id: '',
            aut_mypub_url: '',
            aut_rid_password: null,
            aut_people_australia_id: null,
            aut_description: null,
            aut_orcid_id: null,
            aut_google_scholar_id: null,
            aut_rid_last_updated: null,
            aut_publons_id: null,
            aut_student_username: 'smdcmar',
            uqUsername: 'smdcmar - 553',
        });
    });
    it('should set state properly when UQ identifier is cleared', () => {
        const testFn = jest.fn();
        const { getByTitle } = setup({
            onSubmit: testFn,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'Test',
                uqIdentifier: '411',
            },
        });

        fireEvent.click(getByTitle('Clear'));

        expect(testFn).toHaveBeenCalledWith({
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Test',
            orgaff: 'Missing',
            orgtype: '',
            uqIdentifier: '0',
            uqUsername: '',
        });
    });

    it('should clear contributor form on cancellation from edit', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            onSubmit: testFn,
            displayCancel: true,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
        });
        fireEvent.click(getByTestId('cancel-submit-author'));
        expect(testFn).toBeCalledWith({
            nameAsPublished: 'Firstname Lastname',
            affiliation: 'UQ',
            orgaff: '',
            orgtype: '',
            creatorRole: '',
        });
    });

    it('should clear contributor form on clearing from UQ ID but should not submit for admins', () => {
        const testFn = jest.fn();
        const { getByTitle } = setup({
            canEdit: true,
            onSubmit: testFn,
            showRoleInput: true,
            showIdentifierLookup: true,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
        });
        fireEvent.click(getByTitle('Clear'));
        expect(testFn).not.toBeCalled();
    });
});
