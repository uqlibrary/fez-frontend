import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListBook = {
    "total": 2,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [
        {
            "rek_pid": "UQ:335214",
            "rek_title": "El Reino Del Galapago: Volviendo A Su Edad De Oro",
            "rek_description": null,
            "rek_display_type": 174,
            "rek_status": 2,
            "rek_date": "1999-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 10202,
            "rek_created_date": "2014-07-23T14:14:54Z",
            "rek_updated_date": "2019-05-19T02:31:36Z",
            "rek_file_downloads": 1,
            "rek_citation": "",
            "rek_genre": "Book",
            "rek_formatted_title": "El Reino Del Gala\u0301pago: Volviendo A Su Edad De Oro<br \/>",
            "rek_formatted_abstract": "Relatos de mas de treinta a&ntilde;os de conservaci&oacute;n de las tortugas por parte de las organizaciones que se dedican a tales fines, as&iacute; como tambi&eacute;n relata la historia de las islas Gal&aacute;pagos desde su descubrimiento en 1535 y el proceso de desaparici&oacute;n de las tortugas de su habitad natural por parte del ser humano. Informa del trabajo realizado por organizaciones de conservaci&oacute;n que llevan a&ntilde;os dedicados a la conservaci&oacute;n de la fauna y la flora de las islas. <br \/>",
            "rek_depositor_affiliation": 923,
            "rek_thomson_citation_count": null,
            "rek_subtype": "Research book (original research)",
            "rek_scopus_citation_count": null,
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "rek_datastream_policy": null,
            "fez_record_search_key_author": [
                "Merlen, Godfrey",
                "Rojas-Lizana, Isolda",
            ],
            "fez_record_search_key_author_id": [{
                "rek_author_id": 0,
            }, {
                "rek_author_id": 7970,
                "rek_author_id_lookup": "Rojas-Lizana, Isolda "
            }],
            "fez_record_search_key_file_attachment_name": ["UQ335214_frontmatter.pdf", "presmd_UQ335214_frontmatter.xml"],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 450005,
                "rek_herdc_code_lookup": "AX"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453225,
                "rek_institutional_status_lookup": "Unknown"
            },
            "fez_record_search_key_isbn": ["9978530169", "9789978530160"],
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof": "UQ:3838",
                "parent": {
                    "rek_pid": "UQ:3838",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "School of Languages and Cultures Publications"
            }],
            "fez_record_search_key_language": ["spa"],
            "fez_record_search_key_language_of_title": ["spa"],
            "fez_record_search_key_native_script_title": "El Reino Del Gala\u0301pago: Volviendo A Su Edad De Oro",
            "fez_record_search_key_notes":
                "Spanish translation of Merlen, Godfrey (1999). \"Restoring the tortoise dynasty: the decline and recovery of the Galapagos giant tortoise\", Charles Darwin Foundation, Quito, Ecuador.",
            "fez_record_search_key_place_of_publication": "Quito, Ecuador",
            "fez_record_search_key_publisher": "Fundacio\u0301n Charles Darwin",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_roman_script_title": "El Reino Del Galapago: Volviendo A Su Edad De Oro",
            "fez_record_search_key_total_pages": "53",
            "fez_record_search_key_translated_title":
                "Restoring the tortoise dynasty: the decline and recovery of the Galapagos giant tortoise",
            "fez_datastream_info": [{
                "dsi_id": 0,
                "dsi_pid": "UQ:335214",
                "dsi_dsid": "ElReinoDelGalapago.pdf",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Full text (open access)",
                "dsi_mimetype": "application\/pdf",
                "dsi_copyright": null,
                "dsi_state": "D",
                "dsi_size": 3215093,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0
            }, {
                "dsi_id": 1,
                "dsi_pid": "UQ:335214",
                "dsi_dsid": "presmd_ElReinoDelGalapago.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application\/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 15138,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0
            }, {
                "dsi_id": 2,
                "dsi_pid": "UQ:335214",
                "dsi_dsid": "presmd_UQ335214_frontmatter.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application\/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 18254,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0
            }, {
                "dsi_id": 3,
                "dsi_pid": "UQ:335214",
                "dsi_dsid": "UQ335214_frontmatter.pdf",
                "dsi_embargo_date": null,
                "dsi_open_access": 0,
                "dsi_label": "HERDC evidence - not publicly available",
                "dsi_mimetype": "application\/pdf",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1417301,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0
            }],
            "rek_display_type_lookup": "Book",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        },
        {
            "rek_pid": "UQ:2d7b8a8",
            "rek_title": "Deep Learning in Medical Image Analysis and Multimodal Learning for Clinical Decision Support : 4th International Workshop, DLMIA 2018, and 8th International Workshop, ML-CDS 2018, Held in Conjunction with MICCAI 2018, Granada, Spain, September 20, 2018, Proceedings",
            "rek_description": null,
            "rek_display_type": 174,
            "rek_status": 2,
            "rek_date": "2018-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 41783,
            "rek_created_date": "2019-09-30T00:01:02Z",
            "rek_updated_date": "2020-02-14T11:26:02Z",
            "rek_file_downloads": 0,
            "rek_citation": " <i><a class=\"citation_title\" title=\"Click to view Book: Deep Learning in Medical Image Analysis and Multimodal Learning for Clinical Decision Support : 4th International Workshop, DLMIA 2018, and 8th International Workshop, ML-CDS 2018, Held in Conjunction with MICCAI 2018, Granada, Spain, September 20, 2018, Proceedings\" href=\"/view/UQ:2d7b8a8\">Deep Learning in Medical Image Analysis and Multimodal Learning for Clinical Decision Support : 4th International Workshop, DLMIA 2018, and 8th International Workshop, ML-CDS 2018, Held in Conjunction with MICCAI 2018, Granada, Spain, September 20, 2018, Proceedings</a></i>. Edited by <span class=\"citation_contributor\"><span class=\"citation_contributor\">Stoyanov, Danail</span>, <span class=\"citation_contributor\">Taylor, Zeike</span>, <span class=\"citation_contributor\">Carneiro, Gustavo</span>, <span class=\"citation_contributor\">Syeda-Mahmood, Tanveer</span>, <span class=\"citation_contributor\">Martel, Anne</span>, <span class=\"citation_contributor\">Maier-Hein, Lena</span>, <span class=\"citation_contributor\">Tavares, João Manuel R.S.</span>, <span class=\"citation_contributor\">Bradley, Andrew</span>, <span class=\"citation_contributor\">Papa, João Paulo</span>, <span class=\"citation_contributor\">Belagiannis, Vasileios</span>, <span class=\"citation_contributor\">Nascimento, Jacinto C.</span>, <span class=\"citation_contributor\">Lu, Zhi</span>, <span class=\"citation_contributor\">Conjeti, Sailesh</span>, <span class=\"citation_contributor\">Moradi, Mehdi</span>, <span class=\"citation_contributor\">Greenspan, Hayit</span> and <span class=\"citation_contributor\">Madabhushi, Anant</span></span>  <span class=\"citation_place_of_publication\">Cham</span>: <span class=\"citation_publisher\">Springer International Publishing</span>, <span class=\"citation_date\">2018</span>. doi:<span class=\"citation_doi\">10.1007/978-3-030-00889-5</span>",
            "rek_security_inherited": 1,
            "rek_altmetric_score": 16,
            "rek_altmetric_id": 48720797,
            "rek_security_policy": 1,
            "fez_record_search_key_contributor": [
                "Stoyanov, Danail",
                "Taylor, Zeike",
                "Carneiro, Gustavo",
                "Syeda-Mahmood, Tanveer",
                "Martel, Anne",
                "Maier-Hein, Lena",
                "Tavares, João Manuel R.S.",
                "Bradley, Andrew",
                "Papa, João Paulo",
                "Belagiannis, Vasileios",
                "Nascimento, Jacinto C.",
                "Lu, Zhi",
                "Conjeti, Sailesh",
                "Moradi, Mehdi",
                "Greenspan, Hayit",
                "Madabhushi, Anant",
            ],
            "fez_record_search_key_doi": {
                "rek_doi": "10.1007/978-3-030-00889-5",
                "fez_altmetric": {
                "as_id": 125920,
                "as_amid": 48720797,
                "as_doi": "10.1007/978-3-030-00889-5",
                "as_score": 16,
                "as_created": "1558687703",
                "as_last_checked": "1582898518",
                "as_1d": 0,
                "as_2d": 0,
                "as_3d": 0,
                "as_4d": 0,
                "as_5d": 0,
                "as_6d": 0,
                "as_1w": 0,
                "as_1m": 0,
                "as_3m": 0,
                "as_6m": 0.75,
                "as_1y": 1,
                "as_total_posts_count": 103,
                "as_facebook_posts_count": 1,
                "as_policy_posts_count": 0,
                "as_blogs_posts_count": 0,
                "as_googleplus_posts_count": 0,
                "as_news_posts_count": 0,
                "as_reddit_posts_count": 0,
                "as_twitter_posts_count": 102,
                "as_syllabi_posts_count": 0,
                "as_video_posts_count": 0,
                "as_weibo_posts_count": 0,
                "as_qa_posts_count": 0,
                "as_f1000_posts_count": 0,
                "as_wikipedia_posts_count": 0,
                "as_pinterest_posts_count": 0,
                "as_linkedin_posts_count": 0,
                "as_peer_reviews_posts_count": 0,
                "as_citation_url": "http:\/\/www.altmetric.com/details.php?citation_id=48720797"
                }
            },
            "fez_record_search_key_isbn": ["9783030008888", "9783030008895"],
            "fez_record_search_key_ismemberof": [
                {
                "rek_ismemberof": "UQ:639325",
                "parent": {
                    "rek_pid": "UQ:639325",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "Crossref Import"
                }
            ],
            "fez_record_search_key_issn": [
                {
                "rek_issn": "0302-9743",
                "fez_journal_issns": [
                    {
                    "jni_id": 68851,
                    "jni_jnl_id": 42066,
                    "jni_issn": "0302-9743",
                    "jni_issn_order": 1,
                    "fez_journal": {
                        "jnl_id": 42066,
                        "jnl_journal_name": "Lecture Notes in Computer Science",
                        "jnl_era_id": 123605,
                        "jnl_era_year": 2012,
                        "jnl_created_date": "2011-10-28 00:00:00",
                        "jnl_updated_date": "2011-10-28 00:00:00",
                        "jnl_rank": null,
                        "jnl_foreign_name": ""
                    }
                    }
                ],
                "fez_sherpa_romeo": {
                    "srm_id": 69421,
                    "srm_issn": "0302-9743",
                    "srm_journal_name": "Lecture Notes in Artificial Intelligence",
                    "srm_journal_link": "https://v2.sherpa.ac.uk/id/publication/33095"
                },
                "fez_ulrichs": {
                    "ulr_issn": "0302-9743",
                    "ulr_title_id": "122527",
                    "ulr_title": "Lecture Notes in Computer Science"
                },
                "rek_issn_lookup": ""
                },
                {
                "rek_issn": "1611-3349",
                "fez_journal_issns": [
                    {
                    "jni_id": 68852,
                    "jni_jnl_id": 42066,
                    "jni_issn": "1611-3349",
                    "jni_issn_order": 2,
                    "fez_journal": {
                        "jnl_id": 42066,
                        "jnl_journal_name": "Lecture Notes in Computer Science",
                        "jnl_era_id": 123605,
                        "jnl_era_year": 2012,
                        "jnl_created_date": "2011-10-28 00:00:00",
                        "jnl_updated_date": "2011-10-28 00:00:00",
                        "jnl_rank": null,
                        "jnl_foreign_name": ""
                    }
                    }
                ],
                "fez_sherpa_romeo": {
                    "srm_id": 69424,
                    "srm_issn": "1611-3349",
                    "srm_journal_name": "Not found in Sherpa Romeo",
                    "srm_colour": "Not found in Sherpa Romeo",
                    "srm_json": null,
                    "srm_journal_link": null
                },
                "fez_ulrichs": {
                    "ulr_issn": "1611-3349",
                    "ulr_title_id": "339301",
                    "ulr_title": "Lecture Notes in Computer Science"
                },
                "rek_issn_lookup": "Not found in Sherpa Romeo"
                }
            ],
            "fez_record_search_key_license": 453608,
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_place_of_publication": "Cham",
            "fez_record_search_key_publisher": "Springer International Publishing",
            "fez_record_search_key_security_policy": [5],
            "fez_record_search_key_series": "Lecture Notes in Computer Science",
            "rek_display_type_lookup": "Book",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
        }
    ]
}

export default hydrateMockSearchList(publicationTypeListBook);
