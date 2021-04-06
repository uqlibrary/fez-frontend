import React from 'react';
import ManageAuthors from './index';
import { act, render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent } from 'test-utils';
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
        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
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
        mockApi
            .onGet(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, query: '' }).apiUrl)
            .replyOnce(500);

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

    it('should change call an api with updated page size', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2014,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2015,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2016,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2017,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2018,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2019,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2020,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2021,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2022,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2023,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2024,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2025,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },

                    {
                        aut_id: 2026,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2027,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2028,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2029,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2030,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            })
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 50, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 2011,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2012,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2013,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2014,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2015,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2016,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_student_username: 'uqppun',
                    },
                    {
                        aut_id: 2017,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2018,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2019,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2020,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2021,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2022,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2023,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2024,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2025,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },

                    {
                        aut_id: 2026,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2027,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2028,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2029,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2030,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2032,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2032,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                    {
                        aut_id: 2033,
                        aut_display_name: 'Pun, PaulKang K.',
                        aut_org_username: 'uqppun',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            });

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-19')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByText('20 rows'));
        });

        act(() => {
            fireEvent.click(getByText('50'));
        });

        await waitFor(() => getByTestId('authors-list-row-22'));

        expect(getByTestId('authors-list-row-0')).toBeInTheDocument();
        expect(getByTestId('authors-list-row-22')).toBeInTheDocument();
    });
});
