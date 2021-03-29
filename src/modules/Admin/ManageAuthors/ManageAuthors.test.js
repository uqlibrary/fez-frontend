import React from 'react';
import ManageAuthors from './index';
import { render, WithReduxStore, waitFor, waitForElementToBeRemoved } from 'test-utils';
import * as ManageAuthorsActions from 'actions/manageAuthors';
import * as repository from 'repositories';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <ManageAuthors {...testProps} />
        </WithReduxStore>,
    );
};

describe('ManageAuthors', () => {
    beforeEach(() => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, search: '' }).apiUrl))
            .replyOnce(200, {
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
        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        const loadAuthorListFn = jest.spyOn(ManageAuthorsActions, 'loadAuthorList');

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(loadAuthorListFn).toBeCalled();

        await waitFor(() => getByText('Manage authors'));
        expect(getByTestId('authors-list')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('ID')).toBeInTheDocument();
        expect(getByText('Display name')).toBeInTheDocument();
        expect(getByText('UQ username')).toBeInTheDocument();
    });

    it('should render error message', async () => {
        mockApi.onGet(repository.routes.AUTHORS_SEARCH_API().apiUrl).replyOnce(500);

        try {
            const { getByText } = setup({});
            expect(getByText('No records to display')).toBeInTheDocument();
        } catch (e) {
            expect(e).toEqual({
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                status: 500,
            });
        }
    });
});
