import * as actions from 'actions/actionTypes';

export const initialState = {
    topCitedPublicationsList: [],
    loadingTopCitedPublications: false,
};

const handlers = {
    [actions.TOP_CITED_PUBLICATIONS_LOADING]: state => {
        return {
            ...state,
            topCitedPublicationsList: [],
            loadingTopCitedPublications: true,
        };
    },

    [`${actions.TOP_CITED_PUBLICATIONS_LOADED}@`]: (state, action) => {
        const topCitedPublicationsList = [...state.topCitedPublicationsList];
        const source = actions.getActionSuffix(action.type);
        const index = topCitedPublicationsList.findIndex(s => s.key === source);
        index > -1
            ? (topCitedPublicationsList[index].values = action.payload.data)
            : topCitedPublicationsList.push({
                  key: source,
                  values: action.payload.data,
              });

        return {
            ...state,
            topCitedPublicationsList,
            loadingTopCitedPublications: false,
        };
    },

    [actions.TOP_CITED_PUBLICATIONS_LOADED]: (state, action) => {
        return {
            ...state,
            trendingPublicationsList: action.payload.data,
            loadingTopCitedPublications: false,
        };
    },

    [actions.TOP_CITED_PUBLICATIONS_FAILED]: state => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTopCitedPublications: false,
        };
    },
};

export default function topCitedPublicationsReducer(state = initialState, action) {
    const handler = action.type.indexOf('@') >= 0 ? handlers[actions.getAction(action.type)] : handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
