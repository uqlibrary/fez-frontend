import { patch, post, put } from 'repositories/generic';
import {
    EXISTING_COLLECTION_API,
    EXISTING_COMMUNITY_API,
    EXISTING_RECORD_API,
    NEW_COLLECTION_API,
    NEW_COMMUNITY_API,
    NEW_RECORD_API,
    RECORDS_ISSUES_API,
    UNLOCK_RECORD_API,
} from 'repositories/routes';
import { putUploadFiles } from 'repositories';
import * as transformers from './transformers';
import { getRekDate } from './transformers';
import {
    DOCUMENT_TYPES_LOOKUP,
    NEW_COLLECTION_DEFAULT_VALUES,
    NEW_COMMUNITY_DEFAULT_VALUES,
    NEW_RECORD_DEFAULT_VALUES,
} from 'config/general';
import * as actions from './actionTypes';
import * as Sentry from '@sentry/react';

/**
 * @param data
 * @param replacer
 * @return {any}
 */
export const sanitiseData = (data, replacer) => JSON.parse(JSON.stringify(data, replacer));

/**
 * @param keys
 * @return {function(*, *): undefined|*}
 */
const makeReplacer = keys => (key, value) => (keys.indexOf(key) > -1 ? undefined : value);

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
            ...sanitiseData(data),
            ...transformers.getRecordDoiSearchKey(data),
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
            rek_date: getRekDate(data, data.rek_subtype),
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
            'rek_link',
            'rek_link_description',
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
                          issue: `Notes from creator of the new record: ${data.comments}`,
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

const prepareThesisSubmission = data => {
    // set default values, links
    const recordRequest = {
        ...sanitiseData(data),
        ...transformers.getRecordAuthorsSearchKey(data.currentAuthor),
        ...transformers.getRecordAuthorsIdSearchKey(data.currentAuthor),
        ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
        ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
        ...transformers.getRecordFileAttachmentSearchKey(data.files.queue),
        ...transformers.getThesisTypeSearchKey(data.isHdrThesis ? 'hdr' : 'sbs'),
        rek_title: data.thesisTitle.plainText,
        rek_formatted_title: data.thesisTitle.htmlText,
        rek_description: data.thesisAbstract.plainText,
        rek_formatted_abstract: data.thesisAbstract.htmlText,
        rek_subtype: data.rek_genre_type,
        rek_genre: DOCUMENT_TYPES_LOOKUP[data.rek_display_type],
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

    return recordRequest;
};

/**
 * Thesis submission involves four steps:
 *  1. create record,
 *  2. upload files (involves generation of signed URL and actual upload; done elsewhere),
 *  3. log and report if upload failed, and
 *  4. log if reporting failed.
 * @param {object} data to be posted, refer to backend API
 * @param {object} preCreatedRecord If present, the newly created record from a previous attempt.
 * @param {string} formName the name of the form being submitted
 * @param {Array} fullyUploadedFiles List of names of files which have been uploaded already to the server
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function submitThesis(data, preCreatedRecord = {}, formName = '', fullyUploadedFiles = []) {
    return dispatch => {
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;

        let newRecord = null;
        let recordCreated = false;

        const createRecord = recordData => {
            const recordRequest = prepareThesisSubmission(recordData);
            dispatch({ type: actions.CREATE_RECORD_SAVING });
            return post(NEW_RECORD_API(), recordRequest);
        };

        // Helper to dispatch successful record creation with or without file upload issues
        // and return the new record
        const getRecord = fileUploadOrIssueFailed => {
            !preCreatedRecord.rek_pid &&
                dispatch({
                    type: actions.CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord,
                        fileUploadOrIssueFailed,
                    },
                });
            return newRecord;
        };

        /**
         * Step 1. Create new promise chain from record from earlier attempt or from POST-ing form values
         */
        const submission = !!preCreatedRecord.rek_pid
            ? Promise.resolve({ data: preCreatedRecord })
            : createRecord(data);

        /**
         * Steps 2. If creation succeeded, upload files. Otherwise, reject promise after recording in Sentry.
         * Throws exception is PID is not found
         */
        const onRecordCreationSuccess = response => {
            // save new record response for issue reporting
            newRecord = response.data;
            recordCreated = !!newRecord && !!newRecord.rek_pid;
            if (!recordCreated) {
                return Promise.reject(new Error('API did not return valid PID'));
            }
            return (
                (hasFilesToUpload &&
                    putUploadFiles(
                        response.data.rek_pid,
                        data.files.queue.filter(file => !fullyUploadedFiles.includes(file.name)),
                        dispatch,
                        formName,
                    )) ||
                Promise.resolve(getRecord(false))
            );
        };
        const onRecordCreationFailure = error => {
            Sentry.captureException(error);
            return Promise.reject(error);
        };

        /**
         * Step 3. Dispatch success if uploads succeeded. Otherwise, report issue.
         */
        const onFileUploadSuccess = response => {
            // Signal the successful upload
            hasFilesToUpload && dispatch({ type: actions.FILE_UPLOAD_COMPLETE });

            return (hasFilesToUpload && getRecord(false)) || Promise.resolve(response);
        };
        const onFileUploadFailure = error => {
            // If created record exists, it means only upload failed.
            if (recordCreated) {
                const record = getRecord(true);
                Sentry.captureException(error);

                // Do not report retry failures to Eventum
                if (!preCreatedRecord.rek_pid) {
                    return post(RECORDS_ISSUES_API({ pid: record.rek_pid }), {
                        issue: `The submitter had issues uploading files on this record: ${record.rek_pid}`,
                    });
                }
            }

            // Otherwise, it's the rejection from record creation failure. Pass it on.
            return Promise.reject(error);
        };

        /**
         * Step 4. Log if issue reporting failed
         */
        const onIssueReportSuccess = () => Promise.resolve(newRecord);
        const onIssueReportFailure = error => {
            Sentry.captureException(error);
            if (!recordCreated) {
                dispatch({
                    type: actions.CREATE_RECORD_FAILED,
                    payload: error.message,
                });
            }
            return (recordCreated && !preCreatedRecord.rek_pid && Promise.resolve(newRecord)) || Promise.reject(error);
        };

        return submission
            .then(onRecordCreationSuccess, onRecordCreationFailure)
            .then(onFileUploadSuccess, onFileUploadFailure)
            .then(onIssueReportSuccess, onIssueReportFailure);
    };
}

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
        'notesSection',
        'ntroSection',
        'filesSection',
        'securitySection',
        'reasonSection',
        'culturalInstitutionNoticeSection',
    ];

    return [
        {
            ...data.publication,
            ...{
                rek_genre: DOCUMENT_TYPES_LOOKUP[data.rek_display_type],
                // eslint-disable-next-line camelcase
                rek_genre_type: data.adminSection?.rek_subtype ?? null,
            },
            ...sanitiseData(data, makeReplacer(keys)),
            ...transformers.getAdminSectionSearchKeys(data.adminSection),
            ...transformers.getIdentifiersSectionSearchKeys(data.identifiersSection),
            ...transformers.getBibliographicSectionSearchKeys(
                data.bibliographicSection,
                // eslint-disable-next-line camelcase
                data.adminSection?.rek_subtype,
            ),
            ...transformers.getAuthorsSectionSearchKeys(data.authorsSection),
            ...transformers.getGrantInformationSectionSearchKeys(data.grantInformationSection),
            ...transformers.getNtroSectionSearchKeys(data.ntroSection),
            ...transformers.getFilesSectionSearchKeys(restFilesSection),
            ...transformers.getSecuritySectionSearchKeys(data.securitySection),
            ...transformers.getNotesSectionSearchKeys(data.notesSection),
            ...transformers.getReasonSectionSearchKeys(data.reasonSection),
            ...transformers.getDatastreamInfo(
                (data.publication || {}).fez_datastream_info || [],
                (data.filesSection || {}).fez_datastream_info || [],
                (data.securitySection || {}).dataStreams || [],
            ),
        },
        hasFilesToUpload,
        hasFilesToUpload
            ? transformers.getRecordFileAttachmentSearchKey(files.queue, {
                  ...data.publication,
                  ...data.adminSection,
              })
            : null,
    ];
};

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

