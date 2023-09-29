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
        {
            "rek_pid": "UQ:e09e0b8",
            "rek_title_xsdmf_id": null,
            "rek_title": "A new NTRO work",
            "rek_description_xsdmf_id": null,
            "rek_description": "Tom's abstract",
            "rek_display_type_xsdmf_id": null,
            "rek_display_type": 179,
            "rek_status_xsdmf_id": null,
            "rek_status": 2,
            "rek_date_xsdmf_id": null,
            "rek_date": "2022-02-01T00:00:00Z",
            "rek_object_type_xsdmf_id": null,
            "rek_object_type": 3,
            "rek_depositor_xsdmf_id": null,
            "rek_depositor": 1005428202,
            "rek_created_date_xsdmf_id": null,
            "rek_created_date": "2022-10-07T04:18:20Z",
            "rek_updated_date_xsdmf_id": null,
            "rek_updated_date": "2022-11-17T04:57:45Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"author_id_link\" title=\"Browse by Author ID for Doig, Tom\" href=\"\/records\/search?searchQueryParams%5Brek_author_id%5D%5Bvalue%5D=7625253&searchQueryParams%5Brek_author_id%5D%5Blabel%5D=Doig%2C+Tom&searchMode=advanced\">Doig, Tom<\/a>, <a class=\"citation_author_name\" title=\"Browse by Author Name for Bloggs, Fred\" href=\"\/records\/search?searchQueryParams%5Brek_author%5D%5Bvalue%5D=Bloggs%2C+Fred&searchQueryParams%5Brek_author%5D%5Blabel%5D=Bloggs%2C+Fred&searchMode=advanced\">Bloggs, Fred<\/a>, <a class=\"author_id_link\" title=\"Browse by Author ID for Wilkins, Kim\" href=\"\/records\/search?searchQueryParams%5Brek_author_id%5D%5Bvalue%5D=826&searchQueryParams%5Brek_author_id%5D%5Blabel%5D=Wilkins%2C+Kim&searchMode=advanced\">Wilkins, Kim<\/a>, <a class=\"author_id_link\" title=\"Browse by Author ID for Marrington, Mary-Anne\" href=\"\/records\/search?searchQueryParams%5Brek_author_id%5D%5Bvalue%5D=84025&searchQueryParams%5Brek_author_id%5D%5Blabel%5D=Marrington%2C+Mary-Anne&searchMode=advanced\">Marrington, Mary-Anne<\/a> and <a class=\"author_id_link\" title=\"Browse by Author ID for Lien, Cliff\" href=\"\/records\/search?searchQueryParams%5Brek_author_id%5D%5Bvalue%5D=3712787&searchQueryParams%5Brek_author_id%5D%5Blabel%5D=Lien%2C+Cliff&searchMode=advanced\">Lien, Cliff<\/a> (<span class=\"citation_date\">2022<\/span>). <i><a class=\"citation_title\" title=\"Click to view Journal Article: A new NTRO work\" href=\"\/view\/UQ:e09e0b8\">A new NTRO work<\/a><\/i>. <span class=\"citation_journal_name\">Testing an NTRO<\/span>, <span class=\"citation_volume_number\">23<\/span> (<span class=\"citation_issue_number\">2<\/span>), <span class=\"citation_start_page\">34<\/span>-<span class=\"citation_end_page\">36<\/span>.",
            "rek_genre_xsdmf_id": null,
            "rek_genre": "Journal Article",
            "rek_genre_type_xsdmf_id": null,
            "rek_genre_type": "Creative Work - Textual",
            "rek_formatted_title_xsdmf_id": null,
            "rek_formatted_title": "A new NTRO work",
            "rek_formatted_abstract_xsdmf_id": null,
            "rek_formatted_abstract": "<p>Tom's abstract<\/p>",
            "rek_depositor_affiliation_xsdmf_id": null,
            "rek_depositor_affiliation": null,
            "rek_thomson_citation_count": null,
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
            "rek_ci_notice_attribution_incomplete": null,
            "rek_dimensions_citation_count": null,
            "rek_dimensions_doc_type": null,
            "fez_record_search_key_advisory_statement": null,
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [{
                "rek_author_id": 35198271,
                "rek_author_pid": "UQ:e09e0b8",
                "rek_author_xsdmf_id": null,
                "rek_author": "Doig, Tom",
                "rek_author_order": 1
            }, {
                "rek_author_id": 35198272,
                "rek_author_pid": "UQ:e09e0b8",
                "rek_author_xsdmf_id": null,
                "rek_author": "Bloggs, Fred",
                "rek_author_order": 2
            }, {
                "rek_author_id": 35198273,
                "rek_author_pid": "UQ:e09e0b8",
                "rek_author_xsdmf_id": null,
                "rek_author": "Wilkins, Kim",
                "rek_author_order": 3
            }, {
                "rek_author_id": 35198274,
                "rek_author_pid": "UQ:e09e0b8",
                "rek_author_xsdmf_id": null,
                "rek_author": "Marrington, Mary-Anne",
                "rek_author_order": 4
            }, {
                "rek_author_id": 35198275,
                "rek_author_pid": "UQ:e09e0b8",
                "rek_author_xsdmf_id": null,
                "rek_author": "Lien, Cliff",
                "rek_author_order": 5
            }],
            "fez_record_search_key_author_id": [{
                "rek_author_id_id": 35388773,
                "rek_author_id_pid": "UQ:e09e0b8",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 7625253,
                "rek_author_id_order": 1,
                "author": {
                    "aut_id": 7625253,
                    "aut_orcid_id": "0000-0001-6329-637X",
                    "aut_title": "Dr"
                },
                "rek_author_id_lookup": "Doig, Thomas (Tom)"
            }, {
                "rek_author_id_id": 35388774,
                "rek_author_id_pid": "UQ:e09e0b8",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 0,
                "rek_author_id_order": 2,
                "author": null
            }, {
                "rek_author_id_id": 35388775,
                "rek_author_id_pid": "UQ:e09e0b8",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 826,
                "rek_author_id_order": 3,
                "author": {
                    "aut_id": 826,
                    "aut_orcid_id": "0000-0001-7783-8248",
                    "aut_title": "Professor"
                },
                "rek_author_id_lookup": "Wilkins, Kim"
            }, {
                "rek_author_id_id": 35388776,
                "rek_author_id_pid": "UQ:e09e0b8",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 84025,
                "rek_author_id_order": 4,
                "author": {
                    "aut_id": 84025,
                    "aut_orcid_id": "0000-0003-0268-1885",
                    "aut_title": "Ms"
                },
                "rek_author_id_lookup": "Marrington, Mary-Anne"
            }, {
                "rek_author_id_id": 35388777,
                "rek_author_id_pid": "UQ:e09e0b8",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 3712787,
                "rek_author_id_order": 5,
                "author": {
                    "aut_id": 3712787,
                    "aut_orcid_id": "0000-0003-3738-1487",
                    "aut_title": "Mr"
                },
                "rek_author_id_lookup": "Lien, Cliff C."
            }],
            "fez_record_search_key_author_crossref_authenticated": [],
            "fez_record_search_key_author_crossref_orcid": [],
            "fez_record_search_key_biosis_id": null,
            "fez_record_search_key_contributor": [],
            "fez_record_search_key_contributor_id": [],
            "fez_record_search_key_corresponding_country": [],
            "fez_record_search_key_corresponding_email": [],
            "fez_record_search_key_corresponding_name": [],
            "fez_record_search_key_corresponding_organisation": [],
            "fez_record_search_key_datastream_policy": null,
            "fez_record_search_key_date_available": null,
            "fez_record_search_key_dimensions_id": null,
            "fez_record_search_key_doi": null,
            "fez_record_search_key_end_page": {
                "rek_end_page_id": 5888109,
                "rek_end_page_pid": "UQ:e09e0b8",
                "rek_end_page_xsdmf_id": null,
                "rek_end_page": "36"
            },
            "fez_record_search_key_external_label_id": [],
            "fez_record_search_key_file_attachment_access_condition": [{
                "rek_file_attachment_access_condition_id": 50576,
                "rek_file_attachment_access_condition_pid": "UQ:e09e0b8",
                "rek_file_attachment_access_condition_xsdmf_id": null,
                "rek_file_attachment_access_condition": "1",
                "rek_file_attachment_access_condition_order": 1
            }],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [{
                "rek_file_attachment_name_id": 4581081,
                "rek_file_attachment_name_pid": "UQ:e09e0b8",
                "rek_file_attachment_name_xsdmf_id": null,
                "rek_file_attachment_name": "UQ323e47f_full_report_OA.pdf",
                "rek_file_attachment_name_order": 1
            }],
            "fez_record_search_key_grant_acronym": [],
            "fez_record_search_key_grant_agency": [{
                "rek_grant_agency_id": 1993030,
                "rek_grant_agency_pid": "UQ:e09e0b8",
                "rek_grant_agency_xsdmf_id": null,
                "rek_grant_agency": "Arts Queensland",
                "rek_grant_agency_order": 1
            }],
            "fez_record_search_key_grant_agency_id": [],
            "fez_record_search_key_grant_id": [{
                "rek_grant_id_id": 1943183,
                "rek_grant_id_pid": "UQ:e09e0b8",
                "rek_grant_id_xsdmf_id": null,
                "rek_grant_id": "Not set",
                "rek_grant_id_order": 1
            }],
            "fez_record_search_key_grant_text": [],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code_id": 5208060,
                "rek_herdc_code_pid": "UQ:e09e0b8",
                "rek_herdc_code_xsdmf_id": null,
                "rek_herdc_code": 454028,
                "rek_herdc_code_lookup": "CW1"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status_id": 4061856,
                "rek_herdc_status_pid": "UQ:e09e0b8",
                "rek_herdc_status_xsdmf_id": null,
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_institutional_status": null,
            "fez_record_search_key_isbn": [],
            "fez_record_search_key_isderivationof": [],
            "fez_record_search_key_isi_loc": null,
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof_id": 12836536,
                "rek_ismemberof_pid": "UQ:e09e0b8",
                "rek_ismemberof_xsdmf_id": null,
                "rek_ismemberof": "UQ:218198",
                "rek_ismemberof_order": 1,
                "parent": {
                    "rek_pid": "UQ:218198",
                    "rek_security_policy": 5,
                    "rek_datastream_policy": 5
                },
                "rek_ismemberof_lookup": "Unprocessed Records"
            }],
            "fez_record_search_key_ismn": [],
            "fez_record_search_key_issn": [],
            "fez_record_search_key_issue_number": {
                "rek_issue_number_id": 4717372,
                "rek_issue_number_pid": "UQ:e09e0b8",
                "rek_issue_number_xsdmf_id": null,
                "rek_issue_number": "2"
            },
            "fez_record_search_key_journal_name": {
                "rek_journal_name_id": 5474123,
                "rek_journal_name_pid": "UQ:e09e0b8",
                "rek_journal_name_xsdmf_id": null,
                "rek_journal_name": "Testing an NTRO"
            },
            "fez_record_search_key_keywords": [],
            "fez_record_search_key_language": [{
                "rek_language_id": 5837587,
                "rek_language_pid": "UQ:e09e0b8",
                "rek_language_xsdmf_id": null,
                "rek_language": "eng",
                "rek_language_order": 1
            }],
            "fez_record_search_key_language_of_journal_name": [],
            "fez_record_search_key_language_of_title": [],
            "fez_record_search_key_license": null,
            "fez_record_search_key_link": [],
            "fez_record_search_key_link_description": [],
            "fez_record_search_key_native_script_journal_name": null,
            "fez_record_search_key_native_script_title": null,
            "fez_record_search_key_notes": null,
            "fez_record_search_key_oa_embargo_days": null,
            "fez_record_search_key_oa_notes": null,
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 1305684,
                "rek_oa_status_pid": "UQ:e09e0b8",
                "rek_oa_status_xsdmf_id": null,
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_oa_status_type": null,
            "fez_record_search_key_place_of_publication": null,
            "fez_record_search_key_possible_author_id": [],
            "fez_record_search_key_publisher": null,
            "fez_record_search_key_pubmed_id": null,
            "fez_record_search_key_pubmed_central_id": null,
            "fez_record_search_key_refereed": null,
            "fez_record_search_key_refereed_source": null,
            "fez_record_search_key_roman_script_journal_name": null,
            "fez_record_search_key_roman_script_title": null,
            "fez_record_search_key_scopus_id": null,
            "fez_record_search_key_security_policy": [{
                "rek_security_policy_id": 888443,
                "rek_security_policy_pid": "UQ:e09e0b8",
                "rek_security_policy": 5,
                "rek_security_policy_order": 1
            }],
            "fez_record_search_key_sensitive_handling_note_id": null,
            "fez_record_search_key_sensitive_handling_note_other": null,
            "fez_record_search_key_start_page": {
                "rek_start_page_id": 5992833,
                "rek_start_page_pid": "UQ:e09e0b8",
                "rek_start_page_xsdmf_id": null,
                "rek_start_page": "34"
            },
            "fez_record_search_key_subject": [],
            "fez_record_search_key_total_pages": null,
            "fez_record_search_key_translated_journal_name": null,
            "fez_record_search_key_translated_title": null,
            "fez_record_search_key_volume_number": {
                "rek_volume_number_id": 5491699,
                "rek_volume_number_pid": "UQ:e09e0b8",
                "rek_volume_number_xsdmf_id": null,
                "rek_volume_number": "23"
            },
            "fez_record_search_key_wok_doc_types": [],
            "fez_record_search_key_zoorec_id": null,
            "fez_datastream_info": [{
                "dsi_id": 3777513,
                "dsi_pid": "UQ:e09e0b8",
                "dsi_dsid": "UQ323e47f_full_report_OA.pdf",
                "dsi_checksum": "3cce5349f2dcc72492f3716e33352e61",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "Full report",
                "dsi_mimetype": "application\/pdf",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 342862,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0,
                "dsi_order": 1,
                "dsi_av_check_state": null,
                "dsi_av_check_date": null
            }, {
                "dsi_id": 3777514,
                "dsi_pid": "UQ:e09e0b8",
                "dsi_dsid": "thumbnail_UQ323e47f_full_report_OA_t.jpg",
                "dsi_checksum": "bb9530cb914d977b778c83e3b1b76a3f",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": null,
                "dsi_mimetype": "image\/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 2146,
                "dsi_security_policy": 1,
                "dsi_security_inherited": 0,
                "dsi_order": null,
                "dsi_av_check_state": null,
                "dsi_av_check_date": null
            }],
            "fez_matched_journals": null,
            "fez_record_search_key_isdatasetof": [],
            "fez_record_search_key_has_related_datasets": [],
            "fez_record_search_key_has_derivations": [],
            "rek_display_type_lookup": "Journal Article",
            "rek_pubmed_doc_type_lookup": null,
            "rek_object_type_lookup": "Record",
            "rek_scopus_doc_type_lookup": null,
            "rek_status_lookup": "Published",
            "rek_wok_doc_type_lookup": null
        }
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
