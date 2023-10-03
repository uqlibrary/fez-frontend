import { hydrateMockSearchList } from '../../../helpers/general';

const publicationTypeListBookChapter = {
    "total": 2,
    "took": 1,
    "per_page": 999,
    "current_page": 1,
    "from": 1,
    "to": 2,
    "data": [
        {
            "rek_pid": "UQ:173575",
            "rek_title": "Summary and discussion of studies in the acquisition of Japanese as a second language in Australia",
            "rek_description": null,
            "rek_display_type": 177,
            "rek_status": 2,
            "rek_date": "2008-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 1639,
            "rek_created_date": "2009-04-02T15:47:51Z",
            "rek_updated_date": "2019-02-24T04:21:14Z",
            "rek_file_downloads": 0,
            "rek_citation": "",
            "rek_genre": "Book Chapter",
            "rek_genre_type": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation": 923,
            "rek_thomson_citation_count": null,
            "rek_subtype": "Research book chapter (original research)",
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_author": ["Iwashita, N.", "Harrington, M. W."],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 3191,
                    "rek_author_id_lookup": "Iwashita, Noriko"
                },
                {
                    "rek_author_id": 782,
                    "rek_author_id_lookup": "Harrington, Michael W."
                }
            ],
            "fez_record_search_key_book_title": "多様化する言語習得環境とこれからの日本語教育",
            "fez_record_search_key_chapter_number": "4",
            "fez_record_search_key_contributor": ["Sakamoto Akira", "Nagatomo Kazuhiko", "Koyanagi Kaoru"],
            "fez_record_search_key_contributor_id": [0, 0, 0],
            "fez_record_search_key_date_available": "2009-04-02T15:47:51Z",
            "fez_record_search_key_end_page": "96",
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 450006,
                "rek_herdc_code_lookup": "B1"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453221,
                "rek_herdc_status_lookup": "Confirmed Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453225,
                "rek_institutional_status_lookup": "Unknown"
            },
            "fez_record_search_key_isbn": ["9784883194636"],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:138536",
                    "parent": {
                        "rek_pid": "UQ:138536",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "2009 Higher Education Research Data Collection"
                },
                {
                    "rek_ismemberof": "UQ:3838",
                    "parent": {
                        "rek_pid": "UQ:3838",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Languages and Cultures Publications"
                },
                {
                    "rek_ismemberof": "UQ:3803",
                    "parent": {
                        "rek_pid": "UQ:3803",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Communication and Arts Publications"
                },
                {
                    "rek_ismemberof": "UQ:152266",
                    "parent": {
                        "rek_pid": "UQ:152266",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Excellence in Research Australia (ERA) - Collection"
                }
            ],
            "fez_record_search_key_keywords": ["Japanese language", "Second language acquisition"],
            "fez_record_search_key_language": ["jpn", "eng"],
            "fez_record_search_key_language_of_book_title": ["jpn"],
            "fez_record_search_key_license": {
                "rek_license": 453609,
                "rek_license_lookup": "Creative Commons Attribution-NoDerivatives 3.0 International (CC BY-ND 3.0)"
            },
            "fez_record_search_key_native_script_book_title": "多様化する言語習得環境とこれからの日本語教育",
            "fez_record_search_key_notes":
                "Translated Book title: 'Japanese Language Education in Diverse Learning Environments'.",
            "fez_record_search_key_place_of_publication": "Tokyo, Japan",
            "fez_record_search_key_publisher": "3A Corporation",
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_roman_script_book_title":
                "Tayō-ka suru gengo shūtoku kankyō to korekara no nihongo kyōiku",
            "fez_record_search_key_start_page": "79",
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 450006,
                    "rek_subject_lookup": "B1"
                },
                {
                    "rek_subject": 453090,
                    "rek_subject_lookup": "200401 Applied Linguistics and Educational Linguistics"
                },
                {
                    "rek_subject": 453076,
                    "rek_subject_lookup": "200312 Japanese Language"
                },
                {
                    "rek_subject": 451553,
                    "rek_subject_lookup": "950201 Communication Across Languages and Culture"
                }
            ],
            "fez_record_search_key_total_chapters": "16",
            "fez_record_search_key_total_pages": "18",
            "fez_record_search_key_translated_book_title":
                "Japanese language education in diverse learning environments",
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:173575",
                    "dsi_dsid": "FezACML_UQ_173575.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for PID - UQ:173575",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 3639,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                }
            ],
            "rek_display_type_lookup": "Book Chapter",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "fez_record_search_key_security_policy": [5]
        },
        {
            "rek_pid": "UQ:0048ce9",
            "rek_title": "Higher education: The engine of development",
            "rek_description": "By definition, higher education is primarily concerned with the transmission and development of knowledge at the most advanced levels of learning and research. Historically, the prime functions of the university have been teaching, research and community service. Deep down universities still see themselves as a fountain of knowledge and reason for a better world, as serving as the custodians of knowledge, culture and enlightenment. Nostalgic as that view may be, universities have survived for more than 800 years, largely because they constantly reinvent themselves while seeking to retain their core academic values.",
            "rek_display_type": 177,
            "rek_status": 2,
            "rek_date": "2015-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 41783,
            "rek_created_date": "2019-05-17T15:50:53Z",
            "rek_updated_date": "2020-03-13T06:53:31Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Power, Colin\" href=\"/list/author/Power%2C+Colin/\">Power, Colin</a> (<span class=\"citation_date\">2015</span>). <a class=\"citation_title\" title=\"Click to view Book Chapter: Higher education: The engine of development\" href=\"/view/UQ:0048ce9\">Higher education: The engine of development</a>. In  <i><span class=\"citation_book_title\">The Power of Education</span></i>  (pp. <span class=\"citation_start_page\">163</span>-<span class=\"citation_end_page\">186</span>)  <span class=\"citation_place_of_publication\">Singapore</span>: <span class=\"citation_publisher\">Springer Nature</span>. doi:<span class=\"citation_doi\">10.1007/978-981-287-221-0_10</span>",
            "rek_genre": "Book Chapter",
            "rek_genre_type": "Research book chapter (original research)",
            "rek_formatted_title": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation": 1247,
            "rek_thomson_citation_count": null,
            "rek_subtype": "Research book chapter (original research)",
            "rek_scopus_citation_count": 0,
                "rek_scopus_doc_type": "ch",
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type": null,
            "rek_security_inherited": 1,
            "rek_altmetric_score": 0,
            "rek_altmetric_id": 40181792,
            "rek_copyright": "off",
            "rek_security_policy": 1,
            "fez_record_search_key_author": ["Power, Colin"],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 0,
                    "author": null
                }
            ],
            "fez_record_search_key_book_title": "The Power of Education",
            "fez_record_search_key_corresponding_country": ["aus"],
            "fez_record_search_key_corresponding_name": ["Power C."],
            "fez_record_search_key_doi": {
                "rek_doi_id": 1777692,
                "rek_doi_pid": "UQ:0048ce9",
                "rek_doi_xsdmf_id": null,
                "rek_doi": "10.1007/978-981-287-221-0_10",
                "fez_altmetric": {
                    "as_id": 126090,
                    "as_amid": 40181792,
                    "as_doi": "10.1007/978-981-287-221-0_10",
                    "as_score": 0,
                    "as_created": "1558688187",
                    "as_last_checked": "1583868342",
                    "as_1d": 0,
                    "as_2d": 0,
                    "as_3d": 0,
                    "as_4d": 0,
                    "as_5d": 0,
                    "as_6d": 0,
                    "as_1w": 0,
                    "as_1m": 0,
                    "as_3m": 0,
                    "as_6m": 0,
                    "as_1y": 0,
                    "as_total_posts_count": 0,
                    "as_facebook_posts_count": 0,
                    "as_policy_posts_count": 0,
                    "as_blogs_posts_count": 0,
                    "as_googleplus_posts_count": 0,
                    "as_news_posts_count": 0,
                    "as_reddit_posts_count": 0,
                    "as_twitter_posts_count": 0,
                    "as_syllabi_posts_count": 0,
                    "as_video_posts_count": 0,
                    "as_weibo_posts_count": 0,
                    "as_qa_posts_count": 0,
                    "as_f1000_posts_count": 0,
                    "as_wikipedia_posts_count": 0,
                    "as_pinterest_posts_count": 0,
                    "as_linkedin_posts_count": 0,
                    "as_peer_reviews_posts_count": 0,
                    "as_citation_url": "http://www.altmetric.com/details.php?citation_id=40181792"
                }
            },
            "fez_record_search_key_end_page": "186",
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 450006,
                "rek_herdc_code_lookup": "B1"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453223,
                "rek_institutional_status_lookup": "UQ"
            },
            "fez_record_search_key_isbn": ["9789812872203", "9789812872210"],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:244548",
                    "parent": {
                        "rek_pid": "UQ:244548",
                        "rek_security_policy": 1,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Out of Circulation"
                }
            ],
            "fez_record_search_key_issn": [
                {
                    "rek_issn": "2214-9791",
                    "fez_journal_issns": [],
                    "fez_sherpa_romeo": {
                        "srm_id": 9203899,
                        "srm_issn": "2214-9791",
                        "srm_journal_name": "Not found in Sherpa Romeo",
                        "srm_colour": "Not found in Sherpa Romeo",
                        "srm_json": null,
                        "srm_journal_link": null
                    },
                    "fez_ulrichs": {
                        "ulr_issn": "2214-9791",
                        "ulr_title_id": "756407",
                        "ulr_title": "Education in the Asia-Pacific Region"
                    },
                    "rek_issn_lookup": "Not found in Sherpa Romeo"
                },
                {
                    "rek_issn": "1573-5397",
                    "fez_journal_issns": [],
                    "fez_sherpa_romeo": {
                        "srm_id": 3584389,
                        "srm_issn": "1573-5397",
                        "srm_journal_name": "Not found in Sherpa Romeo",
                        "srm_colour": "Not found in Sherpa Romeo",
                        "srm_json": null,
                        "srm_journal_link": null
                    },
                    "fez_ulrichs": {
                        "ulr_issn": "1573-5397",
                        "ulr_title_id": "756406",
                        "ulr_title": "Education in the Asia-Pacific Region"
                    },
                    "rek_issn_lookup": "Not found in Sherpa Romeo"
                }
            ],
            "fez_record_search_key_keywords": [
                "Autonomy",
                "Globalisation",
                "Higher education",
                "ICT",
                "International co-operation",
                "Internationalisation",
                "League tables",
                "Open access",
                "Quality assurance",
                "Reform",
            ],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_place_of_publication": "Singapore",
            "fez_record_search_key_publisher": "Springer Nature",
            "fez_record_search_key_refereed": 0,
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id": "2-s2.0-85065401638",
                "fez_scopus_citations": {
                    "sc_eid": "2-s2.0-85065401638",
                    "sc_created": "1558170935",
                    "sc_last_checked": "1583313657",
                    "sc_count": 0,
                    "sc_1d": 0,
                    "sc_2d": 0,
                    "sc_3d": 0,
                    "sc_4d": 0,
                    "sc_5d": 0,
                    "sc_6d": 0,
                    "sc_1w": 0,
                    "sc_1m": 0,
                    "sc_3m": 0,
                    "sc_6m": 0,
                    "sc_1y": 0,
                    "sc_citation_url": "https://go.openathens.net/redirector/uq.edu.au?url=http://www.scopus.com/results/citedbyresults.url?sort=plf-f&src=s&sot=cite&sdt=a&cite=2-s2.0-85065401638"
                }
            },
            "fez_record_search_key_security_policy": [1],
            "fez_record_search_key_series": "Education in the Asia-Pacific Region",
            "fez_record_search_key_start_page": "163",
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453525,
                    "rek_subject_lookup": "3304 Education"
                },
                {
                    "rek_subject": 453524,
                    "rek_subject_lookup": "3303 Development"
                },
                {
                    "rek_subject": 453537,
                    "rek_subject_lookup": "3316 Cultural Studies"
                }
            ],
            "fez_record_search_key_total_pages": "24",
            "fez_record_search_key_volume_number": "27",
            "rek_display_type_lookup": "Book Chapter",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "fez_internal_notes": {
                "ain_id": 130372,
                "ain_pid": "UQ:0048ce9",
                "ain_detail": "Chapter from authored book https://espace.library.uq.edu.au/view/UQ:734696"
            },
            "fez_record_search_key_author_affiliation_country": ["aus"],
            "fez_record_search_key_author_affiliation_full_address": ["Brisbane,QLD"],
            "fez_record_search_key_author_affiliation_name": ["University of Queensland"]
        },
        {
            "rek_pid": "UQ:278002",
            "rek_title": "Kurt Weill, Mahagonny and the commercialization of Berlin musical theatre in the Weimar Republic",
            "rek_description": "The title is sufficient indication of the chapter's content. Particular attention is paid to the correspondence between Kurt Weill and his musical peers.",
            "rek_display_type": 177,
            "rek_status": 2,
            "rek_date": "2012-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 10202,
            "rek_created_date": "2012-07-24T09:27:58Z",
            "rek_updated_date": "2020-03-13T06:53:31Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for Grosch, Nils\" href=\"/list/author/Grosch%2C+Nils/\">Grosch, Nils</a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Wilkes, Geoff\" href=\"/list/author_id/850/\">Wilkes, Geoff</a> (<span class=\"citation_date\">2012</span>). <a class=\"citation_title\" title=\"Click to view Book Chapter: Kurt Weill, Mahagonny and the commercialization of Berlin musical theatre in the Weimar Republic\" href=\"/view/UQ:278002\">Kurt Weill, Mahagonny and the commercialization of Berlin musical theatre in the Weimar Republic</a>. In <span class=\"citation_contributor\"><span class=\"citation_contributor\">Jochen Hung</span>, <span class=\"citation_contributor\">Godela Weiss-Sussex</span> and <span class=\"citation_contributor\">Geoffrey Wilkes</span></span> (Ed.), <i><span class=\"citation_book_title\">Beyond glitter and doom: the contingency of the Weimar Republic</span></i>  (pp. <span class=\"citation_start_page\">192</span>-<span class=\"citation_end_page\">208</span>)  <span class=\"citation_place_of_publication\">Munchen, Germany</span>: <span class=\"citation_publisher\">Iudicium</span>.",
            "rek_genre": "Book Chapter",
            "rek_formatted_title": "Kurt Weill, <i>Mahagonny </i>and the commercialization of Berlin musical theatre in the Weimar Republic",
            "rek_formatted_abstract": "<p>The title is sufficient indication of the chapter's content. Particular attention is paid to the correspondence between Kurt Weill and his musical peers.</p>",
            "rek_depositor_affiliation": 923,
            "rek_thomson_citation_count_xsdmf_id": null,
            "rek_subtype_xsdmf_id": null,
            "rek_subtype": "Creative Work - Textual",
            "rek_scopus_citation_count": null,
                "rek_scopus_doc_type_xsdmf_id": null,
            "rek_scopus_doc_type": null,
            "rek_wok_doc_type_xsdmf_id": null,
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type_xsdmf_id": null,
            "rek_pubmed_doc_type": null,
            "rek_security_inherited": 1,
            "rek_altmetric_score": null,
            "rek_altmetric_score_xsdmf_id": null,
            "rek_altmetric_id": null,
            "rek_altmetric_id_xsdmf_id": null,
            "rek_copyright_xsdmf_id": null,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "rek_datastream_policy": null,
            "fez_record_search_key_advisory_statement": null,
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [
                {
                    "rek_author_id": 29129405,
                    "rek_author_pid": "UQ:278002",
                    "rek_author_xsdmf_id": null,
                    "rek_author": "Grosch, Nils",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": 29129406,
                    "rek_author_pid": "UQ:278002",
                    "rek_author_xsdmf_id": null,
                    "rek_author": "Wilkes, Geoff",
                    "rek_author_order": 2
                }
            ],
            "fez_record_search_key_author_affiliation_country": [],
            "fez_record_search_key_author_affiliation_full_address": [],
            "fez_record_search_key_author_affiliation_id": [],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id_id": 28496559,
                    "rek_author_id_pid": "UQ:278002",
                    "rek_author_id_xsdmf_id": null,
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "author": null
                },
                {
                    "rek_author_id_id": 28496560,
                    "rek_author_id_pid": "UQ:278002",
                    "rek_author_id_xsdmf_id": null,
                    "rek_author_id": 850,
                    "rek_author_id_order": 2,
                    "author": {
                        "aut_org_username": "grgwilke",
                        "aut_student_username": null,
                        "aut_id": 850,
                        "aut_orcid_id": "0000-0002-9264-2902",
                        "aut_title": "Dr"
                    },
                    "rek_author_id_lookup": "Wilkes, Geoffrey T."
                }
            ],
            "fez_record_search_key_biosis_id": null,
            "fez_record_search_key_book_title": {
                "rek_book_title_id": 295753,
                "rek_book_title_pid": "UQ:278002",
                "rek_book_title_xsdmf_id": null,
                "rek_book_title": "Beyond glitter and doom: the contingency of the Weimar Republic"
            },
            "fez_record_search_key_chapter_number": null,
            "fez_record_search_key_content_indicator": [],
            "fez_record_search_key_contributor": ["Jochen Hung", "Godela Weiss-Sussex", "Geoffrey Wilkes"],
            "fez_record_search_key_contributor_id": [0, 0, 0],
            "fez_record_search_key_end_page": "208",
            "fez_record_search_key_file_attachment_access_condition": ["8"],
            "fez_record_search_key_file_attachment_name": ["Grosch.pdf", "thumbnail_Grosch_t.jpg"],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 454028,
                "rek_herdc_code_lookup": "CW1"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453223,
                "rek_institutional_status_lookup": "UQ"
            },
            "fez_record_search_key_isbn": ["9780854572335", "9783862050840"],
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:185355",
                    "parent": {
                        "rek_pid": "UQ:185355",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "School of Languages and Cultures -- Student Publications"
                },
                {
                    "rek_ismemberof": "UQ:237156",
                    "parent": {
                        "rek_pid": "UQ:237156",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "Non HERDC"
                },
                {
                    "rek_ismemberof": "UQ:256976",
                    "parent": {
                        "rek_pid": "UQ:256976",
                        "rek_security_policy": 5,
                        "rek_datastream_policy": 5
                    },
                    "rek_ismemberof_lookup": "ERA White List Items"
                }
            ],
            "fez_record_search_key_language": ["eng"],
            "fez_record_search_key_notes":
                "This chapter, by Nils Grosch, was originally published in German and has been translated into English by Geoff Wilkes.",
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_place_of_publication": "Munchen, Germany",
            "fez_record_search_key_publisher": "Iudicium",
            "fez_record_search_key_refereed": 0,
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_security_policy": [5],
            "fez_record_search_key_series": "Publications of the Institute of Germanic Studies",
            "fez_record_search_key_start_page": "192",
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453642,
                    "rek_subject_lookup": "Creative Work - Textual"
                }
            ],
            "fez_record_search_key_total_chapters": "13",
            "fez_record_search_key_total_pages": "17",
            "fez_record_search_key_volume_number": "98",
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:278002",
                    "dsi_dsid": "Grosch.pdf",
                    "dsi_checksum": "e0b738b4a6ac43217c3a277982a62372",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": null,
                    "dsi_mimetype": "application/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 2568624,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                },
                {
                    "dsi_pid": "UQ:278002",
                    "dsi_dsid": "thumbnail_Grosch_t.jpg",
                    "dsi_checksum": "a66ad3ab13bb5f7139d5214a5feae79f",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": null,
                    "dsi_mimetype": "image/jpeg",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1422,
                    "dsi_security_policy": 1,
                    "dsi_security_inherited": 0
                }
            ],
            "rek_display_type_lookup": "Book Chapter",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "fez_internal_notes": {
                "ain_id": 133743,
                "ain_pid": "UQ:278002",
                "ain_detail": "#2293712 User \"Dr Geoff Wilkes (grgwilke)\" has indicated the following are issues on this record: Added files:\r\nGrosch.pdf\r\n\r\nhttp://events.sas.ac.uk/support-research/publications/946\r\n\r\nWilkes, Geoffrey T. (850) has supplied the following file uploads information:\r\n\r\nNotes: This is an NTRO, namely a translation (completed by me) of a scholarly book chapter written by Nils Grosch\r\n\r\nFiles uploaded: #2223391"
            },
            "fez_record_search_key_author_affiliation_name": [
                    "University of Salzburg",
                    "The University of Queensland",
            ],
            "fez_record_search_key_author_affiliation_type": [
                {
                    "rek_author_affiliation_type": 453989,
                    "rek_author_affiliation_type_lookup": "University"
                },
                {
                    "rek_author_affiliation_type": 453989,
                    "rek_author_affiliation_type_lookup": "University"
                }
            ],
            "fez_record_search_key_creator_contribution_statement": [
                "Missing",
                "<p>This is a translation (into English) by me of a book chapter witten (in German) by Prof. Grosch.</p>",
            ],
            "fez_record_search_key_quality_indicator": [
                {
                    "rek_quality_indicator": 453997,
                    "rek_quality_indicator_lookup": "Disseminated via internationally recognised outlet or entity"
                }
            ],
            "fez_record_search_key_significance": [
                {
                    "rek_significance_id": 1236645,
                    "rek_significance": 0,
                },
                {
                    "rek_significance_id": 1236646,
                    "rek_significance": 454027,
                    "rek_significance_lookup": "Minor"
                }
            ]
        },
    ]
};

export default hydrateMockSearchList(publicationTypeListBookChapter);
