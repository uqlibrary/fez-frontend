import locale from 'locale/global';
import templates from 'locale/templates';
import {
    FILE_ACCESS_CONDITION_CLOSED,
    FILE_ACCESS_CONDITION_INHERIT,
    FILE_ACCESS_CONDITION_OPEN,
    FILE_SECURITY_POLICY_ADMIN,
    FILE_SECURITY_POLICY_PUBLIC,
} from 'modules/SharedComponents/Toolbox/FileUploader';
import { contentIndicators } from '../config';
import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK, PLACEHOLDER_ISO8601_DATE } from '../config/general';
import { isSensitiveHandlingNoteTypeOther } from '../modules/SharedComponents/SensitiveHandlingNote/containers/SensitiveHandlingNoteField';
import { STATE_DELETED } from '../config/viewRecord';
import { isDerivative } from 'helpers/datastreams';
import { sanitizeDoi } from '../config/validation';

const moment = require('moment');

const pipe = (...functionsList) => values =>
    functionsList.reduce((attributes, functionItem) => functionItem(attributes), values);

export const getIssueValues = data => {
    const initialContentIndicators = (
        (data.publication && data.publication.fez_record_search_key_content_indicator) ||
        []
    ).map(item => item.rek_content_indicator);
    const newContentIndicators =
        !!data.contentIndicators &&
        data.contentIndicators.filter(item => initialContentIndicators.indexOf(item) === -1);
    const availableContentIndicators = contentIndicators(
        (data.publication && data.publication.rek_display_type) || null,
    );
    return {
        contentIndicators:
            (newContentIndicators &&
                newContentIndicators
                    .map(id => availableContentIndicators.find(item => item.value === id).text)
                    .join('; ')) ||
            null,
        comments: data.comments || null,
        files:
            data.files && data.files.queue
                ? data.files.queue
                      .map(item => item.name)
                      .toString()
                      .replace(/,/g, ', ')
                : null,
        link: data.rek_link || null,
    };
};

const getIssuesRequest = text => ({
    issue: text,
});

/**
 * getFixIssueRequest - returns fix record issue request object
 *
 * @returns {Object} issue request
 */
export const getFixIssueRequest = pipe(getIssueValues, templates.issues.fixRecord, getIssuesRequest);

/**
 * getClaimIssueRequest - returns claim record issue request object
 *
 * @returns {Object} issue request
 */
export const getClaimIssueRequest = pipe(getIssueValues, templates.issues.claimRecord, getIssuesRequest);

/* getRecordLinkSearchKey - returns link object formatted for record request
 * NOTE: link description is required to save link
 * @param {Object} form data may contain link attribute  {rek_link: {string}}
 * @returns {Object} formatted {fez_record_search_key_link*} for record request
 */
export const getRecordLinkSearchKey = data => {
    if (!data.rek_link) return null;

    return {
        fez_record_search_key_link: [
            {
                rek_link: data.rek_link,
                rek_link_order: 1,
            },
        ],
        fez_record_search_key_link_description: [
            {
                rek_link_description:
                    (!!data.rek_link_description && data.rek_link_description) || locale.global.defaultLinkDescription,
                rek_link_description_order: 1,
            },
        ],
    };
};

/* getRecordDoiSearchKey - returns doi object formatted for record request
 * @param {Object} form data may contain doi attribute  {fez_record_search_key_doi: {rek_doi: {string}}}
 * @returns {Object} formatted {fez_record_search_key_doi*} for record request
 */
export const getRecordDoiSearchKey = data => {
    if (!data.fez_record_search_key_doi?.rek_doi) return null;

    return {
        fez_record_search_key_doi: {
            rek_doi: sanitizeDoi(data.fez_record_search_key_doi.rek_doi),
        },
    };
};

/**
 * getCollectionsOnRecordWithSecurity - Copies security policy from existing collections to current collections list.
 * @param {object} record - The updated work object
 *
 * @return {array} The updated array of collections with security policy
 */
export const getCollectionsOnRecordWithSecurity = record =>
    ((!!record && record.collections) || []).map(collection => {
        if (collection.hasOwnProperty('rek_datastream_policy') || !record.rek_pid) {
            // Newly added collection or new record
            return collection;
        }
        // Existing collection. Retrieve security policy from search key
        const existingCollection = record.fez_record_search_key_ismemberof.find(
            collection2 => collection2.rek_ismemberof === collection.rek_pid,
        );
        return {
            ...collection,
            ...existingCollection.parent,
        };
    });

/**
 * getRecordFileAttachmentSearchKey - returns files object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: {string}}
 *
 * @returns {Object} formatted {fez_record_search_key_file_attachment_*} for record request
 */
export const getRecordFileAttachmentSearchKey = (files, record) => {
    if (!files || files.length === 0) return {};

    // if record already has files, add new files to the end of the list (for patch)
    const initialCount =
        record &&
        record.fez_record_search_key_file_attachment_name &&
        record.fez_record_search_key_file_attachment_name.length > 0
            ? record.fez_record_search_key_file_attachment_name[
                  record.fez_record_search_key_file_attachment_name.length - 1
              ].rek_file_attachment_name_order
            : 0;
    const attachmentNames = files.map((item, index) => ({
        rek_file_attachment_name: item.name,
        rek_file_attachment_name_order: initialCount + index + 1,
    }));
    // const attachmentSecurityPolicies = files.map((item, index) => ({
    //     rek_file_attachment_security_policy: item.security_policy,
    //     rek_file_attachment_security_policy_order: initialCount + index + 1,
    // }));
    const attachmentSecurityPolicies = files
        .map((item, index) => {
            if (!item.hasOwnProperty('security_policy')) return null;
            let accessCondition = item.security_policy;
            if (accessCondition === FILE_SECURITY_POLICY_PUBLIC && item.date && moment(item.date).isAfter()) {
                accessCondition = FILE_SECURITY_POLICY_ADMIN;
            }
            return {
                rek_file_attachment_security_policy: accessCondition,
                rek_file_attachment_security_policy_order: initialCount + index + 1,
            };
        })
        .filter(file => file !== null);

    const attachmentEmbargoDates = files
        .map((item, index) => {
            if (!item.hasOwnProperty('date') || !item.date || moment(item.date).isSame(moment(), 'day')) {
                return null;
            }
            return {
                rek_file_attachment_embargo_date: moment(item.date).format(locale.global.embargoDateFormat),
                rek_file_attachment_embargo_date_order: initialCount + index + 1,
            };
        })
        .filter(file => file !== null);
    const collections = getCollectionsOnRecordWithSecurity(record);
    const attachmentAccessConditions = files
        .map((item, index) => {
            if (!item.hasOwnProperty('access_condition_id')) return null;
            let accessCondition = item.access_condition_id;
            if (accessCondition === FILE_ACCESS_CONDITION_OPEN && item.date && moment(item.date).isAfter()) {
                accessCondition = FILE_ACCESS_CONDITION_CLOSED;
            } else if (accessCondition === FILE_ACCESS_CONDITION_INHERIT) {
                const parentPolicy = collections.reduce(
                    (policy, collection) =>
                        collection.rek_datastream_policy < policy ? collection.rek_datastream_policy : policy,
                    FILE_ACCESS_CONDITION_OPEN,
                );
                accessCondition = parentPolicy;
            }
            return {
                rek_file_attachment_access_condition: accessCondition,
                rek_file_attachment_access_condition_order: initialCount + index + 1,
            };
        })
        .filter(file => file !== null);

    return {
        fez_record_search_key_file_attachment_name: [
            ...((record && record.fez_record_search_key_file_attachment_name) || []),
            ...attachmentNames,
        ],
        fez_record_search_key_file_attachment_embargo_date: [
            ...((record && record.fez_record_search_key_file_attachment_embargo_date) || []),
            ...attachmentEmbargoDates,
        ],
        fez_record_search_key_file_attachment_access_condition: [
            ...((record && record.fez_record_search_key_file_attachment_access_condition) || []),
            ...attachmentAccessConditions,
        ],
        fez_record_search_key_file_attachment_security_policy: [
            ...((record && record.fez_record_search_key_file_attachment_security_policy) || []),
            ...attachmentSecurityPolicies,
        ],
    };
};

