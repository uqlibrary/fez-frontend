import {locale} from 'locale';

const moment = require('moment');

const pipe = (...functionsList) => values => functionsList.reduce((attributes, functionItem) => functionItem(attributes), values);

const getIssueValues = (data) => ({
    pid: data.publication.rek_pid,
    userName: data.author.aut_display_name,
    userId: data.author.aut_org_username,
    comments: data.comments
});

const getIssuesRequest = (text) => ({issue: text});

/* getFixIssueRequest - returns fix record issue request object
* @returns {Object} issue request
*/
export const getFixIssueRequest = pipe(getIssueValues, locale.issues.fixRecord, getIssuesRequest);


/* getRecordLinkSearchKey - returns link object formatted for record request
* NOTE: link description is required to save link
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
                rek_link_description: locale.global.defaultLinkDescription,
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
                rek_author: item.nameAsPublished,
                rek_author_order: index + 1
            }
        ))
    };
};

export const getRecordSupervisorsSearchKey = (supervisors) => {
    if (!supervisors || supervisors.length === 0) return {};
    return {
        fez_record_search_key_supervisor: supervisors.map((item, index) => (
            {
                rek_supervisor: item.nameAsPublished,
                rek_supervisor_order: index + 1
            }
        ))
    };
};

export const getRecordSubjectSearchKey = (subjects) => {
    if (!subjects || subjects.length === 0) return {};
    return {
        fez_record_search_key_subject: subjects.map((item, index) => (
            {
                rek_subject_id: item.rek_value.key,
                rek_subject_order: index + 1
            }
        ))
    };
};

/* getRecordAuthorsIdSearchKey - returns authors id object formatted for record request
* @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
* {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12}
* @returns {Object} formatted {fez_record_search_key_author_id} for record request
*/
export const getRecordAuthorsIdSearchKey = (authors, defaultAuthorId) => {
    // return empty object if all parameters are null
    if ((!authors || authors.length === 0) && !defaultAuthorId) return {};

    // return default author if provided
    if ((!authors || authors.length === 0) && defaultAuthorId) {
        return {
            fez_record_search_key_author_id: [
                {
                    rek_author_id: defaultAuthorId,
                    rek_author_id_order: 1
                }
            ]
        };
    }

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

/* unclaimRecordAuthorsIdSearchKey - returns authors id object formatted for record request
* @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
* {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12}
* @param {number} if of a current user in case authors is empty, return auhtors structure with a solo current author id
* @returns {Object} formatted {fez_record_search_key_author_id} for record request
*/
export const unclaimRecordAuthorsIdSearchKey = (authors, authorId) => {
    if (!authors || authors.length === 0) return {fez_record_search_key_author_id: []};
    return {
        fez_record_search_key_author_id: authors.map(
            (item, index) => (
                item.hasOwnProperty('rek_author_id') && item.hasOwnProperty('rek_author_id_order') && item.rek_author_id !== authorId
                    ? item
                    : {
                        rek_author_id: 0,
                        rek_author_id_order: item.hasOwnProperty('rek_author_id_order') ? item.rek_author_id_order : index + 1
                    }
            )
        )
    };
};

/* unclaimRecordContributorsIdSearchKey - returns contributors id object formatted for record request
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, contributorId: 410} or
 * {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:678742", rek_contributor_id: 683, rek_contributor_id_order: 12}
 * @returns {Object} formatted {fez_record_search_key_contributor_id} for record request
 */
export const unclaimRecordContributorsIdSearchKey = (contributors, contributorId) => {
    if (!contributors || contributors.length === 0) return {fez_record_search_key_contributor_id: []};
    return {
        fez_record_search_key_contributor_id: contributors.map(
            (item, index) => (
                item.hasOwnProperty('rek_contributor_id') && item.hasOwnProperty('rek_contributor_id_order') && item.rek_contributor_id !== contributorId
                    ? item
                    : {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: item.hasOwnProperty('rek_contributor_id_order') ? item.rek_contributor_id_order : index + 1
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
* @param {number} defaultAuthorId - if of a current user in case authors is empty, return contributors structure with a solo current author id
* @returns {Object} formatted {fez_record_search_key_contributor_id} for record request
*/
export const getRecordContributorsIdSearchKey = (authors, defaultAuthorId) => {
    // return empty object if all parameters are null
    if ((!authors || authors.length === 0) && !defaultAuthorId) return {};

    // return default author if provided
    if ((!authors || authors.length === 0) && defaultAuthorId) {
        return {
            fez_record_search_key_contributor_id: [
                {
                    rek_contributor_id: defaultAuthorId,
                    rek_contributor_id_order: 1
                }
            ]
        };
    }

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

/* getAuthorIdentifierPatchRequest - returns author patch request to update author identifier
* @param {string} authorIdentifierType - 'orcid', 'google_scholar', etc defined in config/general.js
* @param {string} userId - fez-authors id (eg 1671)
* @param {string} identifierId - new author identifier id
* @param {object} additional data
* @returns {Object} formatted for author patch request
*/
export const getAuthorIdentifierPatchRequest = (authorIdentifier, userId, identifierId, data = null) => {
    if (!authorIdentifier) return {};

    const patchData = {
        aut_id: userId,
        [authorIdentifier.searchKey]: identifierId
    };

    // additional data is set for ORCID
    if (authorIdentifier.name === 'orcid' && data) {
        patchData.fez_author_identifier_user_grants = {
            aig_name: data.scope,
            aig_expires: data.expires_in,
            aig_details: data.access_token,
            aig_details_dump: JSON.stringify(data),
        };
    }

    return patchData;
};
