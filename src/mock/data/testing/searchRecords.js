import stringToArrayBuffer from 'string-to-arraybuffer';

export const espaceList = [
    {
        "currentSource": "espace",
        "sources": [{source: "espace", id: "UQ:224457"}],
        "rek_pid": "UQ:224457",
        "fez_record_search_key_doi": null,
        "fez_record_search_key_isi_loc": {
            "rek_isi_loc_id": 3901795,
            "rek_isi_loc_pid": "UQ:224457",
            "rek_isi_loc_xsdmf_id": null,
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
export const scopusList = [
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
export const wosList = [
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

export const postReducerPublicationsList = [
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
            "rek_isi_loc_xsdmf_id": null,
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

export const expectedDuplicateListByDoiFromEsapceScopusWOS = [
    {
        "currentSource": "scopus",
        "sources": [{source: "scopus", id: "2-s2.0-85030864188"}],
        "fez_record_search_key_doi": {"rek_doi": "10.1186\/s12985-017-0854-x"},
        "fez_record_search_key_scopus_id": {"rek_scopus_id": "2-s2.0-85030864188"}
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
    },
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
        "sources": [{source: "wos", id: "000273712100008"}],
        "fez_record_search_key_isi_loc": {"rek_isi_loc": "000273712100008"},
        "fez_record_search_key_doi": {"rek_doi": "10.1146\/annurev-ento-112408-085457"},
    }
];

export const expectedDuplicateListByWOSIdFromEspaceScopusWOS = [
    ...espaceList,
    {
        "currentSource": "wos",
        "sources": [{source: "wos", id: "000283520500009"}],
        "fez_record_search_key_isi_loc": {"rek_isi_loc": "000283520500009"},
    },
];

export const expectedDuplicateListByWOSIdFromEspaceScopusWOSWithEsapceDuplicatesProvided = [
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
    },
    {
        "currentSource": "wos",
        "sources": [{source: "wos", id: "000283520500009"}],
        "fez_record_search_key_isi_loc": {"rek_isi_loc": "000283520500009"},
    }
];

export const expectedDuplicateListByWOSIdFromEspaceScopusWOSOnlyForEspace = [
    ...espaceList,
];

/*
 * Below espace list has:
 *  -   2 espace records with same wos id with 1 duplicate wos id from wosList
 *  -   1 record with duplicate doi matching from scopusList and wosList
 *  -   1 record with duplicate scopus id matching from scopusList
 */
export const espaceListCrafted = [
    // duplicate espace record with wos id
    {
        rek_pid: 1,
        currentSource: 'espace',
        sources: [{source: 'espace'}],
        fez_record_search_key_doi: null,
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
    },
    // duplicate espace record with wos id
    {
        rek_pid: 2,
        currentSource: 'espace',
        sources: [{source: 'espace'}],
        fez_record_search_key_doi: {rek_doi: '10.1.1122211'},
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
    },
    // duplicate doi matching scopus, wos reocrds
    {
        rek_pid: 3,
        currentSource: 'espace',
        sources: [{source: 'espace'}],
        fez_record_search_key_doi: {rek_doi: '10.1.111111'},
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '454545545'}
    },
    // duplicate scopus id matching in scopus
    {
        rek_pid: 4,
        currentSource: 'espace',
        sources: [{source: 'espace'}],
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
export const scopusListCrafted = [
    // duplicate doi matching wos - not expected in the list
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
        fez_record_search_key_doi: {rek_doi: '10.1.254745'},
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111111'}
    },
    // duplicate doi matching espace - not expected in the list
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
        fez_record_search_key_doi: {rek_doi: '10.1.111111'},
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.1111111133'}
    },
    // duplicate scopus id matching in espace - not expected in the list
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
        fez_record_search_key_doi: {rek_doi: '10.1.222222'},
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.222222222'}
    },
    // unique
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
        fez_record_search_key_doi: null,
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.2323232323'}
    },
    // duplicate doi matching wos - not expected in the list
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
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
export const wosListCrafted = [
    // duplicate doi matching espace - not expected in the list
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.111111'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1232422532'}
    },
    // duplicate doi matching scopus - expected in the list with scopus source added
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.254745'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '222423532'}
    },
    // duplicate wos id matching espace - not expected in the list
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.22222222'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
    },
    // unique
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.99999'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1232423543'}
    },
    // duplicate doi matching scopus - expected in the list with scopus source added
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.989598'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1232423512'}
    }
];

export const expectedListCrafted = [
    // duplicate espace record with wos id
    {
        rek_pid: 1,
        currentSource: 'espace',
        sources: [{source: 'espace'}],
        fez_record_search_key_doi: null,
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
    },
    // duplicate espace record with wos id
    {
        rek_pid: 2,
        currentSource: 'espace',
        sources: [{source: 'espace'}, {source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.1122211'},
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '1233423532'}
    },
    // duplicate scopus id matching in scopus
    {
        rek_pid: 4,
        currentSource: 'espace',
        sources: [{source: 'espace'}, {source: 'scopus'}],
        fez_record_search_key_doi: null,
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.222222222'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '98989898989'}
    },
    // duplicate doi matching scopus, wos reocrds
    {
        rek_pid: 3,
        currentSource: 'espace',
        sources: [{source: 'espace'}, {source: 'scopus'}, {source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.111111'},
        fez_record_search_key_scopus_id: null,
        fez_record_search_key_isi_loc: {rek_isi_loc: '454545545'}
    },
    // duplicate doi matching scopus - expected in the list with scopus source added
    {
        currentSource: 'wos',
        sources: [{source: 'scopus'}, {source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.254745'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '222423532'}
    },
    // duplicate doi matching scopus - expected in the list with scopus source added
    {
        currentSource: 'wos',
        sources: [{source: 'scopus'}, {source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.989598'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1232423512'}
    },
    // unique
    {
        currentSource: 'wos',
        sources: [{source: 'wos'}],
        fez_record_search_key_doi: {rek_doi: '10.1.99999'},
        fez_record_search_key_isi_loc: {rek_isi_loc: '1232423543'}
    },
    // unique
    {
        currentSource: 'scopus',
        sources: [{source: 'scopus'}],
        fez_record_search_key_doi: null,
        fez_record_search_key_scopus_id: {rek_scopus_id: '2.s2.2323232323'}
    },
];

export const exportSearchToExcel = stringToArrayBuffer(`xml file`);
