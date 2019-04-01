import locale from 'locale/global';
import templates from 'locale/templates';

const moment = require('moment');

// Start helpers

const pipe = (...functionsList) => values => functionsList.reduce((attributes, functionItem) => functionItem(attributes), values);

const getIssueValues = (data) => {
    return {
        comments: data.comments || null,
        files: data.files && data.files.queue ? data.files.queue.map(item => item.name).toString().replace(/,/g, ', ') : null,
        link: data.rek_link || null,
    };
};

const getIssuesRequest = (text) => ({issue: text});

/* getFixIssueRequest - returns fix record issue request object
* @returns {Object} issue request
*/
export const getFixIssueRequest = pipe(getIssueValues, templates.issues.fixRecord, getIssuesRequest);

// End helpers

// Start Search Key Transformers
export const getSecurityPolicySearchKey = data => {
    if (!data) return null;

    const patchRequest = {};

    return patchRequest;
};

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

    const OPEN_ACCESS_ID = 9;
    const CLOSED_ACCESS_ID = 8;

    // if record already has files, add new files to the end of the list (for patch)
    const initialCount = record && record.fez_record_search_key_file_attachment_name ?
        record.fez_record_search_key_file_attachment_name.length : 0;
    const attachmentNames = files
        .map((item, index) => {
            return {
                rek_file_attachment_name: item.name,
                rek_file_attachment_name_order: initialCount + index + 1
            };
        });
    const attachmentEmbargoDates = files
        .map((item, index) => {
            if (!item.hasOwnProperty('date') || !item.date || moment(item.date).isSame(moment(), 'day')) return null;
            return {
                rek_file_attachment_embargo_date: moment(item.date).format(locale.global.embargoDateFormat),
                rek_file_attachment_embargo_date_order: initialCount + index + 1
            };
        })
        .filter((file) => (file !== null));
    const attachmentAccessConditions = files
        .map((item, index) => {
            if (!item.hasOwnProperty('access_condition_id')) return null;
            return {
                rek_file_attachment_access_condition: item.access_condition_id === OPEN_ACCESS_ID && (item.date && moment(item.date).isAfter())
                    ? CLOSED_ACCESS_ID
                    : item.access_condition_id,
                rek_file_attachment_access_condition_order: initialCount + index + 1
            };
        })
        .filter((file) => (file !== null));

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

export const getDatasetCreatorRolesSearchKey = (creators) => {
    if (!creators || creators.length === 0) return {};
    return {
        fez_record_search_key_author_role: creators.map((item, index) => (
            !!item.creatorRole && {
                rek_author_role: item.creatorRole,
                rek_author_role_order: index + 1
            } || {}
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
                        rek_author_id: (item.hasOwnProperty('aut_id') && item.aut_id) || (item.hasOwnProperty('authorId') && item.authorId) || 0,
                        rek_author_id_order: index + 1
                    }
            )
        )
    };
};

export const getRecordAuthorAffiliationSearchKey = (authors) => {
    if ((!authors || authors.length === 0)) return {};

    return {
        fez_record_search_key_author_affiliation_name: authors
            .map(
                (item, index) => (
                    {
                        rek_author_affiliation_name: item.orgaff || 'University of Queensland',
                        rek_author_affiliation_name_order: index + 1
                    }
                )
            )
    };
};

