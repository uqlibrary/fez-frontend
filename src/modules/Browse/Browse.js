/* eslint-disable */
import React from 'react';
// import {PropTypes} from 'prop-types';
// import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';
import {ClaimPublicationForm} from 'modules/ClaimPublicationForm';

/*
<StandardPage title={title}>
    <StandardCard title={title} help={help}>
        {text}
    </StandardCard>
</StandardPage>
*/

export default function Browse() {
    const publication = {
        "rek_pid": "UQ:143417",
        "rek_title_xsdmf_id": 10588,
        "rek_title": "Comparing the biological and cultural inheritance of personality and social attitudes in the Virginia 30,000 study of twins and their relatives",
        "rek_description_xsdmf_id": 11441,
        "rek_description": "Measures of four dimensions of personality (Psychoticism, Extraversion, Neuroticism, and Lie scores) and six aspects of social attitudes (to sex, taxation, militarism, politics, religion and a general conservatism scale) were obtained by mailed questionnaire from 29 691 US subjects including adult twins (n = 14 761) their parents (n = 2360), their spouses (n = 4391), siblings (n = 3184) and adult children (n = 4800). After correction for the average effects of age, sex and source of sample, familial correlations were computed for 80 distinct biological and social relationships. The data allow for the estimation of the additive and non-additive effects of genes, assortative mating, vertical cultural inheritance and other non-parental effects of the shared environment on differences in personality and social attitudes. The interaction of genetic and environmental effects with sex may also be analyzed. Model-fitting analyses show that personality and social attitude measures differ markedly in major features of family resemblance. Additive and dominant genetic effects contribute to differences in both personality and attitudes, but the effects of the family environment, including vertical cultural transmission from parent to child, are much more marked for social attitudes than for personality. There is substantial assortative mating for social attitudes and almost none for personality. The causes of family resemblance depend significantly on sex for almost every variable studied. These findings clarify and extend the more tentative findings derived from previous twin, family and adoption studies.",
        "rek_display_type_xsdmf_id": 3673,
        "rek_display_type": 179,
        "rek_status_xsdmf_id": 3680,
        "rek_status": 2,
        "rek_date_xsdmf_id": 6386,
        "rek_date": "1999-01-01 00:00:00",
        "rek_object_type_xsdmf_id": 3674,
        "rek_object_type": 3,
        "rek_depositor_xsdmf_id": null,
        "rek_depositor": null,
        "rek_created_date_xsdmf_id": 3677,
        "rek_created_date": "2008-06-10 14:16:36",
        "rek_updated_date_xsdmf_id": 3678,
        "rek_updated_date": "2014-10-05 13:38:16",
        "rek_file_downloads": 0,
        "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Eaves, Lindon\" href=\"\/list\/author\/Eaves%2C+Lindon\/\">Eaves, Lindon<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Heath, Andrew\" href=\"\/list\/author\/Heath%2C+Andrew\/\">Heath, Andrew<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Martin, Nicholas\" href=\"\/list\/author\/Martin%2C+Nicholas\/\">Martin, Nicholas<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Maes, Hermine\" href=\"\/list\/author\/Maes%2C+Hermine\/\">Maes, Hermine<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Neale, Michael\" href=\"\/list\/author\/Neale%2C+Michael\/\">Neale, Michael<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Kendler, Kenneth\" href=\"\/list\/author\/Kendler%2C+Kenneth\/\">Kendler, Kenneth<\/a>, <a class=\"author_id_link\" title=\"Browse by Author ID for Kirk, Katherine\" href=\"\/list\/author_id\/81987\/\">Kirk, Katherine<\/a> and <a class=\"citation_author_name\" title=\"Browse by Author Name for Corey, Linda\" href=\"\/list\/author\/Corey%2C+Linda\/\">Corey, Linda<\/a> (<span class=\"citation_date\">1999<\/span>) <a class=\"citation_title\" title=\"Click to view Journal Article: Comparing the biological and cultural inheritance of personality and social attitudes in the Virginia 30,000 study of twins and their relatives\" href=\"\/view\/UQ:143417\">Comparing the biological and cultural inheritance of personality and social attitudes in the Virginia 30,000 study of twins and their relatives<\/a>. <i><span class=\"citation_journal_name\">Twin Research<\/span><\/i>, <i><span class=\"citation_volume_number\">2<\/span><\/i> <span class=\"citation_issue_number\">2<\/span>: <span class=\"citation_start_page\">62<\/span>-<span class=\"citation_end_page\">80<\/span>.",
        "rek_genre_xsdmf_id": 7207,
        "rek_genre": "Journal Article",
        "rek_genre_type_xsdmf_id": null,
        "rek_genre_type": null,
        "rek_formatted_title_xsdmf_id": null,
        "rek_formatted_title": null,
        "rek_formatted_abstract_xsdmf_id": null,
        "rek_formatted_abstract": null,
        "rek_depositor_affiliation_xsdmf_id": 11881,
        "rek_depositor_affiliation": 898,
        "rek_thomson_citation_count": null,
        "rek_thomson_citation_count_xsdmf_id": null,
        "rek_subtype_xsdmf_id": null,
        "rek_subtype": null,
        "rek_scopus_citation_count": null,
        "rek_herdc_notes_xsdmf_id": null,
        "rek_herdc_notes": null,
        "rek_scopus_doc_type_xsdmf_id": null,
        "rek_scopus_doc_type": null,
        "rek_wok_doc_type_xsdmf_id": null,
        "rek_wok_doc_type": null,
        "rek_security_inherited": 1,
        "rek_altmetric_score": null,
        "rek_altmetric_score_xsdmf_id": null,
        "rek_altmetric_id": null,
        "rek_altmetric_id_xsdmf_id": null,
        "rek_copyright_xsdmf_id": 3679,
        "rek_copyright": "on",
        "fez_record_search_key_access_conditions": null,
        "fez_record_search_key_acknowledgements": null,
        "fez_record_search_key_additional_notes": null,
        "fez_record_search_key_advisory_statement": null,
        "fez_record_search_key_alternate_genre": [],
        "fez_record_search_key_alternative_title": [],
        "fez_record_search_key_ands_collection_type": null,
        "fez_record_search_key_architectural_features": [],
        "fez_record_search_key_article_number": null,
        "fez_record_search_key_assigned_group_id": [],
        "fez_record_search_key_assigned_user_id": [],
        "fez_record_search_key_author": [{
            "rek_author_id": 29060394,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Eaves, Lindon",
            "rek_author_order": 1
        }, {
            "rek_author_id": 29060395,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Heath, Andrew",
            "rek_author_order": 2
        }, {
            "rek_author_id": 29060396,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Martin, Nicholas",
            "rek_author_order": 3
        }, {
            "rek_author_id": 29060397,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Maes, Hermine",
            "rek_author_order": 4
        }, {
            "rek_author_id": 29060398,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Neale, Michael",
            "rek_author_order": 5
        }, {
            "rek_author_id": 29060399,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Kendler, Kenneth",
            "rek_author_order": 6
        }, {
            "rek_author_id": 29060400,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Kirk, Katherine",
            "rek_author_order": 7
        }, {
            "rek_author_id": 29060401,
            "rek_author_pid": "UQ:143417",
            "rek_author_xsdmf_id": 6351,
            "rek_author": "Corey, Linda",
            "rek_author_order": 8
        }],
        "fez_record_search_key_author_affiliation_id": [],
        "fez_record_search_key_author_affiliation_country": [],
        "fez_record_search_key_author_affiliation_full_address": [],
        "fez_record_search_key_author_affiliation_name": [],
        "fez_record_search_key_author_id": [{
            "rek_author_id_id": 28428266,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 1
        }, {
            "rek_author_id_id": 28428267,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 2
        }, {
            "rek_author_id_id": 28428268,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 3
        }, {
            "rek_author_id_id": 28428269,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 4
        }, {
            "rek_author_id_id": 28428270,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 5
        }, {
            "rek_author_id_id": 28428271,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 6
        }, {
            "rek_author_id_id": 28428272,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 81987,
            "rek_author_id_order": 7
        }, {
            "rek_author_id_id": 28428273,
            "rek_author_id_pid": "UQ:143417",
            "rek_author_id_xsdmf_id": 6346,
            "rek_author_id": 0,
            "rek_author_id_order": 8
        }],
        "fez_record_search_key_author_role": [],
        "fez_record_search_key_book_title": null,
        "fez_record_search_key_building_materials": [],
        "fez_record_search_key_category": [],
        "fez_record_search_key_chapter_number": null,
        "fez_record_search_key_condition": [],
        "fez_record_search_key_conference_dates": null,
        "fez_record_search_key_conference_id": null,
        "fez_record_search_key_conference_location": null,
        "fez_record_search_key_conference_name": null,
        "fez_record_search_key_construction_date": null,
        "fez_record_search_key_contact_details_email": [],
        "fez_record_search_key_contributor": [],
        "fez_record_search_key_contributor_id": [],
        "fez_record_search_key_convener": null,
        "fez_record_search_key_corresponding_email": [],
        "fez_record_search_key_corresponding_name": [],
        "fez_record_search_key_corresponding_country": [],
        "fez_record_search_key_corresponding_organisation": [],
        "fez_record_search_key_country_of_issue": null,
        "fez_record_search_key_coverage_period": [],
        "fez_record_search_key_creator_id": [],
        "fez_record_search_key_creator_name": [],
        "fez_record_search_key_datastream_policy": null,
        "fez_record_search_key_data_volume": null,
        "fez_record_search_key_date_available": null,
        "fez_record_search_key_date_photo_taken": null,
        "fez_record_search_key_date_recorded": null,
        "fez_record_search_key_date_scanned": null,
        "fez_record_search_key_doi": null,
        "fez_record_search_key_edition": null,
        "fez_record_search_key_end_date": null,
        "fez_record_search_key_end_page": {
            "rek_end_page_id": 5542250,
            "rek_end_page_pid": "UQ:143417",
            "rek_end_page_xsdmf_id": 6384,
            "rek_end_page": "80"
        },
        "fez_record_search_key_fields_of_research": [],
        "fez_record_search_key_file_attachment_name": [],
        "fez_record_search_key_geographic_area": [],
        "fez_record_search_key_grant_acronym": [],
        "fez_record_search_key_grant_agency": [],
        "fez_record_search_key_grant_agency_id": [],
        "fez_record_search_key_grant_id": [],
        "fez_record_search_key_grant_text": [],
        "fez_record_search_key_herdc_code": {
            "rek_herdc_code_id": 4700842,
            "rek_herdc_code_pid": "UQ:143417",
            "rek_herdc_code_xsdmf_id": 12386,
            "rek_herdc_code": 450009
        },
        "fez_record_search_key_herdc_status": null,
        "fez_record_search_key_identifier": [],
        "fez_record_search_key_institutional_status": null,
        "fez_record_search_key_interior_features": [],
        "fez_record_search_key_isbn": [],
        "fez_record_search_key_isdatasetof": [],
        "fez_record_search_key_isderivationof": [],
        "fez_record_search_key_isi_loc": null,
        "fez_record_search_key_ismemberof": [{
            "rek_ismemberof_id": 11611370,
            "rek_ismemberof_pid": "UQ:143417",
            "rek_ismemberof_xsdmf_id": 149,
            "rek_ismemberof": "UQ:3831",
            "rek_ismemberof_order": 1
        }],
        "fez_record_search_key_issn": [{
            "rek_issn_id": 5140496,
            "rek_issn_pid": "UQ:143417",
            "rek_issn_xsdmf_id": 10796,
            "rek_issn": "1369-0523",
            "rek_issn_order": 1
        }],
        "fez_record_search_key_issue_number": {
            "rek_issue_number_id": 4426632,
            "rek_issue_number_pid": "UQ:143417",
            "rek_issue_number_xsdmf_id": 6377,
            "rek_issue_number": "2"
        },
        "fez_record_search_key_job_number": null,
        "fez_record_search_key_journal_name": {
            "rek_journal_name_id": 5081991,
            "rek_journal_name_pid": "UQ:143417",
            "rek_journal_name_xsdmf_id": 11071,
            "rek_journal_name": "Twin Research"
        },
        "fez_record_search_key_keywords": [{
            "rek_keywords_id": 29297955,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "assortative mating",
            "rek_keywords_order": 4
        }, {
            "rek_keywords_id": 29297953,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "attitudes",
            "rek_keywords_order": 2
        }, {
            "rek_keywords_id": 29297957,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "behavior genetics",
            "rek_keywords_order": 6
        }, {
            "rek_keywords_id": 29297954,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "cultural transmission",
            "rek_keywords_order": 3
        }, {
            "rek_keywords_id": 29297958,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "heritability",
            "rek_keywords_order": 7
        }, {
            "rek_keywords_id": 29297952,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "personality",
            "rek_keywords_order": 1
        }, {
            "rek_keywords_id": 29297959,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "sex differences",
            "rek_keywords_order": 8
        }, {
            "rek_keywords_id": 29297956,
            "rek_keywords_pid": "UQ:143417",
            "rek_keywords_xsdmf_id": 7956,
            "rek_keywords": "twins",
            "rek_keywords_order": 5
        }],
        "fez_record_search_key_language": [{
            "rek_language_id": 5269811,
            "rek_language_pid": "UQ:143417",
            "rek_language_xsdmf_id": 10570,
            "rek_language": "eng",
            "rek_language_order": 1
        }],
        "fez_record_search_key_language_of_book_title": [],
        "fez_record_search_key_language_of_journal_name": [],
        "fez_record_search_key_language_of_proceedings_title": [],
        "fez_record_search_key_language_of_title": [],
        "fez_record_search_key_length": null,
        "fez_record_search_key_license": null,
        "fez_record_search_key_link": [{
            "rek_link_id": 3201062,
            "rek_link_pid": "UQ:143417",
            "rek_link_xsdmf_id": 6449,
            "rek_link": "http:\/\/www.atypon-link.com\/AAP\/toc\/twin\/2\/2",
            "rek_link_order": 1
        }],
        "fez_record_search_key_link_description": [{
            "rek_link_description_id": 3201031,
            "rek_link_description_pid": "UQ:143417",
            "rek_link_description_xsdmf_id": 6448,
            "rek_link_description": "Link",
            "rek_link_description_order": 1
        }],
        "fez_record_search_key_location": [],
        "fez_record_search_key_native_script_book_title": null,
        "fez_record_search_key_native_script_conference_name": null,
        "fez_record_search_key_native_script_journal_name": null,
        "fez_record_search_key_native_script_proceedings_title": null,
        "fez_record_search_key_native_script_title": null,
        "fez_record_search_key_newspaper": null,
        "fez_record_search_key_notes": null,
        "fez_record_search_key_oa_embargo_days": null,
        "fez_record_search_key_oa_notes": null,
        "fez_record_search_key_oa_status": null,
        "fez_record_search_key_org_name": null,
        "fez_record_search_key_org_unit_name": null,
        "fez_record_search_key_original_format": null,
        "fez_record_search_key_parent_publication": null,
        "fez_record_search_key_patent_number": null,
        "fez_record_search_key_period": [],
        "fez_record_search_key_place_of_publication": {
            "rek_place_of_publication_id": 4209479,
            "rek_place_of_publication_pid": "UQ:143417",
            "rek_place_of_publication_xsdmf_id": 9625,
            "rek_place_of_publication": "U.K."
        },
        "fez_record_search_key_proceedings_title": null,
        "fez_record_search_key_project_description": null,
        "fez_record_search_key_project_id": null,
        "fez_record_search_key_project_name": null,
        "fez_record_search_key_project_start_date": null,
        "fez_record_search_key_publisher": {
            "rek_publisher_id": 4474995,
            "rek_publisher_pid": "UQ:143417",
            "rek_publisher_xsdmf_id": 9626,
            "rek_publisher": "Stockton Press"
        },
        "fez_record_search_key_pubmed_id": null,
        "fez_record_search_key_refereed": null,
        "fez_record_search_key_refereed_source": {
            "rek_refereed_source_id": 1231589,
            "rek_refereed_source_pid": "UQ:143417",
            "rek_refereed_source_xsdmf_id": 16623,
            "rek_refereed_source": "453638"
        },
        "fez_record_search_key_related_datasets": null,
        "fez_record_search_key_related_publications": null,
        "fez_record_search_key_report_number": null,
        "fez_record_search_key_retracted": null,
        "fez_record_search_key_rights": null,
        "fez_record_search_key_roman_script_book_title": null,
        "fez_record_search_key_roman_script_conference_name": null,
        "fez_record_search_key_roman_script_journal_name": null,
        "fez_record_search_key_roman_script_proceedings_title": null,
        "fez_record_search_key_roman_script_title": null,
        "fez_record_search_key_scale": null,
        "fez_record_search_key_scopus_id": null,
        "fez_record_search_key_section": null,
        "fez_record_search_key_seo_code": [],
        "fez_record_search_key_series": null,
        "fez_record_search_key_software_required": [],
        "fez_record_search_key_source": null,
        "fez_record_search_key_start_date": null,
        "fez_record_search_key_start_page": {
            "rek_start_page_id": 5612739,
            "rek_start_page_pid": "UQ:143417",
            "rek_start_page_xsdmf_id": 6383,
            "rek_start_page": "62"
        },
        "fez_record_search_key_structural_systems": [],
        "fez_record_search_key_style": [],
        "fez_record_search_key_subcategory": [],
        "fez_record_search_key_subject": [{
            "rek_subject_id": 9151374,
            "rek_subject_pid": "UQ:143417",
            "rek_subject_xsdmf_id": 6365,
            "rek_subject": 321014,
            "rek_subject_order": 2
        }, {
            "rek_subject_id": 9151373,
            "rek_subject_pid": "UQ:143417",
            "rek_subject_xsdmf_id": 6365,
            "rek_subject": 450009,
            "rek_subject_order": 1
        }, {
            "rek_subject_id": 9151375,
            "rek_subject_pid": "UQ:143417",
            "rek_subject_xsdmf_id": 6365,
            "rek_subject": 450528,
            "rek_subject_order": 3
        }],
        "fez_record_search_key_supervisor": [],
        "fez_record_search_key_supervisor_id": [],
        "fez_record_search_key_surrounding_features": [],
        "fez_record_search_key_time_period_end_date": null,
        "fez_record_search_key_time_period_start_date": null,
        "fez_record_search_key_total_chapters": null,
        "fez_record_search_key_total_pages": {
            "rek_total_pages_id": 5526303,
            "rek_total_pages_pid": "UQ:143417",
            "rek_total_pages_xsdmf_id": 9623,
            "rek_total_pages": "19"
        },
        "fez_record_search_key_transcript": null,
        "fez_record_search_key_translated_book_title": null,
        "fez_record_search_key_translated_conference_name": null,
        "fez_record_search_key_translated_journal_name": null,
        "fez_record_search_key_translated_newspaper": null,
        "fez_record_search_key_translated_proceedings_title": null,
        "fez_record_search_key_translated_title": null,
        "fez_record_search_key_type_of_data": [],
        "fez_record_search_key_volume_number": {
            "rek_volume_number_id": 5139931,
            "rek_volume_number_pid": "UQ:143417",
            "rek_volume_number_xsdmf_id": 6379,
            "rek_volume_number": "2"
        }
    };
    return (
        <ClaimPublicationForm publication={publication}/>
    );
}

Browse.propTypes = {
    // title: PropTypes.string,
    // text: PropTypes.string,
    // help: PropTypes.shape({
    //     title: PropTypes.string,
    //     text: PropTypes.any,
    //     buttonLabel: PropTypes.string
    // })
};

