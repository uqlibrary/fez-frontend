import * as actions from 'actions/actionTypes';
import {locale} from 'config';

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

export const deduplicateResults = (publicationsList) => {
    // get a list of DOI counts
    const doiCountHash = publicationsList
        .filter(item => {
            return !!item.fez_record_search_key_doi;
        })
        .map(item => {
            return item.fez_record_search_key_doi.rek_doi;
        })
        .reduce((duplicatesCount, doi) => {
            duplicatesCount[doi.toLowerCase()] = (duplicatesCount[doi.toLowerCase()] || 0) + 1;
            return duplicatesCount;
        }, []);

    // get a list of duplicate doi records and dois
    const doiDuplicatesList = [];
    const duplicates = publicationsList
        .filter(item => {
            if (item.fez_record_search_key_doi && doiCountHash[item.fez_record_search_key_doi.rek_doi.toLowerCase()] > 1
                && doiDuplicatesList.indexOf(item.fez_record_search_key_doi.rek_doi.toLowerCase()) === -1) {
                doiDuplicatesList.push(item.fez_record_search_key_doi.rek_doi.toLowerCase());
            }
            return !!item.fez_record_search_key_doi && doiCountHash[item.fez_record_search_key_doi.rek_doi.toLowerCase()] > 1;
        });

    // remove all duplicates from full list of results
    const cleanedPublicationsList = publicationsList
        .filter(item => {
            return !item.fez_record_search_key_doi || doiCountHash[item.fez_record_search_key_doi.rek_doi.toLowerCase()] === 1;
        });

    // filter duplicate records based on source priority
    const highPriorityItem = doiDuplicatesList
        .map(doi => {
            // get a record with most priority
            return duplicates
                .filter(item => {
                    return !!item.fez_record_search_key_doi && doi === item.fez_record_search_key_doi.rek_doi.toLowerCase();
                })
                .reduce((list, item) => {
                    if (list.length === 0) {
                        list.push(item);
                    } else {
                        const currentItem = {...list[0]}; // the first item
                        const currentItemPriority = Math
                            .min(...currentItem.sources
                                .map(source => {
                                    return locale.global.sources[source];
                                })); // returns the lowest valued priority source this record has
                        const itemPriority = locale.global.sources[item.sources[0]]; // items current source priority

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

    [actions.SEARCH_COMPLETED]: (state, action) => {
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

    [`${actions.SEARCH_COMPLETED}@`]: (state, action) => {
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
    const handler = action.type.indexOf('SEARCH_COMPLETED@') < 0 && action.type.indexOf('SEARCH_FAILED@') < 0 ?
        handlers[action.type] : handlers[action.type.substring(0, action.type.indexOf('@') + 1)];
    // handlers[actions.getAction(action.type)];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
