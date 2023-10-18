import React from 'react';
import ManageAuthorsList from './ManageAuthorsList';
import { render, fireEvent, waitFor, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as repository from 'repositories';

jest.mock('./helpers', () => ({
    checkForExisting: jest.fn(),
    clearAlerts: jest.fn(),
}));

import { checkForExisting } from './helpers';

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

        // jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should validate org username input for existing org username', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });

        expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });

        checkForExisting.mockImplementationOnce(
            jest.fn(() =>
                Promise.reject({
                    aut_org_username: 'The supplied Organisation Username is already on file for another author.',
                }),
            ),
        );

        await waitFor(() =>
            expect(
                getByText('The supplied Organisation Username is already on file for another author.'),
            ).toBeInTheDocument(),
        );

        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtesta' } });

        await waitFor(() => {
            expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'false');
            expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');
        });
    });

    it('should validate student username input for existing student username', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });

        expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-student-username-input'), { target: { value: 's1234567' } });

        checkForExisting.mockImplementationOnce(
            jest.fn(() =>
                Promise.reject({
                    aut_student_username: 'The supplied Student username is already on file for another author.',
                }),
            ),
        );

        await waitFor(() =>
            expect(
                getByText('The supplied Student username is already on file for another author.'),
            ).toBeInTheDocument(),
        );

        expect(getByTestId('aut-student-username-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        fireEvent.change(getByTestId('aut-student-username-input'), { target: { value: 's1234569' } });

        await waitFor(() => {
            expect(getByTestId('aut-student-username-input')).toHaveAttribute('aria-invalid', 'false');
            expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');
        });
    });

    it('should validate org staff id input for existing org staff id and display error message', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });

        expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-staff-id-input'), { target: { value: '1234567' } });

        checkForExisting.mockImplementationOnce(
            jest.fn(() =>
                Promise.reject({
                    aut_org_staff_id: 'The supplied Organisation Staff ID is already on file for another author.',
                }),
            ),
        );

        await waitFor(() =>
            expect(
                getByText('The supplied Organisation Staff ID is already on file for another author.'),
            ).toBeInTheDocument(),
        );

        expect(getByTestId('aut-org-staff-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-staff-id-input'), { target: { value: '1234569' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        await waitFor(() => {
            expect(getByTestId('aut-org-staff-id-input')).toHaveAttribute('aria-invalid', 'false');
            expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');
        });
    });

    it('should validate org student id input for existing org student id and display error message', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });

        expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '12345678' } });

        checkForExisting.mockImplementationOnce(
            jest.fn(() =>
                Promise.reject({
                    aut_org_student_id: 'The supplied Organisation Student ID is already on file for another author.',
                }),
            ),
        );

        await waitFor(() =>
            expect(
                getByText('The supplied Organisation Student ID is already on file for another author.'),
            ).toBeInTheDocument(),
        );

        expect(getByTestId('aut-org-student-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '12345679' } });

        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        await waitFor(() => {
            expect(getByTestId('aut-org-student-id-input')).toHaveAttribute('aria-invalid', 'false');
            expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');
        });
    });

    it('should render same list after unsuccessful bulk delete operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
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
        });

        const { getByTestId, getByText } = setup({
            onBulkRowDelete: jest.fn(() => Promise.reject({ code: 500 })),
        });

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        const listItem0 = getByTestId('authors-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('authors-list-row-1');
        expect(listItem1).toBeInTheDocument();

        fireEvent.click(getByTestId('select-author-0'));
        fireEvent.click(getByTestId('select-author-1'));

        fireEvent.click(getByTestId('authors-delete-selected-authors'));

        fireEvent.click(getByTestId('confirm-bulk-delete-authors-confirmation'));

        await waitFor(() => {
            expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
            expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqtname');
            expect(getByTestId('aut-display-name-1')).toHaveAttribute('value', 'Vishal, Desai');
            expect(getByTestId('aut-org-username-1')).toHaveAttribute('value', 'uqvdesai');
        });
    });

    it('should validate org username input and leave in invalid state for existing org username even after updating first name and last name', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });

        checkForExisting.mockImplementationOnce(
            jest.fn(() =>
                Promise.reject({
                    aut_org_username: 'The supplied Organisation Username is already on file for another author.',
                }),
            ),
        );

        await waitFor(() => getByText('The supplied Organisation Username is already on file for another author.'));

        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtesta' } });
        checkForExisting.mockImplementationOnce(jest.fn(() => Promise.resolve()));

        await waitFor(() => {
            expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'false');
            expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');
        });
    });

    it('should render previous list on unsuccessful edit operation', async () => {
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
        const { getByTestId, getByText } = setup({
            onRowUpdate: jest.fn(() => Promise.reject({ code: 500 })),
        });

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('authors-list-row-0'));
        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        fireEvent.click(getByTestId('authors-update-this-author-save'));

        await waitFor(() => expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Vishal, Asai'));
    });
});
