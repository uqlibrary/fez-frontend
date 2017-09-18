import {SEARCH_LOADING, SEARCH_COMPLETED, SEARCH_FAILED, SEARCH_SOURCE_COUNT} from 'actions';
import {locale} from 'config';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0
    }
};

export const initialState = {
    publicationsList: [],
    loadingSearch: false,
    ...initialSearchSources
};

function deduplicateResults(publicationsList) {
    // get a list of duplicates DOI
    const doiList = publicationsList
        .filter(item => {
            return !!item.fez_record_search_key_doi;
        })
        .map(item => {
            return item.fez_record_search_key_doi.rek_doi;
        })
        .reduce((duplicates, item) => {
            if (duplicates.indexOf(item.toLowerCase()) < 0) {
                duplicates.push(item.toLowerCase());
            }
            return duplicates;
        }, []);
    // get a list of duplicate doi records
    const duplicates = publicationsList
        .filter(item => {
            return !!item.fez_record_search_key_doi && doiList.indexOf(item.fez_record_search_key_doi.rek_doi.toLowerCase()) >= 0;
        });
    // remove all duplicates from full list of results
    const cleanedPublicationsList = publicationsList
        .filter(item => {
            return !item.fez_record_search_key_doi || doiList.indexOf(item.fez_record_search_key_doi.rek_doi.toLowerCase()) < 0;
        });
    // filter duplicate records based on source priority
    const highPriorityItem = doiList
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

                        // Translate the URL here...

                        if (itemPriority < currentItemPriority) {
                            currentItem.sources.push(item.sources[0]);
                            currentItem.sourcesExtUrl.push(item.sourcesExtUrl[0]);
                            item.sources = currentItem.sources;
                            item.sourcesExtUrl = currentItem.sourcesExtUrl;
                            list[0] = item;
                        } else {
                            list[0].sources.push(item.sources[0]);
                            list[0].sourcesExtUrl.push(item.sourcesExtUrl[0]);
                        }

                        // const sourceLocale = locale.global.sources[source];
                        // const extURL = currentItem[sourceLocale.idLocation] ? (
                        //     locale.global.ezproxyPrefix + sourceLocale.externalURL.replace('[ID]', currentItem[sourceLocale.idLocation][sourceLocale.idKey])
                        // ) : (
                        //     sourceLocale.externalURL.replace('[ID]', currentItem[sourceLocale.idKey])
                        // );
                    }
                    return list;
                }, [])[0];
        });
    // re-add de-duplicated items
    return [...cleanedPublicationsList, ...highPriorityItem];
}

const handlers = {

    [SEARCH_SOURCE_COUNT]: (state, action) => {
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

    [SEARCH_LOADING]: (state) => {
        return {
            ...state,
            loadingSearch: true,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [SEARCH_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: deduplicateResults(action.payload.map(item => {
                return JSON.parse(JSON.stringify(item));
            }))
        };
    },

    [SEARCH_FAILED]: (state) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: [],
            ...initialSearchSources
        };
    },

    [`${SEARCH_FAILED}@`]: (state, action) => {
        // get search source, eg wos/pubmed/etc
        const source = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

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

    [`${SEARCH_COMPLETED}@`]: (state, action) => {
        // get search source, eg wos/pubmed/etc
        const source = action.type.substring(action.type.indexOf('@') + 1, action.type.length);

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

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