/**
 * getRecordAuthorsSearchKey - returns authors object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: {string}}
 *
 * @returns {Object} formatted {fez_record_search_key_author} for record request
 */
export const getRecordAuthorsSearchKey = authors => {
    if (!authors || authors.length === 0) {
        return {
            fez_record_search_key_author: [],
        };
    }

    return {
        fez_record_search_key_author: authors.map((item, index) => ({
            rek_author: item.nameAsPublished,
            rek_author_order: index + 1,
        })),
    };
};

export const getDatasetCreatorRolesSearchKey = creators => {
    if (!creators || creators.length === 0) return {};
    const creatorRoles = creators
        .map(
            (item, index) =>
                (!!item.creatorRole && {
                    rek_author_role: item.creatorRole,
                    rek_author_role_order: index + 1,
                }) ||
                {},
        )
        .filter(creator => !!creator.rek_author_role);

    return creatorRoles.length > 0
        ? {
              fez_record_search_key_author_role: creatorRoles,
          }
        : {};
};

export const getDatasetAuthorEmailsSearchKey = authors => {
    if (!authors || authors.length === 0) return {};
    const authorEmails = authors
        .map(
            (item, index) =>
                (!!item.email && {
                    rek_author_email: item.email,
                    rek_author_email_order: index + 1,
                }) ||
                {},
        )
        .filter(author => !!author.rek_author_email);

    return authorEmails.length > 0
        ? {
              fez_record_search_key_author_email: authorEmails,
          }
        : {};
};

export const getRecordSupervisorsSearchKey = supervisors => {
    if (!supervisors || supervisors.length === 0) return {};
    return {
        fez_record_search_key_supervisor: supervisors.map((item, index) => ({
            rek_supervisor: item.nameAsPublished,
            rek_supervisor_order: index + 1,
        })),
    };
};

/**
 * getRecordAuthorsIdSearchKey - returns authors id object formatted for record request
 *
 * @param {array} authors - array of objects in format
 * {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
 * {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12}
 *
 * @returns {Object} formatted {fez_record_search_key_author_id} for record request
 */
export const getRecordAuthorsIdSearchKey = (authors, defaultAuthorId) => {
    // return empty object if all parameters are null
    if ((!authors || authors.length === 0) && !defaultAuthorId) {
        return {
            fez_record_search_key_author_id: [],
        };
    }

    // return default author if provided
    if ((!authors || authors.length === 0) && defaultAuthorId) {
        return {
            fez_record_search_key_author_id: [
                {
                    rek_author_id: defaultAuthorId,
                    rek_author_id_order: 1,
                },
            ],
        };
    }

    return {
        fez_record_search_key_author_id: authors.map((item, index) =>
            item.hasOwnProperty('rek_author_id') && item.hasOwnProperty('rek_author_id_order')
                ? item
                : {
                      rek_author_id:
                          (item.hasOwnProperty('aut_id') && item.aut_id) ||
                          (item.hasOwnProperty('authorId') && item.authorId) ||
                          0,
                      rek_author_id_order: index + 1,
                  },
        ),
    };
};

export const getRecordAuthorAffiliationSearchKey = authors => {
    if (!authors || authors.length === 0) {
        return {
            fez_record_search_key_author_affiliation_id: [],
            fez_record_search_key_author_affiliation_name: [],
            fez_record_search_key_author_affiliation_country: [],
            fez_record_search_key_author_affiliation_full_address: [],
        };
    }

    return {
        fez_record_search_key_author_affiliation_name: authors.map((item, index) => ({
            rek_author_affiliation_name: !!item.orgaff && item.orgaff.length > 0 ? item.orgaff : 'Missing',
            rek_author_affiliation_name_order: index + 1,
        })),
    };
};

export const getRecordAuthorAffiliationTypeSearchKey = authors => {
    if (!authors || authors.length === 0) {
        return {
            fez_record_search_key_author_affiliation_type: [],
        };
    }

    return {
        fez_record_search_key_author_affiliation_type: authors.map((item, index) => ({
            rek_author_affiliation_type: (item.orgtype && parseInt(item.orgtype, 10)) || 0,
            rek_author_affiliation_type_order: index + 1,
        })),
    };
};

export const getRecordAuthorAffiliations = (authors, canHaveAffiliations = false) => {
    if (!authors || authors.length === 0 || !canHaveAffiliations) {
        return {
            fez_author_affiliation: canHaveAffiliations ? [] : null,
        };
    }

    return {
        fez_author_affiliation: authors.reduce((accumulated, author) => {
            const newArray = [...accumulated];
            author.affiliations?.forEach(affiliation => {
                // eslint-disable-next-line camelcase
                const { af_author_id, af_percent_affiliation, af_org_id, af_status } = affiliation;
                newArray.push({ af_author_id, af_percent_affiliation, af_org_id, af_status });
            });
            return newArray;
        }, []),
    };
};

/**
 * unclaimRecordAuthorsIdSearchKey - returns authors id object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
 * {rek_author_id_id: null, rek_author_id_pid: "UQ:678742", rek_author_id: 683, rek_author_id_order: 12}
 * @param {number} if of a current user in case authors is empty, return auhtors structure with a solo current author id
 *
 * @returns {Object} formatted {fez_record_search_key_author_id} for record request
 */
export const unclaimRecordAuthorsIdSearchKey = (authors, authorId) => {
    if (!authors || authors.length === 0) {
        return {
            fez_record_search_key_author_id: [],
        };
    }

    return {
        fez_record_search_key_author_id: authors.map((item, index) =>
            item.hasOwnProperty('rek_author_id') &&
            item.hasOwnProperty('rek_author_id_order') &&
            item.rek_author_id !== authorId
                ? item
                : {
                      rek_author_id: 0,
                      rek_author_id_order: item.hasOwnProperty('rek_author_id_order')
                          ? item.rek_author_id_order
                          : index + 1,
                  },
        ),
    };
};

