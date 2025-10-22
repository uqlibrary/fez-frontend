import React from 'react';
import ContributorForm from './ContributorForm';
import { render, WithReduxStore, fireEvent, waitFor, act, userEvent, addContributorsEditorItem } from 'test-utils';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

const renderComponent = (props = {}) => {
    return render(
        <WithReduxStore>
            <ContributorForm {...props} />
        </WithReduxStore>,
    );
};

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
        contributorFormId: 'rek-contributor',
        hidePopoverNamesForm: true,
        ...testProps,
    };
    return renderComponent(props);
}

describe('Component ContributorForm', () => {
    it('should render with default props', () => {
        const { container } = renderComponent({ onSubmit: jest.fn() });
        expect(container).toMatchSnapshot();
    });

    it('should render display name field only', () => {
        const { getByTestId } = setup();
        expect(getByTestId('rek-contributor-input')).toBeInTheDocument();
        expect(getByTestId('rek-contributor-add').disabled).toBeTruthy();
    });

    it('should validate new contributor maxlength correctly', () => {
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('rek-contributor-add'));
        expect(getByTestId('rek-contributor-add').disabled).toBeTruthy();
        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: '1' } });
        expect(getByTestId('rek-contributor-add').disabled).toBeFalsy();
        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: '1'.repeat(255) } });
        expect(getByTestId('rek-contributor-add').disabled).toBeFalsy();
        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: '1'.repeat(256) } });
        expect(getByTestId('rek-contributor-add').disabled).toBeTruthy();
    });

    it('should render display name field and identifier field', () => {
        const { getByTestId } = setup({ showIdentifierLookup: true });
        expect(getByTestId('rek-contributor-input')).toBeInTheDocument();
        expect(getByTestId('rek-contributor-aut-id-input')).toBeInTheDocument();
    });

    it('should render display name field and role field', () => {
        const { getByTestId } = setup({ showRoleInput: true });
        expect(getByTestId('rek-contributor-input')).toBeInTheDocument();
        expect(getByTestId('rek-author-role-input')).toBeInTheDocument();
    });

    it('should render NTRO fields', () => {
        const { getByTestId, getByLabelText } = setup({ isNtro: true });
        expect(getByTestId('rek-contributor-input')).toBeInTheDocument();
        expect(getByLabelText('Org affiliation')).toBeInTheDocument();
        expect(getByTestId('rek-contributor-aut-id-input')).toBeInTheDocument();
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

        fireEvent.click(getByTestId('rek-contributor-add'));

        expect(testFn).toBeCalledWith({
            nameAsPublished: 'Firstname Lastname',
            affiliation: 'UQ',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
            creatorRole: '',
            uqIdentifier: '',
            uqUsername: '',
            required: false,
        });
    });

    describe('should add contributor if nameAsPublished is not empty', () => {
        it('hidePopoverNamesForm=true', async () => {
            const testFn = jest.fn();
            const { getByTestId } = setup({
                onSubmit: testFn,
            });
            await userEvent.type(getByTestId('rek-contributor-input'), 'Test Author{enter}');
            expect(testFn).toHaveBeenCalledWith({
                affiliation: '',
                nameAsPublished: 'Test Author',
                creatorRole: '',
                orgaff: '',
                orgtype: '',
                uqIdentifier: '',
                uqUsername: '',
                required: false,
            });
        });
        it('hidePopoverNamesForm=false', async () => {
            const testFn = jest.fn();
            setup({
                onSubmit: testFn,
                hidePopoverNamesForm: false,
            });
            await addContributorsEditorItem('rek-contributor', 'Test', 'Author');
            expect(testFn).toHaveBeenCalledWith({
                affiliation: '',
                nameAsPublished: 'Author, Test',
                creatorRole: '',
                orgaff: '',
                orgtype: '',
                uqIdentifier: '',
                uqUsername: '',
                required: false,
            });
        });
    });

    it('should add contributor if nameAsPublished is not empty and role from the dropdown is selected', async () => {
        const testFn = jest.fn();
        const { getByTestId, getByText, getByRole } = setup({
            onSubmit: testFn,
            showRoleInput: true,
        });
        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'Test Author' } });
        fireEvent.change(getByTestId('rek-author-role-input'), { target: { value: 'C' } });
        const list = await waitFor(() => getByRole('presentation'));
        fireEvent.click(getByText('Co-investigator'), list);
        expect(testFn).toHaveBeenCalledWith({
            affiliation: '',
            creatorRole: 'Co-investigator',
            nameAsPublished: 'Test Author',
            orgaff: '',
            orgtype: '',
            uqIdentifier: '',
            uqUsername: '',
            required: false,
        });
    });

    it('should not add contributor if "Enter" is not pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
        });

        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'Test Author' } });
        fireEvent.keyDown(getByTestId('rek-contributor-input'), { key: 'Esc', code: 27 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if "Enter" is pressed but name as published is empty', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
        });

        fireEvent.keyDown(getByTestId('rek-contributor-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if "Enter" is pressed, name as published is set but creator role is empty', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({
            onAdd: onAddFn,
            showRoleInput: true,
        });
        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'Test Author' } });
        fireEvent.keyDown(getByTestId('rek-contributor-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should not add contributor if key is Enter, affiliation is not UQ, and orgaff and orgtype props are empty strings', () => {
        const onAddFn = jest.fn();
        const { getByTestId, getByText } = setup({
            onAdd: onAddFn,
            isNtro: true,
        });

        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'Test Author' } });
        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('Not UQ'));
        fireEvent.keyDown(getByTestId('rek-contributor-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should handle affiliation change', async () => {
        const { getByTestId, getByText } = setup({
            isNtro: true,
        });

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));

        let options = await waitFor(() => getByTestId('org-affiliation-options'));

        act(() => {
            fireEvent.click(getByText('Not UQ', options));
        });

        expect(getByTestId('org-affiliation-select')).toHaveTextContent('Not UQ');

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        options = await waitFor(() => getByTestId('org-affiliation-options'));

        act(() => {
            fireEvent.click(getByText('UQ', options));
        });

        expect(getByTestId('org-affiliation-select')).toHaveTextContent('UQ');
    });

    it('should show affiliation type selector in error state', () => {
        const { getByTestId } = setup({
            isNtro: true,
            required: true,
        });
        expect(getByTestId('org-affiliation-label')).toHaveClass('Mui-error');
    });

    it('should show error regarding name field', () => {
        const { getByTestId } = setup({
            required: true,
            isContributorAssigned: false,
        });
        expect(getByTestId('rek-contributor-label')).toHaveClass('Mui-error');
    });

    it('should display org affiliation selector if affiliation is NotUQ', () => {
        const { getByTestId, getByText } = setup({ isNtro: true });

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        fireEvent.click(getByText('Not UQ'));

        expect(getByTestId('org-affiliation-name-label')).toHaveClass('Mui-error');
        expect(getByTestId('org-affiliation-type-label')).toHaveClass('Mui-error');

        fireEvent.change(getByTestId('org-affiliation-name'), { target: { value: 'test' } });
        expect(getByTestId('org-affiliation-name-label')).not.toHaveClass('Mui-error');

        fireEvent.mouseDown(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('NGO'));
        expect(getByTestId('org-affiliation-type-label')).not.toHaveClass('Mui-error');

        expect(getByTestId('rek-contributor-add').disabled).toBeTruthy();

        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'testing' } });
        expect(getByTestId('rek-contributor-add').disabled).toBeFalsy();
    });

    it('should show contributor assignment', () => {
        const { getByText } = setup({
            showContributorAssignment: true,
        });
        expect(getByText('Step 1 description')).toBeInTheDocument();
    });

    it('should be able to set uqIdentifier on the contributor object', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            showIdentifierLookup: true,
            onSubmit: testFn,
        });

        fireEvent.change(getByTestId('rek-contributor-input'), { target: { value: 'Testing, UqId' } });
        fireEvent.click(getByTestId('rek-contributor-aut-id-input')); // add focus so control shows entered text
        fireEvent.change(getByTestId('rek-contributor-aut-id-input'), { target: { value: 'christ' } });

        const list = await waitFor(() => getByTestId('rek-contributor-aut-id-options'));

        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);

        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (mdcmar)',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Testing, UqId',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
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
            required: false,
        });
    });

    it('should be able to set nameAsPublished on the contributor object from selected author', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            showIdentifierLookup: true,
            canEdit: true,
            onSubmit: testFn,
        });

        fireEvent.click(getByTestId('rek-contributor-aut-id-input'));
        fireEvent.change(getByTestId('rek-contributor-aut-id-input'), { target: { value: 'christ' } });

        const list = await waitFor(() => getByTestId('rek-contributor-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (mdcmar)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (mdcmar)',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Del Mar, Christopher',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
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
            required: false,
        });
    });

    it('should be able to set uqUsername on the contributor object from selected author student username', async () => {
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
            canEdit: true,
            onSubmit: testFn,
        });

        fireEvent.click(getByTestId('rek-contributor-aut-id-input'));
        fireEvent.change(getByTestId('rek-contributor-aut-id-input'), { target: { value: 'christ' } });

        const list = await waitFor(() => getByTestId('rek-contributor-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (smdcmar)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (smdcmar)',
            affiliation: '',
            creatorRole: '',
            nameAsPublished: 'Del Mar, Christopher',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
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
            required: false,
        });
    });

    it('should not submit contributor form if admin user is linking NotUQ user with identifier lookup', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, {
            data: [
                {
                    aut_id: 553,
                    aut_org_username: null,
                    aut_org_staff_id: null,
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
                    aut_ref_num: '123456',
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
                },
            ],
        });
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            canEdit: true,
            showIdentifierLookup: true,
            onSubmit: testFn,
            isNtro: true,
        });

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        const affiliationOptions = await waitFor(() => getByTestId('org-affiliation-options'));

        fireEvent.click(getByText('Not UQ'), affiliationOptions);

        fireEvent.click(getByTestId('rek-contributor-aut-id-input'));
        fireEvent.change(getByTestId('rek-contributor-aut-id-input'), { target: { value: 'christ' } });

        const list = await waitFor(() => getByTestId('rek-contributor-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (123456)'), list);
        expect(testFn).not.toBeCalled();
    });

    it('should submit contributor form if admin user is linking UQ user with identifier lookup', async () => {
        const testParam = 'christ';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, {
            data: [
                {
                    aut_id: 553,
                    aut_org_username: null,
                    aut_org_staff_id: null,
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
                    aut_ref_num: '123456',
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
                },
            ],
        });
        const testFn = jest.fn();

        const { getByTestId, getByText } = setup({
            canEdit: true,
            showIdentifierLookup: true,
            onSubmit: testFn,
            isNtro: true,
        });

        fireEvent.mouseDown(getByTestId('org-affiliation-select'));
        const affiliationOptions = await waitFor(() => getByTestId('org-affiliation-options'));

        fireEvent.click(getByText('UQ'), affiliationOptions);

        fireEvent.click(getByTestId('rek-contributor-aut-id-input'));
        fireEvent.change(getByTestId('rek-contributor-aut-id-input'), { target: { value: 'christ' } });

        const list = await waitFor(() => getByTestId('rek-contributor-aut-id-options'));
        fireEvent.click(getByText('Professor Del Mar, Christopher B. (123456)'), list);
        expect(testFn).toBeCalledWith({
            id: 553,
            value: 'Professor Del Mar, Christopher B. (123456)',
            affiliation: 'UQ',
            creatorRole: '',
            nameAsPublished: 'Del Mar, Christopher',
            orgaff: 'The University of Queensland',
            orgtype: '453989',
            uqIdentifier: '553',
            aut_id: 553,
            aut_org_username: null,
            aut_org_staff_id: null,
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
            aut_ref_num: '123456',
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
            uqUsername: '123456 - 553',
            required: false,
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
            uqUsername: 'Test',
            required: false,
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
        fireEvent.click(getByTestId('rek-contributor-cancel'));
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
                uqIdentifier: '411',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
        });
        fireEvent.click(getByTitle('Clear'));
        expect(testFn).not.toBeCalled();
    });

    it('should clear contributor form on clearing from UQ ID and submit for admins', () => {
        const testFn = jest.fn();
        const { getByTitle } = setup({
            canEdit: true,
            onSubmit: testFn,
            showRoleInput: false,
            showIdentifierLookup: false,
            contributor: {
                nameAsPublished: 'Firstname Lastname',
                uqIdentifier: '411',
                affiliation: 'UQ',
                orgaff: '',
                orgtype: '',
                creatorRole: '',
            },
        });
        fireEvent.click(getByTitle('Clear'));
        expect(testFn).toBeCalled();
    });

    // it('should not clear and submit blank contributor', () => {
    //     const testFn = jest.fn();
    //     const { getByTitle } = setup({
    //         allowFreeText: true,
    //         canEdit: true,
    //         onSubmit: testFn,
    //         showRoleInput: false,
    //         showIdentifierLookup: false,
    //         contributor: {
    //             nameAsPublished: 'Firstname Lastname',
    //             affiliation: 'UQ',
    //             uqIdentifier: '411',
    //             orgaff: '',
    //             orgtype: '',
    //             creatorRole: '',
    //         },
    //     });
    //     fireEvent.click(getByTitle('Clear'));
    //     expect(testFn).not.toBeCalled();
    // });
});
