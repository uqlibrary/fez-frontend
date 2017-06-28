// Types
export const AUTHORS_LIST_UPDATED = 'AUTHORS_LIST_UPDATED';

/**
 * Updates the redux state with the latest authors list
 * @returns {{type: string, payload: array}}
 */
export function updateAuthorsList(authorsList) {
    return {
        type: AUTHORS_LIST_UPDATED,
        payload: authorsList
    };
}
