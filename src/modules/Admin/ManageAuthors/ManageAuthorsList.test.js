import React from 'react';
import ManageAuthorsList from './ManageAuthorsList';
import { render, fireEvent, act, waitFor, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as repository from 'repositories';

function setup(testProps = {}) {
    const props = {
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

        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    it('should render empty list', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByText } = setup();

        await waitFor(() => getByText('No records to display'));
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for authors', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
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
            total: 1,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
    });

    it('should validate inputs and render added info after adding', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-342' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });

        act(() => {
            fireEvent.click(getByTestId('aut-name-overridden'));
        });

        act(() => {
            fireEvent.click(getByTestId('aut-is-scopus-id-authenticated'));
        });

        act(() => {
            fireEvent.click(getByTestId('authors-add-this-author-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Test, Name');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId, queryByTestId } = setup({
            onRowAdd: jest.fn(() => Promise.reject({ code: 500 })),
        });

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });

        act(() => {
            fireEvent.click(getByTestId('authors-add-this-author-save'));
        });

        expect(queryByTestId('aut-display-name-0')).not.toBeInTheDocument();
    });

    it('should validate inputs and render updated info after editing', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
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
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));
        });

        expect(getByTestId('aut-fname-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('value', 'Desai');
        expect(getByTestId('aut-position-input')).toHaveAttribute('value', 'Sr. Web Developer');
        expect(getByTestId('aut-title-input')).toHaveAttribute('value', 'Mr.');
        expect(getByTestId('aut-orcid-id-input')).toHaveAttribute('value', '0000-0001-1111-2222');
        expect(getByTestId('aut-description-input')).toHaveTextContent('Added position. Updated name');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: '' } });
        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: '' } });
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-update-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-543' } });
        });
        fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '1234564' } });
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtname' } });

        act(() => {
            fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        });

        act(() => {
            fireEvent.click(getByTestId('authors-update-this-author-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveTextContent('uqtname');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Vishal, Asai',
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
                        aut_org_username: 'uqtest',
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
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });
        const { getByTestId, getByText } = setup({
            onRowUpdate: jest.fn(() => Promise.reject({ code: 500 })),
        });

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('authors-list-row-0-edit-this-author'));
        });

        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtname' } });

        act(() => {
            fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        });

        act(() => {
            fireEvent.click(getByTestId('authors-update-this-author-save'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Vishal, Asai');
        expect(getByTestId('aut-org-username-0')).toHaveTextContent('uqtest');
    });

    it.skip('should render previous list on cancelling edit operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    aut_created_date: '2021-03-18T04:47:06Z',
                    aut_description: 'Added position. Updated name',
                    aut_display_name: 'Vishal, Asai',
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
                    aut_org_username: 'uqtest',
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
            total: 1,
        });
        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('authors-list-row-0'));
        });

        act(() => {
            fireEvent.click(getByTestId('authors-update-this-author-cancel'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Vishal, Asai');
        expect(getByTestId('aut-org-username-0')).toHaveTextContent('uqtest');
    });

    it('should delete an author item', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: null,
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003831,
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
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Vishal, Desai',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-3333',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: 'uqvdesai',
                        aut_people_australia_id: null,
                        aut_position: 'Sr Web Developer',
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
                total: 2,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const listItem0 = getByTestId('authors-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('authors-list-row-1');
        expect(listItem1).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        });
        act(() => {
            fireEvent.click(getByTestId('confirm-action'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Vishal, Desai');
        expect(getByTestId('aut-org-username-0')).toHaveTextContent('uqvdesai');
    });

    it('should render same list after unsuccessful delete operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Test, Name',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003831,
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
                        aut_org_username: 'uqtname',
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
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: 'Vishal, Desai',
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: null,
                        aut_homepage_link: null,
                        aut_id: 2000003832,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: '0000-0001-1111-3333',
                        aut_orcid_works_last_modified: null,
                        aut_orcid_works_last_sync: null,
                        aut_org_staff_id: null,
                        aut_org_student_id: null,
                        aut_org_username: 'uqvdesai',
                        aut_people_australia_id: null,
                        aut_position: 'Sr Web Developer',
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
                total: 2,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const { getByTestId, getByText } = setup({
            onRowDelete: jest.fn(() => Promise.reject({ code: 500 })),
        });

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const listItem0 = getByTestId('authors-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('authors-list-row-1');
        expect(listItem1).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        });
        act(() => {
            fireEvent.click(getByTestId('confirm-action'));
        });

        await waitFor(() => getByTestId('authors-list-row-0'));

        expect(getByTestId('aut-display-name-0')).toHaveTextContent('Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveTextContent('uqtname');
        expect(getByTestId('aut-display-name-1')).toHaveTextContent('Vishal, Desai');
        expect(getByTestId('aut-org-username-1')).toHaveTextContent('uqvdesai');
    });
});
