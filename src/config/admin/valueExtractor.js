import moment from 'moment';
import { validation, viewRecordsConfig } from 'config';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ, ORG_TYPE_NOT_SET } from 'config/general';
import locale from 'locale/global';

const authorsGetValue = record => {
    const authors = (record.fez_record_search_key_author || []).reduce(
        (authorsObject, author) => ({
            ...authorsObject,
            [author.rek_author_order]: author,
        }),
        {},
    );

    const authorIds = (record.fez_record_search_key_author_id || []).reduce(
        (authorIdsObject, authorId) => ({
            ...authorIdsObject,
            [authorId.rek_author_id_order]: authorId,
        }),
        {},
    );

    const authorAffiliationNames = (record.fez_record_search_key_author_affiliation_name || []).reduce(
        (authorAffiliationsObject, authorAffiliationName) => ({
            ...authorAffiliationsObject,
            [authorAffiliationName.rek_author_affiliation_name_order]: authorAffiliationName,
        }),
        {},
    );

    const authorAffiliationTypes = (record.fez_record_search_key_author_affiliation_type || []).reduce(
        (authorAffiliationTypesObject, authorAffiliationType) => ({
            ...authorAffiliationTypesObject,
            [authorAffiliationType.rek_author_affiliation_type_order]: authorAffiliationType,
        }),
        {},
    );

    const authorRoles = (record.fez_record_search_key_author_role || []).reduce(
        (authorRolesObject, authorRole) => ({
            ...authorRolesObject,
            [authorRole.rek_author_role_order]: authorRole,
        }),
        {},
    );

    const authorEmails = (record.fez_record_search_key_author_email || []).reduce(
        (authorEmailsObject, authorEmail) => ({
            ...authorEmailsObject,
            [authorEmail.rek_author_email_order]: authorEmail,
        }),
        {},
    );

    const returnValue = (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => ({
        nameAsPublished: (authors[order] || {}).rek_author,
        creatorRole: (authorRoles[order] || {}).rek_author_role || '',
        uqIdentifier: `${(authorIds[order] || {}).rek_author_id || 0}`,
        uqUsername: `${((authorIds[order] || {}).author || {}).aut_org_username ||
            ((authorIds[order] || {}).author || {}).aut_student_username ||
            ((authorIds[order] || {}).author || {}).aut_ref_num ||
            ''}`,
        aut_id: (authorIds[order] || {}).rek_author_id || 0,
        orgaff: (authorAffiliationNames[order] || {}).rek_author_affiliation_name || 'Missing',
        orgtype: `${(authorAffiliationTypes[order] || {}).rek_author_affiliation_type || ''}`,
        affiliation:
            (authorAffiliationNames[order] || {}).rek_author_affiliation_name === locale.global.orgTitle
                ? AFFILIATION_TYPE_UQ
                : AFFILIATION_TYPE_NOT_UQ,
        email: (authorEmails[order] || {}).rek_author_email || '',
        aut_org_username: ((authorIds[order] || {}).author || {}).aut_org_username || '',
        aut_student_username: ((authorIds[order] || {}).author || {}).aut_student_username || '',
        aut_display_name: (authorIds[order] || {}).rek_author_id_lookup || 0,
    }));

    // delete record.fez_record_search_key_author_id;
    delete record.fez_record_search_key_author_affiliation_name;
    delete record.fez_record_search_key_author_affiliation_type;
    delete record.fez_record_search_key_author_role;

    return returnValue;
};

const editorsGetValue = record => {
    const contributors = (record.fez_record_search_key_contributor || []).reduce(
        (contributorsObject, contributor) => ({
            ...contributorsObject,
            [contributor.rek_contributor_order]: contributor,
        }),
        {},
    );

    const contributorIds = (record.fez_record_search_key_contributor_id || []).reduce(
        (contributorIdsObject, contributorId) => ({
            ...contributorIdsObject,
            [contributorId.rek_contributor_id_order]: contributorId,
        }),
        {},
    );

    const returnValue = (record.fez_record_search_key_contributor || []).map(({ rek_contributor_order: order }) => ({
        nameAsPublished: (contributors[order] || {}).rek_contributor,
        creatorRole: '',
        uqIdentifier: `${(contributorIds[order] || {}).rek_contributor_id || 0}`,
        aut_id: (contributorIds[order] || {}).rek_contributor_id || 0,
    }));

    delete record.fez_record_search_key_contributor;
    delete record.fez_record_search_key_contributor_id;

    return returnValue;
};

