import { generateCancelToken } from 'config';
import {
    MIME_TYPE_WHITELIST,
    FILE_ACCESS_CONDITION_CLOSED,
    FILE_ACCESS_CONDITION_OPEN,
    FILE_ACCESS_CONDITION_INHERIT,
    FILE_SECURITY_POLICY_PUBLIC,
} from 'modules/SharedComponents/Toolbox/FileUploader/config';
import * as fileUploadActions from 'modules/SharedComponents/Toolbox/FileUploader/actions';
import { FILE_UPLOAD_API } from './routes';
import { post, put } from './generic';
import * as Sentry from '@sentry/react';
import locale from 'locale/global';
const moment = require('moment');

const sanitiseDescription = description =>
    (description || '')
        .replace(/[[\u2011\u2012\u2013\u2014\u2015\u2017]/g, '-')
        .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]/g, "'")
        .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"');

export const getFileUploadMetadata = (file, collections) => {
    const securityInherited = !!file.access_condition_id && file.access_condition_id === FILE_ACCESS_CONDITION_INHERIT;
    let securityPolicy = file.security_policy;
    if (!!!securityPolicy) {
        // assume file_access is being set
        securityPolicy = file.access_condition_id;
        if (securityInherited) {
            const parentPolicy = collections.reduce(
                (policy, collection) =>
                    collection.rek_datastream_policy < policy ? collection.rek_datastream_policy : policy,
                FILE_ACCESS_CONDITION_OPEN,
            );
            securityPolicy = parentPolicy;
        } else if (
            file.access_condition_id === FILE_ACCESS_CONDITION_OPEN &&
            !!file.date &&
            moment(file.date).isAfter()
        ) {
            securityPolicy = FILE_ACCESS_CONDITION_CLOSED;
        }
    }
    const metadata = {
        dsi_security_inherited: securityInherited ? 1 : 0,
        dsi_security_policy: securityPolicy,
        ...(file.description && file.description.length > 0
            ? { dsi_label: sanitiseDescription(file.description) }
            : {}),
        ...((file.access_condition_id === FILE_ACCESS_CONDITION_OPEN ||
            file.security_policy === FILE_SECURITY_POLICY_PUBLIC) &&
        !moment(file.date).isSame(moment(), 'day')
            ? { dsi_embargo_date: moment(file.date).format(locale.global.embargoDateFormat) }
            : {}),
    };
    return metadata;
};

/**
 * Uploads a file directly into an S3 bucket via API
 *
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {object} file to be uploaded
 * @param {function} dispatch
 * @param {string} formName the name of the form being used to upload the file
 * @param {array} collections assigned to the record
 *
 * @returns {Promise}
 */
export function putUploadFile(pid, file, dispatch, formName, collections) {
    let retried = false;

    const uploadFile = () =>
        post(FILE_UPLOAD_API(), {
            Key: `${pid}/${file.name}`,
            Metadata: getFileUploadMetadata(file, collections),
        })
            .then(uploadUrl => {
                const extension = file.name.split('.').pop().toString().toLowerCase();
                const headers = {};
                if (MIME_TYPE_WHITELIST.hasOwnProperty(extension)) {
                    headers['Content-Type'] = MIME_TYPE_WHITELIST[extension];
                }
                const options = {
                    headers,
                    onUploadProgress: fileUploadActions.notifyFileUploadProgress(file.name, dispatch),
                    cancelToken: generateCancelToken().token,
                };
                const fileUrl = Array.isArray(uploadUrl) && uploadUrl.length > 0 ? uploadUrl[0] : uploadUrl;
                return put({ apiUrl: fileUrl }, file.fileData, options);
            })
            .then(uploadResponse => {
                fileUploadActions.notifyFileUploadProgress(file.name, dispatch)({ loaded: 1, total: 1 });
                fileUploadActions.markCompletedUpload(formName, file.name)(dispatch);
                return Promise.resolve(uploadResponse);
            })
            .catch(error => {
                if (process.env.ENABLE_LOG) Sentry.captureException(error);
                if (fileUploadActions) {
                    dispatch(fileUploadActions.notifyUploadFailed(file.name));
                }
                if (retried) {
                    return Promise.reject(error);
                } else {
                    retried = true;
                    if (fileUploadActions) {
                        dispatch(fileUploadActions.startFileUpload());
                    }
                    return uploadFile();
                }
            });
    return uploadFile();
}

/**
 * Uploads a list of files
 *
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {array} files to be uploaded
 * @param {function} dispatch
 * @param {string} formName the name of the form being used to upload the files
 * @param {array} collections assigned to the record
 *
 * @returns {Promise.all}
 */
export function putUploadFiles(pid, files, dispatch, formName = '', collections = []) {
    const filenameList = files && Array.isArray(files) && files.map(item => item.name);
    const checkIfDuplicateExists = w => {
        return new Set(w).size !== w.length;
    };
    const duplicateFileNames = checkIfDuplicateExists(filenameList);
    if (!!duplicateFileNames) {
        Sentry.captureMessage(`Duplicate files found when uploading files for PID ${pid} : ${filenameList}`);
    }
    dispatch(fileUploadActions.startFileUpload());
    const uploadFilesPromises = files.map(file => putUploadFile(pid, file, dispatch, formName, collections));
    return Promise.all(uploadFilesPromises);
}
