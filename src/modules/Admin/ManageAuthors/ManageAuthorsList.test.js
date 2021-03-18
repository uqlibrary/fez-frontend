import React from 'react';
import ManageAuthorsList from './ManageAuthorsList';
import { render, fireEvent, act, waitFor, WithReduxStore } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        list: [],
        onRowAdd: jest.fn(data => Promise.resolve(data)),
        onRowUpdate: jest.fn(data => Promise.resolve(data)),
        onRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <ManageAuthorsList {...props} />
        </WithReduxStore>,
    );
}

describe('ManageAuthorsList', () => {
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

    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for authors', () => {
        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

        const { getByTestId } = setup({
            list: [
                {
                    aut_created_date: '2006-03-31T00:00:00Z',
                    aut_description: null,
                    aut_display_name: 'Pun, PaulKang K.',
                    aut_email: 'punp@ramsayhealth.com.au',
                    aut_external_id: '0000065773',
                    aut_fname: 'PaulKang',
                    aut_google_scholar_id: null,
                    aut_homepage_link: null,
                    aut_id: 2011,
                    aut_is_orcid_sync_enabled: null,
                    aut_is_scopus_id_authenticated: 0,
                    aut_lname: 'Pun',
                    aut_mname: null,
                    aut_mypub_url: null,
                    aut_orcid_bio: null,
                    aut_orcid_id: null,
                    aut_orcid_works_last_modified: null,
                    aut_orcid_works_last_sync: null,
                    aut_org_staff_id: '0030916',
                    aut_org_student_id: null,
                    aut_org_username: 'uqppun',
                    aut_people_australia_id: null,
                    aut_position: null,
                    aut_publons_id: null,
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_review_orcid_scopus_id_integration: null,
                    aut_rid_last_updated: null,
                    aut_rid_password: null,
                    aut_scopus_id: null,
                    aut_student_username: null,
                    aut_title: 'Dr',
                    aut_twitter_username: null,
                    aut_update_date: '2020-01-19T19:29:55Z',
                },
            ],
        });

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
    });

    it('should validate inputs and render added info after adding', async () => {
        mockApi
            .onPost(repositories.routes.AUTHOR_API().apiUrl)
            .replyOnce(201, { data: { data: { aut_fname: 'Test', aut_lname: 'Name', aut_id: 1234 } } });

        const { getByTestId } = setup({
            list: [],
        });

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });

        act(() => {
            fireEvent.click(getByTestId('authors-add-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-fname-0-input')).toHaveAttribute('value', 'Test');
        expect(getByTestId('aut-lname-0-input')).toHaveAttribute('value', 'Name');
    });

    // it('should render previous list on unsuccessful add operation', async () => {
    //     const { getByTestId, getByText, queryByTestId } = setup({
    //         list: [],
    //         handleRowAdd: jest.fn(() => Promise.reject()),
    //     });

    //     fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

    //     fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
    //     fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
    //     fireEvent.click(getByText('Guest Editor'));
    //     fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
    //     fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

    //     act(() => {
    //         fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
    //     });

    //     await waitFor(() => getByText('No records to display'));

    //     expect(queryByTestId('my-editorial-appointments-list-row-0')).not.toBeInTheDocument();
    // });

    it('should validate inputs and render updated info after editing', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    aut_created_date: '2021-03-18T04:47:06Z',
                    aut_description: 'Added position. Updated name',
                    aut_display_name: null,
                    aut_email: null,
                    aut_external_id: null,
                    aut_fname: 'Vishal',
                    aut_google_scholar_id: null,
                    aut_homepage_link: null,
                    aut_id: 2000003832,
                    aut_is_orcid_sync_enabled: null,
                    aut_is_scopus_id_authenticated: 0,
                    aut_lname: 'Desai',
                    aut_mname: null,
                    aut_mypub_url: null,
                    aut_orcid_bio: null,
                    aut_orcid_id: '0000-0001-1111-2222',
                    aut_orcid_works_last_modified: null,
                    aut_orcid_works_last_sync: null,
                    aut_org_staff_id: null,
                    aut_org_student_id: null,
                    aut_org_username: '',
                    aut_people_australia_id: null,
                    aut_position: 'Sr. Web Developer',
                    aut_publons_id: null,
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_review_orcid_scopus_id_integration: null,
                    aut_rid_last_updated: null,
                    aut_rid_password: null,
                    aut_scopus_id: null,
                    aut_student_username: null,
                    aut_title: 'Mr.',
                    aut_twitter_username: null,
                    aut_update_date: '2021-03-18T22:53:34Z',
                },
            ],
        });

        expect(getByTestId('aut-fname-0-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-0-input')).toHaveAttribute('value', 'Desai');
        expect(getByTestId('aut-position-0-input')).toHaveAttribute('value', 'Sr. Web Developer');
        expect(getByTestId('aut-title-0-input')).toHaveAttribute('value', 'Mr.');
        expect(getByTestId('aut-orcid-id-0-input')).toHaveAttribute('value', '0000-0001-1111-2222');

        fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        fireEvent.change(getByTestId('aut-fname-0-input'), { target: { value: '' } });
        expect(getByTestId('aut-fname-0-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('aut-lname-0-input'), { target: { value: '' } });
        expect(getByTestId('aut-lname-0-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-update-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-0-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-0-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-scopus-id-0-input'), { target: { value: '1234-543' } });
        fireEvent.change(getByTestId('aut-org-student-id-0-input'), { target: { value: '1234564' } });

        act(() => {
            fireEvent.click(getByTestId('authors-update-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-fname-0-input')).toHaveAttribute('value', 'Test');
        expect(getByTestId('aut-lname-0-input')).toHaveAttribute('value', 'Name');
        expect(getByTestId('aut-scopus-id-0-input')).toHaveAttribute('value', '1234-543');
        expect(getByTestId('aut-org-student-id-0-input')).toHaveAttribute('value', '1234564');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    aut_created_date: '2021-03-18T04:47:06Z',
                    aut_description: 'Added position. Updated name',
                    aut_display_name: null,
                    aut_email: null,
                    aut_external_id: null,
                    aut_fname: 'Vishal',
                    aut_google_scholar_id: null,
                    aut_homepage_link: null,
                    aut_id: 2000003832,
                    aut_is_orcid_sync_enabled: null,
                    aut_is_scopus_id_authenticated: 0,
                    aut_lname: 'Desai',
                    aut_mname: null,
                    aut_mypub_url: null,
                    aut_orcid_bio: null,
                    aut_orcid_id: '0000-0001-1111-2222',
                    aut_orcid_works_last_modified: null,
                    aut_orcid_works_last_sync: null,
                    aut_org_staff_id: null,
                    aut_org_student_id: null,
                    aut_org_username: '',
                    aut_people_australia_id: null,
                    aut_position: 'Sr. Web Developer',
                    aut_publons_id: null,
                    aut_ref_num: null,
                    aut_researcher_id: null,
                    aut_review_orcid_scopus_id_integration: null,
                    aut_rid_last_updated: null,
                    aut_rid_password: null,
                    aut_scopus_id: null,
                    aut_student_username: null,
                    aut_title: 'Mr.',
                    aut_twitter_username: null,
                    aut_update_date: '2021-03-18T22:53:34Z',
                },
            ],
            onRowUpdate: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        fireEvent.change(getByTestId('aut-fname-0-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-0-input'), { target: { value: 'Name' } });

        act(() => {
            fireEvent.click(getByTestId('authors-update-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-fname-0-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-0-input')).toHaveAttribute('value', 'Desai');
    });

    // it('should render previous list on unsuccessful edit operation', async () => {
    //     const { getByTestId } = setup({
    //         list: [
    //             {
    //                 eap_id: 1,
    //                 eap_journal_name: 'test',
    //                 eap_jnl_id: 1234,
    //                 eap_role_cvo_id: '123456',
    //                 eap_start_year: '2006',
    //                 eap_end_year: '2026',
    //                 eap_role_name: 'Editor',
    //             },
    //         ],
    //     });

    //     fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

    //     fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
    //     fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
    //     fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

    //     act(() => {
    //         fireEvent.click(getByTestId('my-editorial-appointments-update-cancel'));
    //     });

    //     await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

    //     expect(getByTestId('eap-journal-name-0')).toHaveTextContent('test');
    // });

    // it('should delete my editorial appointment item', async () => {
    //     const { getByTestId } = setup({
    //         list: [
    //             {
    //                 eap_id: 1,
    //                 eap_journal_name: 'test',
    //                 eap_jnl_id: 1234,
    //                 eap_role_cvo_id: '123456',
    //                 eap_start_year: '2006',
    //                 eap_end_year: '2026',
    //                 eap_role_name: 'Guest Editor',
    //             },
    //             {
    //                 eap_id: 2,
    //                 eap_journal_name: 'testing',
    //                 eap_jnl_id: 12345,
    //                 eap_role_cvo_id: '123457',
    //                 eap_start_year: '2016',
    //                 eap_end_year: '2020',
    //                 eap_role_name: 'Editor',
    //             },
    //         ],
    //     });
    //     const listItem0 = getByTestId('my-editorial-appointments-list-row-0');
    //     expect(listItem0).toBeInTheDocument();

    //     const listItem1 = getByTestId('my-editorial-appointments-list-row-1');
    //     expect(listItem1).toBeInTheDocument();

    //     fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-delete-this-editorial-appointment'));

    //     act(() => {
    //         fireEvent.click(getByTestId('my-editorial-appointments-delete-save'));
    //     });

    //     const listItem = await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

    //     expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
    //     expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Editor');
    // });
});
