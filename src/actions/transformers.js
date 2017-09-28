import {locale} from 'config';

const moment = require('moment');

/* getClaimAttachmentsSearchKey - returns claim attachments object formatted for request object
* @param {Object} list of files in format {name: {string}, access_condition_id: {number}, date: {string}}
* @returns {Object} attachments formatted for claim request
*/
export const getClaimAttachmentsSearchKey = (files) => {
    if (!files || files.length === 0) return {};
    const request = {
        attachments: files.map((item) => {
            const request = {
                access_condition_id: item.access_condition_id,
                file: item.name,
            };

            if (item.date) {
                request.date = moment(item.date).format(locale.global.embargoDateFormat);
            }

            return request;
        })
    };
    return request;
};

/* getClaimRequest - returns claim request object
* @param {Object} form data for claim request
* @returns {Object} formatted for claim request
*/
export const getClaimRequest = (data) => {
    const claimRequest = {
        pid: data.publication.rek_pid,
        author_id: data.author.aut_id,
        ...(data.files && data.files.queue ? getClaimAttachmentsSearchKey(data.files.queue) : {})
    };

    if (data.comments) {
        claimRequest.comments = data.comments;
    }

    return claimRequest;
};

/* getRecordLinkSearchKey - returns link object formatted for record request
* @param {Object} form data may contain link attribute  {rek_link: {string}}
* @returns {Object} formatted {fez_record_search_key_link*} for record request
*/
export const getRecordLinkSearchKey = (data) => {
    if (!data.rek_link) return null;

    return {
        fez_record_search_key_link: [
            {
                rek_link: data.rek_link,
                rek_link_order: 1
            }
        ],
        fez_record_search_key_link_description: [
            {
                rek_link_description: data.rek_link,
                rek_link_description_order: 1
            }
        ]
    };
};

/* getRecordFileAttachmentSearchKey - returns files object formatted for record request
* @param {array} of objects in format {nameAsPublished: {string}}
* @returns {Object} formatted {fez_record_search_key_file_attachment_*} for record request
*/
export const getRecordFileAttachmentSearchKey = (files, record) => {
    if (!files || files.length === 0) return {};

    // if record already has files, add new files to the end of the list (for patch)
    const initialCount = record && record.fez_record_search_key_file_attachment_name ?
        record.fez_record_search_key_file_attachment_name.length : 0;
    const attachmentNames = files.map((item, index) => {
        return {
            rek_file_attachment_name: item.name,
            rek_file_attachment_name_order: initialCount + index + 1
        };
    });
    const attachmentEmbargoDates = files
        .map((item, index) => {
            if (!item.hasOwnProperty('date')) return null;
            return {
                rek_file_attachment_embargo_date: moment(item.date).format(locale.global.embargoDateFormat),
                rek_file_attachment_embargo_date_order: initialCount + index + 1
            };
        })
        .filter((file) => (file !== null));
    const attachmentAccessConditions = files.map((item, index) => {
        return {
            rek_file_attachment_access_condition: item.access_condition_id,
            rek_file_attachment_access_condition_order: initialCount + index + 1
        };
    });

    return {
        fez_record_search_key_file_attachment_name: [
            ...((record && record.fez_record_search_key_file_attachment_name) || []),
            ...attachmentNames
        ],
        fez_record_search_key_file_attachment_embargo_date: [
            ...((record && record.fez_record_search_key_file_attachment_embargo_date) || []),
            ...attachmentEmbargoDates
        ],
        fez_record_search_key_file_attachment_access_condition: [
            ...((record && record.fez_record_search_key_file_attachment_access_condition) || []),
            ...attachmentAccessConditions
        ]
    };
};

/* getRecordAuthorsSearchKey - returns authors object formatted for record request
* @param {array} of objects in format {nameAsPublished: {string}}
* @returns {Object} formatted {fez_record_search_key_author} for record request
*/
export const getRecordAuthorsSearchKey = (authors) => {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_author: authors.map((item, index) => (
            {
                rek_author_id: null,
                rek_author: item.nameAsPublished,
                rek_author_order: index + 1
            }
        ))
    };
};


/* getRecordAuthorsIdSearchKey - returns authors id object formatted for record request
* @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
* {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12}
* @returns {Object} formatted {fez_record_search_key_author_id} for record request
*/
export const getRecordAuthorsIdSearchKey = (authors) => {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_author_id: authors.map(
            (item, index) => (
                item.hasOwnProperty('rek_author_id') && item.hasOwnProperty('rek_author_id_order')
                    ? item
                    : {
                        rek_author_id: (item.hasOwnProperty('aut_id') && item.aut_id) || (item.hasOwnProperty('authorId') && item.authorId) || null,
                        rek_author_id_order: index + 1
                    }
            )
        )
    };
};

/* getRecordContributorsSearchKey - returns editors object formatted for record request
* @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410}
* @returns {Object} formatted {fez_record_search_key_contributor} for record request
*/
export const getRecordContributorsSearchKey = (authors) => {
    if (!authors || authors.length === 0) return {};

    return {
        fez_record_search_key_contributor: authors.map((item, index) => (
            {
                rek_contributor_id: null,
                rek_contributor: item.nameAsPublished,
                rek_contributor_order: index + 1
            }
        ))
    };
};

/* getRecordContributorsIdSearchKey - returns editors id object formatted for record request
* @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
* {rek_contributor_id: 100, rek_contributor_id_order: 1}
* @returns {Object} formatted {fez_record_search_key_contributor_id} for record request
*/
export const getRecordContributorsIdSearchKey = (authors) => {
    if (!authors || authors.length === 0) return {};
    return {
        fez_record_search_key_contributor_id: authors.map(
            (item, index) => (
                item.hasOwnProperty('rek_contributor_id') && item.hasOwnProperty('rek_contributor_id_order')
                    ? item
                    : {
                        rek_contributor_id: (item.hasOwnProperty('aut_id') && item.aut_id) || (item.hasOwnProperty('authorId') && item.authorId) || null,
                        rek_contributor_id_order: index + 1
                    }
            )
        )
    };
};
