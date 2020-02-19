import moment from 'moment';
import { validation, viewRecordsConfig } from 'config';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ, ORG_TYPE_NOT_SET } from 'config/general';
import { default as globalLocale } from 'locale/global';

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
    return (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => ({
        nameAsPublished: (authors[order] || {}).rek_author,
        creatorRole: (authorRoles[order] || {}).rek_author_role || '',
        uqIdentifier: `${(authorIds[order] || {}).rek_author_id || 0}`,
        uqUsername: `${((authorIds[order] || {}).author || {}).aut_org_username ||
            ((authorIds[order] || {}).author || {}).aut_student_username ||
            ''} - ${(authorIds[order] || {}).rek_author_id || 0}`,
        aut_id: (authorIds[order] || {}).rek_author_id || 0,
        orgaff: (authorAffiliationNames[order] || {}).rek_author_affiliation_name || 'Missing',
        orgtype: `${(authorAffiliationTypes[order] || {}).rek_author_affiliation_type || ''}`,
        affiliation: (!!(authorIds[order] || {}).rek_author_id && AFFILIATION_TYPE_UQ) || AFFILIATION_TYPE_NOT_UQ,
        aut_org_username: ((authorIds[order] || {}).author || {}).aut_org_username || '',
        aut_student_username: ((authorIds[order] || {}).author || {}).aut_student_username || '',
        aut_display_name: (authorIds[order] || {}).rek_author_id_lookup || 0,
    }));
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

    return (record.fez_record_search_key_contributor || []).map(({ rek_contributor_order: order }) => ({
        nameAsPublished: (contributors[order] || {}).rek_contributor,
        creatorRole: '',
        uqIdentifier: `${(contributorIds[order] || {}).rek_contributor_id || 0}`,
        aut_id: (contributorIds[order] || {}).rek_contributor_id || 0,
    }));
};

