import { hydrateMockSearchList } from '../../../helpers/general';

const incompleteNTROlist = {
    "total": 6,
    "per_page": 10,
    "current_page": 1,
    "from": 1,
    "to": 6,
    "data": [
        {
            "rek_pid": "UQ:692945",
            "rek_title": "Joh for PM",
            "rek_display_type": 313,
            "rek_status": 2,
            "rek_date": "2017-07-07T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 2785,
            "rek_created_date": "2017-11-07T03:40:52Z",
            "rek_updated_date": "2019-03-27T05:26:21Z",
            "rek_genre": "Creative Work",
            "rek_formatted_abstract": "The musical comedy satirizes the bizarre events that occurred in Australian politics during the Bjelke-Petersen reign. Set at a fundraiser for Joh in 1987, audiences will want to sing along to original tunes such as <em>Pumpkin Scone Diplomacy</em>, <em>Feeding the Chooks</em> and the most catchy political song ever, <em>Joh for PM</em>.<br /><br />Bjelke-Petersen was Queensland&rsquo;s longest serving, longest-lived, and most quotable Premier. He was one of the best-known and most controversial political figures of 20th century Australia. Award-winning playwright Stephen Carleton (<em>The Narcissist</em>, <em>The Turquoise Elephant</em>, <em>Bastard Territory</em>) and Off-Broadway composer Paul Hodge (<em>Clinton: The Musical</em>) have taken inspiration from these historic events to create one of the best musicals to come out of Queensland.",
            "rek_depositor_affiliation": 825,
            "rek_subtype": "Live Performance of Creative Work - Plays, Dramas, Theatre",
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "fez_record_search_key_author": ["Carleton, Stephen", "Hodge, Paul"],
            "fez_record_search_key_author_id": [
                {
                    "rek_author_id": 1516,
                    "rek_author_id_lookup": "Carleton, Stephen James"
                },
                {
                    "rek_author_id": 77910,
                    "rek_author_id_lookup": "Paul Hodge"
                }
            ],
            "fez_record_search_key_date_available": "2017-01-01T00:00:00Z",
            "fez_record_search_key_end_date": "2017-08-19T00:00:00Z",
            "fez_record_search_key_file_attachment_name": [
                "FezACML_johforpmreviewguardianaustralia.pdf.xml",
                "FezACML_UQ_692945.xml",
                "johforpmreviewguardianaustralia.pdf",
            ],
            "fez_record_search_key_herdc_code": 454029,
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453224,
                "rek_institutional_status_lookup": "Non-UQ"
            },
            "fez_record_search_key_ismemberof": [
                {
                    "rek_ismemberof": "UQ:3803",
                    "rek_ismemberof_lookup": "School of Communication and Arts Publications"
                }
            ],
            "fez_record_search_key_language": [
                "eng",
            ],
            "fez_record_search_key_notes": {
                "rek_notes_id": 1185841,
                "rek_notes_pid": "UQ:692945",
                "rek_notes": "https://brisbanepowerhouse.org/events/2017/07/07/joh-for-pm/"
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453698,
                "rek_oa_status_lookup": "Not Open Access"
            },
            "fez_record_search_key_place_of_publication": "Brisbane, Australia and Cairns, Qld, Australia",
            "fez_record_search_key_publisher": "Brisbane Powerhouse and JUTE Theatre Company",
            "fez_record_search_key_refereed": 0,
            "fez_record_search_key_refereed_source": "453636",
            "fez_record_search_key_total_pages": "90 minutes duration, 6 week season",
            "fez_datastream_info": [
                {
                    "dsi_pid": "UQ:692945",
                    "dsi_dsid": "FezACML_johforpmreviewguardianaustralia.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - johforpmreviewguardianaustralia.pdf",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 359
                },
                {
                    "dsi_pid": "UQ:692945",
                    "dsi_dsid": "FezACML_UQ_692945.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for PID - UQ:692945",
                    "dsi_mimetype": "text/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 3660
                },
                {
                    "dsi_pid": "UQ:692945",
                    "dsi_dsid": "johforpmreviewguardianaustralia.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "HERDC evidence - not publicly available",
                    "dsi_mimetype": "application/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 751553
                }
            ],
            "rek_display_type_lookup": "Creative Work",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "fez_record_search_key_audience_size": {
                "rek_audience_size": 453993,
                "rek_audience_size_lookup": "100 – 500"
            },
            "fez_record_search_key_quality_indicator": [
                {
                    "rek_quality_indicator": 453996,
                    "rek_quality_indicator_lookup": "Disseminated via nationally recognised outlet or entity"
                },
                {
                    "rek_quality_indicator": 454033,
                    "rek_quality_indicator_lookup": "Association with recognised national entities, distinct from co-creation"
                },
                {
                    "rek_quality_indicator": 454036,
                    "rek_quality_indicator_lookup": "Commissioned by external body"
                },
                {
                    "rek_quality_indicator": 454038,
                    "rek_quality_indicator_lookup": "Selected for use by nationally recognised outlet or entity"
                }
            ],
            "fez_record_search_key_author_affiliation_name": [
                "The University of Queensland",
                "",
            ],
            "fez_record_search_key_creator_contribution_statement": [
                "<p><em>Joh for PM</em>&nbsp;is a new Australian full-length musical theatre production that was commissioned by JUTE Theatre Company and Playlab. I was initially commissioned to undertake the historical/political research about Joh Bjelke-Petersen&#39;s life from childhood through to his aborted tilt at the Australian Prime Ministership in 1987; and to write the first draft of the book and song lyrics. Brisbane Powerhouse was then attached to the project as co-producer, and brought Paul Hodge in to compose music and redraft songs and write new ones. We worked together on the project through to the culmination of a professional development process in December 2016 at the Powerhouse. The Queensland Music Festival were invited to the public reading at the end of that week, and chose the piece to open the 2017 festival at the Brisbane Powerhouse&#39;s main auditorium, with a tour to Cairns following closely thereafter. Kris Stewart, the AD of Brisbane Powerhouse directed, and national musical and comedy stars Colin Lane (Lano and Woodley) and Chloe Dallimore (The Producers) starred.</p><p>While there have been many political plays, cabarets, stand up comedy shows (<em>The Gillies Report</em>), memoirs, PhD theses, documentaries and non-fiction books&nbsp;dealing with the controversial premier and the long shadow he has cast over Queensland cultural and political life, this is the first full scale professional musical dealing with the biography of BJP. It is also Brisbane Powerhouse and JUTE Theatre Company&#39;s first commissioned musicals built &#39;from scratch&#39;. It received widely disseminated national media coverage and reviews, including interviews with Radio National, ABC radio and TV, and a host of local broadcasters and print media outlets. Much of the critical review focussed on the piece&#39;s contemporary resonance and the timeliness of portraying (albeit via musical comedy) a populist politician with autocratic disposition in the era of Trump, Brexit, Hanson et al. Plans are afoot for a 2020 remount and tour.</p>",
                "",
            ],
            "fez_record_search_key_significance": [
                {
                    "rek_significance_id": 123664,
                    "rek_significance": 454026,
                    "rek_significance_lookup": "Major"
                },
                {
                    "rek_significance": "",
                }
            ]
        },
        {
            "rek_pid": "UQ:678742",
            "rek_title": "Incomplete NTRO record 2",
            "rek_description": "Antibiotic resistance is a major global health problem, one that threatens to derail the benefits garnered from arguably the greatest success of modern medicine, the discovery of antibiotics. Among the most potent agents contributing to antibiotic resistance are metallo-\u03b2-lactamases (MBLs). The discovery of MBL-like enzymes in microorganisms that are not in contact with the human population is of particular concern as these proteins already have the in-built capacity to inactivate antibiotics, even though they may not need MBL activity for their survival. Here, we demonstrate that a microbiome from a remote and frozen environment in Alaska harbours at least one highly efficient MBL, LRA-8. LRA-8 is homologous to the B3 subgroup of MBLs and has a substrate profile and catalytic properties similar to well-known members of this enzyme family, which are expressed by major human pathogens. LRA-8 is predominantly a penicillinase, but is also active towards carbapenems, but not cephalosporins. Spectroscopic studies indicate that LRA-8 has an active site structure similar to that of other MBLs (in particular B3 subgroup representative AIM-1), and a combination of steady-state and pre-steady-state kinetic data demonstrate that the enzyme is likely to employ a metal ion-bridging hydroxide to initiate catalysis. The rate-limiting step is the decay of a chromophoric, tetrahedral intermediate, as is observed in various other MBLs. Thus, studying the properties of such \"pristine\" MBL-like proteins may provide insight into the structural plasticity of this family of enzymes that may facilitate functional promiscuity, while important insight into the evolution of MBLs may also be gained.",
            "rek_display_type": 179,
            "rek_status": 2,
            "rek_date": "2017-01-01T00:00:00Z",
            "rek_created_date": "2017-08-12T11:12:04Z",
            "rek_updated_date": "2017-08-19T06:38:50Z",
            "rek_object_type": 3,
            "rek_genre": "Journal Article",
            "fez_record_search_key_author": [
                "Pedroso, Marcelo Monteiro",
                "Selleck, Christopher",
                "Enculescu, Charmaine",
                "Harmer, Jeffrey R.",
                "Miti\u0107, Nata\u0161a",
                "Craig, Whitney R.",
                "Helweh, Waleed",
                "Hugenholtz, Philip",
                "Tyson, Gene W.",
                "Tierney, David L.",
                "Larrabee, James A.",
                "Schenk, Gerhard",
            ],
            "fez_record_search_key_author_affiliation_id": [
                "10.13039\/501100000925"
            ],
            "fez_record_search_key_author_affiliation_full_address": [
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au.",
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au.",
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au.",
                "Centre for Advanced Imaging, The University of Queensland, St. Lucia, Queensland 4072, Australia.",
                "Department of Chemistry, Maynooth University, Maynooth, Co. Kildare, Ireland.",
                "Department of Chemistry and Biochemistry, Miami University, Oxford, Ohio 45056, USA.",
                "Department of Chemistry and Biochemistry, Middlebury College, Middlebury, VT 05753, USA.",
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au and Australian Centre for Ecogenomics, The University of Queensland, St. Lucia, Queensland 4072, Australia.",
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au and Australian Centre for Ecogenomics, The University of Queensland, St. Lucia, Queensland 4072, Australia.",
                "Department of Chemistry and Biochemistry, Miami University, Oxford, Ohio 45056, USA.",
                "Department of Chemistry and Biochemistry, Middlebury College, Middlebury, VT 05753, USA.",
                "School of Chemistry and Molecular Biosciences, The University of Queensland, St. Lucia, Queensland 4072, Australia. m.pedroso@uq.edu.au schenk@uq.edu.au.",
            ],
            "fez_record_search_key_author_affiliation_name": [
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia",
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia",
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia",
                "Centre for Advanced Imaging | The University of Queensland | St. Lucia | Australia",
                "Department of Chemistry | Maynooth University | Maynooth | Ireland",
                "Department of Chemistry and Biochemistry | Miami University | Oxford | USA",
                "Department of Chemistry and Biochemistry | Middlebury College | Middlebury | USA",
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia | Australian Centre for Ecogenomics",
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia | Australian Centre for Ecogenomics",
                "Department of Chemistry and Biochemistry | Miami University | Oxford | USA",
                "Department of Chemistry and Biochemistry | Middlebury College | Middlebury | USA",
                "School of Chemistry and Molecular Biosciences | The University of Queensland | St. Lucia | Australia",
            ],
            "fez_record_search_key_author_id": [
                410,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                683,
            ],
            "fez_record_search_key_contributor": ['Test contributor'],
            "fez_record_search_key_contributor_id": [0],
            "fez_record_search_key_doi": "10.1039\/c7mt00195a",
            "fez_record_search_key_end_page": "1168",
            "fez_record_search_key_grant_agency": ["National Health and Medical Research Council"],
            "fez_record_search_key_grant_agency_id": ["10.13039\/501100000925"],
            "fez_record_search_key_grant_id": ["APP1084778"],
            "fez_record_search_key_ismemberof": ["UQ:639325"],
            "fez_record_search_key_issn": ["1756-5901", "1756-591X"],
            "fez_record_search_key_issue_number": "8",
            "fez_record_search_key_journal_name": "Metallomics",
            "fez_record_search_key_keywords": [
                "Biophysics",
                "Biochemistry",
                "Chemistry (miscellaneous)",
                "Metals and Alloys",
                "Biomaterials",
            ],
            "fez_record_search_key_language": ["0"],
            "fez_record_search_key_oa_status": 453698,
            "fez_record_search_key_publisher": "Royal Society of Chemistry (RSC)",
            "fez_record_search_key_pubmed_id": "28749495",
            "fez_record_search_key_refereed": 1,
            "fez_record_search_key_refereed_source": 453635,
            "fez_record_search_key_start_page": "1157",
            "fez_record_search_key_volume_number": "9",
            "rek_object_type_lookup": "Record",
            "fez_datastream_info": [{
                "dsi_pid": "UQ:678742",
                "dsi_dsid": "Balance.pdf",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "Work evidence - not publicly available",
                "dsi_mimetype": "application\/pdf",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 225201
            },{
                "dsi_pid": "UQ:678742",
                "dsi_dsid": "FezACML_Balance.pdf.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - Balance.pdf",
                "dsi_mimetype": "text\/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 326
            }],
        },
        {
            "rek_pid": "UQ:678743",
            "rek_title": "Moderne Verfahren zur Messung der Bioverfuegbarkeit von Folaten mit Hilfe von stabilen Isotopen",
            "rek_display_type": 130,
            "rek_status": 2,
            "rek_date": "2009-01-01T00:00:00Z",
            "rek_object_type": 3,
            "rek_depositor": 24177,
            "rek_created_date": "2017-08-11T05:39:57Z",
            "rek_updated_date": "2020-07-31T08:13:29Z",
            "rek_genre": "Conference Paper",
            "rek_depositor_affiliation": 1008,
            "rek_subtype": "Published abstract",
            "rek_security_inherited": 1,
            "rek_copyright": "on",
            "rek_security_policy": 1,
            "fez_record_search_key_author": [
                "Rychlik, M.",
                "Moench, S.",
                "Netzel, M.",
                "Netzel, G.",
                "Frank, T.",
            ],
            "fez_record_search_key_author_id": [{
                "rek_author_id": 0,
                "author": null,
                "rek_author_id_lookup": null
            }, {
                "rek_author_id": 0,
                "author": null,
                "rek_author_id_lookup": null
            }, {
                "rek_author_id": 94226,
                "author": {
                    "aut_id": 94226,
                    "aut_orcid_id": "0000-0002-3136-3926",
                    "aut_title": "Dr",
                    "aut_org_username": "uqmnetze",
                    "aut_student_username": null
                },
                "rek_author_id_lookup": "Netzel, Michael"
            }, {
                "rek_author_id": 88554,
                "author": {
                    "aut_id": 88554,
                    "aut_orcid_id": "0000-0003-1581-4851",
                    "aut_title": "Dr",
                    "aut_org_username": "uqgnetze",
                    "aut_student_username": null
                },
                "rek_author_id_lookup": "Netzel, Gabriele A. (Gabi)"
            }, {
                "rek_author_id": 0,
                "author": null,
                "rek_author_id_lookup": null
            }],
            "fez_record_search_key_conference_dates": "12-13 March 2009",
            "fez_record_search_key_conference_location": "Giessen, Germany",
            "fez_record_search_key_conference_name": "46. Wissenschaftliche Kongress der Deutschen Gesellschaft fuer Ernaehrung (DGE)",
            "fez_record_search_key_end_page": "13",
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code": 450018,
                "rek_herdc_code_lookup": "EX"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": {
                "rek_institutional_status": 453224,
                "rek_institutional_status_lookup": "Non-UQ"
            },
            "fez_record_search_key_isbn": ["9783887492151"],
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof": "UQ:7549",
                "parent": {
                    "rek_pid": "UQ:7549",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "Centre for Nutrition and Food Sciences Publications"
            }],
            "fez_record_search_key_oa_status": {
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_proceedings_title": "Proceedings of the German Nutrition Society 13",
            "fez_record_search_key_publisher": "German Nutrition Society",
            "fez_record_search_key_refereed": 0,
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source": 453638,
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_security_policy": [5],
            "fez_record_search_key_start_page": "13",
            "fez_record_search_key_total_pages": "1",
            "rek_display_type_lookup": "Conference Paper",
            "rek_object_type_lookup": "Record",
            "rek_status_lookup": "Published",
            "rek_wok_doc_type_lookup": "Abstract of Published Item",
            "fez_internal_notes": {
                "ain_id": 118608,
                "ain_pid": "UQ:678743",
                "ain_detail": "My Research :: Claimed Publication :: UQ:678743 :: uqgnetze\r\nDescription:\tRecord: https:\/\/espace.library.uq.edu.au\/view\/UQ:678743\r\n\r\nUser \"Gabi Netzel (uqgnetze)\" has indicated that they are \r\nthe author \"Netzel, Gabriele (88554)\" on this publication. #2251252"
            },
        },
    ],
    "filters": {
        "facets": {
            "Scopus document type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Display type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": 179, "doc_count": 2 }]
            },
            "Keywords": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 5,
                "buckets": [{ "key": "Applied Microbiology and Biotechnology", "doc_count": 1 }, {
                    "key": "Biochemistry",
                    "doc_count": 1
                }, { "key": "Bioengineering", "doc_count": 1 }, {
                    "key": "Biomaterials",
                    "doc_count": 1
                }, { "key": "Biomedical Engineering", "doc_count": 1 }]
            },
            "Scopus document type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Subject (lookup)": { "doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": [] },
            "Collection (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "Crossref Import", "doc_count": 2 }]
            },
            "Year published": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "2017", "doc_count": 2 }]
            },
            "Author (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "Schenk, Gerhard (Gary)", "doc_count": 1 }]
            },
            "Subject": { "doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": [] },
            "Journal name": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "Metallomics", "doc_count": 1 }, { "key": "Nature biotechnology", "doc_count": 1 }]
            },
            "Collection": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "UQ:639325", "doc_count": 2 }]
            },
            "Author": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": 683, "doc_count": 1 }]
            },
            "Genre": { "doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": [] },
            "Subtype": { "doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": [] },
            "Display type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{ "key": "Journal Article", "doc_count": 2 }]
            }
        }
    }
};
export default hydrateMockSearchList(incompleteNTROlist);
