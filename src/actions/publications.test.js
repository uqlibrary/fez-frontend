import MockAdapter from 'axios-mock-adapter';
import {api} from 'config';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';

import * as publicationsActions from './publications';

const store = getMockStore();

describe('Publications actions', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    const returnedApiData = {};

    it('should dispatch 2 actions on a successful get latest publications', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
            .reply(200, returnedApiData);

        const expectedActions = [
            {type: actions.LATEST_PUBLICATIONS_LOADING},
            {type: actions.LATEST_PUBLICATIONS_COMPLETED}
        ];

        const store = getMockStore();
        return store.dispatch(publicationsActions.searchLatestPublications()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 3 actions on a failure of get latest publications and set user to anon when API returns 403', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
            .reply(403);

        const expectedActions = [
            {type: actions.LATEST_PUBLICATIONS_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.LATEST_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(publicationsActions.searchLatestPublications()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 2 actions on a failure of get latest publications when API returns 404', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
            .reply(404);

        const expectedActions = [
            {type: actions.LATEST_PUBLICATIONS_LOADING},
            {type: actions.LATEST_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(publicationsActions.searchLatestPublications()).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });



    it('should dispatch 2 actions on a successful get of authors publications', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {},
        })).reply(200, returnedApiData);

        const expectedActions = [
            {type: actions.AUTHOR_PUBLICATIONS_LOADING},
            {type: actions.AUTHOR_PUBLICATIONS_COMPLETED}
        ];

        const store = getMockStore();

        return store.dispatch(publicationsActions.searchAuthorPublications({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {}
        })).then(() => {
                expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 3 actions on a failure to get of authors publications and set user to anon when API returns 403', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {},
        })).reply(403);

        const expectedActions = [
            {type: actions.AUTHOR_PUBLICATIONS_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.AUTHOR_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();

        return store.dispatch(publicationsActions.searchAuthorPublications({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {}
        })).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 2 actions on a failure to get of authors publications when API returns 404', () => {
        mock.onGet(repositories.routes.CURRENT_USER_RECORDS_API({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {},
        })).reply(404);

        const expectedActions = [
            {type: actions.AUTHOR_PUBLICATIONS_LOADING},
            {type: actions.AUTHOR_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();

        return store.dispatch(publicationsActions.searchAuthorPublications({
            userName: 'uqmbrow1',
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'desc',
            facets: {}
        })).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 2 actions on a successful get trending publications', () => {

        const trendingApiReturnedData = {
            "author_details": [
                {
                    "aut_id": "1671",
                    "aut_org_username": "uqmbrow1",
                    "aut_student_username": null,
                    "aut_email": "",
                    "aut_display_name": "Brown, Melissa Anne",
                    "aut_fname": "Melissa",
                    "aut_mname": "Anne",
                    "aut_lname": "Brown",
                    "aut_title": "Professor",
                    "aut_position": "",
                    "aut_homepage_link": "",
                    "aut_researcher_id": "F-1451-2010",
                    "aut_scopus_id": "160618002616",
                    "aut_mypub_url": "",
                    "aut_people_australia_id": "",
                    "aut_description": "",
                    "aut_orcid_id": "0000-0002-2830-9259",
                    "aut_google_scholar_id": null,
                    "aut_rid_last_updated": "2016-10-07",
                    "aut_publons_id": null
                }
            ],
            "altmetric": [
                {
                    "id": "17708",
                    "count": "4",
                    "difference": "0.5",
                    "created": "1424093618",
                    "last_checked": "1511253466",
                    "citation_url": "http://www.altmetric.com/details.php?citation_id=3445881",
                    "rek_pid": "UQ:242578",
                    "rek_date": "2011-05-01 00:00:00",
                    "title": "SNORD-host RNA Zfas1 is a regulator of mammary development and a potential marker for breast cancer",
                    "authors": "...Vargas, Ana C.;Campbell, Ian G.;Brown, Melissa A."
                },
                {
                    "id": "82067",
                    "count": "4",
                    "difference": "3.85",
                    "created": "1502853372",
                    "last_checked": "1510823330",
                    "citation_url": "http://www.altmetric.com/details.php?citation_id=23460021",
                    "rek_pid": "UQ:678947",
                    "rek_date": "2017-08-03 00:00:00",
                    "title": "Long noncoding RNAs CUPID1 and CUPID2 mediate breast cancer risk at 11q13 by modulating the response to DNA damage",
                    "authors": "...Cloonan, Nicole;Pearson,John;Brown, Melissa A...."
                },
                {
                    "id": "2100",
                    "count": "1",
                    "difference": "0.25",
                    "created": "1372746648",
                    "last_checked": "1507654457",
                    "citation_url": "http://www.altmetric.com/details.php?citation_id=888611",
                    "rek_pid": "UQ:282686",
                    "rek_date": "2012-08-01 00:00:00",
                    "title": "BRCA1 R1699Q variant displaying ambiguous functional abrogation confers intermediate breast and ovarian cancer risk",
                    "authors": "...Feng, Bingjian;Healey, Sue;Brown, Melissa A...."
                }
            ],
            "thomson": [
                {
                    "id": "22173067",
                    "count": "3",
                    "difference": "1",
                    "created": "1506802198",
                    "last_checked": "1506802198",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000393077300011&SrcAuth=uqueensland",
                    "rek_pid": "UQ:396321",
                    "rek_date": "2016-07-04 00:00:00",
                    "title": "Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer",
                    "authors": "...Clark, Susan J.;Lakhani, Sunil R.;Brown, Melissa A."
                },
                {
                    "id": "21720066",
                    "count": "20",
                    "difference": "1",
                    "created": "1506799026",
                    "last_checked": "1506799026",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000347707800001&SrcAuth=uqueensland",
                    "rek_pid": "UQ:348436",
                    "rek_date": "2015-01-08 00:00:00",
                    "title": "Fine-scale mapping of the 5q11.2 breast cancer locus reveals at least three independent risk variants regulating MAP3K1",
                    "authors": "...Ahmed, Shahana;Healey, Catherine S.;Brown, Melissa A...."
                },
                {
                    "id": "21581479",
                    "count": "34",
                    "difference": "1",
                    "created": "1506798769",
                    "last_checked": "1506798769",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=resolve1&DestLinkType=CitingArticles&DestApp=WOS_CPL&KeyUT=000342985700003&SrcAuth=uqueensland",
                    "rek_pid": "UQ:345184",
                    "rek_date": "2014-09-01 00:00:00",
                    "title": "Evidence that breast cancer risk at the 2q35 locus is mediated through IGFBP5 regulation",
                    "authors": "...Carroll, Jason;Caldas, Carlos;Brown, Melissa A...."
                }
            ],
            "scopus": [
                {
                    "id": "16078609",
                    "count": "1",
                    "difference": "1",
                    "created": "1506800059",
                    "last_checked": "1506800059",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84962771937&src=s&sot=cite&sdt=a",
                    "rek_pid": "UQ:384236",
                    "rek_date": "2016-04-04 00:00:00",
                    "title": "MicroRNA-206 is differentially expressed in Brca1-deficient mice and regulates epithelial and stromal cell compartments of the mouse mammary gland",
                    "authors": "...Edwards, S. L.;French, J. D.;Brown, M. A."
                },
                {
                    "id": "15777783",
                    "count": "6",
                    "difference": "1",
                    "created": "1506797607",
                    "last_checked": "1506797607",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84930766350&src=s&sot=cite&sdt=a",
                    "rek_pid": "UQ:328887",
                    "rek_date": "2013-01-01 00:00:00",
                    "title": "Consequences of germline variation disrupting the constitutional translational initiation codon start sites of MLH1 and BRCA2: Use of potential alternative start sites and implications for predicting variant pathogenicity",
                    "authors": "...Hopper, John L.;Jenkins, Mark A.;Brown, Melissa A...."
                },
                {
                    "id": "15743381",
                    "count": "46",
                    "difference": "1",
                    "created": "1506795654",
                    "last_checked": "1506795654",
                    "citation_url": "http://ezproxy.library.uq.edu.au/login?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&cite=2-s2.0-84867485246&src=s&sot=cite&sdt=a",
                    "rek_pid": "UQ:286101",
                    "rek_date": "2012-01-01 00:00:00",
                    "title": "A guide for functional analysis of BRCA1 variants of uncertain significance",
                    "authors": "...Caputo, Sandrine M.;Vreeswijk, Maaike P. G.;Brown, Melissa A...."
                }
            ]
        };

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: 'uqmbrow1'}))
            .reply(200, trendingApiReturnedData);

        const expectedActions = [
            {type: actions.TRENDING_PUBLICATIONS_LOADING},
            {type: actions.TRENDING_PUBLICATIONS_COMPLETED}
        ];

        const store = getMockStore();

        // console.log(store.dispatch(publicationsActions.searchTrendingPublications({userId: 'uqmbrow1'})));

        return store.dispatch(publicationsActions.searchTrendingPublications('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 3 actions on a failure to get trending publications and set account to anon when api returns 403', () => {

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: 'uqmbrow1'}))
            .reply(403);

        const expectedActions = [
            {type: actions.TRENDING_PUBLICATIONS_LOADING},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.TRENDING_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();

        // console.log(store.dispatch(publicationsActions.searchTrendingPublications({userId: 'uqmbrow1'})));

        return store.dispatch(publicationsActions.searchTrendingPublications('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch 3 actions on a failure to get trending publications when api returns 404', () => {

        mock.onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: 'uqmbrow1'}))
            .reply(404);

        const expectedActions = [
            {type: actions.TRENDING_PUBLICATIONS_LOADING},
            {type: actions.TRENDING_PUBLICATIONS_FAILED}
        ];

        const store = getMockStore();

        // console.log(store.dispatch(publicationsActions.searchTrendingPublications({userId: 'uqmbrow1'})));

        return store.dispatch(publicationsActions.searchTrendingPublications('uqmbrow1')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });


});
