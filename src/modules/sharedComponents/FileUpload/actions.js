// Repositories
import {loadPresignedData} from 'repositories/fileUpload';

// Types
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_UPLOADED = 'FILE_UPLOADED';

/**
 * Submits the record for approval
 * @returns {function(*)}
 */

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
