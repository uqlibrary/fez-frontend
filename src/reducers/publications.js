import * as actions from 'actions/publications';

/* eslint-disable */
const mockFacets = {
    "Scopus document type": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": []
    },
    "Mock data: Display type": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": 179, "doc_count": 2}]
    },
    "Mock data: Keywords": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 5,
        "buckets": [{"key": "Applied Microbiology and Biotechnology", "doc_count": 1}, {
            "key": "Biochemistry",
            "doc_count": 1
        }, {"key": "Bioengineering", "doc_count": 1}, {
            "key": "Biomaterials",
            "doc_count": 1
        }, {"key": "Biomedical Engineering", "doc_count": 1}]
    },
    "Scopus document type (lookup)": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": []
    },
    "Subject (lookup)": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
    "Collection (lookup)": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "Crossref Import", "doc_count": 2}]
    },
    "Mock data: Year published": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "2017", "doc_count": 2}]
    },
    "Author (lookup)": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "Schenk, Gerhard (Gary)", "doc_count": 1}]
    },
    "SMock data: ubject": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
    "Mock data: Journal name": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "Metallomics", "doc_count": 1}, {"key": "Nature biotechnology", "doc_count": 1}]
    },
    "Mock data: Collection": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "UQ:639325", "doc_count": 2}]
    },
    "Mock data: Author": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": 683, "doc_count": 1}]
    },
    "Mock data: Genre": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
    "Subtype": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
    "Display type (lookup)": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [{"key": "Journal Article", "doc_count": 2}]
    }
};
/* eslint-enable */

export const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: mockFacets,
    loadingPublicationsList: true,

    latestPublicationsList: [],
    loadingLatestPublications: true,
    totalPublicationsCount: null,

    trendingPublicationsList: [],
    loadingTrendingPublications: true
};

const handlers = {

    [actions.LATEST_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: true
        };
    },

    [actions.LATEST_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            latestPublicationsList: action.payload.data,
            totalPublicationsCount: action.payload.total,
            loadingLatestPublications: false,
            publicationsList: action.payload.data,
            publicationsListPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page
            },
            loadingPublicationsList: false
        };
    },

    [actions.LATEST_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            latestPublicationsList: [],
            totalPublicationsCount: null,
            loadingLatestPublications: false
        };
    },

    [actions.AUTHOR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            publicationsList: [],
            publicationsListPagingData: {},
            loadingPublicationsList: true
        };
    },

    [actions.AUTHOR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            publicationsList: action.payload.data,
            publicationsListPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page
            },
            loadingPublicationsList: false
        };
    },

    [actions.AUTHOR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            publicationsList: [],
            publicationsListPagingData: {},
            loadingPublicationsList: false
        };
    },

    [actions.TRENDING_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: true
        };
    },

    [actions.TRENDING_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            trendingPublicationsList: action.payload,
            loadingTrendingPublications: false
        };
    },

    [actions.TRENDING_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            trendingPublicationsList: [],
            loadingTrendingPublications: false
        };
    }
};

export default function publicationsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
