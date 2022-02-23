import * as actions from 'actions/actionTypes';
// import { record } from 'mock/data';

export const initialState = {
    collectionList: [],
    loadingCollections: false,
    loadingCollectionsError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_COLLECTIONS_LOADING]: state => ({
        // collectionList: [...state.collectionList],
        loadingCollections: true,
        collectionList: state.collectionList,
    }),

    [actions.VIEW_COLLECTIONS_LOADED]: (state, action) => {
        // console.log('STATE IS', state);
        const uniqueValues = new Set();
        const collectionList = [...state.collectionList, action.payload];
        const filteredList = collectionList.filter(obj => {
            const isPresent = uniqueValues.has(obj.parent);
            uniqueValues.add(obj.parent);
            return !isPresent;
        });
        return {
            collectionList: [...filteredList],
            loadingCollections: false,
        };
    },

    // [actions.VIEW_COLLECTIONS_LOADED]: (state, action) => ({
    //     collectionList: [...state.collectionList, action.payload],
    // }),

    // [actions.VIEW_COLLECTIONS_LOADED]: (state, action) => (
    //     console.log(state);
    //     return ({
    //     ...initialState,
    //     collectionList: {
    //         ...state.collectionList,

    //     }
    //     loadingCollections: false,
    //     // collectionList: action.payload.data,
    //     totalRecords: action.payload.total,
    //     startRecord: action.payload.from,
    //     endRecord: action.payload.to,
    //     currentPage: action.payload.current_page,
    //     perPage: action.payload.per_page,
    // })),

    [actions.VIEW_COLLECTIONS_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingCollections: false,
        loadingCollectionsError: action.payload,
    }),
};

export default function viewCollectionsReducer(state = { ...initialState }, action) {
    // console.log('STATE:', state, 'ACTION', action);
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
