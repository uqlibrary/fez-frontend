import moment from 'moment';
import { validation, viewRecordsConfig } from 'config';
import { ORG_TYPE_NOT_SET } from 'config/general';

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
    rek_date: {
        getValue: record => record.rek_date,
    },
    rek_subtype: {
        getValue: record => record.rek_subtype,
    },
    languages: {
        getValue: record => record.fez_record_search_key_language.map(language => language.rek_language),
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
    fez_record_search_key_issn: {
        getValue: record => [...record.fez_record_search_key_issn],
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
            record.fez_record_search_key_subject.map(subject => ({
                rek_value: {
                    key: subject.rek_subject,
                    value: subject.rek_subject_lookup,
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
    languageOfConferenceName: {
        getValue: record =>
            record.fez_record_search_key_language_of_conference_name.map(
                language => language.rek_language_of_conference_name,
            ),
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
    languageOfTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_title.map(language => language.rek_language_of_title),
    },
    fez_record_search_key_native_script_title: {
        getValue: record => (record.fez_record_search_key_native_script_title || {}).rek_native_script_title,
    },
    fez_record_search_key_roman_script_title: {
        getValue: record => (record.fez_record_search_key_roman_script_title || {}).rek_roman_script_title,
    },
    fez_record_search_key_translated_title: {
        getValue: record => (record.fez_record_search_key_translated_title || {}).rek_translated_title,
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
        getValue: record => {
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

            return (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => ({
                nameAsPublished: (authors[order] || {}).rek_author,
                creatorRole: '',
                uqIdentifier: `${(authorIds[order] || {}).rek_author_id}` || '',
                authorId: (authorIds[order] || {}).rek_author_id || 0,
                orgaff: (authorAffiliationNames[order] || {}).rek_author_affiliation_name || 'Missing',
                orgtype: `${(authorAffiliationTypes[order] || {}).rek_author_affiliation_type}` || '',
                affiliation: (!!(authorIds[order] || {}).rek_author_id && 'UQ') || 'NotUQ',
            }));
        },
    },
    editors: {
        getValue: record => {
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
                uqIdentifier: `${(contributorIds[order] || {}).rek_contributor_id}` || '',
                authorId: (contributorIds[order] || {}).rek_contributor_id,
            }));
        },
    },
    contentIndicators: {
        getValue: record =>
            (record.fez_record_search_key_content_indicator || {}).map(
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
            plainText: (record.fez_record_search_key_notes || {}).rek_notes,
            htmlText: (record.fez_record_search_key_notes || {}).rek_notes,
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
                record.fez_record_search_key_date_available.rek_date_available &&
                moment(record.fez_record_search_key_date_available.rek_date_available).format('YYYY')
            );
        },
    },
    fez_record_search_key_date_recorded: {
        getValue: record => {
            return (
                record.fez_record_search_key_date_recorded &&
                record.fez_record_search_key_date_recorded.rek_date_recorded &&
                moment(record.fez_record_search_key_date_recorded.rek_date_recorded).format('YYYY')
            );
        },
    },
    rek_copyright: {
        getValue: record => record.rek_copyright,
    },
    rek_herdc_notes: {
        getValue: record => record.rek_herdc_notes,
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
    fez_record_search_key_license: {
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
    geoCoordinates: {
        getValue: record =>
            record.fez_record_search_key_geographic_area &&
            record.fez_record_search_key_geographic_area.length > 0 &&
            record.fez_record_search_key_geographic_area[0].rek_geographic_area,
    },
};
