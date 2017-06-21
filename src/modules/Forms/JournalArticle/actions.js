// Repositories
import {loadPublicationSubTypeData} from 'repositories/publicationSubTypes';
import {loadAuthorsData} from 'repositories/authors';
import {submitRecord} from 'repositories/addRecord';

// config
import {locale} from 'config';

// Types
export const PUBLICATION_SUB_TYPES_LOADING = 'PUBLICATION_SUB_TYPES_LOADING';
export const PUBLICATION_SUB_TYPES_LOADED = 'PUBLICATION_SUB_TYPES_LOADED';
export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';
export const RECORD_SUBMITTED_RESETTED = 'RECORD_SUBMITTED_RESETTED';

// module imports
import {showSnackbar} from 'modules/App';

/**
 * Returns the vocab id entry
 * @returns {object}
 */
function getVocabId(id) {
    return locale.mapping.vocabs.filter(vocab => {
        return vocab.documentId === id;
    });
}

/**
 * Loads the publication sub types into the application
 * @returns {function(*)}
 */
export function loadPublicationSubTypesList(id) {
    return dispatch => {
        dispatch({type: PUBLICATION_SUB_TYPES_LOADING});
        const entry = getVocabId(id);

        loadPublicationSubTypeData(entry[0].vocabId).then(publicationTypes => {
            dispatch({
                type: PUBLICATION_SUB_TYPES_LOADED,
                payload: publicationTypes
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Loads a list of authors
 * @returns {function(*)}
 */
export function loadAuthorsList() {
    return dispatch => {
        dispatch({type: AUTHORS_LOADING});
        loadAuthorsData().then(authorList => {
            dispatch({
                type: AUTHORS_LOADED,
                payload: authorList
            });
        }).catch((error) => {
            throw(error);
        });
    };
}


/**
 * Cancels the add record functionality
 * @returns {function(*)}
 */
export function cancelAddRecord(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Submits the record for approval
 * @returns {Promise}
 */
export function submitRecordForApproval(data) {
    return new Promise((resolve, reject) => {
        submitRecord(data).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
            throw(error);
        });
    });
}

/**
 * Resets the isFormSubmissionComplete state
 * @returns {{type: string}}
 */
export function resetFormSubmissionFlag() {
    return {
        type: RECORD_SUBMITTED_RESETTED
    };
}
