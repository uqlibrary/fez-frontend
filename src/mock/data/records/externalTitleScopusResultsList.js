import { hydrateMockSearchList } from '../../hydrateMock';

const externalTitleScopusResultsList = {
    "total": 4,
    "data": [
        {
            "rek_pid": 'UQ:567364',
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:308300",
                    "rek_ismemberof_order": 1
                }
            ],
            "rek_object_type": 3,
            "rek_status": 2,
            "fez_record_search_key_publisher": {
                "rek_publisher": "Elsevier Ltd"
            },
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453337,
                    "rek_subject_order": 1
                },
                {
                    "rek_subject": 453437,
                    "rek_subject_order": 2
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                {
                    "rek_author_affiliation_name": "Control and Modelling Group (GCOM),Department of Electrical Engineering,Federal University of S\u00e3o Jo\u00e3o del-Rei",
                    "rek_author_affiliation_name_order": 1
                },
                {
                    "rek_author_affiliation_name": "Department of Mathematics,Federal University of Minas Gerais",
                    "rek_author_affiliation_name_order": 2
                },
                {
                    "rek_author_affiliation_name": "Department of Electronic Engineering,School of Engineering,Federal University of Minas Gerais",
                    "rek_author_affiliation_name_order": 3
                }
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                {
                    "rek_author_affiliation_full_address": "S\u00e3o Jo\u00e3o del-Rei,MG",
                    "rek_author_affiliation_full_address_order": 1
                },
                {
                    "rek_author_affiliation_full_address": "Belo Horizonte,MG",
                    "rek_author_affiliation_full_address_order": 2
                },
                {
                    "rek_author_affiliation_full_address": "Belo Horizonte,MG",
                    "rek_author_affiliation_full_address_order": 3
                }
            ],
            "fez_record_search_key_author_affiliation_country": [
                {
                    "rek_author_affiliation_country": "bra",
                    "rek_author_affiliation_country_order": 1
                },
                {
                    "rek_author_affiliation_country": "bra",
                    "rek_author_affiliation_country_order": 2
                },
                {
                    "rek_author_affiliation_country": "bra",
                    "rek_author_affiliation_country_order": 3
                }
            ],
            "rek_scopus_citation_count": "0",
            "fez_record_search_key_corresponding_name": [
                {
                    "rek_corresponding_name": "Nepomuceno E.G.",
                    "rek_corresponding_name_order": 1
                }
            ],
            "fez_record_search_key_corresponding_email": [
                {
                    "rek_corresponding_email": "nepomuceno@ufsj.edu.br",
                    "rek_corresponding_email_order": 1
                }
            ],
            "fez_record_search_key_corresponding_organization": [
                {
                    "rek_corresponding_organization": "Control and Modelling Group (GCOM),Department of Electrical Engineering,Federal University of S\u00e3o Jo\u00e3o del-Rei",
                    "rek_corresponding_organization_order": 1
                }
            ],
            "fez_record_search_key_corresponding_country": [
                {
                    "rek_corresponding_country": "bra",
                    "rek_corresponding_country_order": 1
                }
            ],
            "rek_description": "The present study has investigated mixed control strategy to reduce the required level of vaccination to eradicate a disease. It is well known that despite the advances on the development of new vaccines and control strategies to eradicate diseases, many diseases such as measles, tuberculosis and flu are still persistent. Any effort made to bring some light in this issue should be considered and developed. Here, we present a dynamic analysis of the SIR model to develop a simple but efficient strategy of control based on the simultaneously application of vaccination and isolation. We show how to significantly decrease the required level of vaccination to eradicate a disease. We have also found that a growth in population decreases the effects of isolation in the required time to eradicate a disease. Finally, we noticed that the effect of isolation for both fixed size population or variable population is more significant for lower levels of vaccination, which is particularly interesting in real life situations, where the high levels of vaccination are not undertaken. Numerical simulations are provided to show the effectiveness of the proposed technique.",
            "fez_record_search_key_keywords": [
                {
                    "rek_keywords": "Biological systems",
                    "rek_keywords_order": 1
                },
                {
                    "rek_keywords": "Disease dynamics",
                    "rek_keywords_order": 2
                },
                {
                    "rek_keywords": "Epidemiology",
                    "rek_keywords_order": 3
                },
                {
                    "rek_keywords": "Isolation",
                    "rek_keywords_order": 4
                },
                {
                    "rek_keywords": "Mixed control",
                    "rek_keywords_order": 5
                },
                {
                    "rek_keywords": "SIR Model",
                    "rek_keywords_order": 6
                },
                {
                    "rek_keywords": "Vaccination",
                    "rek_keywords_order": 7
                }
            ],
            "rek_title": "Reducing vaccination level to eradicate a disease by means of a mixed control with isolation",
            "fez_record_search_key_doi": {
                "rek_doi": "10.1016\/j.bspc.2017.09.004"
            },
            "fez_record_search_key_issn": [
                {
                    "rek_issn": "17468108 17468094",
                    "rek_issn_order": 1
                }
            ],
            "rek_date": "2018-02-01T00:00:00Z",
            "fez_record_search_key_volume_number": {
                "rek_volume_number": "40"
            },
            "fez_record_search_key_start_page": {
                "rek_start_page": "83"
            },
            "fez_record_search_key_end_page": {
                "rek_end_page": "90"
            },
            "fez_record_search_key_total_pages": {
                "rek_total_pages": "8"
            },
            "fez_record_search_key_embase_id": {
                "rek_embase_id": "618277665"
            },
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id": "2-s2.0-85029547144"
            },
            "fez_record_search_key_language": [
                {
                    "rek_language": "eng",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_license": null,
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": "453224"
            },
            "rek_scopus_doc_type": "ar",
            "rek_display_type": 179,
            "rek_genre": "Journal Article",
            "rek_genre_type": "Article (original research)",
            "rek_subtype": "Article (original research)",
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "Biomedical Signal Processing and Control"
            },
            "fez_record_search_key_author": [
                {
                    "rek_author": "Nepomuceno, Erivelton G.",
                    "rek_author_order": 1
                },
                {
                    "rek_author": "Takahashi, Ricardo H.C.",
                    "rek_author_order": 2
                },
                {
                    "rek_author": "Aguirre, Luis A.",
                    "rek_author_order": 3
                }
            ],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 6603006224,
                        "aut_display_name": "Nepomuceno E.G.",
                        "aut_fname": "Erivelton G.",
                        "aut_lname": "Nepomuceno",
                        "aut_email": "nepomuceno@ufsj.edu.br"
                    }
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56647455500,
                        "aut_display_name": "Takahashi R.H.C.",
                        "aut_fname": "Ricardo H.C.",
                        "aut_lname": "Takahashi",
                        "aut_email": ""
                    }
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 3,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 7005475778,
                        "aut_display_name": "Aguirre L.A.",
                        "aut_fname": "Luis A.",
                        "aut_lname": "Aguirre",
                        "aut_email": "aguirre@cpdee.ufmg.br"
                    }
                }
            ]
        },
        {
            "rek_pid": 'UQ:768456',
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:308300",
                    "rek_ismemberof_order": 1
                }
            ],
            "rek_object_type": 3,
            "rek_status": 2,
            "fez_record_search_key_publisher": {
                "rek_publisher": "Elsevier B.V."
            },
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453444,
                    "rek_subject_order": 1
                },
                {
                    "rek_subject": 453397,
                    "rek_subject_order": 2
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                {
                    "rek_author_affiliation_name": "Centre for Evaluation of Vaccination,Vaccine and Infectious Diseases Institute,University of Antwerp",
                    "rek_author_affiliation_name_order": 1
                },
                {
                    "rek_author_affiliation_name": "Unit of Cancer Epidemiology,Belgian Cancer Centre,Scientific Institute of Public Health",
                    "rek_author_affiliation_name_order": 2
                },
                {
                    "rek_author_affiliation_name": "P95,Epidemiology and Pharmacovigilance Consulting and Services",
                    "rek_author_affiliation_name_order": 3
                },
                {
                    "rek_author_affiliation_name": "Cancer Research Epidemiology Program,Catalan Institute of Oncology,IDIBELL",
                    "rek_author_affiliation_name_order": 4
                },
                {
                    "rek_author_affiliation_name": "Cancer Research Epidemiology Program,Catalan Institute of Oncology,IDIBELL",
                    "rek_author_affiliation_name_order": 5
                },
                {
                    "rek_author_affiliation_name": "Department of Women's Health Medicine,Hokkaido University Graduate School of Medicine",
                    "rek_author_affiliation_name_order": 6
                },
                {
                    "rek_author_affiliation_name": "Vaccine Confidence Project,London School of Hygiene & Tropical Medicine",
                    "rek_author_affiliation_name_order": 7
                },
                {
                    "rek_author_affiliation_name": "Department of Translational Research and New Technologies in Medicine and Surgery,University of Pisa",
                    "rek_author_affiliation_name_order": 8
                },
                {
                    "rek_author_affiliation_name": "Health Protection Scotland",
                    "rek_author_affiliation_name_order": 9
                },
                {
                    "rek_author_affiliation_name": "Immunisation,Hepatitis & Blood Safety Department,Public Health England",
                    "rek_author_affiliation_name_order": 10
                },
                {
                    "rek_author_affiliation_name": "Centre for Evaluation of Vaccination,Vaccine and Infectious Diseases Institute,University of Antwerp",
                    "rek_author_affiliation_name_order": 11
                }
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                {
                    "rek_author_affiliation_full_address": "Antwerp",
                    "rek_author_affiliation_full_address_order": 1
                },
                {
                    "rek_author_affiliation_full_address": "Brussels",
                    "rek_author_affiliation_full_address_order": 2
                },
                {
                    "rek_author_affiliation_full_address": "Leuven",
                    "rek_author_affiliation_full_address_order": 3
                },
                {
                    "rek_author_affiliation_full_address": "Barcelona",
                    "rek_author_affiliation_full_address_order": 4
                },
                {
                    "rek_author_affiliation_full_address": "Barcelona",
                    "rek_author_affiliation_full_address_order": 5
                },
                {
                    "rek_author_affiliation_full_address": "Kita Ku,Sapporo",
                    "rek_author_affiliation_full_address_order": 6
                },
                {
                    "rek_author_affiliation_full_address": "London",
                    "rek_author_affiliation_full_address_order": 7
                },
                {
                    "rek_author_affiliation_full_address": "Glasgow,Scotland",
                    "rek_author_affiliation_full_address_order": 8
                },
                {
                    "rek_author_affiliation_full_address": "London",
                    "rek_author_affiliation_full_address_order": 9
                },
                {
                    "rek_author_affiliation_full_address": "Antwerp",
                    "rek_author_affiliation_full_address_order": 10
                }
            ],
            "fez_record_search_key_author_affiliation_country": [
                {
                    "rek_author_affiliation_country": "bel",
                    "rek_author_affiliation_country_order": 1
                },
                {
                    "rek_author_affiliation_country": "bel",
                    "rek_author_affiliation_country_order": 2
                },
                {
                    "rek_author_affiliation_country": "bel",
                    "rek_author_affiliation_country_order": 3
                },
                {
                    "rek_author_affiliation_country": "esp",
                    "rek_author_affiliation_country_order": 4
                },
                {
                    "rek_author_affiliation_country": "esp",
                    "rek_author_affiliation_country_order": 5
                },
                {
                    "rek_author_affiliation_country": "jpn",
                    "rek_author_affiliation_country_order": 6
                },
                {
                    "rek_author_affiliation_country": "gbr",
                    "rek_author_affiliation_country_order": 7
                },
                {
                    "rek_author_affiliation_country": "ita",
                    "rek_author_affiliation_country_order": 8
                },
                {
                    "rek_author_affiliation_country": "gbr",
                    "rek_author_affiliation_country_order": 9
                },
                {
                    "rek_author_affiliation_country": "gbr",
                    "rek_author_affiliation_country_order": 10
                },
                {
                    "rek_author_affiliation_country": "bel",
                    "rek_author_affiliation_country_order": 11
                }
            ],
            "rek_scopus_citation_count": "0",
            "fez_record_search_key_corresponding_name": [
                {
                    "rek_corresponding_name": "Vorsters A.",
                    "rek_corresponding_name_order": 1
                }
            ],
            "fez_record_search_key_corresponding_email": [
                {
                    "rek_corresponding_email": "alex.vorsters@uantwerpen.be",
                    "rek_corresponding_email_order": 1
                }
            ],
            "fez_record_search_key_corresponding_organization": [
                {
                    "rek_corresponding_organization": "Centre for Evaluation of Vaccination,Vaccine and Infectious Diseases Institute,University of Antwerp",
                    "rek_corresponding_organization_order": 1
                }
            ],
            "fez_record_search_key_corresponding_country": [
                {
                    "rek_corresponding_country": "bel",
                    "rek_corresponding_country_order": 1
                }
            ],
            "rek_description": "The Human Papillomavirus Prevention and Control Board brought together experts to discuss optimizing HPV vaccination and screening programs. Board members reviewed the safety profile of licensed HPV vaccines based on clinical and post-marketing data, reaching a consensus that current safety data is reassuring. Successful vaccination programs used well-coordinated communication campaigns, integrating (social) media to spread awareness. Communication of evidence supporting vaccine effectiveness had beneficial effects on the perception of the vaccine. However, anti-vaccination campaigns have threatened existing programs in many countries. Measurement and monitoring of HPV vaccine confidence over time could help understand the nature and scale of waning confidence, define issues and intervene appropriately using context-specific evidence-based strategies. Finally, a broad group of stakeholders, such as teachers, health care providers and the media should also be provided with accurate information and training to help support prevention efforts through enhanced understanding of the risks and benefits of vaccination. Similarly, while cervical cancer screening through population-based programs is highly effective, barriers to screening exist: awareness in countries with population-based screening programs, access for vulnerable populations, and access and affordability in low- and middle-income countries. Integration of primary and secondary prevention has the potential to accelerate the decrease in cervical cancer incidence.",
            "fez_record_search_key_grant_id": [
                {
                    "rek_grant_id": "2014 SGR 756",
                    "rek_grant_id_order": 1
                }
            ],
            "fez_record_search_key_grant_agency": [
                {
                    "rek_grant_agency": "Ag\u00e8ncia de Gesti\u00f3 d\u2019Ajuts Universitaris i de Recerca",
                    "rek_grant_agency_order": 1
                },
                {
                    "rek_grant_agency": "Merck",
                    "rek_grant_agency_order": 2
                },
                {
                    "rek_grant_agency": "Roche",
                    "rek_grant_agency_order": 3
                },
                {
                    "rek_grant_agency": "Universiteit Antwerpen",
                    "rek_grant_agency_order": 4
                }
            ],
            "fez_record_search_key_grant_acronym": [
                {
                    "rek_grant_acronym": "AGAUR",
                    "rek_grant_acronym_order": 1
                }
            ],
            "fez_record_search_key_grant_text": [
                {
                    "rek_grant_text": "SdS receives partial support from AGAUR, Generalitat de Catalunya (2014 SGR 756)",
                    "rek_grant_text_order": 1
                }
            ],
            "fez_record_search_key_keywords": [
                {
                    "rek_keywords": "(max 6) Human papillomavirus",
                    "rek_keywords_order": 1
                },
                {
                    "rek_keywords": "Barriers",
                    "rek_keywords_order": 2
                },
                {
                    "rek_keywords": "Screening",
                    "rek_keywords_order": 3
                },
                {
                    "rek_keywords": "Vaccine",
                    "rek_keywords_order": 4
                },
                {
                    "rek_keywords": "Vaccine confidence",
                    "rek_keywords_order": 5
                }
            ],
            "rek_title": "Overcoming barriers in HPV vaccination and screening programs",
            "fez_record_search_key_doi": {
                "rek_doi": "10.1016\/j.pvr.2017.07.001"
            },
            "fez_record_search_key_issn": [
                {
                    "rek_issn": "2405-8521",
                    "rek_issn_order": 1
                }
            ],
            "rek_date": "2017-12-01T00:00:00Z",
            "fez_record_search_key_volume_number": {
                "rek_volume_number": "4"
            },
            "fez_record_search_key_start_page": {
                "rek_start_page": "45"
            },
            "fez_record_search_key_end_page": {
                "rek_end_page": "53"
            },
            "fez_record_search_key_total_pages": {
                "rek_total_pages": "9"
            },
            "fez_record_search_key_embase_id": {
                "rek_embase_id": "617515024"
            },
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id": "2-s2.0-85026395122"
            },
            "fez_record_search_key_language": [
                {
                    "rek_language": "eng",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_license": null,
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": "453224"
            },
            "rek_scopus_doc_type": "cp",
            "rek_display_type": 130,
            "rek_genre": "Conference Paper",
            "rek_genre_type": "Fully published paper",
            "rek_subtype": "Fully published paper",
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "Papillomavirus Research"
            },
            "fez_record_search_key_author": {
                "0": {
                    "rek_author": "Vorsters, Alex",
                    "rek_author_order": 1
                },
                "10": {
                    "rek_author": "Van Damme, Pierre",
                    "rek_author_order": 11
                },
                "1": {
                    "rek_author": "Arbyn, Marc",
                    "rek_author_order": 2
                },
                "2": {
                    "rek_author": "Baay, Marc",
                    "rek_author_order": 3
                },
                "3": {
                    "rek_author": "Bosch, Xavier",
                    "rek_author_order": 4
                },
                "4": {
                    "rek_author": "de Sanjos\u00e9, Silvia",
                    "rek_author_order": 5
                },
                "5": {
                    "rek_author": "Hanley, Sharon",
                    "rek_author_order": 6
                },
                "6": {
                    "rek_author": "Karafillakis, Emilie",
                    "rek_author_order": 7
                },
                "7": {
                    "rek_author": "Lopalco, Pier Luigi",
                    "rek_author_order": 8
                },
                "8": {
                    "rek_author": "Pollock, Kevin G.",
                    "rek_author_order": 9
                },
                "9": {
                    "rek_author": "Yarwood, Joanne",
                    "rek_author_order": 10
                }
            },
            "fez_record_search_key_author_id": {
                "0": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 23109625700,
                        "aut_display_name": "Vorsters A.",
                        "aut_fname": "Alex",
                        "aut_lname": "Vorsters",
                        "aut_email": "alex.vorsters@uantwerpen.be"
                    }
                },
                "10": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 11,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 7101714318,
                        "aut_display_name": "Van Damme P.",
                        "aut_fname": "Pierre",
                        "aut_lname": "Van Damme",
                        "aut_email": ""
                    }
                },
                "1": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 6701473074,
                        "aut_display_name": "Arbyn M.",
                        "aut_fname": "Marc",
                        "aut_lname": "Arbyn",
                        "aut_email": ""
                    }
                },
                "2": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 3,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 6603831059,
                        "aut_display_name": "Baay M.",
                        "aut_fname": "Marc",
                        "aut_lname": "Baay",
                        "aut_email": ""
                    }
                },
                "3": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 4,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 23990295900,
                        "aut_display_name": "Bosch X.",
                        "aut_fname": "Xavier",
                        "aut_lname": "Bosch",
                        "aut_email": ""
                    }
                },
                "4": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 5,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 54790529200,
                        "aut_display_name": "de Sanjose S.",
                        "aut_fname": "Silvia",
                        "aut_lname": "de Sanjos\u00e9",
                        "aut_email": ""
                    }
                },
                "5": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 6,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 40361080700,
                        "aut_display_name": "Hanley S.",
                        "aut_fname": "Sharon",
                        "aut_lname": "Hanley",
                        "aut_email": ""
                    }
                },
                "6": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 7,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56568430800,
                        "aut_display_name": "Karafillakis E.",
                        "aut_fname": "Emilie",
                        "aut_lname": "Karafillakis",
                        "aut_email": ""
                    }
                },
                "7": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 8,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 23992957700,
                        "aut_display_name": "Lopalco P.L.",
                        "aut_fname": "Pier Luigi",
                        "aut_lname": "Lopalco",
                        "aut_email": ""
                    }
                },
                "8": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 9,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 8973894100,
                        "aut_display_name": "Pollock K.G.",
                        "aut_fname": "Kevin G.",
                        "aut_lname": "Pollock",
                        "aut_email": ""
                    }
                },
                "9": {
                    "rek_author_id": 0,
                    "rek_author_id_order": 10,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 16240136700,
                        "aut_display_name": "Yarwood J.",
                        "aut_fname": "Joanne",
                        "aut_lname": "Yarwood",
                        "aut_email": ""
                    }
                }
            }
        },
        {
            "rek_pid": 'UQ:768457',
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:308300",
                    "rek_ismemberof_order": 1
                }
            ],
            "rek_object_type": 3,
            "rek_status": 2,
            "fez_record_search_key_publisher": {
                "rek_publisher": "Nature Publishing Group"
            },
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453236,
                    "rek_subject_order": 1
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                {
                    "rek_author_affiliation_name": "Frankfurt Institute for Advanced Studies",
                    "rek_author_affiliation_name_order": 1
                },
                {
                    "rek_author_affiliation_name": "Frankfurt Institute for Advanced Studies",
                    "rek_author_affiliation_name_order": 2
                }
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                {
                    "rek_author_affiliation_full_address": "Ruth-Moufang-Strasse 1,Frankfurt am Main",
                    "rek_author_affiliation_full_address_order": 1
                },
                {
                    "rek_author_affiliation_full_address": "Ruth-Moufang-Strasse 1,Frankfurt am Main",
                    "rek_author_affiliation_full_address_order": 2
                }
            ],
            "fez_record_search_key_author_affiliation_country": [
                {
                    "rek_author_affiliation_country": "deu",
                    "rek_author_affiliation_country_order": 1
                },
                {
                    "rek_author_affiliation_country": "deu",
                    "rek_author_affiliation_country_order": 2
                }
            ],
            "rek_scopus_citation_count": "0",
            "fez_record_search_key_corresponding_name": [
                {
                    "rek_corresponding_name": "Hernandez-Vargas E.A.",
                    "rek_corresponding_name_order": 1
                }
            ],
            "fez_record_search_key_corresponding_email": [
                {
                    "rek_corresponding_email": "vargas@fias.uni-frankfurt.de",
                    "rek_corresponding_email_order": 1
                }
            ],
            "fez_record_search_key_corresponding_organization": [
                {
                    "rek_corresponding_organization": "Frankfurt Institute for Advanced Studies",
                    "rek_corresponding_organization_order": 1
                }
            ],
            "fez_record_search_key_corresponding_country": [
                {
                    "rek_corresponding_country": "deu",
                    "rek_corresponding_country_order": 1
                }
            ],
            "rek_description": "Ebola virus (EBOV) infection causes a high death toll, killing a high proportion of EBOV-infected patients within 7 days. Comprehensive data on EBOV infection are fragmented, hampering efforts in developing therapeutics and vaccines against EBOV. Under this circumstance, mathematical models become valuable resources to explore potential controlling strategies. In this paper, we employed experimental data of EBOV-infected nonhuman primates (NHPs) to construct a mathematical framework for determining windows of opportunity for treatment and vaccination. Considering a prophylactic vaccine based on recombinant vesicular stomatitis virus expressing the EBOV glycoprotein (rVSV-EBOV), vaccination could be protective if a subject is vaccinated during a period from one week to four months before infection. For the case of a therapeutic vaccine based on monoclonal antibodies (mAbs), a single dose might resolve the invasive EBOV replication even if it was administrated as late as four days after infection. Our mathematical models can be used as building blocks for evaluating therapeutic and vaccine modalities as well as for evaluating public health intervention strategies in outbreaks. Future laboratory experiments will help to validate and refine the estimates of the windows of opportunity proposed here.",
            "rek_title": "Windows of opportunity for <sup>Ebola</sup> virus infection treatment and vaccination",
            "fez_record_search_key_doi": {
                "rek_doi": "10.1038\/s41598-017-08884-0"
            },
            "fez_record_search_key_issn": [
                {
                    "rek_issn": "2045-2322",
                    "rek_issn_order": 1
                }
            ],
            "fez_record_search_key_issue_number": {
                "rek_issue_number": "1"
            },
            "rek_date": "2017-12-01T00:00:00Z",
            "fez_record_search_key_volume_number": {
                "rek_volume_number": "7"
            },
            "fez_record_search_key_embase_id": {
                "rek_embase_id": "617911509"
            },
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id": "2-s2.0-85027893883"
            },
            "fez_record_search_key_language": [
                {
                    "rek_language": "eng",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_license": null,
            "fez_record_search_key_article_number": {
                "rek_article_number": "8975"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": "453224"
            },
            "rek_scopus_doc_type": "ar",
            "rek_display_type": 179,
            "rek_genre": "Journal Article",
            "rek_genre_type": "Article (original research)",
            "rek_subtype": "Article (original research)",
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "Scientific Reports"
            },
            "fez_record_search_key_author": [
                {
                    "rek_author": "Nguyen, Van Kinh",
                    "rek_author_order": 1
                },
                {
                    "rek_author": "Hernandez-Vargas, Esteban A.",
                    "rek_author_order": 2
                }
            ],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56681690200,
                        "aut_display_name": "Nguyen V.K.",
                        "aut_fname": "Van Kinh",
                        "aut_lname": "Nguyen",
                        "aut_email": ""
                    }
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 12038776500,
                        "aut_display_name": "Hernandez-Vargas E.A.",
                        "aut_fname": "Esteban A.",
                        "aut_lname": "Hernandez-Vargas",
                        "aut_email": "vargas@fias.uni-frankfurt.de"
                    }
                }
            ]
        },
        {
            "rek_pid": 'UQ:768458',
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:308300",
                    "rek_ismemberof_order": 1
                }
            ],
            "rek_object_type": 3,
            "rek_status": 2,
            "fez_record_search_key_publisher": {
                "rek_publisher": "Springer Verlag"
            },
            "fez_record_search_key_subject": [
                {
                    "rek_subject": 453408,
                    "rek_subject_order": 1
                },
                {
                    "rek_subject": 453407,
                    "rek_subject_order": 2
                },
                {
                    "rek_subject": 453409,
                    "rek_subject_order": 3
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                {
                    "rek_author_affiliation_name": "Department of Mathematics,Harbin Institute of Technology",
                    "rek_author_affiliation_name_order": 1
                },
                {
                    "rek_author_affiliation_name": "Department of Mathematics,Harbin Institute of Technology",
                    "rek_author_affiliation_name_order": 2
                },
                {
                    "rek_author_affiliation_name": "National Center for AIDS\/STD Control and Prevention,Chinese Center for Disease Control and Prevention",
                    "rek_author_affiliation_name_order": 3
                }
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                {
                    "rek_author_affiliation_full_address": "Harbin",
                    "rek_author_affiliation_full_address_order": 1
                },
                {
                    "rek_author_affiliation_full_address": "Harbin",
                    "rek_author_affiliation_full_address_order": 2
                },
                {
                    "rek_author_affiliation_full_address": "Beijing",
                    "rek_author_affiliation_full_address_order": 3
                }
            ],
            "fez_record_search_key_author_affiliation_country": [
                {
                    "rek_author_affiliation_country": "chn",
                    "rek_author_affiliation_country_order": 1
                },
                {
                    "rek_author_affiliation_country": "chn",
                    "rek_author_affiliation_country_order": 2
                },
                {
                    "rek_author_affiliation_country": "chn",
                    "rek_author_affiliation_country_order": 3
                }
            ],
            "rek_scopus_citation_count": "10",
            "fez_record_search_key_corresponding_name": [
                {
                    "rek_corresponding_name": "Tulu T.W.",
                    "rek_corresponding_name_order": 1
                }
            ],
            "fez_record_search_key_corresponding_email": [
                {
                    "rek_corresponding_email": "thomaswetere@yahoo.com",
                    "rek_corresponding_email_order": 1
                }
            ],
            "fez_record_search_key_corresponding_organization": [
                {
                    "rek_corresponding_organization": "Department of Mathematics,Harbin Institute of Technology",
                    "rek_corresponding_organization_order": 1
                }
            ],
            "fez_record_search_key_corresponding_country": [
                {
                    "rek_corresponding_country": "chn",
                    "rek_corresponding_country_order": 1
                }
            ],
            "rek_description": "Ebola virus infection is a severe infectious disease with the highest case fatality rate which has become the global public health treat now. What makes the disease the worst of all is no specific effective treatment available, its dynamics is not much researched and understood. In this article a new mathematical model incorporating both vaccination and quarantine to study the dynamics of Ebola epidemic has been developed and comprehensively analyzed using fractional derivative in the sense of the Caputo derivative of order \u03b1\u2208 (0 , 1 ]. The existence as well as nonnegativity of the solution to the model is also verified and the basic reproduction number is calculated. Besides, stability conditions are also checked and finally simulation is done using both the Euler method and one of the top ten most influential algorithms known as Markov Chain Monte Carlo (MCMC) method. Different rates of vaccination to predict the effect of vaccination on the infected individual over time and that of quarantine are discussed. The results show that quarantine and vaccination are very effective ways to control Ebola epidemic. From our study it was also seen that there is less possibility of an individual for getting Ebola virus for the second time if they survived his\/her first infection. Last but not least, real data has been fitted to the model, showing that it can be used to predict the dynamic of Ebola epidemic.",
            "fez_record_search_key_keywords": [
                {
                    "rek_keywords": "Caputo derivative",
                    "rek_keywords_order": 1
                },
                {
                    "rek_keywords": "epidemic model",
                    "rek_keywords_order": 2
                },
                {
                    "rek_keywords": "mathematical modeling",
                    "rek_keywords_order": 3
                },
                {
                    "rek_keywords": "numerical simulation",
                    "rek_keywords_order": 4
                },
                {
                    "rek_keywords": "stability",
                    "rek_keywords_order": 5
                }
            ],
            "rek_title": "Modeling the effect of quarantine and vaccination on Ebola disease",
            "fez_record_search_key_doi": {
                "rek_doi": "10.1186\/s13662-017-1225-z"
            },
            "fez_record_search_key_issn": [
                {
                    "rek_issn": "16871847 16871839",
                    "rek_issn_order": 1
                }
            ],
            "fez_record_search_key_issue_number": {
                "rek_issue_number": "1"
            },
            "rek_date": "2017-12-01T00:00:00Z",
            "fez_record_search_key_volume_number": {
                "rek_volume_number": "2017"
            },
            "fez_record_search_key_embase_id": {
                "rek_embase_id": "616989955"
            },
            "fez_record_search_key_scopus_id": {
                "rek_scopus_id": "2-s2.0-85021419419"
            },
            "fez_record_search_key_language": [
                {
                    "rek_language": "eng",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_license": null,
            "fez_record_search_key_article_number": {
                "rek_article_number": "178"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": "453224"
            },
            "rek_scopus_doc_type": "ar",
            "rek_display_type": 179,
            "rek_genre": "Journal Article",
            "rek_genre_type": "Article (original research)",
            "rek_subtype": "Article (original research)",
            "fez_record_search_key_journal_name": {
                "rek_journal_name": "Advances in Difference Equations"
            },
            "fez_record_search_key_author": [
                {
                    "rek_author": "Tulu, Thomas Wetere",
                    "rek_author_order": 1
                },
                {
                    "rek_author": "Tian, Boping",
                    "rek_author_order": 2
                },
                {
                    "rek_author": "Wu, Zunyou",
                    "rek_author_order": 3
                }
            ],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 1,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 57193453991,
                        "aut_display_name": "Tulu T.W.",
                        "aut_fname": "Thomas Wetere",
                        "aut_lname": "Tulu",
                        "aut_email": "thomaswetere@yahoo.com"
                    }
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 2,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 57192939646,
                        "aut_display_name": "Tian B.",
                        "aut_fname": "Boping",
                        "aut_lname": "Tian",
                        "aut_email": "bopingt361147@hit.edu.cn"
                    }
                },
                {
                    "rek_author_id": 0,
                    "rek_author_id_order": 3,
                    "fez_author": {
                        "aut_id": 0,
                        "aut_scopus_id": 56378232600,
                        "aut_display_name": "Wu Z.",
                        "aut_fname": "Zunyou",
                        "aut_lname": "Wu",
                        "aut_email": ""
                    }
                }
            ]
        }
    ]
};
export default hydrateMockSearchList(externalTitleScopusResultsList);