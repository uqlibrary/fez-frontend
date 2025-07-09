import { hydrateMockSearchList } from '../../../helpers/general';

const internalTitleSearchList = {
    total: 7,
    per_page: 10,
    current_page: 1,
    from: 1,
    to: 7,
    data: [
        {
            rek_pid: 'UQ:795469',
            rek_status_lookup: 'Published',
            rek_security_inherited: 1,
            fez_record_search_key_author: ['Parker, Malcolm'],
            fez_record_search_key_author_id: [410],
            fez_record_search_key_isbn: ['9783319715797', '9783319715803'],
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof: 'UQ:218198',
                    rek_ismemberof_lookup: 'Unprocessed Records'
                }
            ],
            fez_record_search_key_place_of_publication: 'Cham',
            fez_record_search_key_contributor_id: [0, 0],
            rek_created_date: '2018-03-07T23:30:00Z',
            fez_record_search_key_contributor: ['El-Hawary, Ron', 'Eberson, Craig P.'],
            fez_record_search_key_publisher: 'Springer International Publishing',
            fez_record_search_key_doi: '10.1007/978-3-319-71580-3',
            rek_title: 'Early Onset Scoliosis',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453694,
                rek_oa_status_lookup: 'link (no DOI)'
            },
            fez_record_search_key_link: ["https://www.library.uq.edu.au/fryer-library/indigenous-voices"],
            fez_record_search_key_link_description: [
                "Browse Indigenous language resources from this collection online",
            ],
            rek_date: '2018-01-01T00:00:00Z',
            sources: [
                {
                    source: 'espace',
                    id: 'UQ:795469'
                },
                {
                    source: 'crossref',
                    id: '10.1007/978-3-319-71580-3'
                }
            ],
            rek_updated_date: '2018-03-14T03:11:09Z',
            rek_depositor: 6230,
            rek_display_type_lookup: 'Image',
            rek_display_type: 238,
            fez_record_search_key_advisory_statement: "Aboriginal and Torres Strait Islander people are warned that this photograph may contain images of Aboriginal and Islander people now deceased.",
            fez_datastream_info: [
                {
                    dsi_id: 2706296,
                    dsi_pid: 'UQ:252236',
                    dsi_dsid: 'My_UQ_eSpace_UPO_guidelines_2016.pdf',
                    dsi_embargo_date: '2018-01-01',
                    dsi_label: 'UPO Guide v.4',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 5,
                },
            ],
        },
        {
            rek_pid: 'UQ:342708',
            rek_title: 'Vaccination day',
            rek_description: null,
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '2014-06-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 8524,
            rek_created_date: '2014-10-21T01:43:26Z',
            rek_updated_date: '2017-09-22T13:28:50Z',
            rek_file_downloads: 0,
            rek_isi_loc: 12345678,
            rek_genre: 'Journal Article',
            rek_formatted_abstract: 'They enter<br /><br />in curves and stoops<br /><br />limping and tapping<br /><br />a file of bare arms<br /><br />creased faces uplifted<br /><br />red eyelids pouting<br /><br />eyes curtained in cataract.<br />',
            rek_depositor_affiliation: 898,
            rek_thomson_citation_count: 12,
            rek_subtype: 'Article (original research)',
            rek_scopus_doc_type: 'ar',
            rek_security_inherited: 1,
            rek_altmetric_score: 333,
            rek_altmetric_id: 123456,
            rek_copyright: 'on',
            fez_record_search_key_author: ['Parker, Malcolm'],
            fez_record_search_key_author_id: [410],
            fez_record_search_key_date_available: '2014-01-01T00:00:00Z',
            fez_record_search_key_doi: '10.1007/s11673-014-9531-6',
            fez_record_search_key_end_page: '161',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453221,
            fez_record_search_key_isi_loc: 'A1990EC45400046',
            fez_record_search_key_institutional_status: 453223,
            fez_record_search_key_ismemberof: ['UQ:237156', 'UQ:3831'],
            fez_record_search_key_issn: ['1176-7529', '1872-4353'],
            fez_record_search_key_issue_number: '2',
            fez_record_search_key_journal_name: 'Journal of Bioethical Inquiry',
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_oa_notes: 'Post print permissible - 12 months embargo.',
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_place_of_publication: 'Dordrecht, Netherlands',
            fez_record_search_key_publisher: 'Springer Netherlands',
            fez_record_search_key_refereed: 1,
            fez_record_search_key_refereed_source: '453635',
            fez_record_search_key_scopus_id: '2-s2.0-84957442577',
            fez_record_search_key_start_page: '161',
            fez_record_search_key_total_pages: '1',
            fez_record_search_key_volume_number: '11'
        },
        {
            rek_pid: 'UQ:288545',
            rek_title: 'Bacterial plaques staining composition <sup>for</sup> evaluating dental <sub>caries</sub> activity',
            rek_display_type: 185,
            rek_status: 2,
            rek_date: '2008-08-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 10923,
            rek_created_date: '2013-01-09T06:11:24Z',
            rek_updated_date: '2014-10-05T17:00:40Z',
            rek_genre: 'Patent',
            rek_genre_type: null,
            rek_formatted_title: null,
            rek_formatted_abstract:
                'PROBLEM TO BE SOLVED: To obtain a bacterial plaque staining composition for evaluating dental caries activity, which approximately simultaneously carries out bacterial plaque staining and dental caries activity evaluation and evaluates dental caries activity relatively accurately even in thick bacterial plaque in comparison with a conventional bacterial plaque staining composition.<br /><br />SOLUTION: The bacterial plaque staining composition for evaluating dental caries activity comprises a blue pigment that is soluble in water and does not change a color tone at pH7, a red pigment that is soluble in water at pH4.5 but not soluble in water and does not change a color tone at pH4.5 and a saccharide. The bacterial plaque staining composition comprises 1 pt.wt. of the total content of the blue pigment and the red pigment and 1-50 pts.wt. of saccharide content in the content ratio of the blue pigment to the red pigment of preferably 1:3-3:1.<br />',
            rek_depositor_affiliation: 840,
            rek_security_inherited: 1,
            rek_copyright: 'on',
            fez_record_search_key_author: [
                'Walsh, Laurence J',
                'Ota R',
                'Nagao S',
                'Sato T',
            ],
            fez_record_search_key_author_id: [471, 0, 0, 0],
            fez_record_search_key_country_of_issue: 'Japan',
            fez_record_search_key_ismemberof: ['UQ:3808'],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_patent_number: 'JP2008189575',
            fez_record_search_key_publisher: 'GC Corporation',
            fez_record_search_key_refereed_source: '453638',
            fez_record_search_key_subject: [270802, 270300, 320800],
        },
        {
            rek_pid: 'UQ:95980',
            rek_title: 'Lipid-core-peptides for vaccination.',
            rek_display_type: 130,
            rek_status: 2,
            rek_date: '2001-01-01T00:00:00Z',
            rek_object_type: 3,
            rek_created_date: '2007-08-24T00:08:15Z',
            rek_updated_date: '2014-10-05T07:33:29Z',
            rek_genre: 'Conference Paper',
            rek_subtype: 'Fully published paper',
            rek_security_inherited: 1,
            fez_record_search_key_author: [
                'Schubert, A.',
                'Olive, C.',
                'Wong, A. K.',
                'Good, M. F.',
                'Toth, I.',
                "de Crecy-Lagard, Valerie",
                "Diaz, Naryttza",
                "Disz, Terry",
                "Edwards, Robert",
                "Fonstein, Michael",
                "Frank, Ed D.",
                "Gerdes, Svetlana",
                "Glass, Elizabeth M.",
                "Goesmann, Alexander",
                "Hanson, Andrew",
                "Iwata-Reuyl, Dirk",
                "Jensen, Roy",
                "Jamshidi, Neema",
                "Krause, Lutz",
                "Kubal, Michael",
                "Larsen, Niels",
                "Linke, Burkhard",
                "McHardy, Alice C.",
                "Meyer, Folker",
                "Neuweger, Heiko",
                "Olsen, Gary",
                "Olsen, Robert",
                "Osterman, Andrei",
                "Portnoy, Vasiliy",
                "Pusch, Gordon D.",
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id: 27856,
                },
                {
                    rek_author_id: 25707,
                },
                {
                    rek_author_id: 18932,
                },
                {
                    rek_author_id: 24216,
                },
                {
                    rek_author_id: 1475,
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 88421,
                    "author": {
                        "aut_id": 88421,
                        "aut_orcid_id": "0000-0003-3806-0845",
                        "aut_title": "Associate Professor"
                    },
                    "rek_author_id_lookup": "Lutz Krause"
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }, {
                    "rek_author_id": 0,
                    "author": null
                }
            ],
            fez_record_search_key_conference_dates: '30 Nov 2001',
            fez_record_search_key_conference_location: 'Univerity of Queensland, Brisbane',
            fez_record_search_key_conference_name: 'Brisbane Biological & Organic Chemistry Symposium 2001',
            fez_record_search_key_herdc_code: 450018,
            fez_record_search_key_ismemberof: ['UQ:3833'],
            fez_record_search_key_place_of_publication: 'Brisbane',
            fez_record_search_key_proceedings_title: 'Brisbane Biological & Organic Chemistry Symposium 2001',
            fez_record_search_key_refereed_source: '453638',
            fez_record_search_key_subject: [320501, 450018, 450282],
            fez_record_search_key_volume_number: '2001'
        },
        {
            rek_pid: 'UQ:433847',
            rek_title: 'A state-based vaccination register',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '1998-07-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 41783,
            rek_created_date: '2017-02-01T15:00:38Z',
            rek_updated_date: '2017-08-10T20:06:04Z',
            rek_genre: 'Journal Article',
            rek_subtype: 'Letter to editor, brief commentary or brief communication',
            rek_security_inherited: 1,
            fez_record_search_key_author: [ 'Selvey, LA', 'Peterson, KV'],
            fez_record_search_key_author_id: [ 3280085, 0 ],
            fez_record_search_key_end_page: '59',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453220,
            fez_record_search_key_institutional_status: 453225,
            fez_record_search_key_isi_loc: '000074671800020',
            fez_record_search_key_ismemberof: [ 'UQ:183940' ],
            fez_record_search_key_issn: [ '0025-729X' ],
            fez_record_search_key_issue_number: '1',
            fez_record_search_key_journal_name: {
                rek_journal_name: 'Medical Journal of Australia'
            },
            fez_record_search_key_keywords: [],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_publisher: 'AUSTRALASIAN MED PUBL CO LTD',
            fez_record_search_key_refereed_source: '453635',
            fez_record_search_key_start_page: '59',
            fez_record_search_key_total_pages: '1',
            fez_record_search_key_volume_number: '169',
        },
        {
            rek_pid: 'UQ:215681',
            rek_title: 'Rheumatic complications of influenza vaccination',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '1994-10-01T00:00:00Z',
            rek_object_type: 3,
            rek_created_date: '2010-09-07T10:01:15Z',
            rek_updated_date: '2017-09-24T01:04:27Z',
            rek_genre: 'Journal Article',
            rek_depositor_affiliation: 788,
            rek_thomson_citation_count: 20,
            rek_subtype: 'Other',
            rek_scopus_citation_count: 25,
            rek_wok_doc_type: 'N',
            rek_pubmed_doc_type: null,
            rek_security_inherited: 1,
            rek_altmetric_score: 4,
            rek_altmetric_id: 11749800,
            rek_copyright: 'on',
            fez_record_search_key_author: ['Brown, M. A.', 'Bertouch, J. V.'],
            fez_record_search_key_author_id: [3728, 0],
            fez_record_search_key_doi: '10.1111/j.1445-5994.1994.tb01760.x',
            fez_record_search_key_end_page: '573',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453220,
            fez_record_search_key_institutional_status: 453225,
            fez_record_search_key_isi_loc: 'A1994PP66100010',
            fez_record_search_key_ismemberof: ['UQ:3931'],
            fez_record_search_key_issn: ['0004-8291'],
            fez_record_search_key_issue_number: '5',
            fez_record_search_key_journal_name: 'Australian and New Zealand Journal of Medicine',
            fez_record_search_key_keywords: ['Immunization',],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_link: ['http://onlinelibrary.wiley.com/journal/10.1111/%28ISSN%291445-5994'],
            fez_record_search_key_link_description: ['Journal website'],
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_oa_status_type: null,
            fez_record_search_key_org_name: null,
            fez_record_search_key_org_unit_name: null,
            fez_record_search_key_original_format: null,
            fez_record_search_key_parent_publication: null,
            fez_record_search_key_patent_number: null,
            fez_record_search_key_period: [],
            fez_record_search_key_place_of_publication: 'Sydney, NSW, Australia',
            fez_record_search_key_publisher: 'Adis International',
            fez_record_search_key_refereed_source: '453634',
            fez_record_search_key_scopus_id: '2-s2.0-0028527457',
            fez_record_search_key_start_page: '572',
            fez_record_search_key_subject: [452090, 452548],
            fez_record_search_key_total_pages: '2',
            fez_record_search_key_volume_number: '24'
        },
        {
            rek_pid: 'UQ:175986',
            rek_title: 'Patient care drives mandatory vaccination',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '2008-11-01T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 1655,
            rek_created_date: '2009-04-15T16:04:56Z',
            rek_updated_date: '2017-09-24T00:38:21Z',
            rek_file_downloads: 0,
            rek_citation: '<a class="author_id_link" title="Browse by Author ID for Lambert, Stephen B." href="/list/author_id/72497/">Lambert, Stephen B.</a> (<span class="citation_date">2008</span>) <a class="citation_title" title="Click to view Journal Article: Patient care drives mandatory vaccination" href="/view/UQ:175986">Patient care drives mandatory vaccination</a>. <i><span class="citation_journal_name">British Medical Journal</span></i>, <i><span class="citation_volume_number">337</span></i> <span class="citation_issue_number">7680</span>: <span class="citation_start_page">1188</span>-<span class="citation_end_page">1188</span>. doi:<span class="citation_doi">10.1136/bmj.a2588</span>',
            rek_genre: 'Journal Article',
            rek_depositor_affiliation: 970,
            rek_thomson_citation_count: 4,
            rek_subtype: 'Article (original research)',
            rek_scopus_citation_count: 1,
            rek_scopus_doc_type: 'le',
            rek_wok_doc_type: 'L',
            rek_security_inherited: 1,
            rek_altmetric_score: 0,
            rek_altmetric_id: 0,
            rek_copyright: 'on',
            fez_record_search_key_assigned_user_id: [1655],
            fez_record_search_key_author: ['Lambert, Stephen B.'],
            fez_record_search_key_author_id: [72497],
            fez_record_search_key_contributor: ['F. Godlee'],
            fez_record_search_key_doi: '10.1136/bmj.a2588',
            fez_record_search_key_edition: null,
            fez_record_search_key_end_date: null,
            fez_record_search_key_end_page: '1188',
            fez_record_search_key_herdc_code: 450013,
            fez_record_search_key_herdc_status: 453221,
            fez_record_search_key_institutional_status: 453224,
            fez_record_search_key_isi_loc: '000262654000015',
            fez_record_search_key_ismemberof: ['UQ:138536', 'UQ:254105', 'UQ:7573'],
            fez_record_search_key_issn: ['0959-8146', '0959-535X'],
            fez_record_search_key_issue_number: '7680',
            fez_record_search_key_journal_name: 'British Medical Journal',
            fez_record_search_key_keywords: [
                'Healthcare workers',
                'Mandatory vaccination',
                'Patient care',
                'Vaccine',
            ],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_notes: 'Letters: "Mandatory flu vaccination"',
            fez_record_search_key_oa_status: 453698,
            fez_record_search_key_place_of_publication: 'London, United Kingdom',
            fez_record_search_key_publisher: 'BMJ Publishing Group',
            fez_record_search_key_refereed: 1,
            fez_record_search_key_refereed_source: '453635',
            fez_record_search_key_scopus_id: '2-s2.0-57349138348',
            fez_record_search_key_start_page: '1188',
            fez_record_search_key_subject: [450009, 451393, 451447, 452107, 452111 ],
            fez_record_search_key_total_pages: '1',
            fez_record_search_key_volume_number: '337'
        },
        {
            rek_pid: 'UQ:66e9f53',
            rek_title: 'Fluid mechanics in turbulent times: what can we learn in 2020?',
            rek_description: null,
            rek_display_type: 130,
            rek_status: 2,
            rek_date: '2020-12-11T00:00:00Z',
            rek_object_type: 3,
            rek_depositor: 41783,
            rek_created_date: '2020-11-17T04:30:51Z',
            rek_updated_date: '2020-11-18T04:47:52Z',
            rek_formatted_abstract:
                'The Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020 focus on many aspects of fluid mechanics and their applications, especially in terms of diversity, challenges, ecology, and public health relevant to the 21st century. The event organisation aimed to facilitate the sharing of information among biomedical, chemical, civil, environmental, mechanical, mining, nuclear and water engineers coming from different regions, universities, industries and background, including developed and developing countries, and students, young and senior professionals. After reviewing the challenges associated with fluid mechanics in terms of diversity, challenges, ecology, public health, socio-economics into the 21st century, the proceedings peer-review process is detailed. The proceedings contents are listed, as well as the AFMC2020 organisation. At the end, the reviewers are acknowledged.',
            rek_subtype: 'Fully published paper',
            rek_security_inherited: 1,
            rek_copyright: 'on',
            rek_security_policy: 1,
            fez_record_search_key_author: ['Chanson, Hubert', 'Brown, Richard', 'Kani, Michel'],
            fez_record_search_key_author_id: [
                {
                    rek_author_id: 0,
                    author: null,
                },
                {
                    rek_author_id: 0,
                    author: null,
                },
                {
                    rek_author_id: 0,
                    author: null,
                },
            ],
            fez_record_search_key_conference_dates: '7-10 December 2020',
            fez_record_search_key_conference_location: 'Brisbane, Australia',
            fez_record_search_key_conference_name: '22nd Australasian Fluid Mechanics Conference AFMC2020',
            fez_record_search_key_contributor: ['Abel, Gillian', 'Fitzgerald, Lisa', 'Healy, Catherine'],
            fez_record_search_key_contributor_id: [
                {
                    "rek_contributor_id": 0,
                }, {
                    "rek_contributor_id": 74066,
                    "rek_contributor_id_lookup": "Fitzgerald, Lisa J."
                }, {
                    "rek_contributor_id": 0,
                }
            ],
            fez_record_search_key_doi: '10.14264/66e9f53',
            fez_record_search_key_file_attachment_name: ['placeholder_2020xt.txt'],
            fez_record_search_key_herdc_code: {
                rek_herdc_code: 450014,
                rek_herdc_code_lookup: 'E1',
            },
            fez_record_search_key_herdc_status: {
                rek_herdc_status: 453220,
                rek_herdc_status_lookup: 'Provisional Code',
            },
            fez_record_search_key_isbn: ['9781742723419'],
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof: 'UQ:ffbf03a',
                    parent: {
                        rek_pid: 'UQ:ffbf03a',
                        rek_security_policy: 1,
                        rek_datastream_policy: 0,
                    },
                    rek_ismemberof_lookup:
                        'Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020 (Holding collection)',
                },
            ],
            fez_record_search_key_keywords: [
                'Fluid mechanics',
                'Australasia',
                'AFMC2020',
                'Challenges',
                'Diversity',
                'Ecology',
                'Public Health',
                'Peer-review process',
                'Proceedings',
            ],
            fez_record_search_key_language: ['eng'],
            fez_record_search_key_license: {
                rek_license: 453610,
                rek_license_lookup: 'Creative Commons Attribution-NonCommercial 3.0 International (CC BY-NC 3.0)',
            },
            fez_record_search_key_notes: 'Conference paper number:E1',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
                rek_oa_status_lookup: 'File (Publisher version)',
            },
            fez_record_search_key_place_of_publication: 'Brisbane, Australia',
            fez_record_search_key_proceedings_title:
                'Proceedings of the 22nd Australasian Fluid Mechanics Conference AFMC2020',
            fez_record_search_key_publisher: 'The University of Queensland',
            fez_record_search_key_security_policy: [1],
            rek_display_type_lookup: 'Conference Paper',
            rek_object_type_lookup: 'Record',
            rek_status_lookup: 'Published',
            rek_wok_doc_type_lookup: 'Abstract of Published Item',
        }
    ],
    filters: {
        facets: {
            'Scopus document type': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 'ar',
                        doc_count: 35
                    },
                    {
                        key: 're',
                        doc_count: 4
                    },
                    {
                        key: 'ed',
                        doc_count: 1
                    },
                    {
                        key: 'ip',
                        doc_count: 1
                    }
                ]
            },
            'Display type': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 179,
                        doc_count: 55
                    },
                    {
                        key: 130,
                        doc_count: 13
                    }
                ]
            },
            Keywords: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 436,
                buckets: [
                    {
                        key: 'Cell Biology',
                        doc_count: 19
                    },
                    {
                        key: 'Biochemistry & Molecular Biology',
                        doc_count: 11
                    },
                    {
                        key: 'CELL BIOLOGY',
                        doc_count: 8
                    },
                    {
                        key: '3t3-l1 Adipocytes',
                        doc_count: 7
                    },
                    {
                        key: 'Plasma-membrane',
                        doc_count: 7
                    }
                ]
            },
            'Scopus document type (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: []
            },
            'Subject (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 66,
                buckets: [
                    {
                        key: 'C1',
                        doc_count: 19
                    },
                    {
                        key: '1300 Biochemistry, Genetics and Molecular Biology',
                        doc_count: 9
                    },
                    {
                        key: '270104 Membrane Biology',
                        doc_count: 8
                    },
                    {
                        key: '780105 Biological sciences',
                        doc_count: 8
                    },
                    {
                        key: '2700 Medicine',
                        doc_count: 7
                    }
                ]
            },
            'Collection (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 61,
                buckets: [
                    {
                        key: 'Institute for Molecular Bioscience - Publications',
                        doc_count: 31
                    },
                    {
                        key: 'Queensland Brain Institute Publications',
                        doc_count: 18
                    },
                    {
                        key: 'ResearcherID Downloads - Archived',
                        doc_count: 17
                    },
                    {
                        key: 'Excellence in Research Australia (ERA) - Collection',
                        doc_count: 12
                    },
                    {
                        key: 'Australian Institute for Bioengineering and Nanotechnology Publications',
                        doc_count: 8
                    }
                ]
            },
            'Year published': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 45,
                buckets: [
                    {
                        key: '1994',
                        doc_count: 5
                    },
                    {
                        key: '2012',
                        doc_count: 5
                    },
                    {
                        key: '2013',
                        doc_count: 5
                    },
                    {
                        key: '1998',
                        doc_count: 4
                    },
                    {
                        key: '2000',
                        doc_count: 4
                    }
                ]
            },
            'Author (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 185,
                buckets: [
                    {
                        key: 'Martin, Sally',
                        doc_count: 68
                    },
                    {
                        key: 'Parton, Robert G.',
                        doc_count: 22
                    },
                    {
                        key: 'Meunier, Frederic A.',
                        doc_count: 13
                    },
                    {
                        key: 'Andreas Papadopulos',
                        doc_count: 9
                    },
                    {
                        key: 'Rachel Sarah Gormal',
                        doc_count: 8
                    }
                ]
            },
            Subject: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 66,
                buckets: [
                    {
                        key: 450009,
                        doc_count: 19
                    },
                    {
                        key: 453239,
                        doc_count: 9
                    },
                    {
                        key: 270104,
                        doc_count: 8
                    },
                    {
                        key: 450774,
                        doc_count: 8
                    },
                    {
                        key: 453253,
                        doc_count: 7
                    }
                ]
            },
            'Journal name': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 44,
                buckets: [
                    {
                        key: 'Journal of Biological Chemistry',
                        doc_count: 5
                    },
                    {
                        key: 'Molecular Biology of The Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Molecular Biology of the Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Biochemical Journal',
                        doc_count: 4
                    },
                    {
                        key: 'Journal of Cell Biology',
                        doc_count: 4
                    }
                ]
            },
            Collection: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 61,
                buckets: [
                    {
                        key: 'UQ:3858',
                        doc_count: 31
                    },
                    {
                        key: 'UQ:23912',
                        doc_count: 18
                    },
                    {
                        key: 'UQ:682195',
                        doc_count: 17
                    },
                    {
                        key: 'UQ:152266',
                        doc_count: 12
                    },
                    {
                        key: 'UQ:3860',
                        doc_count: 8
                    }
                ]
            },
            Author: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 185,
                buckets: [
                    {
                        key: 745,
                        doc_count: 68
                    },
                    {
                        key: 824,
                        doc_count: 22
                    },
                    {
                        key: 2746,
                        doc_count: 13
                    },
                    {
                        key: 89985,
                        doc_count: 9
                    },
                    {
                        key: 10992,
                        doc_count: 8
                    }
                ]
            },
            Genre: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 5,
                buckets: [
                    {
                        key: 'Article (original research)',
                        doc_count: 49
                    },
                    {
                        key: 'Molecular Biology of the Cell',
                        doc_count: 5
                    },
                    {
                        key: 'Review of research - research literature review (NOT book review',
                        doc_count: 4
                    },
                    {
                        key: 'Biochemical Society Transactions',
                        doc_count: 1
                    },
                    {
                        key: 'Chemistry and Physics of Lipids',
                        doc_count: 1
                    }
                ]
            },
            Subtype: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 2,
                buckets: [
                    {
                        key: 'Article (original research)',
                        doc_count: 50
                    },
                    {
                        key: 'Published abstract',
                        doc_count: 9
                    },
                    {
                        key: 'Critical review of research, literature review, critical commentary',
                        doc_count: 3
                    },
                    {
                        key: 'Fully published paper',
                        doc_count: 2
                    },
                    {
                        key: 'Editorial',
                        doc_count: 1
                    }
                ]
            },
            'Display type (lookup)': {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                    {
                        key: 'Journal Article',
                        doc_count: 55
                    },
                    {
                        key: 'Conference Paper',
                        doc_count: 13
                    }
                ]
            }
        }
    }
};
export default hydrateMockSearchList(internalTitleSearchList);