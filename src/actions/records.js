import { post, patch } from 'repositories/generic';
import {
    NEW_RECORD_API,
    EXISTING_RECORD_API,
    RECORDS_ISSUES_API,
    NEW_COLLECTION_API,
    EXISTING_COLLECTION_API,
    NEW_COMMUNITY_API,
    EXISTING_COMMUNITY_API,
} from 'repositories/routes';
import { putUploadFiles } from 'repositories';
import * as transformers from './transformers';
import { NEW_RECORD_DEFAULT_VALUES, NEW_COLLECTION_DEFAULT_VALUES, NEW_COMMUNITY_DEFAULT_VALUES } from 'config/general';
import * as actions from './actionTypes';

/**
 * Save a new record involves up to three steps: create a new record, upload files, update record with uploaded files.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function createNewRecord(data) {
    return dispatch => {
        dispatch({ type: actions.CREATE_RECORD_SAVING });
        // set default values, links
        const recordRequest = {
            ...NEW_RECORD_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
            ...transformers.getRecordLinkSearchKey(data),
            ...transformers.getRecordAuthorsSearchKey(
                data.authors || (data.currentAuthor && [data.currentAuthor[0]]) || null,
            ),
            ...transformers.getRecordAuthorsIdSearchKey(
                data.authors || (data.currentAuthor && [data.currentAuthor[0]]) || null,
            ),
            ...transformers.getRecordContributorsSearchKey(data.editors),
            ...transformers.getRecordContributorsIdSearchKey(data.editors),
            ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
            ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
            ...transformers.getDatasetContactDetailSearchKeys(data.contact || null),
            ...transformers.getGeographicAreaSearchKey(data.geographicArea || null),
            ...transformers.getDatasetCreatorRolesSearchKey(data.authors || null),
            ...transformers.getRecordAuthorAffiliationSearchKey((data.isNtro && data.authors) || null),
            ...transformers.getRecordAuthorAffiliationTypeSearchKey((data.isNtro && data.authors) || null),
            ...transformers.getRecordAbstractDescriptionSearchKey((data.isNtro && data.ntroAbstract) || null),
            ...transformers.getGrantsListSearchKey((data.isNtro && data.grants) || null),
            ...transformers.getNtroMetadataSearchKeys((data.isNtro && data) || null),
            ...transformers.getLanguageSearchKey((data.isNtro && data.languages) || null),
            ...transformers.getQualityIndicatorSearchKey((data.isNtro && data.qualityIndicators) || null),
            ...transformers.getContentIndicatorSearchKey(data.contentIndicators || null),
        };

        // delete extra form values from request object
        const keysToDelete = [
            'authors',
            'comments',
            'contact',
            'currentAuthor',
            'editors',
            'fieldOfResearch',
            'files',
            'geographicArea',
            'grants',
            'impactStatement',
            'languages',
            'ntroAbstract',
            'qualityIndicators',
            'significance',
            'supervisors',
            'contentIndicators',
        ];
        keysToDelete.forEach(key => {
            delete recordRequest[key];
        });

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        const recordPatch = hasFilesToUpload ? transformers.getRecordFileAttachmentSearchKey(data.files.queue) : null;

        return post(NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() => (hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            .then(() =>
                hasFilesToUpload ? patch(EXISTING_RECORD_API({ pid: newRecord.rek_pid }), recordPatch) : newRecord,
            )
            .then(() =>
                data.comments
                    ? post(RECORDS_ISSUES_API({ pid: newRecord.rek_pid }), {
                        issue: 'Notes from creator of the new record: ' + data.comments,
                    })
                    : newRecord,
            )
            .then(response => {
                dispatch({
                    type: actions.CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false,
                    },
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.CREATE_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true,
                        },
                    });

                    return Promise.resolve(newRecord);
                }

                dispatch({
                    type: actions.CREATE_RECORD_FAILED,
                    payload: error.message,
                });

                return Promise.reject(error);
            });
    };
}

/**
 * Submit thesis involves two steps: upload files, create record with uploaded files.
 * This method has been deprecated - kept for posterity.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
// export function submitThesisOld(data, author) {
//     return dispatch => {
//         const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
//         if (!hasFilesToUpload) {
//             // reject thesis submission, files are required
//             return Promise.reject('Please attach files to proceed with thesis submission');
//         }
//         // set default values, links
//         const recordRequest = {
//             ...JSON.parse(JSON.stringify(data)),
//             ...transformers.getRecordAuthorsSearchKey(data.currentAuthor),
//             ...transformers.getRecordAuthorsIdSearchKey(data.currentAuthor),
//             ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
//             ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
//             ...transformers.getRecordFileAttachmentSearchKey(data.files.queue),
//             rek_title: data.thesisTitle.plainText,
//             rek_formatted_title: data.thesisTitle.htmlText,
//             rek_description: data.thesisAbstract.plainText,
//             rek_formatted_abstract: data.thesisAbstract.htmlText
//         };
//
//         // delete extra form values from request object
//         if (recordRequest.authors) delete recordRequest.authors;
//         if (recordRequest.editors) delete recordRequest.editors;
//         if (recordRequest.files) delete recordRequest.files;
//         if (recordRequest.currentAuthor) delete recordRequest.currentAuthor;
//         if (recordRequest.supervisors) delete recordRequest.supervisors;
//         if (recordRequest.fieldOfResearch) delete recordRequest.fieldOfResearch;
//         if (recordRequest.thesisTitle) delete recordRequest.thesisTitle;
//         if (recordRequest.thesisAbstract) delete recordRequest.thesisAbstract;
//         let fileUploadSucceeded = false;
//         dispatch({type: actions.CREATE_RECORD_SAVING});
//         return putUploadFiles(`UQ:${author.aut_student_username}`, data.files.queue, dispatch)
//             .then((response) => {
//                 fileUploadSucceeded = !!response;
//                 return post(NEW_RECORD_API(), recordRequest);
//             })
//             .then(response => {
//                 // if(process.env.ENABLE_LOG) {
//                 //     Raven.captureException('THESIS CREATED', {message: 'Thesis created successfully'});
//                 // }
//                 dispatch({
//                     type: actions.CREATE_RECORD_SUCCESS,
//                     payload: {
//                         newRecord: response
//                     }
//                 });
//                 return response;
//             })
//             .catch(error => {
//                 const specificError = !fileUploadSucceeded
//                     ? 'Submit Thesis: File upload failed. '
//                     : 'Submit Thesis: Error occurred while saving record to eSpace. ';
//                 const compositeError = `${specificError} ${ error.message ? `(${error.message})` : '' }`;
//
//                 if(process.env.ENABLE_LOG) Raven.captureException(error, {message: specificError});
//
//                 dispatch({
//                     type: actions.CREATE_RECORD_FAILED,
//                     payload: compositeError
//                 });
//
//                 return Promise.reject(compositeError);
//             });
//     };
// }

/**
 * Submit thesis involves two steps: create record - get signed url to upload files - upload files - patch record.
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function submitThesis(data) {
    return dispatch => {
        dispatch({ type: actions.CREATE_RECORD_SAVING });
        // set default values, links
        const recordRequest = {
            ...JSON.parse(JSON.stringify(data)),
            ...transformers.getRecordAuthorsSearchKey(data.currentAuthor),
            ...transformers.getRecordAuthorsIdSearchKey(data.currentAuthor),
            ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
            ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
            ...transformers.getRecordFileAttachmentSearchKey(data.files.queue),
            rek_title: data.thesisTitle.plainText,
            rek_formatted_title: data.thesisTitle.htmlText,
            rek_description: data.thesisAbstract.plainText,
            rek_formatted_abstract: data.thesisAbstract.htmlText,
        };

        // delete extra form values from request object
        const keysToDelete = [
            'authors',
            'editors',
            'currentAuthor',
            'supervisors',
            'fieldOfResearch',
            'files',
            'thesisTitle',
            'thesisAbstract',
        ];
        keysToDelete.forEach(key => {
            delete recordRequest[key];
        });

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        const recordPatch = hasFilesToUpload ? transformers.getRecordFileAttachmentSearchKey(data.files.queue) : null;

        return post(NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() => (hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            .then(() =>
                hasFilesToUpload ? patch(EXISTING_RECORD_API({ pid: newRecord.rek_pid }), recordPatch) : newRecord,
            )
            .then(response => {
                /* istanbul ignore next */
                dispatch({
                    type: actions.CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false,
                    },
                });
                /* istanbul ignore next */
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.CREATE_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true,
                        },
                    });
                    return post(RECORDS_ISSUES_API({ pid: newRecord.rek_pid }), {
                        issue: `The submitter had issues uploading files on this record: ${newRecord}`,
                    }).then(
                        /* istanbul ignore next */
                        () => {
                            return Promise.resolve(newRecord);
                        },
                    );
                }

                dispatch({
                    type: actions.CREATE_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/**
 * Save a new collection involves a single request.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function createCollection(data, authorId) {
    return dispatch => {
        dispatch({ type: actions.CREATE_COLLECTION_SAVING });
        // set default values, links
        const recordRequest = {
            ...NEW_COLLECTION_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof: data.fez_record_search_key_ismemberof,
                    rek_ismemberof_order: 1,
                },
            ],
            rek_depositor: authorId,
        };
        return post(NEW_COLLECTION_API(), recordRequest)
            .then(response => {
                dispatch({
                    type: actions.CREATE_COLLECTION_SUCCESS,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.CREATE_COLLECTION_FAILED,
                    payload: error.message,
                });

                return Promise.reject(error);
            });
    };
}

export const updateCollection = ({ pid, date, updated }) => {
    return dispatch => {
        dispatch({
            type: actions.COLLECTION_UPDATING,
        });
        const patchRecordRequest = {
            rek_date: date,
            ...transformers.getSecuritySectionSearchKeys(updated.securitySection),
        };
        return Promise.resolve([])
            .then(() => patch(EXISTING_COLLECTION_API({ pid }), patchRecordRequest))
            .then(response => {
                dispatch({
                    type: actions.COLLECTION_UPDATE_SUCCESS,
                    payload: {
                        ...response.data,
                    },
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.COLLECTION_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
};

/**
 * Save a new community involves a single request.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function createCommunity(data, authorId) {
    return dispatch => {
        dispatch({ type: actions.CREATE_COMMUNITY_SAVING });
        // set default values, links
        const recordRequest = {
            ...NEW_COMMUNITY_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
            rek_depositor: authorId,
        };
        return post(NEW_COMMUNITY_API(), recordRequest)
            .then(response => {
                dispatch({
                    type: actions.CREATE_COMMUNITY_SUCCESS,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.CREATE_COMMUNITY_FAILED,
                    payload: error.message,
                });

                return Promise.reject(error);
            });
    };
}

export const updateCommunity = ({ pid, date, updated }) => {
    return dispatch => {
        dispatch({
            type: actions.COMMUNITY_UPDATING,
        });
        const patchRecordRequest = {
            rek_date: date,
            ...transformers.getSecuritySectionSearchKeys(updated.securitySection),
        };
        return Promise.resolve([])
            .then(() => patch(EXISTING_COMMUNITY_API({ pid }), patchRecordRequest))
            .then(response => {
                dispatch({
                    type: actions.COMMUNITY_UPDATE_SUCCESS,
                    payload: {
                        ...response.data,
                    },
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.COMMUNITY_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
};

/**
 * Clear new record
 * @returns {action}
 */
export function clearNewRecord() {
    return dispatch => {
        dispatch({
            type: actions.CREATE_RECORD_RESET,
        });
    };
}

const sanitiseData = (data, replacer) => JSON.parse(JSON.stringify(data, replacer));
const makeReplacer = keys => (key, value) => (keys.indexOf(key) > -1 ? undefined : value);

const getAdminRecordRequest = data => {
    const { files, ...restFilesSection } = data.filesSection || {};
    const hasFilesToUpload = files && files.queue && files.queue.length > 0;
    // delete extra form values from request object
    const keys = [
        'pid',
        'recordType',
        'publication',
        'adminSection',
        'identifiersSection',
        'bibliographicSection',
        'authorsSection',
        'grantInformationSection',
        'ntroSection',
        'filesSection',
        'securitySection',
    ];

    return [
        {
            ...sanitiseData(data, makeReplacer(keys)),
            ...transformers.getAdminSectionSearchKeys(data.adminSection),
            ...transformers.getIdentifiersSectionSearchKeys(data.identifiersSection),
            ...transformers.getBibliographicSectionSearchKeys(data.bibliographicSection),
            ...transformers.getAuthorsSectionSearchKeys(data.authorsSection),
            ...transformers.getGrantInformationSectionSearchKeys(data.grantInformationSection),
            ...transformers.getNtroSectionSearchKeys(data.ntroSection),
            ...transformers.getFilesSectionSearchKeys(restFilesSection),
            ...transformers.getSecuritySectionSearchKeys(
                data.securitySection,
                (data.filesSection || {}).fez_datastream_info || [],
            ),
        },
        hasFilesToUpload,
        hasFilesToUpload ? transformers.getRecordFileAttachmentSearchKey(files.queue) : null,
    ];
};

/**
 * Update work request for admins: patch record
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted, refer to backend API data
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function adminUpdate(data) {
    const { files } = data.filesSection || {};
    return dispatch => {
        dispatch({
            type: actions.ADMIN_UPDATE_WORK_PROCESSING,
        });

        const [patchRecordRequest, hasFilesToUpload, patchFilesRequest] = getAdminRecordRequest(data);

        return Promise.resolve([])
            .then(() => (hasFilesToUpload ? putUploadFiles(data.publication.rek_pid, files.queue, dispatch) : null))
            .then(() =>
                hasFilesToUpload
                    ? patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), {
                        ...patchRecordRequest,
                        ...patchFilesRequest,
                    })
                    : patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchRecordRequest),
            )
            .then(response => {
                dispatch({
                    type: actions.ADMIN_UPDATE_WORK_SUCCESS,
                    payload: {
                        pid: response.data,
                    },
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_UPDATE_WORK_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/**
 * Clear new admin record
 * @returns {action}
 */
export function adminReset() {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_CREATE_RECORD_RESET,
        });
    };
}

/**
 * Save a new record as an admin involves multiple requests.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function adminCreate(data) {
    const {
        filesSection: { files },
    } = data;
    return dispatch => {
        dispatch({
            type: actions.ADMIN_CREATE_RECORD_SAVING,
        });

        let newRecord = null;
        const [createRecordRequest, hasFilesToUpload, patchFilesRequest] = getAdminRecordRequest(data);

        return post(NEW_RECORD_API(), {
            ...NEW_RECORD_DEFAULT_VALUES,
            ...createRecordRequest,
        })
            .then(response => {
                newRecord = response.data;
                return response;
            })
            .then(() => (hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, files.queue, dispatch) : newRecord))
            .then(() =>
                hasFilesToUpload
                    ? patch(EXISTING_RECORD_API({ pid: newRecord.rek_pid }), patchFilesRequest)
                    : newRecord,
            )
            .then(response => {
                dispatch({
                    type: actions.ADMIN_CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false,
                    },
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.ADMIN_CREATE_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true,
                        },
                    });

                    return Promise.resolve(newRecord);
                }

                dispatch({
                    type: actions.ADMIN_CREATE_RECORD_FAILED,
                    payload: error.message,
                });

                return Promise.reject(error);
            });
    };
}
