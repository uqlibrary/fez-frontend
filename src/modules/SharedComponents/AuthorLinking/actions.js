export const AUTHOR_SELECTED = 'AUTHOR_SELECTED';
export const AUTHOR_SELECTED_RESET = 'AUTHOR_SELECTED_RESET';


/**
 * Sets the selected author id
 * @returns {type: String, payload: String}
 */
export function setSelectedAuthor(authorId) {
    return {
        type: AUTHOR_SELECTED,
        payload: authorId
    };
}

/**
 * Sets the selected author id
 * @returns {type: String, payload: String}
 */
export function resetSelectedAuthor() {
    return {
        type: AUTHOR_SELECTED_RESET
    };
}