/**
 * unclaimRecordContributorsIdSearchKey - returns contributors id object formatted for record request
 *
 * @param {array} of objects in format {
 *     nameAsPublished: "string",
 *     disabled: false,
 *     selected: true,
 *     contributorId: 410
 * } or
 * {
 *     rek_contributor_id_id: null,
 *     rek_contributor_id_pid: "UQ:678742",
 *     rek_contributor_id: 683,
 *     rek_contributor_id_order: 12
 * }
 *
 * @returns {Object} formatted {fez_record_search_key_contributor_id} for record request
 */
export const unclaimRecordContributorsIdSearchKey = (contributors, contributorId) => {
    if (!contributors || contributors.length === 0) {
        return {
            fez_record_search_key_contributor_id: [],
        };
    }

    return {
        fez_record_search_key_contributor_id: contributors.map((item, index) =>
            item.hasOwnProperty('rek_contributor_id') &&
            item.hasOwnProperty('rek_contributor_id_order') &&
            item.rek_contributor_id !== contributorId
                ? item
                : {
                      rek_contributor_id: 0,
                      rek_contributor_id_order: item.hasOwnProperty('rek_contributor_id_order')
                          ? item.rek_contributor_id_order
                          : index + 1,
                  },
        ),
    };
};

/**
 * getRecordContributorsSearchKey - returns editors object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410}
 *
 * @returns {Object} formatted {fez_record_search_key_contributor} for record request
 */
export const getRecordContributorsSearchKey = authors => {
    if (!authors || authors.length === 0) return {};

    return {
        fez_record_search_key_contributor: authors.map((item, index) => ({
            rek_contributor: item.nameAsPublished,
            rek_contributor_order: index + 1,
        })),
    };
};

/**
 * getRecordContributorsIdSearchKey - returns editors id object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410} or
 * {rek_contributor_id: 100, rek_contributor_id_order: 1}
 * @param {number} defaultAuthorId - if of a current user in case authors is empty, return contributors
 * structure with a solo current author id
 *
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
                    rek_contributor_id_order: 1,
                },
            ],
        };
    }

    return {
        fez_record_search_key_contributor_id: authors.map((item, index) =>
            item.hasOwnProperty('rek_contributor_id') && item.hasOwnProperty('rek_contributor_id_order')
                ? item
                : {
                      rek_contributor_id:
                          (item.hasOwnProperty('aut_id') && item.aut_id) ||
                          (item.hasOwnProperty('authorId') && item.authorId) ||
                          0,
                      rek_contributor_id_order: index + 1,
                  },
        ),
    };
};

/**
 * getRecordCreatorsSearchKey - returns editors object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410}
 *
 * @returns {Object} formatted {fez_record_search_key_creator} for record request
 */
export const getRecordCreatorsSearchKey = creators => {
    if (!creators || creators.length === 0) return {};

    return {
        fez_record_search_key_creator: creators.map((item, index) => ({
            rek_creator: item.nameAsPublished,
            rek_creator_order: index + 1,
        })),
    };
};

export const getRecordCreatorsIdSearchKey = creators => {
    // return empty object if all parameters are null
    if (!creators || creators.length === 0) return {};

    return {
        fez_record_search_key_creator_id: creators.map((item, index) =>
            item.hasOwnProperty('rek_creator_id') && item.hasOwnProperty('rek_creator_id_order')
                ? item
                : {
                      rek_creator_id:
                          (item.hasOwnProperty('aut_id') && item.aut_id) ||
                          (item.hasOwnProperty('authorId') && item.authorId) ||
                          0,
                      rek_creator_id_order: index + 1,
                  },
        ),
    };
};

/**
 * getRecordArchitectSearchKey - returns editors object formatted for record request
 *
 * @param {array} of objects in format {nameAsPublished: "string", disabled: false, selected: true, authorId: 410}
 *
 * @returns {Object} formatted {fez_record_search_key_architect} for record request
 */
export const getRecordArchitectsSearchKey = architects => {
    if (!architects || architects.length === 0) return {};

    return {
        fez_record_search_key_architect: architects.map((item, index) => ({
            rek_architect: item.nameAsPublished,
            rek_architect_order: index + 1,
        })),
    };
};

export const getRecordArchitectsIdSearchKey = architects => {
    // return empty object if all parameters are null
    if (!architects || architects.length === 0) return {};

    return {
        fez_record_search_key_architect_id: architects.map((item, index) =>
            item.hasOwnProperty('rek_architect_id') && item.hasOwnProperty('rek_architect_id_order')
                ? item
                : {
                      rek_architect_id:
                          (item.hasOwnProperty('aut_id') && item.aut_id) ||
                          (item.hasOwnProperty('authorId') && item.authorId) ||
                          0,
                      rek_architect_id_order: index + 1,
                  },
        ),
    };
};

/**
 * getRecordSubjectSearchKey - returns subjects for record request
 *
 * @param {array} of objects in format {rek_value: {key: id, value: value}, rek_order}
 *
 * @returns {Object} formatted {fez_record_search_key_subject} for record request
 */
export const getRecordSubjectSearchKey = subject => {
    if (!subject || subject.length === 0) return {};

    return {
        fez_record_search_key_subject: subject.map(item => ({
            rek_subject: item.rek_value.key,
            rek_subject_order: item.rek_order,
        })),
    };
};

/**
 * getAuthorIdentifierOrcidPatchRequest - returns author patch request to update author identifier with new orcid id
 *
 * @param {string} authorId - fez-authors id (eg 1671)
 * @param {string} orcidId - new orcid id
 * @param {object} additional data
 *
 * @returns {Object} formatted for author patch request
 */
