import * as actions from 'actions/actionTypes';
import {locale} from 'locale';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0
    }
};

const initialState = {
    publicationsList: [],
    loadingSearch: false,
    ...initialSearchSources
};

const idSearchKeys = [
    {key: 'fez_record_search_key_doi', value: 'rek_doi'},
    {key: 'fez_record_search_key_scopus_id', value: 'rek_scopus_id'},
    {key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc'}
];

export const deduplicateResults = (list) => {
    return idSearchKeys.reduce((publicationsList, idSearchKey) => {
        // get a list of doi/scopus_id/isi_loc counts
        const idCountHash = publicationsList
            .filter(item => {
                return !!item[idSearchKey.key];
            })
            .map(item => {
                return item[idSearchKey.key][idSearchKey.value];
            })
            .reduce((duplicatesCount, doi) => {
                duplicatesCount[doi.toLowerCase()] = (duplicatesCount[doi.toLowerCase()] || 0) + 1;
                return duplicatesCount;
            }, []);

        // get a list of duplicate doi records and dois/scopus_ids/isi_loc
        const idDuplicatesList = [];
        const duplicates = publicationsList
            .filter(item => {
                if (item[idSearchKey.key] && idCountHash[item[idSearchKey.key][idSearchKey.value].toLowerCase()] > 1
                    && idDuplicatesList.indexOf(item[idSearchKey.key][idSearchKey.value].toLowerCase()) === -1) {
                    idDuplicatesList.push(item[idSearchKey.key][idSearchKey.value].toLowerCase());
                }
                return !!item[idSearchKey.key] && idCountHash[item[idSearchKey.key][idSearchKey.value].toLowerCase()] > 1;
            });

        // remove all duplicates from full list of results
        const cleanedPublicationsList = publicationsList
            .filter(item => {
                return !item[idSearchKey.key] || idCountHash[item[idSearchKey.key][idSearchKey.value].toLowerCase()] === 1;
            });

        // filter duplicate records based on source priority
        const highPriorityItem = idDuplicatesList
            .map(id => {
                // get a record with most priority
                return duplicates
                    .filter(item => {
                        return !!item[idSearchKey.key] && id === item[idSearchKey.key][idSearchKey.value].toLowerCase();
                    })
                    .reduce((list, item) => {
                        if (list.length === 0) {
                            list.push(item);
                        } else {
                            const currentItem = {...list[0]}; // the first item
                            const currentItemPriority = Math
                                .min(...currentItem.sources
                                    .map(source => {
                                        return locale.global.sources[source.source].priority;
                                    })); // returns the lowest valued priority source this record has
                            const itemPriority = locale.global.sources[item.sources[0].source].priority; // items current source priority

                            if (itemPriority < currentItemPriority) {
                                currentItem.sources.push(item.sources[0]);
                                item.sources = currentItem.sources;
                                list[0] = item;
                            } else {
                                list[0].sources.push(item.sources[0]);
                            }
                        }
                        return list;
                    }, [])[0];
            });

        // re-add de-duplicated items
        return [...highPriorityItem, ...cleanedPublicationsList]
            .sort((item1, item2) =>
                (locale.global.sources[item1.currentSource].priority - locale.global.sources[item2.currentSource].priority));
    }, [...list]);
};

const handlers = {

    [actions.SEARCH_SOURCE_COUNT]: (state, action) => {
        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSourcesCount: action.payload
            }
        };

        return {
            ...state,
            ...loadingPublicationSources
        };
    },

    [actions.SEARCH_LOADING]: (state, action) => {
        const rawSearchQuery = action.payload;
        return {
            ...state,
            rawSearchQuery: rawSearchQuery,
            loadingSearch: true,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [actions.SEARCH_LOADED]: (state, action) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: deduplicateResults(action.payload.map(item => {
                return JSON.parse(JSON.stringify(item));
            }))
        };
    },

    [actions.SEARCH_FAILED]: (state) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [`${actions.SEARCH_FAILED}@`]: (state, action) => {
        // get search source, eg wos/pubmed/etc
        const source = actions.getActionSuffix(action.type);

        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSearchedCount: state.loadingPublicationSources.totalSearchedCount + 1,
                [source]: true,
                [`${source}Count`]: 0
            }
        };

        return {
            ...state,
            ...loadingPublicationSources
        };
    },

    [`${actions.SEARCH_LOADED}@`]: (state, action) => {
        const source = actions.getActionSuffix(action.type);

        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSearchedCount: state.loadingPublicationSources.totalSearchedCount + 1,
                [source]: true,
                [`${source}Count`]: action.payload.length
            }
        };

        return {
            ...state,
            loadingSearch: true,
            publicationsList:
                deduplicateResults(
                    [
                        ...state.publicationsList.map(item => {
                            return JSON.parse(JSON.stringify(item));
                        }),
                        ...action.payload.map(item => {
                            return JSON.parse(JSON.stringify(item));
                        })
                    ]),
            ...loadingPublicationSources
        };
    }
};

export default function searchRecordsReducer(state = initialState, action) {
    const handler = action.type.indexOf('@') >= 0 ? handlers[actions.getAction(action.type)] : handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