export const deleteKey = (record, searchKey) => {
    const skipDeleteForKeys = [
        'rek_date',
        'rek_title',
        'rek_subtype',
        'fez_record_search_key_oa_status',
        'fez_record_search_key_language',
    ];
    !skipDeleteForKeys.includes(searchKey) && delete (record || {})[searchKey];
};

export const getValueSearchKeyObject = (record, searchKey) => {
    const returnValue = { ...((record || {})[searchKey] || {}) };
    deleteKey(record, searchKey);
    return returnValue;
};

export const getValueSearchKeyArray = (record, searchKey) => {
    const returnValue = [...((record || {})[searchKey] || [])];
    deleteKey(record, searchKey);
    return returnValue;
};

export const getValueSearchKeyCKEditor = (record, plainTextSearchKey, htmlTextSearchKey) => {
    let returnValue;
    if (plainTextSearchKey.indexOf('.') >= 0) {
        const [primaryKey, subKey] = plainTextSearchKey.split('.');
        const [primaryHtmlKey, subHtmlKey] = htmlTextSearchKey.split('.');

        returnValue = {
            plainText: ((record || {})[primaryKey] || {})[subKey],
            htmlText: ((record || {})[primaryHtmlKey] || {})[subHtmlKey] || ((record || {})[primaryKey] || {})[subKey],
        };
        deleteKey(record, primaryKey);
        deleteKey(record, primaryHtmlKey);
    } else {
        returnValue = {
            plainText: (record || {})[plainTextSearchKey],
            htmlText: (record || {})[htmlTextSearchKey] || (record || {})[plainTextSearchKey],
        };

        deleteKey(record, plainTextSearchKey);
        deleteKey(record, htmlTextSearchKey);
    }

    if (!returnValue.plainText && !!returnValue.htmlText) {
        const tempDiv = document.createElement('div');

        // Keep line breaks when converting html to text
        tempDiv.innerHTML = returnValue.htmlText.replaceAll(/<(p|br ?\/?)>/g, '\n').replace(/^\n(.*)/, '$1');

        returnValue.plainText = tempDiv.innerText;
    }

    return returnValue;
};

export const getValueFromRekKey = (record, rekKey) => {
    const returnValue = record[rekKey];
    deleteKey(record, rekKey);
    return returnValue;
};

export const getValueSearchKeyRekValueList = (record, searchKey) => {
    let returnValue = [];

    if (searchKey.indexOf('.') >= 0) {
        const [primaryKey, subKey] = searchKey.split('.');

        returnValue = (record[primaryKey] || []).map(item => item[subKey]);
        deleteKey(record, primaryKey);
    }

    return returnValue;
};

