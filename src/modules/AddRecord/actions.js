// Repositories
import {loadPublicationTypesData} from 'repositories/publicationTypes';
import {loadPresignedData} from 'repositories/fileUpload';

// Types
export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';

// module imports
import {showSnackbar} from 'modules/App';

/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadPublicationTypesList() {
    return dispatch => {
        dispatch({type: PUBLICATION_TYPES_LOADING});
        loadPublicationTypesData().then(publicationTypes => {
            dispatch({
                type: PUBLICATION_TYPES_LOADED,
                payload: publicationTypes
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
 * Saves the record for later edits
 * @returns {function(*)}
 */
export function saveForLater(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Submits the record for approval
 * @returns {function(*)}
 */
export function submitRecord(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

export function uploadFile(acceptedFiles) {
    return dispatch => {
        acceptedFiles.map(file => {
            dispatch({type: FILE_UPLOADING});
            console.log(file);
            loadPresignedData(file).then(presignedUrl => {
                dispatch({
                    type: FILE_UPLOADED,
                    payload: presignedUrl
                });
            }).catch((error) => {
                throw(error);
            });
        });
    };
}