export const getAuthorIdentifierOrcidPatchRequest = (authorId, orcidId, data = null) => {
    if (!authorId) return {};

    const patchRequest = {
        aut_id: authorId,
        aut_orcid_id: orcidId,
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

export const getDatasetContactDetailSearchKeys = contact => {
    if (!contact) return {};
    return {
        fez_record_search_key_contributor: [
            {
                rek_contributor: contact.contactName,
                rek_contributor_order: 1,
            },
        ],
        fez_record_search_key_contributor_id: [
            {
                rek_contributor_id: isNaN((contact.contactNameId || {}).id)
                    ? 0
                    : parseInt(contact.contactNameId.id, 10),
                rek_contributor_id_order: 1,
            },
        ],
        fez_record_search_key_contact_details_email: [
            {
                rek_contact_details_email: contact.contactEmail,
                rek_contact_details_email_order: 1,
            },
        ],
    };
};

export const getGeographicAreaSearchKey = (area = null) => {
    if (!area) return {};

    return {
        fez_record_search_key_geographic_area: [
            {
                rek_geographic_area: area,
                rek_geographic_area_order: 1,
            },
        ],
    };
};

export const getRecordAbstractDescriptionSearchKey = (abstract = null) => {
    if (!abstract) return {};

    return {
        rek_description: abstract.plainText,
        rek_formatted_abstract: abstract.htmlText,
    };
};

export const getGrantsListSearchKey = grants => {
    if (!grants || grants.length === 0) return {};

    return {
        fez_record_search_key_grant_agency: [
            ...grants.map((item, index) => ({
                rek_grant_agency: item.grantAgencyName || 'Not set',
                rek_grant_agency_order: index + 1,
            })),
        ],
        fez_record_search_key_grant_id: [
            ...grants.map((item, index) => ({
                rek_grant_id: item.grantId || 'Not set',
                rek_grant_id_order: index + 1,
            })),
        ],
        fez_record_search_key_grant_agency_type: [
            ...grants.map((item, index) => ({
                rek_grant_agency_type: parseInt(item.grantAgencyType, 10) || 454045, // Vocab value for "Not set"
                rek_grant_agency_type_order: index + 1,
            })),
        ],
    };
};

export const getLanguageSearchKey = languages => {
    if (!languages || languages.length === 0) {
        return {
            fez_record_search_key_language: [
                {
                    rek_language: 'eng',
                    rek_language_order: 1,
                },
            ],
        };
    }

    return {
        fez_record_search_key_language: [
            ...languages.map((item, index) => ({
                rek_language: item,
                rek_language_order: index + 1,
            })),
        ],
    };
};

export const getNtroMetadataSearchKeys = data => {
    if (!data) return {};
    const ntroMetadata = {};

    if (!!data.significance) {
        ntroMetadata.fez_record_search_key_significance = data.authors.map((item, index) => ({
            rek_significance: item.selected === true ? data.significance : 0,
            rek_significance_order: index + 1,
        }));
    }

    if (!!data.impactStatement) {
        ntroMetadata.fez_record_search_key_creator_contribution_statement = data.authors.map((item, index) => ({
            rek_creator_contribution_statement:
                item.selected === true ? data.impactStatement.htmlText : locale.global.defaultAuthorDataPlaceholder,
            rek_creator_contribution_statement_order: index + 1,
        }));
    }

    return ntroMetadata;
};

export const getQualityIndicatorSearchKey = (qualityIndicators = []) => {
    if (!qualityIndicators || qualityIndicators.length === 0) return {};

    return {
        fez_record_search_key_quality_indicator: qualityIndicators.map((item, index) => ({
            rek_quality_indicator: item,
            rek_quality_indicator_order: index + 1,
        })),
    };
};

export const getContentIndicatorSearchKey = (contentIndicators = []) => {
    if (!contentIndicators || contentIndicators.length === 0) return {};

    return {
        fez_record_search_key_content_indicator: contentIndicators.map((item, index) => ({
            rek_content_indicator: item,
            rek_content_indicator_order: index + 1,
        })),
    };
};

export const getAuthorOrder = data => {
    const author = data.publication.fez_record_search_key_author_id.filter(
        authorId => authorId.rek_author_id === data.author.aut_id,
    );

    // a missing author doesn't actually reach here, but if code is
    // changed and that doesnt catch it anymore, -1 here should force
    // handling, rather than silently introducing bad data
    return (author.length > 0 && author[0].rek_author_id_order) || -1;
};

export const getSearchKey = (searchKey, currentAuthorOrder, initialValues = [], value = null) => {
    if (!value) return {};

    const currentAuthorSearchKeyObject = {
        [searchKey.value.subkey]: value,
        [searchKey.value.orderKey]: currentAuthorOrder,
    };

    let authorOrderMatched = false;

    const searchKeyValues =
        initialValues.length > 0
            ? initialValues.map(initialValue => {
                  if (initialValue[searchKey.value.orderKey] === currentAuthorOrder) {
                      authorOrderMatched = true;
                      return currentAuthorSearchKeyObject;
                  } else {
                      return initialValue;
                  }
              })
            : [currentAuthorSearchKeyObject];

    return {
        [searchKey.key]:
            (initialValues.length > 0 && !authorOrderMatched && [...searchKeyValues, currentAuthorSearchKeyObject]) ||
            searchKeyValues,
    };
};

export const getSignificanceAndContributionStatementSearchKeys = data => {
    if (!data) return {};

    const currentAuthorOrder = getAuthorOrder(data);

    return {
        ...getSearchKey(
            {
                key: 'fez_record_search_key_significance',
                value: {
                    subkey: 'rek_significance',
                    orderKey: 'rek_significance_order',
                },
            },
            currentAuthorOrder,
            data.initialValues?.initialSignificance,
            data.significance,
        ),
        ...getSearchKey(
            {
                key: 'fez_record_search_key_creator_contribution_statement',
                value: {
                    subkey: 'rek_creator_contribution_statement',
                    orderKey: 'rek_creator_contribution_statement_order',
                },
            },
            currentAuthorOrder,
            data.initialValues?.initialContributionStatements,
            (data.impactStatement || {}).htmlText || (data.impactStatement || {}).plainText || null,
        ),
    };
};

export const getExternalSourceIdSearchKeys = data => {
    const result = {};
    const sourceKeys = {
        crossref: '_doi',
        scopus: '_scopus_id',
        wos: '_isi_loc',
    };
    !!data &&
        data.forEach(sourceObj => {
            const sourceKey = sourceKeys[sourceObj.source];
            const searchKey = `fez_record_search_key${sourceKey}`;
            const subKey = `rek${sourceKey}`;
            result[searchKey] = {};
            result[searchKey][subKey] = sourceObj.id;
        });

    return result;
};

export const getLinkSearchKey = (links = []) => {
    if (!links || links.length === 0) return {};

    return {
        fez_record_search_key_link: links.map(link => ({
            rek_link: link.rek_value.key,
            rek_link_order: link.rek_order,
        })),
    };
};

export const getLinkDescriptionSearchKey = (links = []) => {
    if (!links || links.length === 0) return {};

    return {
        fez_record_search_key_link_description: links.map(link => ({
            rek_link_description: link.rek_value.value,
            rek_link_description_order: link.rek_order,
        })),
    };
};

export const getRecordLocationSearchKey = locations => {
    if (!locations || locations.length === 0) return {};

    return {
        fez_record_search_key_location: locations.map(location => ({
            ...location,
        })),
    };
};

export const cleanDatastreamsObject = data => {
    // Clean the datastream object, where required.
    // If an admin has renamed an existing, attached file in the record there will be a
    // unique dsi_dsid_new key that we must do something with.
    //
    // IF the dsi_dsid === dsi_dsid_new, delete the latter
    // IF dsi_dsid !== dsi_dsid_new, swap values between keys.
    //
    // Background: the backend server will look for dsi_dsid_new when
    // processing the record and, if found, will proceed to rename
    // the original file and all derivatives with the value of
    // dsi_dsid_new.
    // The frontend, however, uses dsi_dsid to present filename information
    // on screen and with every update from the user, so a record of the original
    // is stored in _new for processing here.
    if (!!!data) return {};

    const newDatastreamObject = data.map(entry => {
        if (!entry.hasOwnProperty('dsi_dsid_new')) return entry;
        if (entry.dsi_dsid === entry.dsi_dsid_new) {
            delete entry.dsi_dsid_new;
        } else {
            const newFilename = entry.dsi_dsid;
            entry.dsi_dsid = entry.dsi_dsid_new;
            entry.dsi_dsid_new = newFilename;
        }
        return entry;
    });
    return newDatastreamObject;
};

const cleanBlankEntries = data => {
    // Clean out blanked fields
    // * For a single-child-key, to delete, remove the key from the payload sent to api
    // * For a many-child-key, where we want to end up with zero children (ie remove all),
    //   ditto: remove the key from the payload sent to api
    // * For a many-child-key, where we only want to remove some of its children,
    //   unset those children and re-number the order fields
    const entries = Object.entries(data);
    const keyPrefix = 'fez_record_search_key_';
    const subkeyPrefix = 'rek_';
    return entries
        .filter(item => {
            const [searchKeyName, values] = item;
            if (!searchKeyName.startsWith(keyPrefix)) {
                // keep all the base fez_record_seach_key fields
                return true;
            }

            if (Array.isArray(values) && values.length === 0) {
                // where a many-to-one child has no entries, remove it so API deletes the database record
                return false;
            }

            if (Object.keys(values).length === 0 && values.constructor === Object) {
                // eg fez_record_search_key_edition can return an empty object; remove this
                return false;
            }

            const valueFieldName = searchKeyName.replace(keyPrefix, subkeyPrefix);
            if (values[valueFieldName] === null || values[valueFieldName] === '') {
                // where the field has been cleared, remove so API deletes the database record
                return false;
            }

            // assume many-to-one children with blank entries have already been removed and reordered by, eg ListEditor

            return true;
        })
        .reduce((accum, [k, v]) => {
            // per https://stackoverflow.com/questions/49807489/reversing-an-object-entries-conversion
            accum[k] = v;
            return accum;
        }, {});
};

export const getIdentifiersSectionSearchKeys = (data = {}) => {
    const {
        fez_record_search_key_doi: doi,
        fez_record_search_key_isi_loc: isiLoc,
        fez_record_search_key_scopus_id: scopusId,
        fez_record_search_key_pubmed_id: pubmedId,
        fez_record_search_key_pubmed_central_id: pubmedCentralId,
        locations,
        rek_pubmed_doc_type: pubmedDocType,
        rek_scopus_doc_type: scopusDocType,
        rek_wok_doc_type: wosDocType,
        links,
        ...rest
    } = data;

    return {
        ...(!!pubmedDocType && pubmedDocType !== 'None' && pubmedDocType !== null
            ? { rek_pubmed_doc_type: pubmedDocType }
            : { rek_pubmed_doc_type: null }),
        ...(!!scopusDocType && scopusDocType !== 'None' && scopusDocType !== null
            ? { rek_scopus_doc_type: scopusDocType }
            : { rek_scopus_doc_type: null }),
        ...(!!wosDocType && wosDocType !== 'None' && wosDocType !== null
            ? { rek_wok_doc_type: wosDocType }
            : { rek_wok_doc_type: null }),
        ...(!!doi && doi.hasOwnProperty('rek_doi') ? { fez_record_search_key_doi: doi } : {}),
        ...(!!isiLoc && isiLoc.hasOwnProperty('rek_isi_loc') ? { fez_record_search_key_isi_loc: isiLoc } : {}),
        ...(!!scopusId && scopusId.hasOwnProperty('rek_scopus_id')
            ? { fez_record_search_key_scopus_id: scopusId }
            : {}),
        ...(!!pubmedId && pubmedId.hasOwnProperty('rek_pubmed_id')
            ? { fez_record_search_key_pubmed_id: pubmedId }
            : {}),
        ...(!!pubmedCentralId && pubmedCentralId.hasOwnProperty('rek_pubmed_central_id')
            ? { fez_record_search_key_pubmed_central_id: pubmedCentralId }
            : {}),
        ...getLinkSearchKey(links),
        ...getLinkDescriptionSearchKey(links),
        ...(!!locations ? getRecordLocationSearchKey(locations) : {}),
        ...cleanBlankEntries(rest),
    };
};

export const getRecordIsDatasetOfSearchKey = datasets => {
    if ((datasets || []).length === 0) return {};

    return {
        fez_record_search_key_isdatasetof: datasets.map(({ rek_isdatasetof: value, rek_isdatasetof_order: order }) => ({
            rek_isdatasetof: value.id || value,
            rek_isdatasetof_order: order,
        })),
    };
};

export const getRecordIsDerivationOfSearchKey = relatedPubs => {
    return relatedPubs.length === 0
        ? { fez_record_search_key_isderivationof: [] }
        : {
              fez_record_search_key_isderivationof: relatedPubs.map(
                  ({ rek_isderivationof: value, rek_isderivationof_order: order }) => ({
                      rek_isderivationof: value.id || value,
                      rek_isderivationof_order: order,
                  }),
              ),
          };
};

export const getFezMatchedJournalsKey = matchedJournal => {
    // No match was present in unedited record

    if (matchedJournal === undefined) {
        return {};
    }

    // Match was deleted
    if (!matchedJournal) {
        return {
            fez_matched_journals: null,
        };
    }

    // Match was untouched
    if (!!matchedJournal.mtj_status) {
        delete matchedJournal.id;
        delete matchedJournal.jnl_jid;
        return {
            fez_matched_journals: matchedJournal,
        };
    }

    // New match
    if (matchedJournal.jnl_jid && matchedJournal.jnl_jid !== 0) {
        return {
            fez_matched_journals: { mtj_jnl_id: matchedJournal.jnl_jid, mtj_status: 'M' },
        };
    } else {
        return {
            fez_matched_journals: null,
        };
    }
};

/**
 * @param data
 * @param rekSubtype
 * @return {string|string}
 */
export const getRekDate = (data, rekSubtype) => {
    if (
        // eslint-disable-next-line camelcase
        rekSubtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK &&
        // eslint-disable-next-line camelcase
        data.fez_record_search_key_project_start_date?.rek_project_start_date
    ) {
        // sync rek_date with rek_project_start_date
        return moment(data.fez_record_search_key_project_start_date.rek_project_start_date).format(
            'YYYY-MM-DD 00:00:00',
        );
    }
    // eslint-disable-next-line camelcase
    return !data.rek_date || !moment(data.rek_date).isValid()
        ? PLACEHOLDER_ISO8601_DATE
        : moment(data.rek_date).format('YYYY-MM-DD 00:00:00');
};

export const getBibliographicSectionSearchKeys = (data = {}, rekSubtype) => {
    const {
        rek_title: title,
        rek_description: description,
        languageOfTitle,
        languageOfBookTitle,
        languageOfProceedingsTitle,
        languageOfJournalName,
        languages,
        subjects,
        geoCoordinates,
        fez_record_search_key_date_available: dateAvailable,
        fez_record_search_key_date_recorded: dateRecorded,
        fez_record_search_key_end_date: endDate,
        fez_record_search_key_isderivationof: relatedPubs,
        fez_record_search_key_location: location,
        fez_record_search_key_isdatasetof: datasets,
        fez_record_search_key_related_datasets: relatedDatasets,
        fez_record_search_key_related_publications: relatedPublications,
        issns,
        fez_matched_journals: matchedJournal,
        ...rest
    } = data;
    return {
        ...cleanBlankEntries(rest),
        ...(!!relatedDatasets && relatedDatasets.hasOwnProperty('htmlText')
            ? {
                  fez_record_search_key_related_datasets: {
                      rek_related_datasets: relatedDatasets.htmlText,
                  },
              }
            : {}),
        ...(!!relatedPublications && relatedPublications.hasOwnProperty('htmlText')
            ? {
                  fez_record_search_key_related_publications: {
                      rek_related_publications: relatedPublications.htmlText,
                  },
              }
            : {}),
        rek_date: getRekDate(data, rekSubtype),
        ...(!!data.rek_genre_type ? { rek_subtype: data.rek_genre_type } : {}),
        ...(!!title && title.hasOwnProperty('plainText') ? { rek_title: title.plainText } : {}),
        ...(!!title && title.hasOwnProperty('htmlText') ? { rek_formatted_title: title.htmlText } : {}),
        ...{
            rek_description:
                (!!description && description.hasOwnProperty('plainText') && description.plainText) || null,
        },
        ...{
            rek_formatted_abstract:
                (!!description && description.hasOwnProperty('htmlText') && description.htmlText) || null,
        },
        ...(!!languageOfTitle
            ? {
                  fez_record_search_key_language_of_title: languageOfTitle.map((lang, index) => ({
                      rek_language_of_title: lang,
                      rek_language_of_title_order: index + 1,
                  })),
              }
            : {}),
        ...(!!languageOfBookTitle
            ? {
                  fez_record_search_key_language_of_book_title: languageOfBookTitle.map((lang, index) => ({
                      rek_language_of_book_title: lang,
                      rek_language_of_book_title_order: index + 1,
                  })),
              }
            : {}),
        ...(!!languageOfProceedingsTitle
            ? {
                  fez_record_search_key_language_of_proceedings_title: languageOfProceedingsTitle.map(
                      (lang, index) => ({
                          rek_language_of_proceedings_title: lang,
                          rek_language_of_proceedings_title_order: index + 1,
                      }),
                  ),
              }
            : {}),
        ...(!!languageOfJournalName
            ? {
                  fez_record_search_key_language_of_journal_name: languageOfJournalName.map((lang, index) => ({
                      rek_language_of_journal_name: lang,
                      rek_language_of_journal_name_order: index + 1,
                  })),
              }
            : {}),
        ...getLanguageSearchKey(languages),
        ...(!!dateAvailable && moment(dateAvailable.rek_date_available, 'YYYY').isValid()
            ? {
                  fez_record_search_key_date_available: {
                      ...dateAvailable,
                      rek_date_available: moment(dateAvailable.rek_date_available, 'YYYY').format(),
                  },
              }
            : {}),
        ...(!!dateRecorded && moment(dateRecorded.rek_date_recorded, 'YYYY-MM-DD').year() > 0
            ? {
                  fez_record_search_key_date_recorded: {
                      ...dateRecorded,
                  },
              }
            : {}),
        ...(!!endDate && !!endDate.rek_end_date ? { fez_record_search_key_end_date: { ...endDate } } : {}),
        ...getGeographicAreaSearchKey(geoCoordinates),
        ...getRecordSubjectSearchKey(subjects),
        ...(!!location && location.length === 1 && !!location[0].rek_location
            ? { fez_record_search_key_location: [...location] }
            : {}),
        ...(!!issns
            ? {
                  fez_record_search_key_issn: issns.map(({ rek_value: value, rek_order: order }) => ({
                      rek_issn: value.key || value,
                      rek_issn_order: order,
                  })),
              }
            : {}),
        ...(!!relatedPubs ? getRecordIsDerivationOfSearchKey(relatedPubs) : {}),
        ...getRecordIsDatasetOfSearchKey(datasets),
        ...getFezMatchedJournalsKey(matchedJournal),
    };
};

export const getNtroSectionSearchKeys = (data = {}) => {
    const { qualityIndicators, significanceAndContributionStatement, ...rest } = data;

    return {
        ...getQualityIndicatorSearchKey(qualityIndicators),
        ...(!!significanceAndContributionStatement && significanceAndContributionStatement.length > 0
            ? {
                  fez_record_search_key_significance: significanceAndContributionStatement.map(item => ({
                      rek_significance: item.rek_value.key,
                      rek_significance_order: item.rek_order,
                  })),
                  fez_record_search_key_creator_contribution_statement: significanceAndContributionStatement.map(
                      ({ rek_value: value, rek_order: order }) => ({
                          rek_creator_contribution_statement: value.value.htmlText || value.value.plainText,
                          rek_creator_contribution_statement_order: order,
                      }),
                  ),
              }
            : {}),
        ...cleanBlankEntries(rest),
    };
};

export const getGrantInformationSectionSearchKeys = grantsSection => ({
    ...getGrantsListSearchKey((grantsSection && grantsSection.grants) || []),
});

export const getAuthorsSearchKeys = (authors, canHaveAffiliations = false) => ({
    ...getRecordAuthorAffiliations(authors, canHaveAffiliations),
    ...getRecordAuthorsSearchKey(authors),
    ...getRecordAuthorsIdSearchKey(authors),
    ...getRecordAuthorAffiliationSearchKey(authors),
    ...getRecordAuthorAffiliationTypeSearchKey(authors),
    ...getDatasetCreatorRolesSearchKey(authors),
    ...getDatasetAuthorEmailsSearchKey(authors),
});

export const getContributorsSearchKeys = editors => ({
    ...getRecordContributorsSearchKey(editors),
    ...getRecordContributorsIdSearchKey(editors),
});

export const getCreatorsSearchKeys = creators => ({
    ...getRecordCreatorsSearchKey(creators),
    ...getRecordCreatorsIdSearchKey(creators),
});

export const getArchitectsSearchKeys = architects => ({
    ...getRecordArchitectsSearchKey(architects),
    ...getRecordArchitectsIdSearchKey(architects),
});

export const getAuthorsSectionSearchKeys = (data = {}) => {
    const { authors, authorsWithAffiliations, editors, supervisors, creators, architects } = data;

    return {
        ...(!!authors || !!authorsWithAffiliations
            ? getAuthorsSearchKeys(!!authors ? authors : authorsWithAffiliations, !!authorsWithAffiliations)
            : {}),
        ...(!!editors ? getContributorsSearchKeys(editors) : {}),
        ...(!!creators ? getCreatorsSearchKeys(creators) : {}),
        ...(!!architects ? getArchitectsSearchKeys(architects) : {}),
        ...(!!supervisors ? getRecordSupervisorsSearchKey(supervisors) : {}),
    };
};

export const getRecordIsMemberOfSearchKey = collections => {
    if ((collections || []).length === 0) return {};

    return {
        fez_record_search_key_ismemberof: collections.map((collection, index) => ({
            rek_ismemberof: !!collection.id ? collection.id : collection.rek_pid,
            rek_ismemberof_order: index + 1,
        })),
    };
};

export const getHerdcCodeSearchKey = record => {
    // return empty object if all parameters are null
    if (record.rek_herdc_code === '0' || (!!record.rek_herdc_code && record.rek_herdc_code.value === null)) {
        return {
            fez_record_search_key_herdc_code: {
                rek_herdc_code: null,
            },
        };
    }

    return {
        fez_record_search_key_herdc_code: {
            rek_herdc_code: record.rek_herdc_code,
        },
    };
};

export const getHerdcStatusSearchKey = record => {
    // return empty object if all parameters are null
    if (!!record.rek_herdc_status && record.rek_herdc_status.value === null) {
        return {
            fez_record_search_key_herdc_status: {
                rek_herdc_status: null,
            },
        };
    }

    return {
        fez_record_search_key_herdc_status: {
            rek_herdc_status: record.rek_herdc_status,
        },
    };
};

export const getOpenAccessStatusTypeSearchKey = record => {
    // return empty object if all parameters are null
    if (
        record.rek_oa_status_type === '0' ||
        (!!record.rek_oa_status_type && record.rek_oa_status_type.value === null)
    ) {
        return {
            fez_record_search_key_oa_status_type: null,
        };
    }

    return {
        fez_record_search_key_oa_status_type: {
            rek_oa_status_type: record.rek_oa_status_type,
        },
    };
};

export const getInstitutionalStatusSearchKey = record => {
    // return empty object if all parameters are null
    if (!!record.rek_institutional_status && record.rek_institutional_status.value === null) {
        return {
            fez_record_search_key_institutional_status: {},
        };
    }

    return {
        fez_record_search_key_institutional_status: {
            rek_institutional_status: record.rek_institutional_status,
        },
    };
};

export const getOpenAccessStatusSearchKey = record => {
    // return empty object if all parameters are null
    if (!!record.rek_oa_status && record.rek_oa_status.value === null) {
        return {
            fez_record_search_key_oa_status: {},
        };
    }

    return {
        fez_record_search_key_oa_status: {
            rek_oa_status: record.rek_oa_status,
        },
    };
};

export const getAdminSectionSearchKeys = (data = {}) => {
    const {
        collections,
        communities,
        contentIndicators,
        contactName,
        contactNameId,
        contactEmail,
        fez_record_search_key_institutional_status: institutionalStatus,
        fez_record_search_key_herdc_code: herdcCode,
        fez_record_search_key_herdc_status: herdcStatus,
        fez_record_search_key_oa_status: openAccessStatus,
        fez_record_search_key_oa_status_type: openAccessStatusType,
        fez_record_search_key_license: license,
        fez_record_search_key_end_date: endDate,
        ...rest
    } = data;
    return {
        ...getRecordIsMemberOfSearchKey(communities),
        ...getRecordIsMemberOfSearchKey(collections),
        ...getContentIndicatorSearchKey(contentIndicators),
        ...(!!contactName && !!contactEmail
            ? getDatasetContactDetailSearchKeys({ contactName, contactNameId, contactEmail })
            : {}),
        ...(!!institutionalStatus ? getInstitutionalStatusSearchKey(institutionalStatus) : {}),
        ...(!!herdcCode ? getHerdcCodeSearchKey(herdcCode) : {}),
        ...(!!herdcStatus ? getHerdcStatusSearchKey(herdcStatus) : {}),
        ...(!!openAccessStatus ? getOpenAccessStatusSearchKey(openAccessStatus) : {}),
        ...(!!openAccessStatusType ? getOpenAccessStatusTypeSearchKey(openAccessStatusType) : {}),
        ...{
            fez_record_search_key_license: {
                ...(!!license && !!license.rek_license && license.rek_license > 0 ? license : {}),
            },
        },
        ...(!!endDate && !!endDate.rek_end_date ? { fez_record_search_key_end_date: { ...endDate } } : {}),
        ...rest,
    };
};

export const getFilesSectionSearchKeys = data => {
    const { advisoryStatement, sensitiveHandlingNote, ...rest } = data;
    return !data.hasOwnProperty('advisoryStatement')
        ? { ...cleanBlankEntries(rest) }
        : {
              ...cleanBlankEntries(rest),
              ...(!!advisoryStatement && advisoryStatement.hasOwnProperty('htmlText') && !!advisoryStatement.htmlText
                  ? { fez_record_search_key_advisory_statement: { rek_advisory_statement: advisoryStatement.htmlText } }
                  : { fez_record_search_key_advisory_statement: null }),
              ...{
                  fez_record_search_key_sensitive_handling_note_id:
                      parseInt(sensitiveHandlingNote?.id, 10) > 0
                          ? {
                                rek_sensitive_handling_note_id: sensitiveHandlingNote?.id,
                            }
                          : null,
              },
              ...{
                  fez_record_search_key_sensitive_handling_note_other:
                      !!sensitiveHandlingNote?.other && isSensitiveHandlingNoteTypeOther(sensitiveHandlingNote?.id)
                          ? {
                                rek_sensitive_handling_note_other: sensitiveHandlingNote?.other,
                            }
                          : null,
              },
          };
};

export const getSecuritySectionSearchKeys = (data = {}) => {
    return {
        ...(!!data.hasOwnProperty('rek_security_policy') ? { rek_security_policy: data.rek_security_policy } : {}),
        ...(!!data.hasOwnProperty('rek_datastream_policy')
            ? { rek_datastream_policy: data.rek_datastream_policy }
            : {}),
        ...(!!data.hasOwnProperty('rek_security_inherited')
            ? { rek_security_inherited: data.rek_security_inherited }
            : {}),
    };
};

export const getDatastreamInfo = (
    originalDatastreams = [],
    dataStreamsFromFileSection = [],
    dataStreamsFromSecuritySection = [],
) => {
    const cleanedDataStreamsFromFileSection = cleanDatastreamsObject(dataStreamsFromFileSection);
    const dataStreamsLabelMap = cleanedDataStreamsFromFileSection.reduce(
        (map, ds) => ({
            ...map,
            [ds.dsi_dsid]: {
                dsi_label: ds.dsi_label,
                ...(ds.hasOwnProperty('dsi_dsid_new') ? { dsi_dsid_new: ds.dsi_dsid_new } : {}),
                dsi_embargo_date: ds.dsi_embargo_date,
                dsi_order: ds.dsi_order,
            },
        }),
        {},
    );

    const dataStreamsSecurityMap = dataStreamsFromSecuritySection.reduce(
        (map, ds) => ({
            ...map,
            [ds.dsi_dsid]: {
                dsi_security_inherited: ds.dsi_security_inherited,
                dsi_security_policy: ds.dsi_security_policy,
            },
        }),
        {},
    );

    return {
        ...{
            fez_datastream_info: originalDatastreams.map(dataStream => ({
                ...dataStream,
                ...(dataStreamsLabelMap.hasOwnProperty(dataStream.dsi_dsid)
                    ? { ...dataStreamsLabelMap[dataStream.dsi_dsid] }
                    : {
                          ...(!isDerivative(dataStream) ? { dsi_state: STATE_DELETED } : /* istanbul ignore next */ {}),
                      }), // only set delete status on non-derivatives
                ...(dataStreamsSecurityMap.hasOwnProperty(dataStream.dsi_dsid)
                    ? { ...dataStreamsSecurityMap[dataStream.dsi_dsid] }
                    : {}),
            })),
        },
    };
};

export const getNotesSectionSearchKeys = (data = {}) => {
    const { additionalNotes, internalNotes, rek_ci_notice_attribution_incomplete: ciNotices } = data;

    return {
        ...(!!additionalNotes && additionalNotes.hasOwnProperty('htmlText') && !!additionalNotes.htmlText
            ? {
                  fez_record_search_key_notes: { rek_notes: additionalNotes.htmlText },
                  fez_record_search_key_additional_notes: { rek_additional_notes: additionalNotes.htmlText },
              }
            : {}),
        ...(!!internalNotes && internalNotes.hasOwnProperty('htmlText')
            ? { fez_internal_notes: { ain_detail: internalNotes.htmlText } }
            : { fez_internal_notes: null }),

        ...(!(ciNotices === null || ciNotices === undefined)
            ? { rek_ci_notice_attribution_incomplete: !!ciNotices ? 1 : 0 }
            : {}),
    };
};

export const getThesisTypeSearchKey = type => ({
    fez_record_search_key_thesis_type: {
        rek_thesis_type: type,
    },
});

export const getReasonSectionSearchKeys = (data = {}) => {
    const { reason } = data;
    return {
        ...(!!reason ? { reason: reason } : {}),
    };
};

export const getChangeSearchKeyValues = (records, data) => {
    const { search_key: searchKey } = data;
    const [primaryKey, subKey] = searchKey.split('.');
    const getSearchKeyValue = (primaryKey, subKey, item) => {
        switch (primaryKey) {
            case 'fez_record_search_key_notes':
                return {
                    [primaryKey]: {
                        ...item,
                        [subKey]: `${(!!item && item[subKey]) || ''}${data[primaryKey][subKey]}`,
                    },
                };
            default:
                return {
                    [primaryKey]: !!subKey ? { ...item, ...data[primaryKey] } : data[primaryKey],
                };
        }
    };
    return records.map(({ rek_pid: pid, [primaryKey]: item }) => ({
        rek_pid: pid,
        ...getSearchKeyValue(primaryKey, subKey, item),
        edit_reason: data.edit_reason || '',
    }));
};

/**
 *
 * @param {array} records records that needs to be bulk updated
 * @param {array} data form data in the form of the object
 *
 * data = {
 *      search_author_by: 'author' || 'author_id',
 *      search_author: {
 *          author: 'Test, User',
 *          author_id: 123455,
 *      },
 *      rek_author_id: 222222,
 * }
 */
export const getChangeAuthorIdValues = (records, data) => {
    const { search_author_by: searchAuthorBy } = data;
    return records.map(record => {
        const [item] = record[`fez_record_search_key_${searchAuthorBy}`].filter(
            author => author[`rek_${searchAuthorBy}`] === data.search_author[searchAuthorBy],
        );

        if (!!item) {
            return {
                rek_pid: record.rek_pid,
                fez_record_search_key_author_id: record.fez_record_search_key_author_id.map((authorId, index) => ({
                    ...authorId,
                    ...(index + 1 === item[`rek_${searchAuthorBy}_order`]
                        ? { rek_author_id: data.rek_author_id, rek_author_id_order: index + 1 }
                        : {}),
                })),
            };
        } else {
            return {
                rek_pid: record.rek_pid,
            };
        }
    });
};

export const getRemoveFromCollectionData = (records, data) => {
    const selectedCollections = data.collections.map(collection => collection.rek_pid);
    return records.map(record => ({
        rek_pid: record.rek_pid,
        fez_record_search_key_ismemberof: record.fez_record_search_key_ismemberof.filter(
            collection => !selectedCollections.includes(collection.rek_ismemberof),
        ),
    }));
};

export const getRemoveFromCommunityData = (records, data) => {
    const selectedCommunities = data.communities.map(community => community.rek_pid);
    return records.map(record => ({
        rek_pid: record.rek_pid,
        fez_record_search_key_ismemberof: record.fez_record_search_key_ismemberof.filter(
            community => !selectedCommunities.includes(community.rek_ismemberof),
        ),
    }));
};

export const getCopyToCollectionData = (records, data) => {
    return records.map(record => {
        const existingCollectionPids = record.fez_record_search_key_ismemberof.map(
            existingCollection => existingCollection.rek_pid,
        );
        return {
            rek_pid: record.rek_pid,
            fez_record_search_key_ismemberof: [
                ...record.fez_record_search_key_ismemberof,
                ...data.collections
                    .filter(newCollection => existingCollectionPids.indexOf(newCollection.rek_pid) === -1)
                    .map((collection, index) => ({
                        rek_ismemberof: collection.rek_pid,
                        rek_ismemberof_order: record.fez_record_search_key_ismemberof.length + index + 1,
                    })),
            ],
        };
    });
};
export const getCopyToCommunityData = (records, data) => {
    return records.map(record => {
        const existingCommunityPids = record.fez_record_search_key_ismemberof.map(
            existingCommunity => existingCommunity.rek_pid,
        );
        return {
            rek_pid: record.rek_pid,
            fez_record_search_key_ismemberof: [
                ...record.fez_record_search_key_ismemberof,
                ...data.communities
                    .filter(newCommunity => existingCommunityPids.indexOf(newCommunity.rek_pid) === -1)
                    .map((community, index) => ({
                        rek_ismemberof: community.rek_pid,
                        rek_ismemberof_order: record.fez_record_search_key_ismemberof.length + index + 1,
                    })),
            ],
        };
    });
};
export const createOrUpdateDoi = records => {
    return records.map(record => {
        return {
            rek_pid: record.rek_pid,
            fez_record_search_key_doi: {
                rek_doi: true,
            },
        };
    });
};