export default {
    rek_title: {
        getValue: record => getValueSearchKeyCKEditor(record, 'rek_title', 'rek_formatted_title'),
    },
    rek_description: {
        getValue: record => getValueSearchKeyCKEditor(record, 'rek_description', 'rek_formatted_abstract'),
    },
    internalNotes: {
        getValue: record =>
            getValueSearchKeyCKEditor(record, 'fez_internal_notes.ain_detail', 'fez_internal_notes.ain_detail'),
    },
    rek_date: {
        getValue: record => getValueFromRekKey(record, 'rek_date'),
    },
    rek_subtype: {
        getValue: record => getValueFromRekKey(record, 'rek_subtype'),
    },
    languages: {
        getValue: record => getValueSearchKeyRekValueList(record, 'fez_record_search_key_language.rek_language'),
    },
    fez_record_search_key_journal_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_journal_name'),
    },
    fez_record_search_key_book_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_book_title'),
    },
    fez_record_search_key_conference_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_conference_name'),
    },
    fez_record_search_key_conference_location: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_conference_location'),
    },
    fez_record_search_key_conference_dates: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_conference_dates'),
    },
    fez_record_search_key_proceedings_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_proceedings_title'),
    },
    fez_record_search_key_place_of_publication: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_place_of_publication'),
    },
    fez_record_search_key_publisher: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_publisher'),
    },
    fez_record_search_key_volume_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_volume_number'),
    },
    fez_record_search_key_issue_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_issue_number'),
    },
    fez_record_search_key_article_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_article_number'),
    },
    fez_record_search_key_patent_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_patent_number'),
    },
    fez_record_search_key_start_page: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_start_page'),
    },
    fez_record_search_key_end_page: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_end_page'),
    },
    fez_record_search_key_oa_embargo_days: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_oa_embargo_days'),
    },
    fez_record_search_key_total_pages: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_total_pages'),
    },
    fez_record_search_key_collection_view_type: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_collection_view_type'),
    },

    communities: {
        getValue: record => {
            const uniqueCommunities = [];
            record.fez_record_search_key_ismemberof.forEach(community => {
                if (!uniqueCommunities.find(uniqueItem => community.rek_ismemberof === uniqueItem.rek_ismemberof)) {
                    uniqueCommunities.push(community);
                }
            });
            const returnValue = uniqueCommunities.map(community => ({
                rek_pid: community.rek_ismemberof,
                rek_title: community.rek_ismemberof_lookup,
                id: community.rek_ismemberof,
                value: community.rek_ismemberof_lookup,
            }));

            // delete record.fez_record_search_key_ismemberof;

            return returnValue;
        },
    },
    collections: {
        getValue: record => {
            const uniqueCollections = [];
            record.fez_record_search_key_ismemberof.forEach(collection => {
                if (!uniqueCollections.find(uniqueItem => collection.rek_ismemberof === uniqueItem.rek_ismemberof)) {
                    uniqueCollections.push(collection);
                }
            });
            const returnValue = uniqueCollections.map(collection => ({
                rek_pid: collection.rek_ismemberof,
                rek_title: collection.rek_ismemberof_lookup,
                id: collection.rek_ismemberof,
                value: collection.rek_ismemberof_lookup,
            }));

            // delete record.fez_record_search_key_ismemberof;

            return returnValue;
        },
    },
    issns: {
        getValue: record => {
            const returnValue = (record.fez_record_search_key_issn || []).map(issn => ({
                rek_order: issn.rek_issn_order,
                rek_value: {
                    key: issn.rek_issn,
                    value: {
                        fez_sherpa_romeo: issn.fez_sherpa_romeo,
                        fez_ulrichs: issn.fez_ulrichs,
                    },
                    hasPreload: true,
                },
            }));

            delete record.fez_record_search_key_issn;
            return returnValue;
        },
    },
    fez_record_search_key_isbn: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_isbn'),
    },
    fez_record_search_key_ismn: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_ismn'),
    },
    fez_record_search_key_isrc: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_isrc'),
    },
    fez_record_search_key_edition: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_edition'),
    },
    fez_record_search_key_series: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_series'),
    },
    fez_record_search_key_chapter_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_chapter_number'),
    },
    subjects: {
        getValue: record => {
            const returnValue = (record.fez_record_search_key_subject || []).map(subject => ({
                rek_value: {
                    key: subject.rek_subject,
                    value: subject.rek_subject_lookup || `${subject.rek_subject} (cvo_id)`,
                },
                rek_order: subject.rek_subject_order,
            }));

            delete record.fez_record_search_key_subject;

            return returnValue;
        },
    },
    fez_record_search_key_sustainable_development_goal: {
        getValue: record => {
            const returnValue = (record.fez_record_search_key_sustainable_development_goal || []).map(subject => ({
                rek_value: {
                    key: subject.rek_sustainable_development_goal,
                    value:
                        subject.rek_sustainable_development_goal_lookup ||
                        `${subject.rek_sustainable_development_goal} (cvo_id)`,
                },
                rek_order: subject.rek_sustainable_development_goal_order,
            }));

            delete record.fez_record_search_key_sustainable_development_goal;
            return returnValue;
        },
    },
    fez_record_search_key_refereed_source: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_refereed_source'),
    },
    languageOfJournalName: {
        getValue: record =>
            getValueSearchKeyRekValueList(
                record,
                'fez_record_search_key_language_of_journal_name.rek_language_of_journal_name',
            ),
    },
    fez_record_search_key_native_script_journal_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_native_script_journal_name'),
    },
    fez_record_search_key_roman_script_journal_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_roman_script_journal_name'),
    },
    fez_record_search_key_translated_journal_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_journal_name'),
    },
    languageOfBookTitle: {
        getValue: record =>
            getValueSearchKeyRekValueList(
                record,
                'fez_record_search_key_language_of_book_title.rek_language_of_book_title',
            ),
    },
    fez_record_search_key_native_script_book_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_native_script_book_title'),
    },
    fez_record_search_key_roman_script_book_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_roman_script_book_title'),
    },
    fez_record_search_key_translated_book_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_book_title'),
    },
    fez_record_search_key_native_script_conference_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_native_script_conference_name'),
    },
    fez_record_search_key_roman_script_conference_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_roman_script_conference_name'),
    },
    fez_record_search_key_translated_conference_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_conference_name'),
    },
    languageOfProceedingsTitle: {
        getValue: record =>
            getValueSearchKeyRekValueList(
                record,
                'fez_record_search_key_language_of_proceedings_title.rek_language_of_proceedings_title',
            ),
    },
    fez_record_search_key_native_script_proceedings_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_native_script_proceedings_title'),
    },
    fez_record_search_key_roman_script_proceedings_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_roman_script_proceedings_title'),
    },
    fez_record_search_key_translated_proceedings_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_proceedings_title'),
    },
    languageOfTitle: {
        getValue: record =>
            getValueSearchKeyRekValueList(record, 'fez_record_search_key_language_of_title.rek_language_of_title'),
    },
    fez_record_search_key_native_script_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_native_script_title'),
    },
    fez_record_search_key_roman_script_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_roman_script_title'),
    },
    fez_record_search_key_translated_title: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_title'),
    },
    fez_record_search_key_doi: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_doi'),
    },
    fez_record_search_key_isi_loc: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_isi_loc'),
    },
    fez_record_search_key_scopus_id: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_scopus_id'),
    },
    fez_record_search_key_pubmed_id: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_pubmed_id'),
    },
    fez_record_search_key_pubmed_central_id: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_pubmed_central_id'),
    },
    rek_wok_doc_type: {
        getValue: record => getValueFromRekKey(record, 'rek_wok_doc_type'),
    },
    rek_scopus_doc_type: {
        getValue: record => getValueFromRekKey(record, 'rek_scopus_doc_type'),
    },
    rek_pubmed_doc_type: {
        getValue: record => getValueFromRekKey(record, 'rek_pubmed_doc_type'),
    },
    links: {
        getValue: record => {
            const returnValue = (record.fez_record_search_key_link || []).map(link => ({
                rek_order: link.rek_link_order,
                rek_value: {
                    key: link.rek_link,
                    value: record.fez_record_search_key_link_description
                        .filter(description => description.rek_link_description_order === link.rek_link_order)
                        .reduce((pv, cv) => cv.rek_link_description, ''),
                },
            }));

            delete record.fez_record_search_key_link;
            delete record.fez_record_search_key_link_description;

            return returnValue;
        },
    },
    authors: {
        getValue: authorsGetValue,
    },
    authorsWithAffiliations: {
        getValue: authorsGetValue,
    },
    editors: {
        getValue: editorsGetValue,
    },
    contentIndicators: {
        getValue: record =>
            getValueSearchKeyRekValueList(record, 'fez_record_search_key_content_indicator.rek_content_indicator'),
    },
    fez_record_search_key_herdc_code: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_herdc_code'),
    },
    fez_record_search_key_herdc_status: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_herdc_status'),
    },
    fez_record_search_key_institutional_status: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_institutional_status'),
    },
    additionalNotes: {
        getValue: record =>
            getValueSearchKeyCKEditor(
                record,
                'fez_record_search_key_notes.rek_notes',
                'fez_record_search_key_notes.rek_notes',
            ),
    },
    advisoryStatement: {
        getValue: record =>
            getValueSearchKeyCKEditor(
                record,
                'fez_record_search_key_advisory_statement.rek_advisory_statement',
                'fez_record_search_key_advisory_statement.rek_advisory_statement',
            ),
    },
    sensitiveHandlingNote: {
        getValue: record => {
            return {
                id: getValueSearchKeyObject(record, 'fez_record_search_key_sensitive_handling_note_id')
                    .rek_sensitive_handling_note_id,
                other: getValueSearchKeyObject(record, 'fez_record_search_key_sensitive_handling_note_other')
                    .rek_sensitive_handling_note_other,
            };
        },
    },
    significanceAndContributionStatement: {
        getValue: record => {
            const authors = (record.fez_record_search_key_author || []).reduce(
                (authorsObject, author) => ({
                    ...authorsObject,
                    [author.rek_author_order]: author,
                }),
                {},
            );

            const significanceScales = (record.fez_record_search_key_significance || []).reduce(
                (significanceScalesObject, significance) => ({
                    ...significanceScalesObject,
                    [significance.rek_significance_order]: {
                        ...significance,
                        // // so we can determine if we should allow add or not
                        // numAuthors: record.fez_record_search_key_author?.length || 0,
                    },
                }),
                {},
            );

            const contributionStatements = (record.fez_record_search_key_creator_contribution_statement || []).reduce(
                (contributionStatementsObject, contributionStatement) => ({
                    ...contributionStatementsObject,
                    [contributionStatement.rek_creator_contribution_statement_order]: contributionStatement,
                }),
                {},
            );

            const returnValue = (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => {
                return {
                    rek_order: order,
                    rek_value: {
                        id: (significanceScales[order] || {}).rek_significance_id || 0,
                        // originalAuthorCount: (significanceScales[order] || {}).numAuthors || 0,
                        key: (significanceScales[order] || {}).rek_significance || 0,
                        value: {
                            plainText:
                                (contributionStatements[order] || {}).rek_creator_contribution_statement || 'Missing',
                            htmlText:
                                (contributionStatements[order] || {}).rek_creator_contribution_statement || 'Missing',
                        },
                        author: authors[order],
                    },
                };
            });

            // delete record.fez_record_search_key_author;
            // delete record.fez_record_search_key_significance;
            // delete record.fez_record_search_key_creator_contribution_statement;

            return returnValue;
        },
    },
    qualityIndicators: {
        getValue: record =>
            getValueSearchKeyRekValueList(record, 'fez_record_search_key_quality_indicator.rek_quality_indicator'),
    },
    grants: {
        getValue: record => {
            if (!record.fez_record_search_key_grant_agency) {
                return [];
            }
            const grantAgencyNames = (record.fez_record_search_key_grant_agency || []).reduce(
                (grantAgencyNamesObject, grantAgencyName) => ({
                    ...grantAgencyNamesObject,
                    [grantAgencyName.rek_grant_agency_order]: grantAgencyName,
                }),
                {},
            );
            const grantIds = (record.fez_record_search_key_grant_id || []).reduce(
                (grantIdsObject, grantId) => ({
                    ...grantIdsObject,
                    [grantId.rek_grant_id_order]: grantId,
                }),
                {},
            );
            const grantAgencyTypes = (record.fez_record_search_key_grant_agency_type || []).reduce(
                (grantAgencyTypesObject, grantAgencyType) => ({
                    ...grantAgencyTypesObject,
                    [grantAgencyType.rek_grant_agency_type_order]: grantAgencyType,
                }),
                {},
            );

            const returnValue = record.fez_record_search_key_grant_agency.map(({ rek_grant_agency_order: order }) => ({
                grantAgencyName: grantAgencyNames[order].rek_grant_agency,
                grantId: (grantIds[order] || {}).rek_grant_id || '',
                grantAgencyType: (grantAgencyTypes[order] || {}).rek_grant_agency_type || ORG_TYPE_NOT_SET,
            }));

            delete record.fez_record_search_key_grant_agency;
            delete record.fez_record_search_key_grant_id;
            delete record.fez_record_search_key_grant_agency_type;

            return returnValue;
        },
    },
    files: {
        getValue: () => [],
    },
    reason: {
        getValue: () => '',
    },
    rek_ci_notice_attribution_incomplete: {
        getValue: record => {
            return getValueFromRekKey(record, 'rek_ci_notice_attribution_incomplete') || null;
        },
    },
    fez_datastream_info: {
        getValue: record => {
            return (record.fez_datastream_info || []).filter(validation.isFileValid(viewRecordsConfig, true));
        },
    },
    fez_record_search_key_oa_status: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_oa_status'),
    },
    fez_record_search_key_oa_status_type: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_oa_status_type'),
    },
    fez_record_search_key_date_available: {
        getValue: record => {
            const returnValue = record.fez_record_search_key_date_available &&
                record.fez_record_search_key_date_available.rek_date_available && {
                    ...record.fez_record_search_key_date_available,
                    rek_date_available: moment(record.fez_record_search_key_date_available.rek_date_available).format(
                        'YYYY',
                    ),
                };
            delete record.fez_record_search_key_date_available;
            return returnValue;
        },
    },
    fez_record_search_key_date_recorded: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_date_recorded'),
    },
    rek_copyright: {
        getValue: record => getValueFromRekKey(record, 'rek_copyright'),
    },
    fez_record_search_key_isderivationof: {
        getValue: record =>
            (record.fez_record_search_key_isderivationof || []).map(derivation => ({
                rek_isderivationof: {
                    id: derivation.rek_isderivationof,
                    value: derivation.rek_isderivationof_lookup,
                },
                rek_isderivationof_order: derivation.rek_isderivationof_order,
            })),
    },
    fez_record_search_key_alternate_genre: {
        getValue: record =>
            getValueSearchKeyRekValueList(record, 'fez_record_search_key_alternate_genre.rek_alternate_genre'),
    },
    fez_record_search_key_location: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_location'),
    },
    locations: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_location'),
    },
    fez_record_search_key_identifier: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_identifier'),
    },
    fez_record_search_key_keywords: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_keywords'),
    },
    fez_record_search_key_source: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_source'),
    },
    fez_record_search_key_rights: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_rights'),
    },
    fez_record_search_key_acknowledgements: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_acknowledgements'),
    },
    fez_record_search_key_length: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_length'),
    },
    fez_record_search_key_license: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_license'),
    },
    fez_record_search_key_original_format: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_original_format'),
    },
    fez_record_search_key_transcript: {
        getValue: record =>
            getValueSearchKeyCKEditor(
                record,
                'fez_record_search_key_transcript.rek_transcript',
                'fez_record_search_key_transcript.rek_transcript',
            ),
    },
    rek_genre: {
        getValue: record => getValueFromRekKey(record, 'rek_genre'),
    },
    rek_genre_type: {
        getValue: record => getValueFromRekKey(record, 'rek_genre_type'),
    },
    geoCoordinates: {
        getValue: record => {
            const returnValue =
                record.fez_record_search_key_geographic_area &&
                record.fez_record_search_key_geographic_area.length > 0 &&
                record.fez_record_search_key_geographic_area[0].rek_geographic_area;

            delete record.fez_record_search_key_geographic_area;

            return returnValue;
        },
    },
    fez_record_search_key_access_conditions: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_access_conditions'),
    },
    fez_record_search_key_related_datasets: {
        getValue: record =>
            getValueSearchKeyCKEditor(
                record,
                'fez_record_search_key_related_datasets.rek_related_datasets',
                'fez_record_search_key_related_datasets.rek_related_datasets',
            ),
    },
    fez_record_search_key_related_publications: {
        getValue: record =>
            getValueSearchKeyCKEditor(
                record,
                'fez_record_search_key_related_publications.rek_related_publications',
                'fez_record_search_key_related_publications.rek_related_publications',
            ),
    },
    fez_record_search_key_software_required: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_software_required'),
    },
    fez_record_search_key_type_of_data: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_type_of_data'),
    },
    fez_record_search_key_data_volume: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_data_volume'),
    },
    fez_record_search_key_ands_collection_type: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_ands_collection_type'),
    },
    fez_record_search_key_isdatasetof: {
        getValue: record => {
            const returnValue = (record.fez_record_search_key_isdatasetof || []).map(dataset => ({
                rek_isdatasetof: {
                    id: dataset.rek_isdatasetof,
                    value: dataset.rek_isdatasetof_lookup,
                },
                rek_isdatasetof_order: dataset.rek_isdatasetof_order,
            }));

            delete record.fez_record_search_key_isdatasetof;

            return returnValue;
        },
    },
    contactName: {
        getValue: record => {
            const returnValue = ((record.fez_record_search_key_contributor || [{}])[0] || {}).rek_contributor;
            delete record.fez_record_search_key_contributor;
            return returnValue;
        },
    },
    contactNameId: {
        getValue: record => {
            const returnValue = {
                id: ((record.fez_record_search_key_contributor_id || [{}])[0] || {}).rek_contributor_id,
                value: ((record.fez_record_search_key_contributor_id || [{}])[0] || {}).rek_contributor_id,
            };

            delete record.fez_record_search_key_contributor_id;
            return returnValue;
        },
    },
    contactEmail: {
        getValue: record => {
            const returnValue = ((record.fez_record_search_key_contact_details_email || [{}])[0] || {})
                .rek_contact_details_email;
            delete record.fez_record_search_key_contact_details_email;
            return returnValue;
        },
    },
    fez_record_search_key_project_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_project_name'),
    },
    fez_record_search_key_project_description: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_project_description'),
    },
    fez_record_search_key_project_id: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_project_id'),
    },
    fez_record_search_key_project_start_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_project_start_date'),
    },
    fez_record_search_key_start_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_start_date'),
    },
    fez_record_search_key_end_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_end_date'),
    },
    fez_record_search_key_time_period_start_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_time_period_start_date'),
    },
    fez_record_search_key_time_period_end_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_time_period_end_date'),
    },
    fez_record_search_key_org_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_org_name'),
    },
    fez_record_search_key_org_unit_name: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_org_unit_name'),
    },
    fez_record_search_key_report_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_report_number'),
    },
    fez_record_search_key_period: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_period'),
    },
    fez_record_search_key_structural_systems: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_structural_systems'),
    },
    fez_record_search_key_style: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_style'),
    },
    fez_record_search_key_subcategory: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_subcategory'),
    },
    fez_record_search_key_surrounding_features: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_surrounding_features'),
    },
    fez_record_search_key_interior_features: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_interior_features'),
    },
    fez_record_search_key_date_photo_taken: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_date_photo_taken'),
    },
    fez_record_search_key_date_scanned: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_date_scanned'),
    },
    fez_record_search_key_building_materials: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_building_materials'),
    },
    fez_record_search_key_category: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_category'),
    },
    fez_record_search_key_condition: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_condition'),
    },
    fez_record_search_key_construction_date: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_construction_date'),
    },
    fez_record_search_key_alternative_title: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_alternative_title'),
    },
    fez_record_search_key_architectural_features: {
        getValue: record => getValueSearchKeyArray(record, 'fez_record_search_key_architectural_features'),
    },
    architects: {
        getValue: record => {
            const architects = (record.fez_record_search_key_architect_name || []).reduce(
                (architectsObject, architect) => ({
                    ...architectsObject,
                    [architect.rek_architect_name_order]: architect,
                }),
                {},
            );

            const architectIds = (record.fez_record_search_key_architect_id || []).reduce(
                (architectIdsObject, architectId) => ({
                    ...architectIdsObject,
                    [architectId.rek_architect_id_order]: architectId,
                }),
                {},
            );

            const returnValue = (record.fez_record_search_key_architect_name || []).map(
                ({ rek_architect_name_order: order }) => ({
                    nameAsPublished: (architects[order] || {}).rek_architect_name,
                    creatorRole: '',
                    uqIdentifier: `${(architectIds[order] || {}).rek_architect_id || 0}`,
                    aut_id: (architectIds[order] || {}).rek_architect_id || 0,
                }),
            );

            delete record.fez_record_search_key_architect_name;
            delete record.fez_record_search_key_architect_id;

            return returnValue;
        },
    },
    supervisors: {
        getValue: record => {
            const supervisors = (record.fez_record_search_key_supervisor || []).reduce(
                (supervisorsObject, supervisor) => ({
                    ...supervisorsObject,
                    [supervisor.rek_supervisor_order]: supervisor,
                }),
                {},
            );

            const supervisorIds = (record.fez_record_search_key_supervisor_id || []).reduce(
                (supervisorIdsObject, supervisorId) => ({
                    ...supervisorIdsObject,
                    [supervisorId.rek_supervisor_id_order]: supervisorId,
                }),
                {},
            );

            const returnValue = (record.fez_record_search_key_supervisor || []).map(
                ({ rek_supervisor_order: order }) => ({
                    nameAsPublished: (supervisors[order] || {}).rek_supervisor,
                    creatorRole: '',
                    uqIdentifier: `${(supervisorIds[order] || {}).rek_supervisor_id || 0}`,
                    aut_id: (supervisorIds[order] || {}).rek_supervisor_id || 0,
                }),
            );

            delete record.fez_record_search_key_supervisor;
            delete record.fez_record_search_key_supervisor_id;

            return returnValue;
        },
    },
    creators: {
        getValue: record => {
            const creators = (record.fez_record_search_key_creator_name || []).reduce(
                (creatorsObject, creator) => ({
                    ...creatorsObject,
                    [creator.rek_creator_name_order]: creator,
                }),
                {},
            );

            const creatorIds = (record.fez_record_search_key_creator_id || []).reduce(
                (creatorIdsObject, creatorId) => ({
                    ...creatorIdsObject,
                    [creatorId.rek_creator_id_order]: creatorId,
                }),
                {},
            );

            const returnValue = (record.fez_record_search_key_creator_name || []).map(
                ({ rek_creator_name_order: order }) => ({
                    nameAsPublished: (creators[order] || {}).rek_creator_name,
                    creatorRole: '',
                    uqIdentifier: `${(creatorIds[order] || {}).rek_creator_id || 0}`,
                    aut_id: (creatorIds[order] || {}).rek_creator_id || 0,
                }),
            );

            delete record.fez_record_search_key_creator_name;
            delete record.fez_record_search_key_creator_id;

            return returnValue;
        },
    },
    fez_record_search_key_parent_publication: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_parent_publication'),
    },
    fez_record_search_key_newspaper: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_newspaper'),
    },
    fez_record_search_key_section: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_section'),
    },
    fez_record_search_key_translated_newspaper: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_translated_newspaper'),
    },
    fez_record_search_key_audience_size: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_audience_size'),
    },
    fez_record_search_key_scale: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_scale'),
    },
    fez_record_search_key_job_number: {
        getValue: record => getValueSearchKeyObject(record, 'fez_record_search_key_job_number'),
    },
    fez_matched_journals: {
        getValue: record =>
            (record.fez_matched_journals && {
                ...record.fez_matched_journals,
                jnl_jid: record.fez_matched_journals.mtj_jnl_id,
                id: record.fez_matched_journals.mtj_jnl_id,
            }) ||
            {},
    },
};
