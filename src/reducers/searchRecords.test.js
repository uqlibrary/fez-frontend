import * as actions from 'actions/actionTypes';
import searchRecordsReducer, {
    deduplicateResults,
    getEspaceDuplicatePublicationsByIdExceptLastItem,
    getIdCountHash,
    getDuplicateList,
} from './searchRecords';
import * as records from 'mock/data/testing/searchRecords';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0,
    },
};

const initialState = {
    rawSearchQuery: 'This is a test',
    publicationsList: [],
    searchLoading: false,
    searchLoadingError: false,
    ...initialSearchSources,
};

describe('searchRecords reducer', () => {
    // We need to offer clean data for each test, as the de-duplication method mutates the array
    let espaceList;
    let scopusList;
    let wosList;

    beforeEach(() => {
        espaceList = records.espaceList;
        scopusList = records.scopusList;
        wosList = records.wosList;
    });

    it('should return de-duplicated list of publications', () => {
        const result = deduplicateResults([...espaceList, ...scopusList, ...wosList]);

        expect(result.length).toEqual(6);

        result.map(item => {
            if (
                item.fez_record_search_key_doi &&
                (item.fez_record_search_key_doi.rek_doi === '10.1186/s12985-017-0854-x' ||
                    item.fez_record_search_key_doi.rek_doi === '10.1099/jgv.0.000580' ||
                    item.fez_record_search_key_doi.rek_doi === '10.1146/annurev-ento-112408-085457' ||
                    item.fez_record_search_key_doi.rek_doi === '10.1128/JVI.00737-15')
            ) {
                expect(item.sources.map(item => item.source)).toEqual(['scopus', 'wos']);
            }
        });
        expect(result[0].sources.map(item => item.source)).toEqual(['espace', 'scopus']);
        expect(result[1].sources.map(item => item.source)).toEqual(['espace', 'wos']);
        expect(result[0].currentSource).toEqual('espace');
        expect(result[1].currentSource).toEqual('espace');
    });

    it('updates correctly when it is loading from API', () => {
        const loadingState = searchRecordsReducer(initialState, { type: actions.SEARCH_LOADING });
        expect(loadingState.searchLoading).toBeTruthy();
        expect(loadingState.publicationsList).toEqual([]);
    });

    it('sets publication list to empty array if the payload array "data" is empty in SEARCH_LOADED', () => {
        const test = searchRecordsReducer(initialState, {
            payload: { data: [] },
            type: actions.SEARCH_LOADED,
        });
        expect(test.publicationsList).toBeInstanceOf(Array);
        expect(test.publicationsList.length).toBe(0);
    });

    it('sets publication list to empty array if the payload array "data" is empty in SEARCH_LOADED@', () => {
        const test = searchRecordsReducer(initialState, {
            payload: { data: [] },
            type: `${actions.SEARCH_LOADED}@`,
        });
        expect(test.publicationsList).toBeInstanceOf(Array);
        expect(test.publicationsList.length).toBe(0);
    });

    it('updates correctly once general API data loaded', () => {
        const postReducerPublicationsList = records.postReducerPublicationsList;

        const loadedState = searchRecordsReducer(initialState, {
            payload: { data: [...espaceList, ...scopusList, ...wosList] },
            type: actions.SEARCH_LOADED,
        });
        expect(loadedState.searchLoading).toBeFalsy();
        expect(loadedState.publicationsList).toEqual(postReducerPublicationsList);
        expect(loadedState.publicationsList.length).toEqual(6);
        expect(loadedState.rawSearchQuery).toEqual(initialState.rawSearchQuery);
    });

    it('updates correctly once WOS API data loaded', () => {
        const postReducerWOSPublicationsList = records.wosList;

        const wosState = searchRecordsReducer(initialState, {
            payload: { data: wosList },
            type: `${actions.SEARCH_LOADED}@wos`,
        });
        expect(wosState.searchLoading).toBeTruthy();
        expect(wosState.publicationsList).toEqual(postReducerWOSPublicationsList);
        expect(wosState.publicationsList.length).toEqual(5);
        expect(wosState.rawSearchQuery).toEqual(initialState.rawSearchQuery);
    });

    it('updates correctly when the Scopus data is already available, and we are processing WOS data', () => {
        const aSourceLoadedState = {
            ...initialState,
            publicationsList: deduplicateResults(scopusList),
            loadingPublicationSources: { scopus: true, scopusCount: 5, totalSearchedCount: 1 },
        };
        const wosState2 = searchRecordsReducer(aSourceLoadedState, {
            payload: { data: [...wosList] },
            type: `${actions.SEARCH_LOADED}@wos`,
        });
        expect(wosState2.searchLoading).toBeTruthy();
        expect(wosState2.publicationsList.length).toEqual(6); // adds 1 new publication after de-duplication
        expect(wosState2.publicationsList[0].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[1].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[2].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[3].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[4].currentSource).toEqual('wos');
        expect(wosState2.publicationsList[5].currentSource).toEqual('scopus');
    });

    it('updates correctly on general API failure', () => {
        const failedState = searchRecordsReducer(initialState, { type: actions.SEARCH_FAILED });
        expect(failedState.searchLoading).toBeFalsy();
        expect(failedState.publicationsList).toEqual([]);
        expect(failedState.loadingPublicationSources).toEqual(initialState.loadingPublicationSources);
    });

    it('updates correctly on scopus API failure', () => {
        const postReducerScopusPublicationsCount = {
            scopus: true,
            scopusCount: 0,
            totalSearchedCount: 1,
            totalSourcesCount: 0,
        };
        const failedScopusState = searchRecordsReducer(initialState, {
            payload: [],
            type: `${actions.SEARCH_FAILED}@scopus`,
        });
        expect(failedScopusState.searchLoading).toBeFalsy();
        expect(failedScopusState.publicationsList).toEqual([]);
        expect(failedScopusState.rawSearchQuery).toEqual(initialState.rawSearchQuery);
        expect(failedScopusState.loadingPublicationSources).toEqual(postReducerScopusPublicationsCount);
    });

    it('updates the totalSourcesCount', () => {
        const countState = searchRecordsReducer(initialState, { payload: 5, type: actions.SEARCH_SOURCE_COUNT });
        expect(countState.loadingPublicationSources.totalSourcesCount).toEqual(5);
        expect(countState.searchLoading).toBeFalsy();
    });

    it('returns the initial state when specifying an invalid handler type', () => {
        const countState = searchRecordsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
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
            { rek_pid: 1, currentSource: 'espace', fez_record_search_key_doi: { rek_doi: '10.1.111111' } },
            { rek_pid: 2, currentSource: 'espace', fez_record_search_key_doi: { rek_doi: '10.1.1122211' } },
            {
                rek_pid: 3,
                currentSource: 'espace',
                fez_record_search_key_doi: { rek_doi: '10.1.111111' },
                fez_record_search_key_scopus_id: { rek_scopus_id: '2.s2.1111111111' },
            },
            { rek_pid: 4, currentSource: 'espace', fez_record_search_key_doi: { rek_doi: '10.1.111111' } },
            { rek_pid: 10, currentSource: 'espace', fez_record_search_key_doi: { rek_doi: '10.1.111111' } },
            {
                rek_pid: 5,
                currentSource: 'espace',
                fez_record_search_key_scopus_id: { rek_scopus_id: '2.s2.1111111111' },
            },
            {
                rek_pid: 6,
                currentSource: 'espace',
                fez_record_search_key_scopus_id: { rek_scopus_id: '2.s2.1111111111' },
            },
            {
                rek_pid: 7,
                currentSource: 'espace',
                fez_record_search_key_scopus_id: { rek_scopus_id: '2.s2.1111122222' },
            },
            { rek_pid: 8, currentSource: 'espace', fez_record_search_key_isi_loc: { rek_isi_loc: '1232423532' } },
            { rek_pid: 9, currentSource: 'espace', fez_record_search_key_isi_loc: { rek_isi_loc: '1232423532' } },
        ];

        const espaceDuplicatesByDoi = getEspaceDuplicatePublicationsByIdExceptLastItem(list, {
            key: 'fez_record_search_key_doi',
            value: 'rek_doi',
        });
        expect(espaceDuplicatesByDoi.length).toEqual(3);
        expect(espaceDuplicatesByDoi.map(item => item.rek_pid)).toEqual([1, 3, 4]);

        const espaceDuplicatesByScopusId = getEspaceDuplicatePublicationsByIdExceptLastItem(list, {
            key: 'fez_record_search_key_scopus_id',
            value: 'rek_scopus_id',
        });
        expect(espaceDuplicatesByScopusId.length).toEqual(2);
        expect(espaceDuplicatesByScopusId.map(item => item.rek_pid)).toEqual([3, 5]);

        const espaceDuplicatesByWOS = getEspaceDuplicatePublicationsByIdExceptLastItem(list, {
            key: 'fez_record_search_key_isi_loc',
            value: 'rek_isi_loc',
        });
        expect(espaceDuplicatesByWOS.length).toEqual(1);
        expect(espaceDuplicatesByWOS.map(item => item.rek_pid)).toEqual([8]);
    });

    it('should deduplicate from other sources but keep from espace', () => {
        /*
         * Below espace list has:
         *  -   2 espace records with same wos id with 1 duplicate wos id from wosList
         *  -   1 record with duplicate doi matching from scopusList and wosList
         *  -   1 record with duplicate scopus id matching from scopusList
         */
        const espaceList = records.espaceListCrafted;

        /*
         * Below scopus list has:
         *  -   2 records with duplicate doi mathicng from wosList
         *  -   1 record with duplicate doi matching from espaceList
         *  -   1 record with duplicate scopus id matching from espaceList
         *  -   1 unique record
         */
        const scopusList = records.scopusListCrafted;

        /*
         * Below wos list has:
         *  -   2 records with duplicate doi mathicng from scopusList
         *  -   1 record with duplicate doi matching from espaceList
         *  -   1 record with duplicate wos id matching from espaceList (2 espace record with same wos id)
         *  -   1 unique record
         */
        const wosList = records.wosListCrafted;

        const expectedList = records.expectedListCrafted;

        const result = deduplicateResults([...espaceList, ...scopusList, ...wosList]);

        expect(result.length).toEqual(8);
        expect(result).toEqual(expectedList);
    });

    it('getIdCountHash should correctly return id count hash', () => {
        const testCases = [
            {
                inputList: [...espaceList],
                idSearchKey: { key: 'fez_record_search_key_doi', value: 'rek_doi' },
                isOnlyForEspace: false,
                expectedIdCountHash: {},
            },
            {
                inputList: [...espaceList, ...scopusList],
                idSearchKey: { key: 'fez_record_search_key_doi', value: 'rek_doi' },
                isOnlyForEspace: false,
                expectedIdCountHash: {
                    '10.1186/s12985-017-0854-x': 1,
                    '10.1016/b978-0-12-801573-5.00033-4': 1,
                    '10.1099/jgv.0.000580': 1,
                    '10.1128/jvi.00737-15': 1,
                    '10.1146/annurev-ento-112408-085457': 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_doi', value: 'rek_doi' },
                isOnlyForEspace: false,
                expectedIdCountHash: {
                    '10.1.111111': 3,
                    '10.1.1122211': 1,
                    '10.1.222222': 1,
                    '10.1.22222222': 1,
                    '10.1.254745': 2,
                    '10.1.989598': 2,
                    '10.1.99999': 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_scopus_id', value: 'rek_scopus_id' },
                isOnlyForEspace: false,
                expectedIdCountHash: {
                    '2.s2.222222222': 2,
                    '2.s2.1111111111': 1,
                    '2.s2.1111111133': 1,
                    '2.s2.2323232323': 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_doi', value: 'rek_doi' },
                isOnlyForEspace: true,
                expectedIdCountHash: {
                    '10.1.111111': 1,
                    '10.1.1122211': 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_scopus_id', value: 'rek_scopus_id' },
                isOnlyForEspace: true,
                expectedIdCountHash: {
                    '2.s2.222222222': 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                isOnlyForEspace: true,
                expectedIdCountHash: {
                    1233423532: 2,
                    454545545: 1,
                    98989898989: 1,
                },
            },
            {
                inputList: [...records.espaceListCrafted, ...records.scopusListCrafted, ...records.wosListCrafted],
                idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                isOnlyForEspace: false,
                expectedIdCountHash: {
                    1233423532: 3,
                    454545545: 1,
                    98989898989: 1,
                    1232422532: 1,
                    222423532: 1,
                    1232423543: 1,
                    1232423512: 1,
                },
            },
        ];

        testCases.map(testCase => {
            const { inputList, idSearchKey, isOnlyForEspace, expectedIdCountHash } = testCase;
            expect(getIdCountHash(inputList, idSearchKey, isOnlyForEspace)).toEqual(expectedIdCountHash);
        });
    });

    it('getDuplicateList should get duplicates from the list correctly', () => {
        const testCases = [
            {
                inputList: [...espaceList, ...scopusList, ...wosList],
                idSearchKey: { key: 'fez_record_search_key_doi', value: 'rek_doi' },
                isOnlyForEspace: false,
                espaceDuplicates: [],
                expectedDuplicates: records.expectedDuplicateListByDoiFromEsapceScopusWOS,
            },
            {
                inputList: [...espaceList, ...scopusList, ...wosList],
                idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                isOnlyForEspace: false,
                espaceDuplicates: [],
                expectedDuplicates: records.expectedDuplicateListByWOSIdFromEspaceScopusWOS,
            },
            {
                inputList: [...espaceList, ...scopusList, ...wosList],
                idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                isOnlyForEspace: undefined,
                espaceDuplicates: [espaceList[0]],
                expectedDuplicates: records.expectedDuplicateListByWOSIdFromEspaceScopusWOSWithEsapceDuplicatesProvided,
            },
            {
                inputList: [...espaceList, ...scopusList, ...wosList],
                idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                isOnlyForEspace: true,
                espaceDuplicates: [],
                expectedDuplicates: records.expectedDuplicateListByWOSIdFromEspaceScopusWOSOnlyForEspace,
            },
        ];

        testCases.map(testCase => {
            const { inputList, idSearchKey, isOnlyForEspace, expectedDuplicates, espaceDuplicates } = testCase;
            expect(getDuplicateList(inputList, idSearchKey, isOnlyForEspace, espaceDuplicates)).toEqual(
                expectedDuplicates,
            );
        });
    });

    it(
        'getEspaceDuplicatePublicationsByIdExceptLastItem should correctly ' +
            'get espace records with duplicate id except last',
        () => {
            const testCases = [
                {
                    inputList: [...espaceList, ...scopusList, ...wosList],
                    idSearchKey: { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
                    expectedDuplicates: records.expectedDuplicateListByWOSIdFromEspaceScopusWOSOnlyForEspace.slice(
                        0,
                        -1,
                    ),
                },
            ];

            testCases.map(testCase => {
                const { inputList, idSearchKey, expectedDuplicates } = testCase;
                expect(getEspaceDuplicatePublicationsByIdExceptLastItem(inputList, idSearchKey)).toEqual(
                    expectedDuplicates,
                );
            });
        },
    );

    it('should set search query in state', () => {
        const testValue = 'i feel lucky';
        const countState = searchRecordsReducer(initialState, {
            payload: { title: testValue },
            type: actions.SET_SEARCH_QUERY,
        });
        expect(countState.searchQuery).toEqual({ title: testValue });
    });

    it('should reset search query in state', () => {
        const countState = searchRecordsReducer(
            { ...initialState, searchQuery: { all: 'i feel lucky' } },
            { type: actions.CLEAR_SEARCH_QUERY },
        );
        expect(countState.searchQuery).toEqual({});
    });

    it('should set search loading error in state', () => {
        const searchState = searchRecordsReducer(initialState, { type: actions.SEARCH_FAILED });
        expect(searchState.searchLoadingError).toBeTruthy();
    });

    it('should reset search loading error in state', () => {
        const searchState = searchRecordsReducer(
            { ...initialState, searchLoadingError: true },
            { payload: { title: 'test search reset error' }, type: actions.SET_SEARCH_QUERY },
        );
        expect(searchState.searchLoadingError).toBeFalsy();
    });

    it('should reset rawSearchQuery on clearing new record', () => {
        const searchState = searchRecordsReducer(
            { ...initialState, rawSearchQuery: 'testing testing' },
            { type: actions.CREATE_RECORD_RESET },
        );

        expect(searchState.rawSearchQuery).toBe('');
    });
});