export default {
    rek_title: {
        getValue: record => ({
            plainText: record.rek_title,
            htmlText: record.rek_formatted_title || record.rek_title,
        }),
    },
    rek_description: {
        getValue: record => ({
            plainText: record.rek_description,
            htmlText: record.rek_formatted_abstract || record.rek_description,
        }),
    },
    rek_herdc_notes: {
        getValue: record => ({
            plainText: (record || {}).rek_herdc_notes,
            htmlText: (record || {}).rek_herdc_notes,
        }),
    },
    internalNotes: {
        getValue: record => ({
            plainText: ((record || {}).fez_internal_notes || {}).ain_detail,
            htmlText: ((record || {}).fez_internal_notes || {}).ain_detail,
        }),
    },
    rek_date: {
        getValue: record => record.rek_date,
    },
    rek_subtype: {
        getValue: record => record.rek_subtype,
    },
    languages: {
        getValue: record => (record.fez_record_search_key_language || []).map(language => language.rek_language),
    },
    fez_record_search_key_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_journal_name }),
    },
    fez_record_search_key_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_book_title }),
    },
    fez_record_search_key_conference_name: {
        getValue: record => ({ ...record.fez_record_search_key_conference_name }),
    },
    fez_record_search_key_conference_location: {
        getValue: record => ({ ...record.fez_record_search_key_conference_location }),
    },
    fez_record_search_key_conference_dates: {
        getValue: record => ({ ...record.fez_record_search_key_conference_dates }),
    },
    fez_record_search_key_proceedings_title: {
        getValue: record => ({ ...record.fez_record_search_key_proceedings_title }),
    },
    fez_record_search_key_place_of_publication: {
        getValue: record => ({
            ...record.fez_record_search_key_place_of_publication,
        }),
    },
    fez_record_search_key_publisher: {
        getValue: record => ({ ...record.fez_record_search_key_publisher }),
    },
    fez_record_search_key_volume_number: {
        getValue: record => ({ ...record.fez_record_search_key_volume_number }),
    },
    fez_record_search_key_issue_number: {
        getValue: record => ({ ...record.fez_record_search_key_issue_number }),
    },
    fez_record_search_key_article_number: {
        getValue: record => ({ ...record.fez_record_search_key_article_number }),
    },
    fez_record_search_key_patent_number: {
        getValue: record => ({ ...record.fez_record_search_key_patent_number }),
    },
    fez_record_search_key_start_page: {
        getValue: record => ({ ...record.fez_record_search_key_start_page }),
    },
    fez_record_search_key_end_page: {
        getValue: record => ({ ...record.fez_record_search_key_end_page }),
    },
    fez_record_search_key_oa_embargo_days: {
        getValue: record => ({
            ...record.fez_record_search_key_oa_embargo_days,
        }),
    },
    fez_record_search_key_total_pages: {
        getValue: record => ({
            ...record.fez_record_search_key_total_pages,
        }),
    },
    collections: {
        getValue: record =>
            record.fez_record_search_key_ismemberof.map(collection => ({
                id: collection.rek_ismemberof,
                value: collection.rek_ismemberof_lookup,
            })),
    },
    issnField: {
        getValue: record =>
            (record.fez_record_search_key_issn || []).map(issn => {
                const ulrichsLink =
                    (!!issn.fez_ulrichs &&
                        !!issn.fez_ulrichs.ulr_title_id &&
                        globalLocale.global.ulrichsLink.externalUrl.replace('[id]', issn.fez_ulrichs.ulr_title_id)) ||
                    '';
                const ulrichsLinkText =
                    (!!issn.fez_ulrichs && !!issn.fez_ulrichs.ulr_title && issn.fez_ulrichs.ulr_title) || '';
                const sherpaRomeoLink =
                    (!!issn.fez_sherpa_romeo &&
                        !!issn.fez_sherpa_romeo.srm_issn &&
                        globalLocale.global.sherpaRomeoLink.externalUrl.replace(
                            '[issn]',
                            issn.fez_sherpa_romeo.srm_issn,
                        )) ||
                    '';
                const sherpaRomeoLinkText =
                    (!!issn.fez_sherpa_romeo &&
                        !!issn.fez_sherpa_romeo.srm_journal_name &&
                        issn.fez_sherpa_romeo.srm_journal_name) ||
                    '';
                return {
                    rek_order: issn.rek_issn_order,
                    rek_value: {
                        key: issn.rek_issn,
                        value: {
                            ulrichs: {
                                link: ulrichsLink,
                                linkText: ulrichsLinkText,
                                title: ulrichsLinkText,
                            },
                            sherpaRomeo: {
                                link: sherpaRomeoLink,
                                linkText: sherpaRomeoLinkText,
                                title: sherpaRomeoLinkText,
                            },
                        },
                    },
                };
            }),
    },
    fez_record_search_key_isbn: {
        getValue: record => [...record.fez_record_search_key_isbn],
    },
    fez_record_search_key_ismn: {
        getValue: record => [...record.fez_record_search_key_ismn],
    },
    fez_record_search_key_edition: {
        getValue: record => ({ ...record.fez_record_search_key_edition }),
    },
    fez_record_search_key_series: {
        getValue: record => ({ ...record.fez_record_search_key_series }),
    },
    fez_record_search_key_chapter_number: {
        getValue: record => ({ ...record.fez_record_search_key_chapter_number }),
    },
    subjects: {
        getValue: record =>
            (record.fez_record_search_key_subject || []).map(subject => ({
                rek_value: {
                    key: subject.rek_subject,
                    value: subject.rek_subject_lookup || `${subject.rek_subject} (cvo_id)`,
                },
                rek_order: subject.rek_subject_order,
            })),
    },
    fez_record_search_key_refereed_source: {
        getValue: record => ({ ...record.fez_record_search_key_refereed_source }),
    },
    languageOfJournalName: {
        getValue: record =>
            record.fez_record_search_key_language_of_journal_name.map(
                language => language.rek_language_of_journal_name,
            ),
    },
    fez_record_search_key_native_script_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_journal_name }),
    },
    fez_record_search_key_roman_script_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_journal_name }),
    },
    fez_record_search_key_translated_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_translated_journal_name }),
    },
    languageOfBookTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_book_title.map(language => language.rek_language_of_book_title),
    },
    fez_record_search_key_native_script_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_book_title }),
    },
    fez_record_search_key_roman_script_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_book_title }),
    },
    fez_record_search_key_translated_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_translated_book_title }),
    },
    fez_record_search_key_native_script_conference_name: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_conference_name }),
    },
    fez_record_search_key_roman_script_conference_name: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_conference_name }),
    },
    fez_record_search_key_translated_conference_name: {
        getValue: record => ({ ...record.fez_record_search_key_translated_conference_name }),
    },
    languageOfProceedingsTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_proceedings_title.map(
                language => language.rek_language_of_proceedings_title,
            ),
    },
    fez_record_search_key_native_script_proceedings_title: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_proceedings_title }),
    },
    fez_record_search_key_roman_script_proceedings_title: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_proceedings_title }),
    },
    fez_record_search_key_translated_proceedings_title: {
        getValue: record => ({ ...record.fez_record_search_key_translated_proceedings_title }),
    },
    languageOfTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_title.map(language => language.rek_language_of_title),
    },
    fez_record_search_key_native_script_title: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_title }),
    },
    fez_record_search_key_roman_script_title: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_title }),
    },
    fez_record_search_key_translated_title: {
        getValue: record => ({ ...record.fez_record_search_key_translated_title }),
    },
    fez_record_search_key_doi: {
        getValue: record => ({ ...record.fez_record_search_key_doi }),
    },
    fez_record_search_key_isi_loc: {
        getValue: record => ({ ...record.fez_record_search_key_isi_loc }),
    },
    fez_record_search_key_scopus_id: {
        getValue: record => ({ ...record.fez_record_search_key_scopus_id }),
    },
    fez_record_search_key_pubmed_id: {
        getValue: record => ({ ...record.fez_record_search_key_pubmed_id }),
    },
    fez_record_search_key_pubmed_central_id: {
        getValue: record => ({ ...record.fez_record_search_key_pubmed_central_id }),
    },
    rek_wok_doc_type: {
        getValue: record => record.rek_wok_doc_type,
    },
    rek_scopus_doc_type: {
        getValue: record => record.rek_scopus_doc_type,
    },
    rek_pubmed_doc_type: {
        getValue: record => record.rek_pubmed_doc_type,
    },
    links: {
        getValue: record =>
            (record.fez_record_search_key_link || []).map(link => ({
                rek_order: link.rek_link_order,
                rek_value: {
                    key: link.rek_link,
                    value: record.fez_record_search_key_link_description
                        .filter(description => description.rek_link_description_order === link.rek_link_order)
                        .reduce((pv, cv) => cv.rek_link_description, ''),
                },
            })),
    },
    authors: {
        getValue: authorsGetValue,
    },
    editors: {
        getValue: editorsGetValue,
    },
    contentIndicators: {
        getValue: record =>
            (record.fez_record_search_key_content_indicator || []).map(
                contentIndicator => contentIndicator.rek_content_indicator,
            ),
    },
    fez_record_search_key_herdc_code: {
        getValue: record => ({ ...record.fez_record_search_key_herdc_code }),
    },
    fez_record_search_key_herdc_status: {
        getValue: record => ({ ...record.fez_record_search_key_herdc_status }),
    },
    fez_record_search_key_institutional_status: {
        getValue: record => ({ ...record.fez_record_search_key_institutional_status }),
    },
    additionalNotes: {
        getValue: record => ({
            plainText: (record.fez_record_search_key_notes || {}).rek_notes || '',
            htmlText: (record.fez_record_search_key_notes || {}).rek_notes || '',
        }),
    },
    advisoryStatement: {
        getValue: record => ({
            plainText: (record.fez_record_search_key_advisory_statement || {}).rek_advisory_statement || '',
            htmlText: (record.fez_record_search_key_advisory_statement || {}).rek_advisory_statement || '',
        }),
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
                    [significance.rek_significance_order]: significance,
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

            return (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => {
                return {
                    rek_order: order,
                    rek_value: {
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
        },
    },
    qualityIndicators: {
        getValue: record => {
            return (record.fez_record_search_key_quality_indicator || []).map(item => item.rek_quality_indicator);
        },
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

            return record.fez_record_search_key_grant_agency.map(({ rek_grant_agency_order: order }) => ({
                grantAgencyName: grantAgencyNames[order].rek_grant_agency,
                grantId: (grantIds[order] || {}).rek_grant_id || '',
                grantAgencyType: (grantAgencyTypes[order] || {}).rek_grant_agency_type || ORG_TYPE_NOT_SET,
            }));
        },
    },
    files: {
        getValue: () => [],
    },
    fez_datastream_info: {
        getValue: record => {
            return (record.fez_datastream_info || []).filter(validation.isFileValid(viewRecordsConfig, true));
        },
    },
    fez_record_search_key_oa_status: {
        getValue: record => ({ ...record.fez_record_search_key_oa_status }),
    },
    fez_record_search_key_date_available: {
        getValue: record => {
            return (
                record.fez_record_search_key_date_available &&
                record.fez_record_search_key_date_available.rek_date_available && {
                    ...record.fez_record_search_key_date_available,
                    rek_date_available: moment(record.fez_record_search_key_date_available.rek_date_available).format(
                        'YYYY',
                    ),
                }
            );
        },
    },
    fez_record_search_key_date_recorded: {
        getValue: record => {
            return (
                record.fez_record_search_key_date_recorded &&
                record.fez_record_search_key_date_recorded.rek_date_recorded && {
                    ...record.fez_record_search_key_date_recorded,
                    rek_date_recorded: moment(record.fez_record_search_key_date_recorded.rek_date_recorded).format(
                        'YYYY',
                    ),
                }
            );
        },
    },
    rek_copyright: {
        getValue: record => record.rek_copyright,
    },
    fez_record_search_key_advisory_statement: {
        getValue: record => ({ ...record.fez_record_search_key_advisory_statement }),
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
        getValue: record => record.fez_record_search_key_alternate_genre.map(genre => genre.rek_alternate_genre),
    },
    fez_record_search_key_location: {
        getValue: record => [...record.fez_record_search_key_location],
    },
    fez_record_search_key_identifier: {
        getValue: record => [...record.fez_record_search_key_identifier],
    },
    fez_record_search_key_keywords: {
        getValue: record => [...record.fez_record_search_key_keywords],
    },
    fez_record_search_key_source: {
        getValue: record => ({ ...record.fez_record_search_key_source }),
    },
    fez_record_search_key_rights: {
        getValue: record => ({ ...record.fez_record_search_key_rights }),
    },
    fez_record_search_key_acknowledgements: {
        getValue: record => ({ ...record.fez_record_search_key_acknowledgements }),
    },
    fez_record_search_key_length: {
        getValue: record => ({ ...record.fez_record_search_key_length }),
    },
    fez_record_search_key_license_biblio: {
        getValue: record => ({ ...record.fez_record_search_key_license }),
    },
    fez_record_search_key_license_additional: {
        getValue: record => ({ ...record.fez_record_search_key_license }),
    },
    fez_record_search_key_original_format: {
        getValue: record => ({ ...record.fez_record_search_key_original_format }),
    },
    fez_record_search_key_transcript: {
        getValue: record => ({
            plainText: (record.fez_record_search_key_transcript || {}).rek_transcript,
            htmlText: (record.fez_record_search_key_transcript || {}).rek_transcript,
        }),
    },
    rek_genre: {
        getValue: record => record.rek_genre,
    },
    rek_genre_type: {
        getValue: record => record.rek_genre_type,
    },
    geoCoordinates: {
        getValue: record =>
            record.fez_record_search_key_geographic_area &&
            record.fez_record_search_key_geographic_area.length > 0 &&
            record.fez_record_search_key_geographic_area[0].rek_geographic_area,
    },
    fez_record_search_key_access_conditions: {
        getValue: record => ({ ...record.fez_record_search_key_access_conditions }),
    },
    fez_record_search_key_related_datasets: {
        getValue: record => ({ ...record.fez_record_search_key_related_datasets }),
    },
    fez_record_search_key_related_publications: {
        getValue: record => ({ ...record.fez_record_search_key_related_publications }),
    },
    fez_record_search_key_software_required: {
        getValue: record =>
            (record.fez_record_search_key_software_required || []).map(dataset => ({
                rek_software_required: dataset.rek_software_required,
                rek_software_required_order: dataset.rek_software_required_order,
            })),
    },
    fez_record_search_key_type_of_data: {
        getValue: record =>
            (record.fez_record_search_key_type_of_data || []).map(dataset => ({
                rek_type_of_data: dataset.rek_type_of_data,
                rek_type_of_data_order: dataset.rek_type_of_data_order,
            })),
    },
    fez_record_search_key_data_volume: {
        getValue: record => ({ ...record.fez_record_search_key_data_volume }),
    },
    fez_record_search_key_ands_collection_type: {
        getValue: record => ({ ...record.fez_record_search_key_ands_collection_type }),
    },
    fez_record_search_key_isdatasetof: {
        getValue: record =>
            (record.fez_record_search_key_isdatasetof || []).map(dataset => ({
                rek_isdatasetof: {
                    id: dataset.rek_isdatasetof,
                    value: dataset.rek_isdatasetof_lookup,
                },
                rek_isdatasetof_order: dataset.rek_isdatasetof_order,
            })),
    },
    contactName: {
        getValue: record => (record.fez_record_search_key_contributor[0] || {}).rek_contributor,
    },
    contactNameId: {
        getValue: record => ({
            id: (record.fez_record_search_key_contributor_id[0] || {}).rek_contributor_id,
            value: (record.fez_record_search_key_contributor_id[0] || {}).rek_contributor_id,
        }),
    },
    contactEmail: {
        getValue: record => record.fez_record_search_key_contact_details_email[0].rek_contact_details_email,
    },
    fez_record_search_key_project_name: {
        getValue: record => ({ ...record.fez_record_search_key_project_name }),
    },
    fez_record_search_key_project_description: {
        getValue: record => ({ ...record.fez_record_search_key_project_description }),
    },
    fez_record_search_key_project_id: {
        getValue: record => ({ ...(record.fez_record_search_key_project_id || {}) }),
    },
    fez_record_search_key_project_start_date: {
        getValue: record => ({ ...record.fez_record_search_key_project_start_date }),
    },
    fez_record_search_key_start_date: {
        getValue: record => ({ ...record.fez_record_search_key_start_date }),
    },
    fez_record_search_key_end_date: {
        getValue: record => ({ ...record.fez_record_search_key_end_date }),
    },
    fez_record_search_key_time_period_start_date: {
        getValue: record => ({ ...record.fez_record_search_key_time_period_start_date }),
    },
    fez_record_search_key_time_period_end_date: {
        getValue: record => ({ ...record.fez_record_search_key_time_period_end_date }),
    },
    fez_record_search_key_org_name: {
        getValue: record => ({ ...record.fez_record_search_key_org_name }),
    },
    fez_record_search_key_org_unit_name: {
        getValue: record => ({ ...record.fez_record_search_key_org_unit_name }),
    },
    fez_record_search_key_report_number: {
        getValue: record => ({ ...record.fez_record_search_key_report_number }),
    },
    fez_record_search_key_period: {
        getValue: record => [...record.fez_record_search_key_period],
    },
    fez_record_search_key_structural_systems: {
        getValue: record => [...record.fez_record_search_key_structural_systems],
    },
    fez_record_search_key_style: {
        getValue: record => [...record.fez_record_search_key_style],
    },
    fez_record_search_key_subcategory: {
        getValue: record => [...record.fez_record_search_key_subcategory],
    },
    fez_record_search_key_surrounding_features: {
        getValue: record => [...record.fez_record_search_key_surrounding_features],
    },
    fez_record_search_key_interior_features: {
        getValue: record => [...record.fez_record_search_key_interior_features],
    },
    fez_record_search_key_date_photo_taken: {
        getValue: record => ({ ...record.fez_record_search_key_date_photo_taken }),
    },
    fez_record_search_key_date_scanned: {
        getValue: record => ({ ...record.fez_record_search_key_date_scanned }),
    },
    fez_record_search_key_building_materials: {
        getValue: record => [...record.fez_record_search_key_building_materials],
    },
    fez_record_search_key_category: {
        getValue: record => [...record.fez_record_search_key_category],
    },
    fez_record_search_key_condition: {
        getValue: record => [...record.fez_record_search_key_condition],
    },
    fez_record_search_key_construction_date: {
        getValue: record => ({ ...record.fez_record_search_key_construction_date }),
    },
    fez_record_search_key_alternative_title: {
        getValue: record => [...record.fez_record_search_key_alternative_title],
    },
    fez_record_search_key_architectural_features: {
        getValue: record => [...record.fez_record_search_key_architectural_features],
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

            return (record.fez_record_search_key_architect_name || []).map(({ rek_architect_name_order: order }) => ({
                nameAsPublished: (architects[order] || {}).rek_architect_name,
                creatorRole: '',
                uqIdentifier: `${(architectIds[order] || {}).rek_architect_id || 0}`,
                aut_id: (architectIds[order] || {}).rek_architect_id || 0,
            }));
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

            return (record.fez_record_search_key_supervisor || []).map(({ rek_supervisor_order: order }) => ({
                nameAsPublished: (supervisors[order] || {}).rek_supervisor,
                creatorRole: '',
                uqIdentifier: `${(supervisorIds[order] || {}).rek_supervisor_id || 0}`,
                aut_id: (supervisorIds[order] || {}).rek_supervisor_id || 0,
            }));
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

            return (record.fez_record_search_key_creator_name || []).map(({ rek_creator_name_order: order }) => ({
                nameAsPublished: (creators[order] || {}).rek_creator_name,
                creatorRole: '',
                uqIdentifier: `${(creatorIds[order] || {}).rek_creator_id || 0}`,
                aut_id: (creatorIds[order] || {}).rek_creator_id || 0,
            }));
        },
    },
    fez_record_search_key_parent_publication: {
        getValue: record => ({ ...record.fez_record_search_key_parent_publication }),
    },
    fez_record_search_key_newspaper: {
        getValue: record => ({ ...record.fez_record_search_key_newspaper }),
    },
    fez_record_search_key_section: {
        getValue: record => ({ ...record.fez_record_search_key_section }),
    },
    fez_record_search_key_translated_newspaper: {
        getValue: record => ({ ...record.fez_record_search_key_translated_newspaper }),
    },
    fez_record_search_key_audience_size: {
        getValue: record => ({ ...record.fez_record_search_key_audience_size }),
    },
    fez_record_search_key_scale: {
        getValue: record => ({ ...record.fez_record_search_key_scale }),
    },
    fez_record_search_key_job_number: {
        getValue: record => ({ ...record.fez_record_search_key_job_number }),
    },
};