export const getRecordAuthorAffiliationTypeSearchKey = (authors) => {
    if ((!authors || authors.length === 0)) return {};

    return {
        fez_record_search_key_author_affiliation_type: authors
            .map(
                (item, index) => (
                    {
                        rek_author_affiliation_type: !!item.orgtype ? parseInt(item.orgtype, 10) : 453989,
                        rek_author_affiliation_type_order: index + 1
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

/* getRecordSubjectSearchKey - returns subjects for record request
 * @param {array} of objects in format {rek_value: {key: id, value: value}, rek_order}
 * @returns {Object} formatted {fez_record_search_key_subject} for record request
 */
export const getRecordSubjectSearchKey = (subject) => {
    if (!subject || subject.length === 0) return {};

    return {
        fez_record_search_key_subject: subject.map((item) => (
            {
                rek_subject: item.rek_value.key,
                rek_subject_order: item.rek_order
            }
        ))
    };
};

/*
* getAuthorIdentifierOrcidPatchRequest - returns author patch request to update author identifier with new orcid id
* @param {string} authorId - fez-authors id (eg 1671)
* @param {string} orcidId - new orcid id
* @param {object} additional data
* @returns {Object} formatted for author patch request
*/
export const getAuthorIdentifierOrcidPatchRequest = (authorId, orcidId, data = null) => {
    if (!authorId) return {};

    const patchRequest = {
        aut_id: authorId,
        aut_orcid_id: orcidId
    };

    // additional data is set for ORCID
    if (orcidId && data) {
        patchRequest.fez_author_identifier_user_grants = {
            aig_name: data.scope,
            aig_expires: data.expires_in,
            aig_details: data.access_token,
            aig_details_dump: JSON.stringify(data),
        };
    }

    return patchRequest;
};

export const getDatasetContactDetailSearchKeys = (contact) => {
    if (!contact) return {};
    return {
        fez_record_search_key_contributor: [{
            rek_contributor: contact.contactName,
            rek_contributor_id: null,
            rek_contributor_order: 1
        }],
        fez_record_search_key_contributor_id: [{
            rek_contributor_id: isNaN(contact.contactNameId.id) ? 0 : parseInt(contact.contactNameId.id, 10),
            rek_contributor_id_order: 1
        }],
        fez_record_search_key_contact_details_email: [{
            rek_contact_details_email: contact.contactEmail,
            rek_contact_details_email_order: 1
        }]
    };
};

export const getGeographicAreaSearchKey = (area = null) => {
    if (!area) return {};

    return {
        fez_record_search_key_geographic_area: [{
            rek_geographic_area: area,
            rek_geographic_area_order: 1
        }]
    };
};

export const getRecordAbstractDescriptionSearchKey = (abstract = null) => {
    if (!abstract) return {};

    return {
        rek_description: abstract.plainText,
        rek_formatted_abstract: abstract.htmlText
    };
};

export const getGrantsListSearchKey = (grants) => {
    if (!grants || grants.length === 0) return {};

    return {
        fez_record_search_key_grant_agency: [
            ...grants
                .map((item, index) => ({
                    rek_grant_agency: item.grantAgencyName || 'Not set',
                    rek_grant_agency_order: index + 1
                }))
        ],
        fez_record_search_key_grant_id: [
            ...grants
                .map((item, index) => ({
                    rek_grant_id: item.grantId || 'Not set',
                    rek_grant_id_order: index + 1
                }))
        ],
        fez_record_search_key_grant_agency_type: [
            ...grants
                .map((item, index) => ({
                    rek_grant_agency_type: parseInt(item.grantAgencyType, 10) || 454045, // Vocab value for "Not set"
                    rek_grant_agency_type_order: index + 1
                }))
        ]
    };
};

export const getLanguageSearchKey = (languages) => {
    if (!languages || languages.length === 0) return {};
    return {
        fez_record_search_key_language: [
            ...languages
                .map((item, index) => ({
                    rek_language: item,
                    rek_language_order: index + 1
                }))
        ]
    };
};

export const getNtroMetadataSearchKeys = (data) => {
    if (!data || !data.authors) {
        return {};
    }
    const selectedAuthorIdIndex = data.authors.findIndex(author => author.selected === true);
    const ntroMetadata = {};

    if (!!data.significance) {
        ntroMetadata.fez_record_search_key_significance = data.authors.map((item, index) =>{
            if (selectedAuthorIdIndex === index) {
                return {
                    rek_significance: data.significance,
                    rek_significance_order: selectedAuthorIdIndex + 1
                };
            } else {
                return {
                    rek_significance: 0,
                    rek_significance_order: index + 1
                };
            }
        });
    }

    if (!!data.impactStatement) {
        ntroMetadata.fez_record_search_key_creator_contribution_statement = data.authors.map((item, index) =>{
            if (selectedAuthorIdIndex === index) {
                return {
                    rek_creator_contribution_statement: data.impactStatement.htmlText,
                    rek_creator_contribution_statement_order: selectedAuthorIdIndex + 1
                };
            } else {
                return {
                    rek_creator_contribution_statement: locale.global.defaultContributorStatementMissing,
                    rek_creator_contribution_statement_order: index + 1
                };
            }
        });
    }

    if (!!data.qualityIndicators) {
        ntroMetadata.fez_record_search_key_quality_indicator = data.qualityIndicators.map((item, index) => ({
            rek_quality_indicator: item,
            rek_quality_indicator_order: index + 1
        }));
    }

    return ntroMetadata;
};
