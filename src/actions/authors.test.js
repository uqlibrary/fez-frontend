import MockAdapter from 'axios-mock-adapter';
import {api} from 'config';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';

import * as authorsActions from './authors';

const store = getMockStore();

describe('Authors actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    const returnedApiData = {
            "total": 3,
            "data": [
                {
                    "aut_id": 47769,
                    "aut_org_username": null,
                    "aut_org_staff_id": null,
                    "aut_org_student_id": null,
                    "aut_email": null,
                    "aut_display_name": "P Hugenholtz",
                    "aut_fname": "P",
                    "aut_mname": null,
                    "aut_lname": "Hugenholtz",
                    "aut_title": "Mr",
                    "aut_position": null,
                    "aut_homepage_link": null,
                    "aut_created_date": "2007-08-09T00:00:00Z",
                    "aut_update_date": "2017-12-11T02:12:06Z",
                    "aut_external_id": "0000076107",
                    "aut_ref_num": null,
                    "aut_researcher_id": null,
                    "aut_scopus_id": null,
                    "aut_mypub_url": null,
                    "aut_rid_password": null,
                    "aut_people_australia_id": null,
                    "aut_description": null,
                    "aut_orcid_id": null,
                    "aut_google_scholar_id": null,
                    "aut_rid_last_updated": null,
                    "aut_publons_id": null,
                    "aut_student_username": null
                },
                {
                    "aut_id": 26788,
                    "aut_org_username": null,
                    "aut_org_staff_id": null,
                    "aut_org_student_id": null,
                    "aut_email": null,
                    "aut_display_name": "P Hugenholtz",
                    "aut_fname": "P",
                    "aut_mname": null,
                    "aut_lname": "Hugenholtz",
                    "aut_title": "",
                    "aut_position": null,
                    "aut_homepage_link": null,
                    "aut_created_date": "2007-08-09T00:00:00Z",
                    "aut_update_date": "2017-12-11T02:12:06Z",
                    "aut_external_id": "0000051621",
                    "aut_ref_num": null,
                    "aut_researcher_id": null,
                    "aut_scopus_id": null,
                    "aut_mypub_url": null,
                    "aut_rid_password": null,
                    "aut_people_australia_id": null,
                    "aut_description": null,
                    "aut_orcid_id": null,
                    "aut_google_scholar_id": null,
                    "aut_rid_last_updated": null,
                    "aut_publons_id": null,
                    "aut_student_username": null
                },
                {
                    "aut_id": 20288,
                    "aut_org_username": "uqphugen",
                    "aut_org_staff_id": "0000243",
                    "aut_org_student_id": null,
                    "aut_email": "p.hugenholtz@uq.edu.au",
                    "aut_display_name": "Hugenholtz, Philip",
                    "aut_fname": "Philip",
                    "aut_mname": "",
                    "aut_lname": "Hugenholtz",
                    "aut_title": "Professor",
                    "aut_position": "",
                    "aut_homepage_link": "",
                    "aut_created_date": "2007-08-09T00:00:00Z",
                    "aut_update_date": "2017-12-06T06:16:31Z",
                    "aut_external_id": "0000041266",
                    "aut_ref_num": "",
                    "aut_researcher_id": "G-9608-2011",
                    "aut_scopus_id": "",
                    "aut_mypub_url": "phugenholtz",
                    "aut_rid_password": "",
                    "aut_people_australia_id": "",
                    "aut_description": "",
                    "aut_orcid_id": "0000-0001-5386-7925",
                    "aut_google_scholar_id": "",
                    "aut_rid_last_updated": "2017-09-29",
                    "aut_publons_id": null,
                    "aut_student_username": null
                }
            ]
    };
    const mockFilter = (data) => data.length > 1;

    it('calls 2 actions when it loads a list of authors successfully with a mock filter', () => {
        mock.onGet(repositories.routes.AUTHORS_SEARCH_API({query: 'hugenholtz'}))
            .reply(200, returnedApiData);

        const expectedActions = [
            {type: actions.AUTHORS_LOADING},
            {type: actions.AUTHORS_LOADED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.searchAuthors('hugenholtz', mockFilter)).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 2 actions when it loads a list of authors successfully without a mock filter', () => {
        mock.onGet(repositories.routes.AUTHORS_SEARCH_API({query: 'hugenholtz'}))
            .reply(200, returnedApiData);

        const expectedActions = [
            {type: actions.AUTHORS_LOADING},
            {type: actions.AUTHORS_LOADED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.searchAuthors('hugenholtz', null)).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 3 actions as it fails to load a list of authors and loads anon account with API response 403', () => {
        mock.onGet(repositories.routes.AUTHORS_SEARCH_API({query: 'hugenholtz'}))
            .reply(403);

        const expectedActions = [
            {type: actions.AUTHORS_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.AUTHORS_LOAD_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.searchAuthors('hugenholtz')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 2 actions as it fails to load a list of authors with API response 404', () => {
        mock.onGet(repositories.routes.AUTHORS_SEARCH_API({query: 'hugenholtz'}))
            .reply(404);

        const expectedActions = [
            {type: actions.AUTHORS_LOADING},
            {type: actions.AUTHORS_LOAD_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.searchAuthors('hugenholtz')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 2 actions when it loads author details successfully', () => {

        const authorDetailsApiResponse = {
            "uqr_id": 937,
            "espace_id": 1671,
            "image_exists": 1,
            "username": "uqmbrow1",
            "staff_id": "0024086",
            "given_name": "Melissa",
            "family_name": "Brown",
            "title": "Professor",
            "scopus_id": "160618002616",
            "google_scholar_id": null,
            "researcher_id": "F-1451-2010",
            "orcid_id": "0000-0003-4976-7483",
            "publons_id": null,
            "mypub_url": "",
            "org_units": [
                "Faculty of Science",
                "Mater Research Institute-UQ"
            ],
            "positions": [
                "Affiliate Professor",
                "Executive Dean"
            ],
            "espace": {
                "first_year": 1987,
                "last_year": 2016,
                "doc_count": "126"
            }
        };

        mock.onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(200, authorDetailsApiResponse);

        const expectedActions = [
            {type: actions.AUTHOR_DETAILS_LOADING},
            {type: actions.AUTHOR_DETAILS_LOADED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.loadAuthorDetails('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 3 actions when it fails to load author details with a 403 response from API', () => {

        mock.onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(403);

        const expectedActions = [
            {type: actions.AUTHOR_DETAILS_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.AUTHOR_DETAILS_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.loadAuthorDetails('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('calls 3 actions when it fails to load author details with a 404 response from API', () => {

        mock.onGet(repositories.routes.AUTHOR_DETAILS_API({userId: 'uqmbrow1'}))
            .reply(404);

        const expectedActions = [
            {type: actions.AUTHOR_DETAILS_LOADING},
            {type: actions.AUTHOR_DETAILS_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorsActions.loadAuthorDetails('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });


});
