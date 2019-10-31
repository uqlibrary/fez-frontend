import * as records from 'mock/data/testing/records';
import { AdditionalInformationClass } from './AdditionalInformation';
import AdditionalInformation from './AdditionalInformation';

function setup(testProps = {}, args = { context: { userCountry: 'AU' } }) {
    const props = {
        classes: {
            header: 'header',
            data: 'data',
            gridRow: 'gridRow',
            list: 'list',
        },
        publication: {
            ...(testProps.publication || records.journalArticle || {}),
            rek_formatted_abstract: 'This is a&nbsp;test',
        },
        account: {},
        ...testProps,
    };
    return getElement(AdditionalInformationClass, props, args);
}

describe('Additional Information Component ', () => {
    it('should not render component with empty publication', () => {
        const wrapper = setup({ publication: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with journal article', () => {
        const wrapper = setup({ publication: records.journalArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('.sherpaRomeoGreen').length).toEqual(1);
        // expect(wrapper.find('.eraYearListed').text()).toEqual(' (ERA 2010 Journal(s) Listed)');
    });

    it('should render component with journal', () => {
        const wrapper = setup({ publication: records.journal });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with data collection', () => {
        const wrapper = setup({ publication: records.dataCollection });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with audio document', () => {
        const wrapper = setup({ publication: records.audioDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('.license.cc-by-nc-nd').length).toEqual(1);
    });

    it('should render component with book', () => {
        const wrapper = setup({ publication: records.book });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with book chapter', () => {
        const wrapper = setup({ publication: records.bookChapter });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with conference paper', () => {
        const wrapper = setup({ publication: records.conferencePaper });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with conference proceedings', () => {
        const wrapper = setup({ publication: records.conferenceProceedings });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with creative work', () => {
        const wrapper = setup({ publication: records.creativeWork });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with design document', () => {
        const wrapper = setup({ publication: records.design });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with digilib image', () => {
        const wrapper = setup({ publication: records.digilibImage });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const wrapper = setup({ publication: records.imageDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with generic document', () => {
        const wrapper = setup({ publication: records.generic });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with manuscript', () => {
        const wrapper = setup({ publication: records.manuscript });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with newspaperArticle', () => {
        const wrapper = setup({ publication: records.newspaperArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with patent', () => {
        const wrapper = setup({ publication: records.patent });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with preprint', () => {
        const wrapper = setup({ publication: records.preprint });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with reference entry', () => {
        const wrapper = setup({ publication: records.referenceEntry });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with research report', () => {
        const wrapper = setup({ publication: records.researchReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with thesis', () => {
        const wrapper = setup({ publication: records.thesis });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with working paper', () => {
        const wrapper = setup({ publication: records.workingPaper });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with video document', () => {
        const wrapper = setup({ publication: records.videoDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render oa status value link in the component with thesis', () => {
        records.thesis.fez_record_search_key_oa_status.rek_oa_status_lookup = 'File (Author Post-print)';
        const wrapper = setup({ publication: records.thesis });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with data collection with FoR codes', () => {
        const wrapper = setup({ publication: records.dataCollectionWithFoRCodes });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with proceedings title link', () => {
        const wrapper = setup({ publication: records.conferencePaperWithProceedingsTitle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with rek_herdc_code', () => {
        const wrapper = setup({ publication: records.journalArticle, account: { canMasquerade: true } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with rek_start and end dates', () => {
        const publication = {
            rek_pid: 'UQ:177836',
            rek_title_xsdmf_id: 12000,
            rek_title: 'Sustainable home Brisbane',
            rek_description_xsdmf_id: null,
            rek_description: null,
            rek_display_type_xsdmf_id: 3673,
            rek_display_type: 313,
            rek_status_xsdmf_id: 3680,
            rek_status: 2,
            rek_date_xsdmf_id: 11989,
            rek_date: '2006-01-01T00:00:00Z',
            rek_start_date: '2006-01-01T00:00:00Z',
            rek_end_date: '2006-01-01T00:00:00Z',
            rek_object_type_xsdmf_id: 3674,
            rek_object_type: 3,
            rek_depositor_xsdmf_id: 7578,
            rek_depositor: 3608,
            rek_created_date_xsdmf_id: 3677,
            rek_created_date: '2009-05-21T11:24:28Z',
            rek_updated_date_xsdmf_id: 3678,
            rek_updated_date: '2015-07-31T07:33:09Z',
            rek_file_downloads: 342,
            rek_citation:
                // eslint-disable-next-line max-len
                '<a class="author_id_link" title="Browse by Author ID for Webster-Mannison, Marci" href="/list/author_id/75912/">Webster-Mannison, Marci</a> (<span class="citation_date">2006</span>) <a class="citation_title" title="Click to view Creative Work: Sustainable home Brisbane" href="/view/UQ:177836">Sustainable home Brisbane</a>. <span class="citation_place_of_publication">St Lucia, Brisbane, QLD, Australia</span>, <span class="citation_publisher">School of Architecture, The University of Queensland</span>.',
            rek_genre_xsdmf_id: 11991,
            rek_genre: 'Creative Work',
            rek_genre_type_xsdmf_id: null,
            rek_genre_type: null,
            rek_formatted_title_xsdmf_id: null,
            rek_formatted_title: null,
            rek_formatted_abstract_xsdmf_id: 12036,
            rek_formatted_abstract:
                // eslint-disable-next-line max-len
                "<b>Research Background:</b> 35,000 to 40,000 new dwellings per year are built in Queensland making it an imperative to incorporate sustainability into the design. The Queensland Government's Sustainable Homes program provides communities with unique display homes which exemplify their regional climatic context and environmental, social and economic sustainability.<br /><b><br />Research Contribution:</b> The Sustainable Home Brisbane, Seventeen Mile Rocks was part of the Queensland Government Sustainable Homes program, and addresses the need to provide industry, government, community groups, and the public an opportunity to learn about sustainable housing design and living.<br /><br />The home demonstrates cost-effective environmental features and practices in its construction and operation. The approaches to integrated water management involving significant rainwater collection and treatment for potable use, greywater treatment and biofiltration and energy efficiency through passive solar design, the unique passive air cooling and heating system and the use of solar energy are highly innovative and replicable. The Sustainable Home Brisbane sets a benchmark for future housing design in subtropical Queensland.<br /><b><br />Research Significance:</b> The significance of this research is evidenced by the project winning the Royal Australian Institute of Australia (RAIA Qld Chapter) Architecture Award, Regional Commendation, Brisbane Sustainable Home, 2007, the Housing Industry Association (HIA) Greensmart Building of the Year, 2006, the HIA Greensmart Water Efficiency Award, 2006 and the Brisbane/Gold Coast HIA GreenSmart Energy Efficient Housing Award. Furthermore, the significant interest in this project is evidenced by the number of visitors during the public display period.<br />",
            rek_depositor_affiliation_xsdmf_id: 11881,
            rek_depositor_affiliation: 888,
            rek_thomson_citation_count: null,
            rek_thomson_citation_count_xsdmf_id: null,
            rek_subtype_xsdmf_id: null,
            rek_subtype: null,
            rek_scopus_citation_count: null,
            rek_herdc_notes_xsdmf_id: null,
            rek_herdc_notes: null,
            rek_scopus_doc_type_xsdmf_id: null,
            rek_scopus_doc_type: null,
            rek_wok_doc_type_xsdmf_id: null,
            rek_wok_doc_type: null,
            rek_pubmed_doc_type_xsdmf_id: null,
            rek_pubmed_doc_type: null,
            rek_security_inherited: 1,
            rek_altmetric_score: null,
            rek_altmetric_score_xsdmf_id: null,
            rek_altmetric_id: null,
            rek_altmetric_id_xsdmf_id: null,
            rek_copyright_xsdmf_id: 3679,
            rek_copyright: 'on',
            fez_record_search_key_article_number: null,
            fez_record_search_key_assigned_group_id: [],
            fez_record_search_key_assigned_user_id: [],
            fez_record_search_key_author: [
                {
                    rek_author_id: 28885139,
                    rek_author_pid: 'UQ:177836',
                    rek_author_xsdmf_id: 11960,
                    rek_author: 'Webster-Mannison, Marci',
                    rek_author_order: 1,
                },
            ],
            fez_record_search_key_author_affiliation_country: [],
            fez_record_search_key_author_affiliation_full_address: [],
            fez_record_search_key_author_affiliation_id: [],
            fez_record_search_key_author_affiliation_name: [],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: 28256890,
                    rek_author_id_pid: 'UQ:177836',
                    rek_author_id_xsdmf_id: 11955,
                    rek_author_id: 75912,
                    rek_author_id_order: 1,
                },
            ],
            fez_record_search_key_contributor: [],
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_corresponding_country: [],
            fez_record_search_key_corresponding_email: [],
            fez_record_search_key_corresponding_name: [],
            fez_record_search_key_corresponding_organisation: [],
            fez_record_search_key_datastream_policy: null,
            fez_record_search_key_date_available: null,
            fez_record_search_key_edition: null,
            fez_record_search_key_end_page: null,
            fez_record_search_key_file_attachment_access_condition: [],
            fez_record_search_key_file_attachment_embargo_date: [],
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name_id: 3880871,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'HCA12UQ177836_plans.pdf',
                    rek_file_attachment_name_order: 1,
                },
                {
                    rek_file_attachment_name_id: 3880872,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'HCA12UQ177836_project_description_.pdf',
                    rek_file_attachment_name_order: 2,
                },
                {
                    rek_file_attachment_name_id: 3880873,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'HCA12UQ177836_report.pdf',
                    rek_file_attachment_name_order: 3,
                },
                {
                    rek_file_attachment_name_id: 3880874,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'UQ177836.pdf',
                    rek_file_attachment_name_order: 4,
                },
                {
                    rek_file_attachment_name_id: 3880875,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'presmd_HCA12UQ177836_plans.xml',
                    rek_file_attachment_name_order: 5,
                },
                {
                    rek_file_attachment_name_id: 3880876,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'presmd_HCA12UQ177836_project_description_.xml',
                    rek_file_attachment_name_order: 6,
                },
                {
                    rek_file_attachment_name_id: 3880877,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'presmd_HCA12UQ177836_report.xml',
                    rek_file_attachment_name_order: 7,
                },
                {
                    rek_file_attachment_name_id: 3880878,
                    rek_file_attachment_name_pid: 'UQ:177836',
                    rek_file_attachment_name_xsdmf_id: 12088,
                    rek_file_attachment_name: 'presmd_UQ177836.xml',
                    rek_file_attachment_name_order: 8,
                },
            ],
            fez_record_search_key_grant_acronym: [],
            fez_record_search_key_grant_agency: [],
            fez_record_search_key_grant_agency_id: [],
            fez_record_search_key_grant_text: [],
            fez_record_search_key_institutional_status: null,
            fez_record_search_key_isbn: [],
            fez_record_search_key_isderivationof: [],
            fez_record_search_key_isi_loc: null,
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof_id: 11518134,
                    rek_ismemberof_pid: 'UQ:177836',
                    rek_ismemberof_xsdmf_id: 149,
                    rek_ismemberof: 'UQ:152266',
                    rek_ismemberof_order: 1,
                },
                {
                    rek_ismemberof_id: 11518135,
                    rek_ismemberof_pid: 'UQ:177836',
                    rek_ismemberof_xsdmf_id: 149,
                    rek_ismemberof: 'UQ:3804',
                    rek_ismemberof_order: 2,
                },
                {
                    rek_ismemberof_id: 11518136,
                    rek_ismemberof_pid: 'UQ:177836',
                    rek_ismemberof_xsdmf_id: 149,
                    rek_ismemberof: 'UQ:254105',
                    rek_ismemberof_order: 3,
                },
            ],
            fez_record_search_key_issn: [],
            fez_record_search_key_keywords: [
                {
                    rek_keywords_id: 29166325,
                    rek_keywords_pid: 'UQ:177836',
                    rek_keywords_xsdmf_id: 11973,
                    rek_keywords: 'Original Creative Works - Design/Architectural work',
                    rek_keywords_order: 1,
                },
            ],
            fez_record_search_key_language: [
                {
                    rek_language_id: 5225989,
                    rek_language_pid: 'UQ:177836',
                    rek_language_xsdmf_id: 11997,
                    rek_language: 'eng',
                    rek_language_order: 1,
                },
            ],
            fez_record_search_key_link: [],
            fez_record_search_key_link_description: [],
            fez_record_search_key_notes: null,
            fez_record_search_key_oa_status: {
                rek_oa_status_id: 319986,
                rek_oa_status_pid: 'UQ:177836',
                rek_oa_status_xsdmf_id: 16975,
                rek_oa_status: 453692,
            },
            fez_record_search_key_place_of_publication: {
                rek_place_of_publication_id: 4167616,
                rek_place_of_publication_pid: 'UQ:177836',
                rek_place_of_publication_xsdmf_id: 11994,
                rek_place_of_publication: 'St Lucia, Brisbane, QLD, Australia',
            },
            fez_record_search_key_publisher: {
                rek_publisher_id: 4431832,
                rek_publisher_pid: 'UQ:177836',
                rek_publisher_xsdmf_id: 11995,
                rek_publisher: 'School of Architecture, The University of Queensland',
            },
            fez_record_search_key_refereed: null,
            fez_record_search_key_refereed_source: {
                rek_refereed_source_id: 1182431,
                rek_refereed_source_pid: 'UQ:177836',
                rek_refereed_source_xsdmf_id: 16623,
                rek_refereed_source: '453638',
            },
            fez_record_search_key_scopus_id: null,
            fez_record_search_key_series: null,
            fez_record_search_key_start_page: null,
            fez_record_search_key_subject: [
                {
                    rek_subject_id: 9095037,
                    rek_subject_pid: 'UQ:177836',
                    rek_subject_xsdmf_id: 11972,
                    rek_subject: 452674,
                    rek_subject_order: 1,
                },
                {
                    rek_subject_id: 9095038,
                    rek_subject_pid: 'UQ:177836',
                    rek_subject_xsdmf_id: 11972,
                    rek_subject: 452677,
                    rek_subject_order: 2,
                },
            ],
            fez_record_search_key_total_pages: {
                rek_total_pages_id: 5481312,
                rek_total_pages_pid: 'UQ:177836',
                rek_total_pages_xsdmf_id: 11992,
                rek_total_pages: '10',
            },
            fez_record_search_key_translated_title: null,
            rek_display_type_lookup: 'Creative Work',
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'FezACML_HCA10UQ177836.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - HCA10UQ177836.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3097,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'FezACML_UQ177836.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ177836.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 203,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'FezACML_UQ_177836.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for PID - UQ:177836',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3639,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'HCA10UQ177836.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text - not publicly available',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'D',
                    dsi_size: 1106143,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'HCA12UQ177836_plans.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Plans - not publicly available',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2937780,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'HCA12UQ177836_project_description_.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Full text - not publicly available ',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1559809,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'HCA12UQ177836_report.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'full text - not publicly available ',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1106143,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'presmd_HCA10UQ177836.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 46821,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'presmd_HCA12UQ177836_plans.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 16811,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'presmd_HCA12UQ177836_project_description_.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 11120,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'presmd_HCA12UQ177836_report.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 50198,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'presmd_UQ177836.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 24139,
                },
                {
                    dsi_pid: 'UQ:177836',
                    dsi_dsid: 'UQ177836.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'UQ177836.pdf',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 117219,
                },
            ],
            fez_record_search_key_start_date: {
                rek_start_date_id: 8,
                rek_start_date_pid: 'UQ:162308',
                rek_start_date_xsdmf_id: 12154,
                rek_start_date: '2005-01-05 00:00:00',
            },
            fez_record_search_key_end_date: {
                rek_end_date_id: 8,
                rek_end_date_pid: 'UQ:162308',
                rek_end_date_xsdmf_id: 12154,
                rek_end_date: '2005-01-05 00:00:00',
            },
        };
        const wrapper = setup({ publication: publication, account: { canMasquerade: true } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should skip render of date if it has a placeholder value', () => {
        const publication = {
            rek_date: '1000-01-01T00:00:00Z',
            rek_display_type_lookup: 'Journal Article',
        };
        const wrapper = setup({ publication });
        expect(wrapper.instance().renderColumns()).toMatchSnapshot();
    });

    it('renderLicense()', () => {
        const publication = {
            rek_date: '1000-01-01T00:00:00Z',
            rek_display_type_lookup: 'Journal Article',
        };
        const wrapper = setup({ publication });
        expect(wrapper.instance().renderLicense(1, null)).toMatchSnapshot();
    });

    it('getAbstract() 1', () => {
        const wrapper = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null },
            isNtro: true,
        });
        expect(
            wrapper.instance().getAbstract({ ...records.journalArticle, rek_formatted_abstract: null }),
        ).toMatchSnapshot();
    });
    it('getAbstract() 2', () => {
        const wrapper = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null },
            isNtro: false,
        });
        expect(
            wrapper
                .instance()
                .getAbstract({ ...records.journalArticle, rek_formatted_abstract: null, rek_description: null }),
        ).toMatchSnapshot();
    });

    it('getAbstract() 3', () => {
        const wrapper = setup({
            publication: { ...records.journalArticle, rek_formatted_abstract: null },
            isNtro: false,
        });
        expect(
            wrapper
                .instance()
                .getAbstract({ ...records.journalArticle, rek_formatted_abstract: null, rek_description: 'Test' }),
        ).toMatchSnapshot();
    });

    it('renderMap() for China', () => {
        const context = { userCountry: 'CN' };
        const wrapper = setup(
            { publication: records.journalArticle },
            {
                isShallow: true,
                requiresStore: false,
                context,
            },
        );
        expect(wrapper.instance().renderMap([])).toMatchSnapshot();
        expect(wrapper.instance().renderMap([{ rek_geographic_area: 'test' }])).toMatchSnapshot();
    });

    it('renderMap() for Australia', () => {
        const context = { userCountry: 'AU' };
        const wrapper = setup(
            { publication: records.journalArticle },
            {
                isShallow: true,
                requiresStore: false,
                context,
            },
        );
        expect(wrapper.instance().renderMap([])).toMatchSnapshot();
        expect(wrapper.instance().renderMap([{ rek_geographic_area: 'test' }])).toMatchSnapshot();
    });

    it('Full mount render', () => {
        const wrapper = getElement(
            AdditionalInformation,
            { publication: records.journalArticle, account: { canMasquerade: true } },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
