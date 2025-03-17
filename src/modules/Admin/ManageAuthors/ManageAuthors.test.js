import React from 'react';
import ManageAuthors from './index';
import { render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent, preview } from 'test-utils';
import * as ManageAuthorsActions from 'actions/manageAuthors';
import * as AppActions from 'actions/app';
import * as repository from 'repositories';

jest.mock('js-cookie');
import Cookie from 'js-cookie';
import userEvent from '@testing-library/user-event';

const setup = (testProps = {}) => {
    return render(
        <React.StrictMode>
            <WithReduxStore>
                <ManageAuthors {...testProps} />
            </WithReduxStore>
        </React.StrictMode>,
    );
};

describe('ManageAuthors', () => {
    beforeEach(() => {
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render empty list', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).reply(200, {
            data: [],
            total: 0,
        });
        const { getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render default view', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, search: '' }).apiUrl))
            .reply(200, {
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

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        expect(loadAuthorListFn).toBeCalled();

        await waitFor(() => expect(getByTestId('authors-list')).toBeInTheDocument());

        // Expect table column titles
        expect(getByText('ID')).toBeInTheDocument();
        expect(getByText('Display name')).toBeInTheDocument();
        expect(getByText('UQ username')).toBeInTheDocument();
    });

    it('should render error message', async () => {
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        mockApi.onGet(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 1, query: '' }).apiUrl).reply(500);

        const { getByText } = setup({});
        await waitFor(() => expect(getByText('No records to display')).toBeInTheDocument());
        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());
    });

    it('should change call an api with updated page size', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .reply(200, {
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
            });

        const { getAllByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        preview.debug();
        expect(tableRows.length).toBe(20);

        mockApi.reset();
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 50, query: '' }).apiUrl))
            .reply(200, {
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
        fireEvent.mouseDown(getByText('20 rows'));
        fireEvent.click(getByText('50'));

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(23));
    });

    it('should bulk delete authors', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .reply(200, {
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
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost('fez-authors/delete-list')
            .reply(200, {
                data: {
                    '2011': 'Author deleted',
                    '2012': 'Author deleted',
                    '2013': 'Author deleted',
                },
            });

        const { queryAllByTestId, getAllByTestId, getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(3);

        fireEvent.click(getByTestId('select-author-0'));
        fireEvent.click(getByTestId('select-author-1'));
        fireEvent.click(getByTestId('select-author-2'));
        fireEvent.click(getByTestId('authors-delete-selected-authors'));
        fireEvent.click(getByTestId('confirm-bulk-delete-authors-confirmation'));

        await waitFor(() => {
            expect(queryAllByTestId('mtablebodyrow').length).toBe(0);
        });
    });

    it('should fail to bulk delete all authors', async () => {
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .reply(200, {
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
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost(`${repository.routes.AUTHOR_API().apiUrl}/delete-list`)
            .replyOnce(500);

        const { getAllByTestId, getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(3);

        fireEvent.click(getByTestId('select-author-0'));
        fireEvent.click(getByTestId('select-author-1'));
        fireEvent.click(getByTestId('select-author-2'));
        fireEvent.click(getByTestId('authors-delete-selected-authors'));
        fireEvent.click(getByTestId('confirm-bulk-delete-authors-confirmation'));

        await waitFor(() => {
            expect(getAllByTestId('mtablebodyrow').length).toBe(3);
            expect(showAppAlert).toHaveBeenCalled();
        });
    });

    it('should exit from editing author mode', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).reply(200, {
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
        const { getAllByTestId, getByTestId, getByText, queryByTestId, queryByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(1);

        mockApi.onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl)).reply(200, { data: [], total: 0 });
        fireEvent.click(tableRows[0]);
        fireEvent.keyDown(getByTestId('author-edit-row'), { key: 'Escape' });

        expect(queryByTestId('author-edit-row')).not.toBeInTheDocument();
        expect(queryByText('Name information')).not.toBeInTheDocument();
    });

    it('should validate inputs and render added info after adding', async () => {
        mockApi
            .onGet(/fez-authors\/search/)
            .reply(() => {
                return [200, { data: [], total: 0 }];
            })
            .onPost(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .reply(200, { data: { aut_id: 1, aut_display_name: 'Test, Name' } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));
        await waitFor(() => expect(getByTestId('aut-fname-input')).toBeInTheDocument());

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('aut-fname-input'), 'Test');
        await userEvent.type(getByTestId('aut-lname-input'), 'Name');

        fireEvent.change(getByTestId('aut-display-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('aut-scopus-id-input'), { target: { value: '1234-342' } });
        fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });

        expect(getByTestId('authors-add-this-author-save').closest('button')).not.toHaveAttribute('disabled');

        await waitFor(() => getByTestId('aut-name-overridden'));

        fireEvent.click(getByTestId('aut-name-overridden'));
        fireEvent.click(getByTestId('aut-is-scopus-id-authenticated'));
        fireEvent.click(getByTestId('authors-add-this-author-save'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
                data: [],
                total: 0,
            })
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(500);
        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');
        const { getByTestId, queryByTestId } = setup({});

        await userEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('aut-fname-input'), 'Test');
        await userEvent.type(getByTestId('aut-lname-input'), 'Name');
        await userEvent.type(getByTestId('aut-display-name-input'), 'Test, Name');
        await userEvent.click(getByTestId('authors-add-this-author-save'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(queryByTestId('aut-display-name-0')).not.toBeInTheDocument();
    });

    it('should validate inputs and render updated info after editing', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
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
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(200, { data: { aut_id: 1, aut_display_name: 'Test, Name', aut_org_username: 'uqtname' } });
        mockApi.onGet(repository.routes.AUTHORS_SEARCH_API({}).apiUrl).reply(() => {
            return [200, { data: [], total: 0 }];
        });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        await userEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('value', 'Vishal');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('value', 'Desai');
        expect(getByTestId('aut-position-input')).toHaveAttribute('value', 'Sr. Web Developer');
        expect(getByTestId('aut-title-input')).toHaveAttribute('value', 'Mr.');
        expect(getByTestId('aut-description-input')).toHaveTextContent('Added position. Updated name');

        await userEvent.clear(getByTestId('aut-fname-input'));
        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.clear(getByTestId('aut-lname-input'));

        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('authors-update-this-author-save').closest('button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('aut-fname-input'), 'Test');
        await userEvent.type(getByTestId('aut-lname-input'), 'Name');
        await userEvent.type(getByTestId('aut-scopus-id-input'), '1234-543');
        await userEvent.type(getByTestId('aut-org-student-id-input'), '1234564');

        await userEvent.type(getByTestId('aut-display-name-input'), 'Test, Name');
        await userEvent.type(getByTestId('aut-org-username-input'), 'uqtname');

        fireEvent.click(getByTestId('aut-is-orcid-sync-enabled'));
        fireEvent.click(getByTestId('authors-update-this-author-save'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqtname');
    });

    it('should validate inputs and render same info after unsuccessful editing operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
                data: [
                    {
                        aut_created_date: '2021-03-18T04:47:06Z',
                        aut_description: 'Added position. Updated name',
                        aut_display_name: null,
                        aut_email: null,
                        aut_external_id: null,
                        aut_fname: 'Vishal',
                        aut_google_scholar_id: 'asdflakjssss',
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
            .onPut(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(500);
        mockApi.onGet(repository.routes.AUTHORS_SEARCH_API({}).apiUrl).reply(200, { data: [], total: 0 });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getAllByTestId, getByTestId, queryByText } = setup();

        await waitFor(() => expect(queryByText('No records to display')).not.toBeInTheDocument());

        await userEvent.click(getByTestId('authors-list-row-0-edit-this-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('value', 'Vishal');

        await userEvent.clear(getByTestId('aut-fname-input'));
        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.clear(getByTestId('aut-lname-input'));
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-update-this-author-save').closest('button')).toHaveAttribute('disabled');

        await userEvent.type(getByTestId('aut-fname-input'), 'Test');
        await userEvent.type(getByTestId('aut-lname-input'), 'Name');

        await userEvent.click(getByTestId('authors-update-this-author-save'));

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(1));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', '');
    }, 60000); // Increase timeout to 60s

    it('should delete an author item', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
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
            .onDelete(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(200, { data: { aut_id: 2000003831 } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');
        const { getAllByTestId, getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        fireEvent.click(getByTestId('confirm-authors-delete-this-author-confirmation'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        // expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Vishal, Desai');
        // expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqvdesai');
    });

    it('should render same list after unsuccessful delete operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
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
            .onDelete(new RegExp(repository.routes.AUTHOR_API({}).apiUrl))
            .replyOnce(422, { data: 'Error' })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getAllByTestId, getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('authors-list-row-0-delete-this-author'));
        fireEvent.click(getByTestId('confirm-authors-delete-this-author-confirmation'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(getByTestId('aut-display-name-0')).toHaveAttribute('value', 'Test, Name');
        expect(getByTestId('aut-org-username-0')).toHaveAttribute('value', 'uqtname');
        expect(getByTestId('aut-display-name-1')).toHaveAttribute('value', 'Vishal, Desai');
        expect(getByTestId('aut-org-username-1')).toHaveAttribute('value', 'uqvdesai');
    });

    it('should copy author id to clipboard', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl)).reply(200, {
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
        Object.assign(navigator, {
            clipboard: {
                writeText: () => {
                    return Promise.resolve();
                },
            },
        });
        jest.spyOn(navigator.clipboard, 'writeText');

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        fireEvent.click(getByTestId('aut-id-0-copy-text'));

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(2011);

        await waitFor(() => getByTestId('copied-text-snackbar'));
    });

    it('should trigger scopus ingest for the author', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
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
                        aut_is_scopus_id_authenticated: 1,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: null,
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
                        aut_scopus_id: '123442323',
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
                        aut_id: 2000003833,
                        aut_is_orcid_sync_enabled: null,
                        aut_is_scopus_id_authenticated: 0,
                        aut_lname: 'Asai',
                        aut_mname: null,
                        aut_mypub_url: null,
                        aut_orcid_bio: null,
                        aut_orcid_id: null,
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
                        aut_scopus_id: '123442323',
                        aut_student_username: null,
                        aut_title: 'Mr.',
                        aut_twitter_username: null,
                        aut_update_date: '2021-03-18T22:53:34Z',
                    },
                ],
                total: 3,
            })
            .onPost(new RegExp(repository.routes.INGEST_WORKS_API().apiUrl))
            .replyOnce(200, { data: 'Dispatched import' })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const set = jest.spyOn(Cookie, 'set');

        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        expect(getByTestId('authors-list-row-0-ingest-from-scopus').closest('button')).not.toHaveAttribute('disabled');
        expect(getByTestId('authors-list-row-1-ingest-from-scopus').closest('button')).not.toHaveAttribute('disabled');
        expect(getByTestId('authors-list-row-2-ingest-from-scopus').closest('button')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('authors-list-row-0-ingest-from-scopus'));
        fireEvent.click(getByTestId('confirm-scopus-ingest-confirmation'));

        await waitFor(() => {
            expect(showAppAlert).toHaveBeenCalledTimes(2);
            expect(set).toHaveBeenCalledWith('SCOPUS_INGESTED_AUTHORS_2000003831', 2000003831, { expires: 7 });
        });
    });

    it('should fail to trigger scopus ingest for the author', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .reply(200, {
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
                ],
                total: 1,
            })
            .onPost(new RegExp(repository.routes.INGEST_WORKS_API().apiUrl))
            .replyOnce(422)
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, { data: [], total: 0 });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const set = jest.spyOn(Cookie, 'set');

        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('Loading authors'));

        expect(getByTestId('authors-list-row-0-ingest-from-scopus').closest('button')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('authors-list-row-0-ingest-from-scopus'));
        fireEvent.click(getByTestId('confirm-scopus-ingest-confirmation'));

        await waitFor(() => {
            expect(showAppAlert).toHaveBeenCalledTimes(2);
            expect(set).not.toHaveBeenCalled();
        });
    });
});
