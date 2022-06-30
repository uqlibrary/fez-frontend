import * as actions from 'actions/actionTypes';
import { locale } from 'locale';

const initialSearchSources = {
    loadingPublicationSources: {
        totalSearchedCount: 0,
        totalSourcesCount: 0,
    },
};

const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: {},
    searchLoading: false,
    searchLoadingError: false,
    ...initialSearchSources,
};

const idSearchKeys = [
    { key: 'fez_record_search_key_doi', value: 'rek_doi' },
    { key: 'fez_record_search_key_scopus_id', value: 'rek_scopus_id' },
    { key: 'fez_record_search_key_isi_loc', value: 'rek_isi_loc' },
];

export const getIdCountHash = (list, idSearchKey, isOnlyForEspace = false) => {
    return list
        .filter(item => {
            return !!item[idSearchKey.key] && (!isOnlyForEspace || item.currentSource === 'espace');
        })
        .map(item => {
            return item[idSearchKey.key][idSearchKey.value];
        })
        .reduce((duplicatesCount, id) => {
            duplicatesCount[id.toLowerCase()] = (duplicatesCount[id.toLowerCase()] || 0) + 1;
            return duplicatesCount;
        }, {});
};

export const getDuplicateList = (
    publicationsList,
    idSearchKey,
    isOnlyForEspace = false,
    espacePublicationWithDuplicateIds = [],
) => {
    const idCountHash = getIdCountHash(publicationsList, idSearchKey, isOnlyForEspace);

    return publicationsList
        .filter(item => {
            return !!item[idSearchKey.key] && (!isOnlyForEspace || item.currentSource === 'espace');
        })
        .filter(item => {
            return idCountHash[item[idSearchKey.key][idSearchKey.value].toLowerCase()] > 1;
        })
        .filter(item => {
            return (
                isOnlyForEspace ||
                item.currentSource !== 'espace' ||
                espacePublicationWithDuplicateIds.filter(espaceItem => {
                    return espaceItem.rek_pid === item.rek_pid;
                }).length === 0
            );
        });
};

export const getEspaceDuplicatePublicationsByIdExceptLastItem = (list, idSearchKey) => {
    const duplicateList = getDuplicateList(list, idSearchKey, true);
    return duplicateList.slice(0, duplicateList.length - 1);
};

export const deduplicateResults = list => {
    return idSearchKeys.reduce(
        (publicationsList, idSearchKey) => {
            const espacePublicationWithDuplicateIds = getEspaceDuplicatePublicationsByIdExceptLastItem(
                publicationsList,
                idSearchKey,
            );

            // get a list of doi/scopus_id/isi_loc counts
            const idCountHash = getIdCountHash(publicationsList, idSearchKey);

            // get a list of duplicate doi records and dois/scopus_ids/isi_loc
            const duplicates = getDuplicateList(
                publicationsList,
                idSearchKey,
                false,
                espacePublicationWithDuplicateIds,
            );

            // remove all duplicates from full list of results
            const cleanedPublicationsList = publicationsList.filter(item => {
                return (
                    !item[idSearchKey.key] || idCountHash[item[idSearchKey.key][idSearchKey.value].toLowerCase()] === 1
                );
            });

            // filter duplicate records based on source priority
            const highPriorityItem = Object.keys(idCountHash)
                .filter(id => idCountHash[id] > 1)
                .map(id => {
                    // get a record with most priority
                    return duplicates
                        .filter(item => {
                            return (
                                !!item[idSearchKey.key] && id === item[idSearchKey.key][idSearchKey.value].toLowerCase()
                            );
                        })
                        .reduce((list, item) => {
                            if (list.length === 0) {
                                return [item];
                            } else {
                                const currentItem = { ...list[0] }; // the first item
                                const currentItemSources = [...currentItem.sources];
                                const currentItemPriority = Math.min(
                                    ...currentItemSources.map(source => locale.global.sources[source.source].priority),
                                ); // returns the lowest valued priority source this record has
                                // items current source priority
                                const itemPriority = locale.global.sources[item.sources[0].source].priority;

                                // prevent duplicate sources
                                !currentItemSources.some(source => source.source === item.sources[0].source) &&
                                    currentItemSources.push(item.sources[0]);

                                if (itemPriority < currentItemPriority) {
                                    const itemWithNewSources = { ...item };
                                    itemWithNewSources.sources = [...currentItemSources];
                                    return [itemWithNewSources];
                                } else {
                                    currentItem.sources = [...currentItemSources];
                                    return [{ ...currentItem }];
                                }
                            }
                        }, [])[0];
                });

            // re-add de-duplicated items
            return [...espacePublicationWithDuplicateIds, ...highPriorityItem, ...cleanedPublicationsList].sort(
                (item1, item2) =>
                    locale.global.sources[item1.currentSource].priority -
                    locale.global.sources[item2.currentSource].priority,
            );
        },
        [...list],
    );
};

const handlers = {
    [actions.SEARCH_SOURCE_COUNT]: (state, action) => {
        // set search completed for a specific source
        const loadingPublicationSources = {
            loadingPublicationSources: {
                ...state.loadingPublicationSources,
                totalSourcesCount: action.payload,
            },
        };

        return {
            ...state,
            ...loadingPublicationSources,
        };
    },

    [actions.SET_SEARCH_QUERY]: (state, action) => {
        return {
            ...state,
            searchLoadingError: false,
            searchQuery: {
                ...action.payload,
            },
        };
    },

    [actions.CLEAR_SEARCH_QUERY]: state => {
        return {
            ...state,
            searchQuery: {},
        };
    },

    [actions.SEARCH_LOADING]: (state, action) => {
        const rawSearchQuery = action.payload;
        return {
            ...state,
            ...initialSearchSources,
            publicationsList: [],
            publicationsListPagingData: {},
            rawSearchQuery: rawSearchQuery,
            searchLoading: true,
            searchLoadingError: false,
        };
    },

    [actions.SEARCH_LOADED]: (state, action) => {
        return {
            ...state,
            searchLoading: false,
            searchLoadingError: false,
            publicationsList:
                action.payload.data && action.payload.data.length > 0 && action.payload.data[0].currentSource
                    ? deduplicateResults(action.payload.data)
                    : action.payload.data,
            publicationsListType: action.payload.type || null,
            publicationsListPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page,
            },
            publicationsListFacets: (action.payload.filters || {}).facets || {},
            publicationsListDefaultView: {
                id: action.payload.default_view_type || locale.components.sorting.displayRecordsAs[0].index,
                lookup: action.payload.default_view_type_lookup || locale.components.sorting.displayRecordsAs[0].label,
            },
        };
    },

    [actions.SEARCH_FAILED]: state => {
        return {
            ...state,
            ...initialState,
            searchLoadingError: true,
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
                [`${source}Count`]: 0,
            },
        };

        return {
            ...state,
            ...loadingPublicationSources,
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
                [`${source}Count`]: action.payload.data.length,
            },
        };

        return {
            ...state,
            searchLoading: true,
            publicationsList:
                action.payload.data && action.payload.data.length > 0 && action.payload.data[0].currentSource
                    ? deduplicateResults([...state.publicationsList, ...action.payload.data])
                    : state.publicationsList,
            ...loadingPublicationSources,
        };
    },

    [actions.CREATE_RECORD_RESET]: state => ({
        ...state,
        rawSearchQuery: '',
    }),
};

export default function searchRecordsReducer(state = initialState, action) {
    const handler = action.type.indexOf('@') >= 0 ? handlers[actions.getAction(action.type)] : handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