export const updateCollection = data => {
    return dispatch => {
        dispatch({
            type: actions.COLLECTION_UPDATING,
        });

        const [patchRecordRequest] = getAdminRecordRequest(data);

        return Promise.resolve([])
            .then(() => put(EXISTING_COLLECTION_API({ pid: data.publication.rek_pid }), patchRecordRequest))
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

export const updateCommunity = data => {
    return dispatch => {
        dispatch({
            type: actions.COMMUNITY_UPDATING,
        });

        const [patchRecordRequest] = getAdminRecordRequest(data);

        return Promise.resolve([])
            .then(() => put(EXISTING_COMMUNITY_API({ pid: data.publication.rek_pid }), patchRecordRequest))
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
        const collections = transformers.getCollectionsOnRecordWithSecurity({
            ...data.publication,
            collections: data.adminSection.collections,
        });

        return Promise.resolve([])
            .then(() =>
                hasFilesToUpload
                    ? putUploadFiles(data.publication.rek_pid, files.queue, dispatch, '', collections)
                    : null,
            )
            .then(() =>
                hasFilesToUpload
                    ? put(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), {
                          ...patchRecordRequest,
                          ...patchFilesRequest,
                      })
                    : put(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), patchRecordRequest),
            )
            .then(response => {
                if (response.status === 201) {
                    dispatch({
                        type: actions.ADMIN_UPDATE_WORK_JOB_CREATED,
                        payload: {
                            pid: response,
                        },
                    });
                    return Promise.resolve(response);
                } else {
                    dispatch({
                        type: actions.ADMIN_UPDATE_WORK_SUCCESS,
                        payload: {
                            pid: response.data,
                        },
                    });
                    return Promise.resolve(response);
                }
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
            .then(() =>
                hasFilesToUpload
                    ? putUploadFiles(
                          newRecord.rek_pid,
                          files.queue,
                          dispatch,
                          '',
                          transformers.getCollectionsOnRecordWithSecurity({
                              ...newRecord,
                              collections: data.adminSection.collections,
                          }),
                      )
                    : newRecord,
            )
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

export const deleteAttachedFile = file => {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_DELETE_ATTACHED_FILE,
            payload: file,
        });
    };
};

export const renameAttachedFile = (prev, next) => {
    return dispatch => {
        dispatch({
            type: actions.ADMIN_RENAME_ATTACHED_FILE,
            payload: { prev, next },
        });
    };
};

export const unlockRecord = (pid, unlockRecordCallback) => {
    return dispatch => {
        dispatch({
            type: actions.UNLOCK_RECORD_INPROGRESS,
        });
        return patch(UNLOCK_RECORD_API({ pid }))
            .then(() => {
                dispatch({
                    type: actions.UNLOCK_RECORD_SUCCESS,
                });
                return Promise.resolve(true);
            })
            .then(unlockRecordCallback)
            .catch(error => {
                dispatch({
                    type: actions.UNLOCK_RECORD_FAILED,
                });
                return Promise.reject(error);
            });
    };
};

/**
 * Change author ID action
 *
 * @param {array} records
 * @param {object} data
 */
export const changeAuthorId = (records, data) => {
    const changeAuthorIdRequest = transformers.getChangeAuthorIdValues(records, data);
    return async dispatch => {
        dispatch({
            type: actions.CHANGE_AUTHOR_ID_INPROGRESS,
        });
        try {
            const response = await patch(NEW_RECORD_API(), changeAuthorIdRequest);
            dispatch({
                type: actions.CHANGE_AUTHOR_ID_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CHANGE_AUTHOR_ID_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

/**
 * Change display type action
 *
 * @param {array} records
 * @param {object} data
 * @param {bool} isBulkUpdate
 */
export const changeDisplayType = (records, data, isBulkUpdate = false) => {
    const changeDisplayTypeRequest = records.map(record => ({
        rek_pid: record.rek_pid,
        ...data,
        fez_record_search_key_herdc_code: {
            rek_herdc_code: null,
        },
    }));
    return async dispatch => {
        dispatch({
            type: actions.CHANGE_DISPLAY_TYPE_INPROGRESS,
        });
        try {
            const response = await patch(
                isBulkUpdate ? NEW_RECORD_API() : EXISTING_RECORD_API({ pid: records[0].rek_pid }),
                isBulkUpdate ? changeDisplayTypeRequest : changeDisplayTypeRequest[0],
            );
            dispatch({
                type: actions.CHANGE_DISPLAY_TYPE_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CHANGE_DISPLAY_TYPE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export const changeSearchKeyValue = (records, data) => {
    const changeSearchKeyValueRequest = transformers.getChangeSearchKeyValues(records, data);

    return async dispatch => {
        dispatch({
            type: actions.CHANGE_SEARCH_KEY_VALUE_INPROGRESS,
        });
        try {
            const response = await patch(NEW_RECORD_API(), changeSearchKeyValueRequest);
            dispatch({
                type: actions.CHANGE_SEARCH_KEY_VALUE_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CHANGE_SEARCH_KEY_VALUE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

/**
 * Change display type action
 *
 * @param {array} records
 * @param {object} data
 * @param {bool} isRemoveFrom
 */
export const copyToOrRemoveFromCollection = (records, data, isRemoveFrom = false) => {
    const copyToOrRemoveFromCollectionRequest = isRemoveFrom
        ? transformers.getRemoveFromCollectionData(records, data)
        : transformers.getCopyToCollectionData(records, data);
    return async dispatch => {
        dispatch({
            type: actions.CHANGE_COLLECTIONS_INPROGRESS,
        });
        try {
            const response = await patch(NEW_RECORD_API(), copyToOrRemoveFromCollectionRequest);
            dispatch({
                type: actions.CHANGE_COLLECTIONS_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CHANGE_COLLECTIONS_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export const copyToOrRemoveFromCommunity = (records, data, isRemoveFrom = false) => {
    const copyToOrRemoveFromCommunityRequest = isRemoveFrom
        ? transformers.getRemoveFromCommunityData(records, data)
        : transformers.getCopyToCommunityData(records, data);
    return async dispatch => {
        dispatch({
            type: actions.CHANGE_COMMUNITIES_INPROGRESS,
        });
        try {
            const response = await patch(NEW_RECORD_API(), copyToOrRemoveFromCommunityRequest);
            dispatch({
                type: actions.CHANGE_COMMUNITIES_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CHANGE_COMMUNITIES_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

/**
 * @param {array} records
 */
export const createOrUpdateDoi = records => {
    const request = transformers.createOrUpdateDoi(records);
    return async dispatch => {
        dispatch({
            type: actions.CREATE_OR_UPDATE_DOI_INPROGRESS,
        });
        try {
            const response = await patch(NEW_RECORD_API(), request);
            dispatch({
                type: actions.CREATE_OR_UPDATE_DOI_SUCCESS,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: actions.CREATE_OR_UPDATE_DOI_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};
