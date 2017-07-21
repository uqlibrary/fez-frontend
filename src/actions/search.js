import {getSearchExternal} from 'repositories/search';

/**
 * Action types
 * for specific source actions will create source@SEARCH_ACTION, eg SEARCH_LOADING@wos etc
 */
export const SEARCH_LOADING = 'SEARCH_LOADING';
export const SEARCH_COMPLETED = 'SEARCH_COMPLETED';
export const SEARCH_FAILED = 'SEARCH_FAILED';

/**
 * External search sources
 */
export const SOURCE_WOS = 'wos';
export const SOURCE_CROSSREF = 'crossref';
export const SOURCE_SCOPUS = 'scopus';
export const SOURCE_PUBMED = 'pubmed';

/**
 * List of valid external sources
 *
 * @type {[*]}
 */
export const externalSources = [
    SOURCE_CROSSREF,
    SOURCE_PUBMED,
    SOURCE_SCOPUS,
    SOURCE_WOS
];

/**
 * TODO: namespaces for search - think about this....
 * Search namespaces
 */
export const SEARCH_RESULT_ADD_RECORD = 'SEARCH_RESULT_ADD_RECORD';
export const SEARCH_RESULT_CLAIM_PUBLICATION = 'SEARCH_RESULT_CLAIM_PUBLICATION';

// TODO: CLEAR_SEARCH_RESULTS need this???
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

export function createSearchPromise(source, queryString, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({type: `${SEARCH_LOADING}@${source}`});
        getSearchExternal(source, queryString)
            .then(data => {
                dispatch({
                    type: `${SEARCH_COMPLETED}@${source}`,
                    payload: data
                });
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: `${SEARCH_FAILED}@${source}`,
                    payload: error
                });
                reject(error);
            });
    });
}

/**
 * Search publications from various sources
 * @param searchQuery
 * @returns {action}
 */
export function searchPublications(searchQuery) {
    return dispatch => {
        dispatch({type: SEARCH_LOADING});

        // TODO: include internal search
        const externalSearchPropmises = externalSources.map(source => createSearchPromise(source, searchQuery, dispatch));

        Promise.all(externalSearchPropmises)
            .then((data) => {
                let flattenedResults = [].concat.apply([], data);
                flattenedResults = flattenedResults.slice(0, flattenedResults.length);
                dispatch({
                    type: SEARCH_COMPLETED,
                    payload: flattenedResults
                });
            })
            .catch(error => {
                dispatch({
                    type: SEARCH_FAILED,
                    payload: error
                });
            });
    };
}
