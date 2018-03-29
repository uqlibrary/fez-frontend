import * as actions from '../actions/actionTypes';
import searchRecordsReducer, {deduplicateResults, getEspaceDuplicatePublicationsById} from './searchRecords';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0
    }
};

const initialState = {
    rawSearchQuery: 'This is a test',
    publicationsList: [],
    loadingSearch: false,
    ...initialSearchSources
};

describe('searchRecords reducer', () => {

    // We need to offer clean data for each test, as the de-duplication method mutates the array
    let espaceList, scopusList, wosList;

    beforeEach(() => {
        espaceList = [
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:224457"}],
                "rek_pid": "UQ:224457",
                "fez_record_search_key_doi": null,
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 3901795,
                    "rek_isi_loc_pid": "UQ:224457",
                    "rek_isi_loc_xsdmf_id": 10821,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_scopus_id": null
            },
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:683770"}],
                "rek_pid": "UQ:683770",
                "fez_record_search_key_doi": null,
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 4031803,
                    "rek_isi_loc_pid": "UQ:683770",
                    "rek_isi_loc_xsdmf_id": null,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_scopus_id": {
                    "rek_scopus_id_id": 2552454,
                    "rek_scopus_id_pid": "UQ:683770",
                    "rek_scopus_id_xsdmf_id": null,
                    "rek_scopus_id":"2-s2.0-85020491241"
                }
            }
        ];
        scopusList = [
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "2-s2.0-85030864188"}],
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-85030864188"}
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "2-s2.0-85020491241"}],
                "fez_record_search_key_doi": {"rek_doi": "10.1016\/B978-0-12-801573-5.00033-4"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-85020491241"}
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "2-s2.0-84991737284"}],
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-84991737284"}
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "2-s2.0-84971467438"}],
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-84971467438"}
            },
            {
                "currentSource": "scopus",
                "sources": [{source: "scopus", id: "2-s2.0-77449149944"}],
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
                "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-77449149944"}
            }
        ];
        wosList = [
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000412197500001"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000412197500001"},
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"}
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000386872100029"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000386872100029"},
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000377227600002"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000377227600002"},
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000283520500009"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000283520500009"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000273712100008"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000273712100008"},
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
            }
        ];
    });

    it('should return deduplicated list of publications', () => {

        const result = deduplicateResults([...espaceList, ...scopusList, ...wosList]);

        expect(result.length).toEqual(6);

        result.map((item, index) => {
            if (item.fez_record_search_key_doi &&
                (item.fez_record_search_key_doi.rek_doi === '10.1186/s12985-017-0854-x'
                    || item.fez_record_search_key_doi.rek_doi === '10.1099/jgv.0.000580'
                    || item.fez_record_search_key_doi.rek_doi === '10.1146/annurev-ento-112408-085457'
                    || item.fez_record_search_key_doi.rek_doi === '10.1128/JVI.00737-15')) {
                expect(item.sources.map(item => item.source)).toEqual(['scopus', 'wos']);
            }
        });
        expect(result[0].sources.map(item => item.source)).toEqual(['espace', 'scopus']);
        expect(result[1].sources.map(item => item.source)).toEqual(['espace', 'wos']);
        expect(result[0].currentSource).toEqual('espace');
        expect(result[1].currentSource).toEqual('espace');

    });

    it('updates correctly when it is loading from API', () => {
        const loadingState = searchRecordsReducer(initialState, {type: actions.SEARCH_LOADING});
        expect(loadingState.loadingSearch).toBeTruthy();
        expect(loadingState.publicationsList).toEqual([]);
    });

    it('updates correctly once general API data loaded', () => {

        const postReducerPublicationsList = [
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:683770"}, {source: "scopus", id: "2-s2.0-85020491241"}],
                "rek_pid": "UQ:683770",
                "fez_record_search_key_doi": null,
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 4031803,
                    "rek_isi_loc_pid": "UQ:683770",
                    "rek_isi_loc_xsdmf_id": null,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_scopus_id": {
                    "rek_scopus_id_id": 2552454,
                    "rek_scopus_id_pid": "UQ:683770",
                    "rek_scopus_id_xsdmf_id": null,
                    "rek_scopus_id":"2-s2.0-85020491241"
                }
            },
            {
                "currentSource": "espace",
                "sources": [{source: "espace", id: "UQ:224457"}, {source: "wos", id: "000283520500009"}],
                "rek_pid": "UQ:224457",
                "fez_record_search_key_doi": null,
                "fez_record_search_key_isi_loc": {
                    "rek_isi_loc_id": 3901795,
                    "rek_isi_loc_pid": "UQ:224457",
                    "rek_isi_loc_xsdmf_id": 10821,
                    "rek_isi_loc": "000283520500009"
                },
                "fez_record_search_key_scopus_id": null
            },
            // duplicate doi in scopus, wos
            {
                "currentSource": "wos",
                "sources": [{source: "scopus", id: "2-s2.0-85030864188"}, {source: "wos", id: "000412197500001"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000412197500001"},
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"}
            },
            // duplicate doi in scopus, wos
            {
                "currentSource": "wos",
                "sources": [{source: "scopus", id: "2-s2.0-84991737284"}, {source: "wos", id: "000386872100029"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000386872100029"},
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
            },
            // duplicate doi in scopus, wos
            {
                "currentSource": "wos",
                "sources": [{source: "scopus", id: "2-s2.0-84971467438"}, {source: "wos", id: "000377227600002"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000377227600002"},
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
            },
            // duplicate doi in scopus, wos
            {
                "currentSource": "wos",
                "sources": [{source: "scopus", id: "2-s2.0-77449149944"}, {source: "wos", id: "000273712100008"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000273712100008"},
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
            }
        ];

        const loadedState = searchRecordsReducer(initialState, {
            payload: [...espaceList, ...scopusList, ...wosList],
            type: actions.SEARCH_LOADED
        });
        expect(loadedState.loadingSearch).toBeFalsy();
        expect(loadedState.publicationsList).toEqual(postReducerPublicationsList);
        expect(loadedState.publicationsList.length).toEqual(6);
        expect(loadedState.rawSearchQuery).toEqual(initialState.rawSearchQuery);
    });

    it('updates correctly once WOS API data loaded', () => {

        const postReducerWOSPublicationsList = [
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000412197500001"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000412197500001"},
                "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"}
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000386872100029"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000386872100029"},
                "fez_record_search_key_doi": {"rek_doi": "10.1099\/jgv.0.000580"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000377227600002"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000377227600002"},
                "fez_record_search_key_doi": {"rek_doi": "10.1128\/JVI.00737-15"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000283520500009"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000283520500009"},
            },
            {
                "currentSource": "wos",
                "sources": [{source: "wos", id: "000273712100008"}],
                "fez_record_search_key_isi_loc": {"rek_isi_loc": "000273712100008"},
                "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
            }
        ];

        const wosState = searchRecordsReducer(initialState, {
            payload: [...wosList],
            type: `${actions.SEARCH_LOADED}@wos`
        });
        expect(wosState.loadingSearch).toBeTruthy();
        expect(wosState.publicationsList).toEqual(postReducerWOSPublicationsList);
        expect(wosState.publicationsList.length).toEqual(5);
        expect(wosState.rawSearchQuery).toEqual(initialState.rawSearchQuery);

    });

    it('updates correctly when the Scopus data is already available, and we are processing WOS data', () => {
        const aSourceLoadedState = {
            ...initialState,
            publicationsList: deduplicateResults(scopusList),
            loadingPublicationSources: {"scopus": true, "scopusCount": 5, "totalSearchedCount": 1}
        };
        const wosState2 = searchRecordsReducer(aSourceLoadedState, {
            payload: [...wosList],
            type: `${actions.SEARCH_LOADED}@wos`
        });
        expect(wosState2.loadingSearch).toBeTruthy();
        expect(wosState2.publicationsList.length).toEqual(6); // adds 1 new publication after de-duplication
        expect(wosState2.publicationsList[0].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[1].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[2].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[3].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[4].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[5].currentSource).toEqual('scopus');
    });

    it('updates correctly on general API failure', () => {
        const failedState = searchRecordsReducer(initialState, {type: actions.SEARCH_FAILED});
        expect(failedState.loadingSearch).toBeFalsy();
        expect(failedState.publicationsList).toEqual([]);
        expect(failedState.loadingPublicationSources).toEqual(initialState.loadingPublicationSources);
    });

    it('updates correctly on scopus API failure', () => {
        const postReducerScopusPublicationsCount = {
            "scopus": true,
            "scopusCount": 0,
            "totalSearchedCount": 1,
            "totalSourcesCount": 0
        };
        const failedScopusState = searchRecordsReducer(
            initialState, {
                payload: [],
                type: `${actions.SEARCH_FAILED}@scopus`
            });
        expect(failedScopusState.loadingSearch).toBeFalsy();
        expect(failedScopusState.publicationsList).toEqual([]);
        expect(failedScopusState.rawSearchQuery).toEqual(initialState.rawSearchQuery);
        expect(failedScopusState.loadingPublicationSources).toEqual(postReducerScopusPublicationsCount);
    });

    it('updates the totalSourcesCount', () => {
        const countState = searchRecordsReducer(initialState, {payload: 5, type: actions.SEARCH_SOURCE_COUNT});
        expect(countState.loadingPublicationSources.totalSourcesCount).toEqual(5);
        expect(countState.loadingSearch).toBeFalsy();
    });

    it('returns the initial state when specifying an invalid handler type', () => {
        const countState = searchRecordsReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(countState).toEqual(initialState);
    });

    it('returns publicationsList in the correct source order from random api load order (1)', () => {
        const orderResult = deduplicateResults([...scopusList, ...wosList, ...espaceList]);
        expect(orderResult[0].currentSource).toEqual('espace');
        expect(orderResult[1].currentSource).toEqual('espace');
        expect(orderResult[2].currentSource).toEqual('wos');
        expect(orderResult[3].currentSource).toEqual('wos');
        expect(orderResult[4].currentSource).toEqual('wos');
        expect(orderResult[5].currentSource).toEqual('wos');
    });

    it('returns publicationsList in the correct source order from random api load order (2)', () => {
        const orderResult = deduplicateResults([...wosList, ...espaceList, ...scopusList]);
        expect(orderResult[0].currentSource).toEqual('espace');
        expect(orderResult[1].currentSource).toEqual('espace');
        expect(orderResult[2].currentSource).toEqual('wos');
        expect(orderResult[3].currentSource).toEqual('wos');
        expect(orderResult[4].currentSource).toEqual('wos');
        expect(orderResult[5].currentSource).toEqual('wos');
    });

    it('returns publicationsList in the correct source order from random api load order (3)', () => {
        const orderResult = deduplicateResults([...espaceList, ...scopusList, ...wosList]);
        expect(orderResult[0].currentSource).toEqual('espace');
        expect(orderResult[1].currentSource).toEqual('espace');
        expect(orderResult[2].currentSource).toEqual('wos');
        expect(orderResult[3].currentSource).toEqual('wos');
        expect(orderResult[4].currentSource).toEqual('wos');
        expect(orderResult[5].currentSource).toEqual('wos');
    });

    it('should get duplicate espace records with same id except the last duplicate', () => {
        const list = [
            { rek_pid: 1, currentSource: 'espace', fez_record_search_key_doi: {rek_doi: '10.1.111111'}},
            { rek_pid: 2, currentSource: 'espace', fez_record_search_key_doi: {rek_doi: '10.1.1122211'}},
            { rek_pid: 3, currentSource: 'espace', fez_record_search_key_doi: {rek_doi: '10.1.111111'}, fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111111'}},
            { rek_pid: 4, currentSource: 'espace', fez_record_search_key_doi: {rek_doi: '10.1.111111'}},
            { rek_pid: 10, currentSource: 'espace', fez_record_search_key_doi: {rek_doi: '10.1.111111'}},
            { rek_pid: 5, currentSource: 'espace', fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111111'}},
            { rek_pid: 6, currentSource: 'espace', fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111111'}},
            { rek_pid: 7, currentSource: 'espace', fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111122222'}},
            { rek_pid: 8, currentSource: 'espace', fez_record_search_key_isi_loc: {rek_isi_loc: '1232423532'}},
            { rek_pid: 9, currentSource: 'espace', fez_record_search_key_isi_loc: {rek_isi_loc: '1232423532'}}
        ];

        const espaceDuplicatesByDoi = getEspaceDuplicatePublicationsById(list, {key: 'fez_record_search_key_doi', value: 'rek_doi'});
        expect(espaceDuplicatesByDoi.length).toEqual(3);
        expect(espaceDuplicatesByDoi.map(item => item.rek_pid)).toEqual([1, 3, 4]);

        const espaceDuplicatesByScopusId = getEspaceDuplicatePublicationsById(list, {key: 'fez_record_search_key_scopus_id', value: 'rek_scopus_id'});
        expect(espaceDuplicatesByScopusId.length).toEqual(2);
        expect(espaceDuplicatesByScopusId.map(item => item.rek_pid)).toEqual([3, 5]);

        const espaceDuplicatesByWOS = getEspaceDuplicatePublicationsById(list, {key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc'});
        expect(espaceDuplicatesByWOS.length).toEqual(1);
        expect(espaceDuplicatesByWOS.map(item => item.rek_pid)).toEqual([8]);
    });

    it('should deduplicates from other sources but keep from espace', () => {
        /*
         * Below espace list has:
         *  -   2 espace records with same wos id with 1 duplicate wos id from wosList
         *  -   1 record with duplicate doi matching from scopusList and wosList
         *  -   1 record with duplicate scopus id matching from scopusList
         */
        const espaceList = [
            // duplicate espace record with wos id
            { rek_pid: 1, currentSource: 'espace', sources: [{source: 'espace'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
            },
            // duplicate espace record with wos id
            { rek_pid: 2, currentSource: 'espace', sources: [{source: 'espace'}],
                fez_record_search_key_doi: {rek_doi: '10.1.1122211'},
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
            },
            // duplicate doi matching scopus, wos reocrds
            { rek_pid: 3, currentSource: 'espace', sources: [{source: 'espace'}],
                fez_record_search_key_doi: {rek_doi: '10.1.111111'},
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '454545545'}
            },
            // duplicate scopus id matching in scopus
            { rek_pid: 4, currentSource: 'espace', sources: [{source: 'espace'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.222222222'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '98989898989'}
            }
        ];

        /*
         * Below scopus list has:
         *  -   2 records with duplicate doi mathicng from wosList
         *  -   1 record with duplicate doi matching from espaceList
         *  -   1 record with duplicate scopus id matching from espaceList
         *  -   1 unique record
         */
        const scopusList = [
            // duplicate doi matching wos - not expected in the list
            { rek_pid: 5, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: {rek_doi: '10.1.254745'},
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111111'}
            },
            // duplicate doi matching espace - not expected in the list
            { rek_pid: 6, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: {rek_doi: '10.1.111111'},
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111133'}
            },
            // duplicate scopus id matching in espace - not expected in the list
            { rek_pid: 7, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: {rek_doi: '10.1.222222'},
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.222222222'}
            },
            // unique
            { rek_pid: 8, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.2323232323'}
            },
            // duplicate doi matching wos - not expected in the list
            { rek_pid: 9, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: {rek_doi: '10.1.989598'},
                fez_record_search_key_scopus_id: null
            }
        ];

        /*
         * Below wos list has:
         *  -   2 records with duplicate doi mathicng from scopusList
         *  -   1 record with duplicate doi matching from espaceList
         *  -   1 record with duplicate wos id matching from espaceList (2 espace record with same wos id)
         *  -   1 unique record
         */
        const wosList = [
            // duplicate doi matching espace - not expected in the list
            { rek_pid: 10, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.111111'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1232422532'}
            },
            // duplicate doi matching scopus - expected in the list with scopus source added
            { rek_pid: 11, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.254745'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '222423532'}
            },
            // duplicate wos id matching espace - not expected in the list
            { rek_pid: 12, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.22222222'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
            },
            // unique
            { rek_pid: 13, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.99999'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1232423543'}
            },
            // duplicate doi matching scopus - expected in the list with scopus source added
            { rek_pid: 14, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.989598'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1232423512'}
            }
        ];

        const expectedList = [
            // duplicate espace record with wos id
            { rek_pid: 1, currentSource: 'espace', sources: [{source: 'espace'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
            },
            // duplicate espace record with wos id
            { rek_pid: 2, currentSource: 'espace', sources: [{source: 'espace'}, {source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.1122211'},
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
            },
            // duplicate scopus id matching in scopus
            { rek_pid: 4, currentSource: 'espace', sources: [{source: 'espace'}, {source: 'scopus'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.222222222'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '98989898989'}
            },
            // duplicate doi matching scopus, wos reocrds
            { rek_pid: 3, currentSource: 'espace', sources: [{source: 'espace'}, {source: 'scopus'}, {source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.111111'},
                fez_record_search_key_scopus_id: null,
                fez_record_search_key_isi_loc: {rek_isi_loc: '454545545'}
            },
            // duplicate doi matching scopus - expected in the list with scopus source added
            { rek_pid: 11, currentSource: 'wos', sources: [{source: 'scopus'}, {source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.254745'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '222423532'}
            },
            // duplicate doi matching scopus - expected in the list with scopus source added
            { rek_pid: 14, currentSource: 'wos', sources: [{source: 'scopus'}, {source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.989598'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1232423512'}
            },
            // unique
            { rek_pid: 13, currentSource: 'wos', sources: [{source: 'wos'}],
                fez_record_search_key_doi: {rek_doi: '10.1.99999'},
                fez_record_search_key_isi_loc: {rek_isi_loc: '1232423543'}
            },
            // unique
            { rek_pid: 8, currentSource: 'scopus', sources: [{source: 'scopus'}],
                fez_record_search_key_doi: null,
                fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.2323232323'}
            },
        ];

        const result = deduplicateResults([...espaceList, ...scopusList, ...wosList]);

        expect(result.length).toEqual(8);
        expect(result).toEqual(expectedList);
    });
});