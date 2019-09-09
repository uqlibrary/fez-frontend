import { journalArticle } from 'mock/data/testing/records';
import Files from './Files';
import { FilesClass } from './Files';

function setup(testProps, args = { isShallow: true }) {
    const props = {
        theme: {},
        isAdmin: testProps.isAdmin || true,
        publication: testProps.publication || journalArticle,
        hideCulturalSensitivityStatement: false,
        setHideCulturalSensitivityStatement: jest.fn(),
        classes: { header: 'header' },
        ...testProps,
    };
    return getElement(FilesClass, props, args);
}

describe('Files Component ', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render cultural sensitivity statement', () => {
        const wrapper = setup({
            hideCulturalSensitivityStatement: false,
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: null,
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render cultural message', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello' },
            },
            hideCulturalSensitivityStatement: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render an image as the original filename with no thumb or preview', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'testing image description',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 97786,
                    },
                ],
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'No statement' },
            },
            hideCulturalSensitivityStatement: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component full mount', () => {
        const wrapper = getElement(
            Files,
            {
                theme: {},
                account: { canMasquerade: true },
                isAdmin: true,
                isAuthor: true,
                publication: journalArticle,
                hideCulturalSensitivityStatement: false,
                setHideCulturalSensitivityStatement: jest.fn(),
                classes: {},
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render cultural message', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello<br/> there' },
            },
            hideCulturalSensitivityStatement: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render cultural message', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello' },
            },
            hideCulturalSensitivityStatement: false,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should strip HTML from a string containing HTML', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello' },
            },
            hideCulturalSensitivityStatement: false,
        });
        expect(wrapper.instance().stripHtml('hello<br/> there')).toEqual('hello there');
    });

    it('should not render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_datastream_info;
        const wrapper = setup({ publication: publication });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render bytes correctly', () => {
        const wrapper = setup({});
        expect(wrapper.instance().formatBytes(0)).toEqual('0 Bytes');
        expect(wrapper.instance().formatBytes(1024)).toEqual('1 KB');
        expect(wrapper.instance().formatBytes(1048576)).toEqual('1 MB');
    });

    it('should render icon for mimeType', () => {
        const wrapper = setup({});

        wrapper.instance().renderFileIcon('UQ:1', 'blablabla');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'image/jpg');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'video/quicktime');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'audio/mp3');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'app/pdf');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .instance()
            .renderFileIcon('UQ:1', 'image/jpg', 'test.tiff', 'thumbnail_test.jpg', 'preview_test.jpg', true);
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state on showPreview', () => {
        const wrapper = setup({});
        const fileName = 'fileName';
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const webMediaUrl = 'webMediaUrl';
        const mimeType = 'image/jpeg';
        const securityStatus = true;
        wrapper.instance().showPreview(fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl, securityStatus);
        expect(wrapper.state().preview.fileName).toEqual(fileName);
        expect(wrapper.state().preview.previewMediaUrl).toEqual(previewMediaUrl);
        expect(wrapper.state().preview.mediaUrl).toEqual(mediaUrl);
        expect(wrapper.state().preview.webMediaUrl).toEqual(webMediaUrl);
        expect(wrapper.state().preview.mimeType).toEqual(mimeType);
        expect(wrapper.state().preview.securityStatus).toEqual(securityStatus);
    });

    it('should calculate OA status of files', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: '2021-11-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: '2019-12-02',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const wrapper = setup({ isAdmin: false });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0]),
        ).toEqual({
            embargoDate: '1st December 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: false,
        });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1]),
        ).toEqual({
            embargoDate: '1st November 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: false,
        });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2]),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695 });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3]),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695 });
    });

    it('should calculate OA status of files as an admin', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: '2021-11-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: '2019-12-02',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const wrapper = setup({ isAdmin: true, isAuthor: true });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0]),
        ).toEqual({
            embargoDate: '1st December 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
        });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1]),
        ).toEqual({
            embargoDate: '1st November 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
        });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2]),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695 });
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3]),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695 });
    });

    it('should clean up state on hidePreview', () => {
        const wrapper = setup({});
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const mimeType = 'image/jpeg';
        wrapper.instance().showPreview(mediaUrl, previewMediaUrl, mimeType);
        wrapper.instance().hidePreview();
        expect(wrapper.state().preview.previewMediaUrl).toEqual(null);
        expect(wrapper.state().preview.mediaUrl).toEqual(null);
        expect(wrapper.state().preview.mimeType).toEqual(null);
    });

    it('should return the file name with an _xt suffix', () => {
        const wrapper = setup({});
        const fileName = 'test_xt.jpg';
        expect(wrapper.instance().untranscodedItem(fileName)).toEqual('test');
    });

    it('should not calculate OA of files if search key not present', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const wrapper = setup({});
        expect(
            wrapper
                .instance()
                .getFileOpenAccessStatus(
                    publicationEmbargoOAFile,
                    publicationEmbargoOAFile.fez_datastream_info[0].dsi_embargo_date,
                ),
        ).toEqual({ embargoDate: null, isOpenAccess: false, openAccessStatusId: null });
    });

    it('should show embargoed files to admins and not non-admins', () => {
        /* eslint-disable max-len */
        // prettier-ignore
        const publication = {
            rek_pid: 'UQ:676287',
            rek_title:
                'TRPC1 is a differential regulator of hypoxia-mediated events and Akt signalling in PTEN-deficient breast cancer cells',
            rek_description:
                'Hypoxia is a feature of the tumour microenvironment that promotes invasiveness, resistance to chemotherapeutics and cell survival. Our studies identify the transient receptor potential canonical-1 (TRPC1) ion channel as a key component of responses to hypoxia in breast cancer cells. This regulation includes control of specific epithelial to mesenchymal transition (EMT) events and hypoxia-mediated activation of signalling pathways such as activation of the EGFR, STAT3 and the autophagy marker LC3B, through hypoxia-inducible factor-1\u03b1 (HIF1\u03b1)-dependent and -independent mechanisms. TRPC1 regulated HIF1\u03b1 levels in PTEN-deficient MDA-MB-468 and HCC1569 breast cancer cell lines. This regulation arises from effects on the constitutive translation of HIF1\u03b1 under normoxic conditions via an Akt-dependent pathway. In further support of the role of TRPC1 in EMT, its expression is closely associated with EMT- and metastasisrelated genes in breast tumours, and is enhanced in basal B breast cancer cell lines. TRPC1 expression is also significantly prognostic for basal breast cancers, particularly those classified as lymph node positive. The defined roles of TRPC1 identified here could be therapeutically exploited for the control of oncogenic pathways in breast cancer cells.',
            rek_display_type: 179,
            rek_status: 2,
            rek_date: '2017-07-01T00:00:00Z',
            rek_created_date: '2017-07-29T15:00:44Z',
            rek_updated_date: '2017-08-20T04:04:37Z',
            rek_object_type: 3,
            rek_depositor: 8524,
            rek_file_downloads: 0,
            rek_citation:
                '<a class="author_id_link" title="Browse by Author ID for Azimi, Iman" href="/list/author_id/88893/">Azimi, Iman</a>, <a class="citation_author_name" title="Browse by Author Name for Milevskiy, Michael J. G." href="/list/author/Milevskiy%2C+Michael+J.+G./">Milevskiy, Michael J. G.</a>, <a class="author_id_link" title="Browse by Author ID for Kaemmerer, Elke" href="/list/author_id/1706239/">Kaemmerer, Elke</a>, <a class="author_id_link" title="Browse by Author ID for Turner, Dane" href="/list/author_id/97626/">Turner, Dane</a>, <a class="author_id_link" title="Browse by Author ID for Yapa, Kunsala T. D. S." href="/list/author_id/95450/">Yapa, Kunsala T. D. S.</a>, <a class="author_id_link" title="Browse by Author ID for Brown, Melissa A." href="/list/author_id/1671/">Brown, Melissa A.</a>, <a class="citation_author_name" title="Browse by Author Name for Thompson, Erik W." href="/list/author/Thompson%2C+Erik+W./">Thompson, Erik W.</a>, <a class="author_id_link" title="Browse by Author ID for Roberts-Thomson, Sarah J." href="/list/author_id/973/">Roberts-Thomson, Sarah J.</a> and <a class="author_id_link" title="Browse by Author ID for Monteith, Gregory R." href="/list/author_id/972/">Monteith, Gregory R.</a> (<span class="citation_date">2017</span>) <a class="citation_title" title="Click to view Journal Article: TRPC1 is a differential regulator of hypoxia-mediated events and Akt signalling in PTEN-deficient breast cancer cells" href="/view/UQ:676287">TRPC1 is a differential regulator of hypoxia-mediated events and Akt signalling in PTEN-deficient breast cancer cells</a>. <i><span class="citation_journal_name">Journal of Cell Science</span></i>, <i><span class="citation_volume_number">130</span></i> <span class="citation_issue_number">14</span>: <span class="citation_start_page">2292</span>-<span class="citation_end_page">2305</span>. doi:<span class="citation_doi">10.1242/jcs.196659</span>',
            rek_genre: 'Journal Article',
            rek_genre_type: 'Article (original research)',
            rek_formatted_title: null,
            rek_formatted_abstract: 'This is a test of the&nbsp;abstract',
            rek_depositor_affiliation: 1247,
            rek_thomson_citation_count: 0,
            rek_subtype: 'Article (original research)',
            rek_scopus_citation_count: 0,
            rek_herdc_notes: null,
            rek_scopus_doc_type: 'ar',
            rek_wok_doc_type: '@',
            rek_pubmed_doc_type: null,
            rek_security_inherited: null,
            rek_copyright: 'on',
            rek_altmetric_score: 49,
            rek_altmetric_id: 20711411,
            fez_record_search_key_access_conditions: null,
            fez_record_search_key_acknowledgements: null,
            fez_record_search_key_additional_notes: null,
            fez_record_search_key_advisory_statement: null,
            fez_record_search_key_alternate_genre: [],
            fez_record_search_key_alternative_title: [],
            fez_record_search_key_ands_collection_type: null,
            fez_record_search_key_architectural_features: [],
            fez_record_search_key_article_number: null,
            fez_record_search_key_assigned_group_id: [],
            fez_record_search_key_assigned_user_id: [],
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Azimi, Iman',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Milevskiy, Michael J. G.',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Kaemmerer, Elke',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Turner, Dane',
                    rek_author_order: 4,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Yapa, Kunsala T. D. S.',
                    rek_author_order: 5,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Brown, Melissa A.',
                    rek_author_order: 6,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Thompson, Erik W.',
                    rek_author_order: 7,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Roberts-Thomson, Sarah J.',
                    rek_author_order: 8,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:676287',
                    rek_author: 'Monteith, Gregory R.',
                    rek_author_order: 9,
                },
            ],
            fez_record_search_key_author_affiliation_id: [
                {
                    rek_author_affiliation_id_id: null,
                    rek_author_affiliation_id_pid: 'UQ:676287',
                    rek_author_affiliation_id_order: 1,
                    rek_author_affiliation_id: '10.13039/501100000925',
                },
                {
                    rek_author_affiliation_id_id: null,
                    rek_author_affiliation_id_pid: 'UQ:676287',
                    rek_author_affiliation_id_order: 2,
                    rek_author_affiliation_id: '10.13039/501100001168',
                },
                {
                    rek_author_affiliation_id_id: null,
                    rek_author_affiliation_id_pid: 'UQ:676287',
                    rek_author_affiliation_id_order: 3,
                    rek_author_affiliation_id: '10.13039/501100001026',
                },
            ],
            fez_record_search_key_author_affiliation_country: [
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 1,
                    rek_author_affiliation_country: 'Australia|Australia|Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 2,
                    rek_author_affiliation_country: 'Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 3,
                    rek_author_affiliation_country: 'Australia|Australia|Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 4,
                    rek_author_affiliation_country: 'Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 5,
                    rek_author_affiliation_country: 'Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 6,
                    rek_author_affiliation_country: 'Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 7,
                    rek_author_affiliation_country: 'Australia|Australia|Australia|Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 8,
                    rek_author_affiliation_country: 'Australia',
                },
                {
                    rek_author_affiliation_country_id: null,
                    rek_author_affiliation_country_pid: 'UQ:676287',
                    rek_author_affiliation_country_order: 9,
                    rek_author_affiliation_country: 'Australia|Australia|Australia',
                },
            ],
            fez_record_search_key_author_affiliation_full_address: [
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 1,
                    rek_author_affiliation_full_address:
                        'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia|Univ Queensland, Mater Res Inst, Brisbane, Qld 4101, Australia|Translat Res Inst, Brisbane, Qld 4102, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 2,
                    rek_author_affiliation_full_address:
                        'Univ Queensland, Sch Chem & Mol Biosci, Brisbane, Qld 4072, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 3,
                    rek_author_affiliation_full_address:
                        'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia|Univ Queensland, Mater Res Inst, Brisbane, Qld 4101, Australia|Translat Res Inst, Brisbane, Qld 4102, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 4,
                    rek_author_affiliation_full_address: 'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 5,
                    rek_author_affiliation_full_address: 'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 6,
                    rek_author_affiliation_full_address:
                        'Univ Queensland, Sch Chem & Mol Biosci, Brisbane, Qld 4072, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 7,
                    rek_author_affiliation_full_address:
                        'Translat Res Inst, Brisbane, Qld 4102, Australia|Queensland Univ Technol, Inst Hlth & Biomed Innovat, Brisbane, Qld 4059, Australia|Queensland Univ Technol, Sch Biomed Sci, Brisbane, Qld 4059, Australia|Univ Melbourne, St Vincents Hosp, Dept Surg, Melbourne, Vic 3065, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 8,
                    rek_author_affiliation_full_address: 'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia',
                },
                {
                    rek_author_affiliation_full_address_id: null,
                    rek_author_affiliation_full_address_pid: 'UQ:676287',
                    rek_author_affiliation_full_address_order: 9,
                    rek_author_affiliation_full_address:
                        'Univ Queensland, Sch Pharm, Brisbane, Qld 4102, Australia|Univ Queensland, Mater Res Inst, Brisbane, Qld 4101, Australia|Translat Res Inst, Brisbane, Qld 4102, Australia',
                },
            ],
            fez_record_search_key_author_affiliation_name: [
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 1,
                    rek_author_affiliation_name: 'University of Queensland|University of Queensland|Translat Res Inst',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 2,
                    rek_author_affiliation_name: 'University of Queensland',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 3,
                    rek_author_affiliation_name: 'University of Queensland|University of Queensland|Translat Res Inst',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 4,
                    rek_author_affiliation_name: 'University of Queensland',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 5,
                    rek_author_affiliation_name: 'University of Queensland',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 6,
                    rek_author_affiliation_name: 'University of Queensland',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 7,
                    rek_author_affiliation_name:
                        'Translat Res Inst|Queensland University of Technology (QUT)|Queensland University of Technology (QUT)|University of Melbourne',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 8,
                    rek_author_affiliation_name: 'University of Queensland',
                },
                {
                    rek_author_affiliation_name_id: null,
                    rek_author_affiliation_name_pid: 'UQ:676287',
                    rek_author_affiliation_name_order: 9,
                    rek_author_affiliation_name: 'University of Queensland|University of Queensland|Translat Res Inst',
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 88893,
                    rek_author_id_order: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 0,
                    rek_author_id_order: 2,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 1706239,
                    rek_author_id_order: 3,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 97626,
                    rek_author_id_order: 4,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 95450,
                    rek_author_id_order: 5,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 1671,
                    rek_author_id_order: 6,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 0,
                    rek_author_id_order: 7,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 973,
                    rek_author_id_order: 8,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:676287',
                    rek_author_id: 972,
                    rek_author_id_order: 9,
                },
            ],
            fez_record_search_key_author_role: [],
            fez_record_search_key_book_title: null,
            fez_record_search_key_building_materials: [],
            fez_record_search_key_category: [],
            fez_record_search_key_chapter_number: null,
            fez_record_search_key_condition: [],
            fez_record_search_key_conference_dates: null,
            fez_record_search_key_conference_id: null,
            fez_record_search_key_conference_location: null,
            fez_record_search_key_conference_name: null,
            fez_record_search_key_construction_date: null,
            fez_record_search_key_contact_details_email: [],
            fez_record_search_key_contributor: [],
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_convener: null,
            fez_record_search_key_corresponding_email: [
                {
                    rek_corresponding_email_id: null,
                    rek_corresponding_email_pid: 'UQ:676287',
                    rek_corresponding_email_order: 1,
                    rek_corresponding_email: 'gregm@uq.edu.au',
                },
                {
                    rek_corresponding_email_id: null,
                    rek_corresponding_email_pid: 'UQ:676287',
                    rek_corresponding_email_order: 2,
                    rek_corresponding_email: 'gregm@uq.edu.au',
                },
                {
                    rek_corresponding_email_id: null,
                    rek_corresponding_email_pid: 'UQ:676287',
                    rek_corresponding_email_order: 3,
                    rek_corresponding_email: 'gregm@uq.edu.au',
                },
            ],
            fez_record_search_key_corresponding_name: [
                {
                    rek_corresponding_name_id: null,
                    rek_corresponding_name_pid: 'UQ:676287',
                    rek_corresponding_name_order: 1,
                    rek_corresponding_name: 'Monteith, Gregory R.',
                },
                {
                    rek_corresponding_name_id: null,
                    rek_corresponding_name_pid: 'UQ:676287',
                    rek_corresponding_name_order: 2,
                    rek_corresponding_name: 'Monteith, Gregory R.',
                },
                {
                    rek_corresponding_name_id: null,
                    rek_corresponding_name_pid: 'UQ:676287',
                    rek_corresponding_name_order: 3,
                    rek_corresponding_name: 'Monteith, Gregory R.',
                },
            ],
            fez_record_search_key_corresponding_country: [
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 1,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 2,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 3,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 4,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 5,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 6,
                    rek_corresponding_country: 'Australia',
                },
                {
                    rek_corresponding_country_id: null,
                    rek_corresponding_country_pid: 'UQ:676287',
                    rek_corresponding_country_order: 7,
                    rek_corresponding_country: 'Australia',
                },
            ],
            fez_record_search_key_corresponding_organisation: [
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 1,
                    rek_corresponding_organisation: 'University of Queensland',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 2,
                    rek_corresponding_organisation: 'University of Queensland',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 3,
                    rek_corresponding_organisation: 'Translat Res Inst',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 4,
                    rek_corresponding_organisation: 'University of Queensland',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 5,
                    rek_corresponding_organisation: 'Queensland University of Technology (QUT)',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 6,
                    rek_corresponding_organisation: 'Queensland University of Technology (QUT)',
                },
                {
                    rek_corresponding_organisation_id: null,
                    rek_corresponding_organisation_pid: 'UQ:676287',
                    rek_corresponding_organisation_order: 7,
                    rek_corresponding_organisation: 'University of Melbourne',
                },
            ],
            fez_record_search_key_country_of_issue: null,
            fez_record_search_key_coverage_period: [],
            fez_record_search_key_creator_id: [],
            fez_record_search_key_creator_name: [],
            fez_record_search_key_datastream_policy: null,
            fez_record_search_key_data_volume: null,
            fez_record_search_key_date_available: {
                rek_date_available_id: null,
                rek_date_available_pid: 'UQ:676287',
                rek_date_available: '2017-07-15T00:00:00Z',
            },
            fez_record_search_key_date_photo_taken: null,
            fez_record_search_key_date_recorded: null,
            fez_record_search_key_date_scanned: null,
            fez_record_search_key_doi: { rek_doi_id: null, rek_doi_pid: 'UQ:676287', rek_doi: '10.1242/jcs.196659' },
            fez_record_search_key_edition: null,
            fez_record_search_key_end_date: null,
            fez_record_search_key_end_page: {
                rek_end_page_id: null,
                rek_end_page_pid: 'UQ:676287',
                rek_end_page: '2305',
            },
            fez_record_search_key_file_attachment_access_condition: [
                {
                    rek_file_attachment_access_condition_id: 17,
                    rek_file_attachment_access_condition_pid: 'UQ:792099',
                    rek_file_attachment_access_condition_xsdmf_id: 0,
                    rek_file_attachment_access_condition_order: 3,
                    rek_file_attachment_access_condition: '8',
                },
            ],
            fez_record_search_key_file_attachment_embargo_date: [
                {
                    rek_file_attachment_embargo_date_id: 83,
                    rek_file_attachment_embargo_date_pid: 'UQ:795494',
                    rek_file_attachment_embargo_date_xsdmf_id: 0,
                    rek_file_attachment_embargo_date_order: 3,
                    rek_file_attachment_embargo_date: '2018-03-27T08:16:00Z',
                },
            ],
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name_id: null,
                    rek_file_attachment_name_pid: 'UQ:676287',
                    rek_file_attachment_name: 'FezACML_UQ676287_OA.pdf.xml',
                    rek_file_attachment_name_order: 1,
                },
                {
                    rek_file_attachment_name_id: null,
                    rek_file_attachment_name_pid: 'UQ:676287',
                    rek_file_attachment_name: 'presmd_UQ676287_OA.xml',
                    rek_file_attachment_name_order: 2,
                },
                {
                    rek_file_attachment_name_id: null,
                    rek_file_attachment_name_pid: 'UQ:676287',
                    rek_file_attachment_name: 'UQ676287_OA.pdf',
                    rek_file_attachment_name_order: 3,
                },
                {
                    rek_file_attachment_name_id: null,
                    rek_file_attachment_name_pid: 'UQ:676287',
                    rek_file_attachment_name: 'image.jpg',
                    rek_file_attachment_name_order: 4,
                },
            ],
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'image.jpg',
                    dsi_embargo_date: '2050-12-01',
                    dsi_open_access: null,
                    dsi_label: 'testing image description',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97786,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'preview_image.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'preview_image.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 65857,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'thumbnail_image.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'thumbnail_image.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3952,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'web_image.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'web_image.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97345,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'deleted.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'deleted jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'D',
                    dsi_size: 97345,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'staffdata.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'staffdata.pdf',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97345,
                },
            ],
            fez_record_search_key_geographic_area: [],
            fez_record_search_key_grant_acronym: [],
            fez_record_search_key_grant_agency: [
                {
                    rek_grant_agency_id: null,
                    rek_grant_agency_pid: 'UQ:676287',
                    rek_grant_agency_order: 1,
                    rek_grant_agency: 'National Health and Medical Research Council',
                },
                {
                    rek_grant_agency_id: null,
                    rek_grant_agency_pid: 'UQ:676287',
                    rek_grant_agency_order: 2,
                    rek_grant_agency: 'Cancer Council Queensland',
                },
                {
                    rek_grant_agency_id: null,
                    rek_grant_agency_pid: 'UQ:676287',
                    rek_grant_agency_order: 3,
                    rek_grant_agency: 'National Breast Cancer Foundation',
                },
            ],
            fez_record_search_key_grant_agency_id: [
                {
                    rek_grant_agency_id_id: null,
                    rek_grant_agency_id_pid: 'UQ:676287',
                    rek_grant_agency_id_order: 1,
                    rek_grant_agency_id: '10.13039/501100000925',
                },
                {
                    rek_grant_agency_id_id: null,
                    rek_grant_agency_id_pid: 'UQ:676287',
                    rek_grant_agency_id_order: 2,
                    rek_grant_agency_id: '10.13039/501100001168',
                },
                {
                    rek_grant_agency_id_id: null,
                    rek_grant_agency_id_pid: 'UQ:676287',
                    rek_grant_agency_id_order: 3,
                    rek_grant_agency_id: '10.13039/501100001026',
                },
            ],
            fez_record_search_key_grant_id: [
                {
                    rek_grant_id_id: null,
                    rek_grant_id_pid: 'UQ:676287',
                    rek_grant_id_order: 1,
                    rek_grant_id: '569645 | 1022263',
                },
                {
                    rek_grant_id_id: null,
                    rek_grant_id_pid: 'UQ:676287',
                    rek_grant_id_order: 2,
                    rek_grant_id: '1042819',
                },
                {
                    rek_grant_id_id: null,
                    rek_grant_id_pid: 'UQ:676287',
                    rek_grant_id_order: 3,
                    rek_grant_id: 'CG-12-07 | CG-10-04',
                },
            ],
            fez_record_search_key_grant_text: [
                {
                    rek_grant_text_id: 583,
                    rek_grant_text_pid: 'UQ:396321',
                    rek_grant_text_xsdmf_id: 0,
                    rek_grant_text_order: 1,
                    rek_grant_text:
                        'We thank Jonathan Harris for the provision of DHT and David Miller for technical assistance and Kyle Upton for his critical review of the manuscript. Research was funded by the National Breast Cancer Foundation (NBCF: 2007003445 and CG-12-07) of Australia, the Australian Research Council (ARC: DP0985025), the Cancer Council of Queensland (CCQ: 1026095) and The University of Queensland. DHD was supported by a Collaborative Program Grant from the, National Breast Cancer Foundation [NBCF; CG-08-03]. Institute, Integrative Cancer Biology Program U54CA1113001 (KPN). SLE, JDF, AMS and ED are supported by Fellowships from the NBCF [ID# ECF-10-05, ECF-12-04, ECF-12-12 and ECF-13-04 respectively]. FA is supported by Future Fellowship from the Australian Research Council [ID: FT130101417]. JMWG is funding by a Scientific Fellowship from Breast Cancer Now. MJM and JAB are supported by an Australian Postgraduate Award (APA). AS was supported from NBCF program grant. SJC supported by NHMRC fellowship. Funding to pay the Open Access publication charges for this article was provided by The University of Queensland.',
                },
            ],
            fez_record_search_key_herdc_code: {
                rek_herdc_code_id: null,
                rek_herdc_code_pid: 'UQ:676287',
                rek_herdc_code: 450009,
            },
            fez_record_search_key_herdc_status: {
                rek_herdc_status_id: null,
                rek_herdc_status_pid: 'UQ:676287',
                rek_herdc_status: 453220,
            },
            fez_record_search_key_identifier: [],
            fez_record_search_key_institutional_status: {
                rek_institutional_status_id: null,
                rek_institutional_status_pid: 'UQ:676287',
                rek_institutional_status: 453223,
            },
            fez_record_search_key_interior_features: [],
            fez_record_search_key_isbn: [],
            fez_record_search_key_isdatasetof: [],
            fez_record_search_key_isderivationof: [],
            fez_record_search_key_isi_loc: {
                rek_isi_loc_id: null,
                rek_isi_loc_pid: 'UQ:676287',
                rek_isi_loc: '000405613400008',
            },
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof_id: null,
                    rek_ismemberof_pid: 'UQ:676287',
                    rek_ismemberof: 'UQ:3833',
                    rek_ismemberof_order: 1,
                },
                {
                    rek_ismemberof_id: null,
                    rek_ismemberof_pid: 'UQ:676287',
                    rek_ismemberof: 'UQ:13602',
                    rek_ismemberof_order: 2,
                },
                {
                    rek_ismemberof_id: null,
                    rek_ismemberof_pid: 'UQ:676287',
                    rek_ismemberof: 'UQ:3825',
                    rek_ismemberof_order: 3,
                },
                {
                    rek_ismemberof_id: null,
                    rek_ismemberof_pid: 'UQ:676287',
                    rek_ismemberof: 'UQ:218311',
                    rek_ismemberof_order: 4,
                },
                {
                    rek_ismemberof_id: null,
                    rek_ismemberof_pid: 'UQ:676287',
                    rek_ismemberof: 'UQ:677356',
                    rek_ismemberof_order: 5,
                },
            ],
            fez_record_search_key_issn: [
                {
                    rek_issn_id: 5382905,
                    rek_issn_pid: 'UQ:676287',
                    rek_issn_xsdmf_id: null,
                    rek_issn: '1477-9137',
                    rek_issn_order: 1,
                    fez_journal_issns: [
                        {
                            jni_id: 13071,
                            jni_jnl_id: 7538,
                            jni_issn: '1477-9137',
                            jni_issn_order: 2,
                            fez_journal: {
                                jnl_id: 7538,
                                jnl_journal_name: 'Journal of Cell Science',
                                jnl_era_id: 2234,
                                jnl_era_year: 2010,
                                jnl_created_date: '2010-11-19 00:00:00',
                                jnl_updated_date: '2010-11-19 00:00:00',
                                jnl_rank: 'A',
                                jnl_foreign_name: null,
                            },
                        },
                    ],
                    fez_sherpa_romeo: {
                        srm_id: 13764,
                        srm_issn: '1477-9137',
                        srm_xml:
                            '<?xml version="1.0" encoding="ISO-8859-1" ?>\n<!DOCTYPE romeoapi SYSTEM "http://www.sherpa.ac.uk/romeo/romeoapi293.dtd">\n<romeoapi version="2.9.9">\n  <header>\n    <parameters>\n      <parameter source="specified">\n        <parametername>issn</parametername>\n        <parametervalue>1477-9137</parametervalue>\n      </parameter>\n      <parameter source="specified">\n        <parametername>versions</parametername>\n        <parametervalue>all</parametervalue>\n      </parameter>\n      <parameter source="default">\n        <parametername>showfunder</parametername>\n        <parametervalue>none</parametervalue>\n      </parameter>\n      <parameter source="default">\n        <parametername>fIDnum</parametername>\n        <parametervalue>|</parametervalue>\n      </parameter>\n      <parameter source="default">\n        <parametername>la</parametername>\n        <parametervalue>en</parametervalue>\n      </parameter>\n    </parameters>\n    <numhits>1</numhits>\n    <apicontrol>journal</apicontrol>\n    <outcome>singleJournal</outcome>\n    <message />\n    <licence>SHERPA/RoMEO data is available for re-use under a Creative Commons Attribution-Non-Commercial-Share Alike 2.5 licence. For more details, please see the \'conditions for re-use\' at the &lt;licenceurl /&gt;, and linked-to from the SHERPA/RoMEO home page.</licence>\n    <licenceurl>http://www.sherpa.ac.uk/romeoreuse.html</licenceurl>\n    <disclaimer>All SHERPA/RoMEO information is correct to the best of our knowledge but should not be relied upon for legal advice. SHERPA cannot be held responsible for the re-use of RoMEO data, or for alternative interpretations which are derived from this information.</disclaimer>\n    <timestamp>30-Sep-2017:19:26:17</timestamp>\n  </header>\n  <journals>\n    <journal>\n      <jtitle>Journal of Cell Science</jtitle>\n      <issn>0021-9533</issn>\n      <zetocpub>Company of Biologists</zetocpub>\n      <romeopub>Company of Biologists</romeopub>\n    </journal>\n  </journals>\n  <publishers>\n    <publisher id="29">\n      <name>Company of Biologists</name>\n      <alias />\n      <homeurl>http://www.biologists.com/web/index.shtml</homeurl>\n      <preprints>\n        <prearchiving>can</prearchiving>\n        <prerestrictions />\n      </preprints>\n      <postprints>\n        <postarchiving>can</postarchiving>\n        <postrestrictions />\n      </postprints>\n      <pdfversion>\n        <pdfarchiving>can</pdfarchiving>\n        <pdfrestrictions />\n      </pdfversion>\n      <conditions>\n        <condition>On author\'s personal website immediately</condition>\n        <condition>On institutional repository or PubMed Central after a &lt;num&gt;12&lt;/num&gt; &lt;period units=&quot;month&quot;&gt;months&lt;/period&gt; embargo period or as mandated</condition>\n        <condition>Authors retain copyright</condition>\n        <condition>Publisher\'s version/PDF may be used</condition>\n        <condition>Must link to publisher version</condition>\n        <condition>Non-commercial use</condition>\n        <condition>Publisher will automatically deposit in PMC for authors funded by RCUK, HHMI, NIH, MRC, Wellcome Trust for release 6 or 12 months after publication</condition>\n        <condition>Non-commercial use</condition>\n        <condition>Publisher last contacted on 30/03/2016</condition>\n      </conditions>\n      <mandates />\n      <paidaccess>\n        <paidaccessurl>http://jcs.biologists.org/content/rights-permissions</paidaccessurl>\n        <paidaccessname>Open Access</paidaccessname>\n        <paidaccessnotes>A paid open access option is available for this journal.</paidaccessnotes>\n      </paidaccess>\n      <copyrightlinks>\n        <copyrightlink>\n          <copyrightlinktext>Journal of Cell Science Policy</copyrightlinktext>\n          <copyrightlinkurl>http://jcs.biologists.org/content/rights-permissions</copyrightlinkurl>\n        </copyrightlink>\n        <copyrightlink>\n          <copyrightlinktext>Journal of Experimental Biology Policy</copyrightlinktext>\n          <copyrightlinkurl>http://jeb.biologists.org/content/rights-permissions</copyrightlinkurl>\n        </copyrightlink>\n      </copyrightlinks>\n      <romeocolour>green</romeocolour>\n      <dateadded>2004-01-10 00:00:00</dateadded>\n      <dateupdated>2016-04-12 16:14:47</dateupdated>\n    </publisher>\n  </publishers>\n</romeoapi>\n',
                        srm_journal_name: 'Journal of Cell Science',
                        srm_colour: 'green',
                        srm_date_updated: '2017-09-30 18:26:18',
                    },
                    rek_issn_lookup: 'green',
                },
            ],
            fez_record_search_key_issue_number: {
                rek_issue_number_id: null,
                rek_issue_number_pid: 'UQ:676287',
                rek_issue_number: '14',
            },
            fez_record_search_key_job_number: null,
            fez_record_search_key_journal_name: {
                rek_journal_name_id: null,
                rek_journal_name_pid: 'UQ:676287',
                rek_journal_name: 'Journal of Cell Science',
            },
            fez_record_search_key_keywords: [
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'Akt',
                    rek_keywords_order: 1,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'Breast cancer',
                    rek_keywords_order: 2,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'Ca2+',
                    rek_keywords_order: 3,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'Hypoxia',
                    rek_keywords_order: 4,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'PTEN',
                    rek_keywords_order: 5,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'Signal transduction',
                    rek_keywords_order: 6,
                },
                {
                    rek_keywords_id: null,
                    rek_keywords_pid: 'UQ:676287',
                    rek_keywords: 'TRPC1',
                    rek_keywords_order: 7,
                },
            ],
            fez_record_search_key_language: [
                {
                    rek_language_id: null,
                    rek_language_pid: 'UQ:676287',
                    rek_language: 'eng',
                    rek_language_order: 1,
                },
            ],
            fez_record_search_key_language_of_book_title: [],
            fez_record_search_key_language_of_journal_name: [],
            fez_record_search_key_language_of_proceedings_title: [],
            fez_record_search_key_language_of_title: [],
            fez_record_search_key_length: null,
            fez_record_search_key_license: null,
            fez_record_search_key_link: [],
            fez_record_search_key_link_description: [],
            fez_record_search_key_location: [],
            fez_record_search_key_native_script_book_title: null,
            fez_record_search_key_native_script_conference_name: null,
            fez_record_search_key_native_script_journal_name: null,
            fez_record_search_key_native_script_proceedings_title: null,
            fez_record_search_key_native_script_title: null,
            fez_record_search_key_newspaper: null,
            fez_record_search_key_notes: null,
            fez_record_search_key_oa_embargo_days: null,
            fez_record_search_key_oa_notes: null,
            fez_record_search_key_oa_status: {
                rek_oa_status_id: null,
                rek_oa_status_pid: 'UQ:676287',
                rek_oa_status: 453695,
            },
            fez_record_search_key_org_name: null,
            fez_record_search_key_org_unit_name: null,
            fez_record_search_key_original_format: null,
            fez_record_search_key_parent_publication: null,
            fez_record_search_key_patent_number: null,
            fez_record_search_key_period: [],
            fez_record_search_key_place_of_publication: {
                rek_place_of_publication_id: null,
                rek_place_of_publication_pid: 'UQ:676287',
                rek_place_of_publication: 'Cambridge, United Kingdom',
            },
            fez_record_search_key_proceedings_title: null,
            fez_record_search_key_project_description: null,
            fez_record_search_key_project_id: null,
            fez_record_search_key_project_name: null,
            fez_record_search_key_project_start_date: null,
            fez_record_search_key_publisher: {
                rek_publisher_id: null,
                rek_publisher_pid: 'UQ:676287',
                rek_publisher: 'Company of Biologists',
            },
            fez_record_search_key_pubmed_id: {
                rek_pubmed_id_id: null,
                rek_pubmed_id_pid: 'UQ:676287',
                rek_pubmed_id: '28559303',
            },
            fez_record_search_key_refereed: { rek_refereed_id: null, rek_refereed_pid: 'UQ:676287', rek_refereed: 1 },
            fez_record_search_key_refereed_source: {
                rek_refereed_source_id: null,
                rek_refereed_source_pid: 'UQ:676287',
                rek_refereed_source: 453635,
            },
            fez_record_search_key_related_datasets: null,
            fez_record_search_key_related_publications: null,
            fez_record_search_key_report_number: null,
            fez_record_search_key_retracted: {
                rek_retracted_id: null,
                rek_retracted_pid: 'UQ:676287',
                rek_retracted: 0,
            },
            fez_record_search_key_rights: null,
            fez_record_search_key_roman_script_book_title: null,
            fez_record_search_key_roman_script_conference_name: null,
            fez_record_search_key_roman_script_journal_name: null,
            fez_record_search_key_roman_script_proceedings_title: null,
            fez_record_search_key_roman_script_title: null,
            fez_record_search_key_scale: null,
            fez_record_search_key_scopus_id: {
                rek_scopus_id_id: null,
                rek_scopus_id_pid: 'UQ:676287',
                rek_scopus_id: '2-s2.0-85024119372',
            },
            fez_record_search_key_section: null,
            fez_record_search_key_seo_code: [],
            fez_record_search_key_series: null,
            fez_record_search_key_software_required: [],
            fez_record_search_key_source: null,
            fez_record_search_key_start_date: null,
            fez_record_search_key_start_page: {
                rek_start_page_id: null,
                rek_start_page_pid: 'UQ:676287',
                rek_start_page: '2292',
            },
            fez_record_search_key_structural_systems: [],
            fez_record_search_key_style: [],
            fez_record_search_key_subcategory: [],
            fez_record_search_key_subject: [],
            fez_record_search_key_supervisor: [],
            fez_record_search_key_supervisor_id: [],
            fez_record_search_key_surrounding_features: [],
            fez_record_search_key_time_period_end_date: null,
            fez_record_search_key_time_period_start_date: null,
            fez_record_search_key_total_chapters: null,
            fez_record_search_key_total_pages: {
                rek_total_pages_id: null,
                rek_total_pages_pid: 'UQ:676287',
                rek_total_pages: '14',
            },
            fez_record_search_key_transcript: null,
            fez_record_search_key_translated_book_title: null,
            fez_record_search_key_translated_conference_name: null,
            fez_record_search_key_translated_journal_name: null,
            fez_record_search_key_translated_newspaper: null,
            fez_record_search_key_translated_proceedings_title: null,
            fez_record_search_key_translated_title: null,
            fez_record_search_key_type_of_data: [],
            fez_record_search_key_volume_number: {
                rek_volume_number_id: null,
                rek_volume_number_pid: 'UQ:676287',
                rek_volume_number: '130',
            },
            rek_display_type_lookup: 'Journal Article',
        };
        /* eslint-enable max-len */

        const wrapper = setup({ publication: publication, isAdmin: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        const wrapper2 = setup({ publication: publication, isAdmin: false });
        expect(toJson(wrapper2)).toMatchSnapshot();
        expect(toJson(wrapper)).not.toEqual(toJson(wrapper2));
    });

    it('should correctly get dataStream item for thumbnail and preview images', () => {
        const thumbnailFileName = 'thumbnail_AL_LH_01.jpg';
        const previewFileName = 'preview_AL_LH_01.jpg';
        const fezDatastreamInfo = [
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'AL_LH_01.tif',
                dsi_embargo_date: null,
                dsi_open_access: 1,
                dsi_label: '',
                dsi_mimetype: 'image/tiff',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 27932352,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'FezACML_AL_LH_01.tif.xml',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: 'FezACML security for datastream - AL_LH_01.tif',
                dsi_mimetype: 'text/xml',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 64,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'FezACML_UQ_107683.xml',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: 'FezACML security for PID - UQ:107683',
                dsi_mimetype: 'text/xml',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 3633,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'presmd_AL_LH_01.xml',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'application/xml',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 239623,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'preview_AL_LH_01.jpg',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 95360,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'thumbnail_AL_LH_01.jpg',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 3912,
            },
            {
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'web_AL_LH_01.jpg',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 163244,
            },
        ];

        const wrapper = setup({});
        expect(wrapper.instance().searchByKey(fezDatastreamInfo, 'dsi_dsid', thumbnailFileName)).toEqual({
            dsi_pid: 'UQ:107683',
            dsi_dsid: 'thumbnail_AL_LH_01.jpg',
            dsi_embargo_date: null,
            dsi_open_access: null,
            dsi_label: '',
            dsi_mimetype: 'image/jpeg',
            dsi_copyright: null,
            dsi_state: 'A',
            dsi_size: 3912,
        });

        expect(wrapper.instance().searchByKey(fezDatastreamInfo, 'dsi_dsid', previewFileName)).toEqual({
            dsi_pid: 'UQ:107683',
            dsi_dsid: 'preview_AL_LH_01.jpg',
            dsi_embargo_date: null,
            dsi_open_access: null,
            dsi_label: '',
            dsi_mimetype: 'image/jpeg',
            dsi_copyright: null,
            dsi_state: 'A',
            dsi_size: 95360,
        });
    });

    it(
        'should correctly get dataStream item for a file that skips transcoding and has' +
            'overrides supplied for thumbnail and preview images',
        () => {
            const thumbnailFileName = 'thumbnail_AL_LH_01.jpg';
            const previewFileName = 'preview_AL_LH_01.jpg';
            const fezDatastreamInfo = [
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'AL_LH_01_xt.tif',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: '',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 27932352,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'FezACML_AL_LH_01.tif.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - AL_LH_01.tif',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 64,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'FezACML_UQ_107683.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for PID - UQ:107683',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3633,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'presmd_AL_LH_01.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 239623,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'preview_AL_LH_01.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 95360,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'thumbnail_AL_LH_01.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3912,
                },
                {
                    dsi_pid: 'UQ:107683',
                    dsi_dsid: 'web_AL_LH_01.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 163244,
                },
            ];

            const wrapper = setup({});
            expect(wrapper.instance().searchByKey(fezDatastreamInfo, 'dsi_dsid', thumbnailFileName)).toEqual({
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'thumbnail_AL_LH_01.jpg',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 3912,
            });

            expect(wrapper.instance().searchByKey(fezDatastreamInfo, 'dsi_dsid', previewFileName)).toEqual({
                dsi_pid: 'UQ:107683',
                dsi_dsid: 'preview_AL_LH_01.jpg',
                dsi_embargo_date: null,
                dsi_open_access: null,
                dsi_label: '',
                dsi_mimetype: 'image/jpeg',
                dsi_copyright: null,
                dsi_state: 'A',
                dsi_size: 95360,
            });
        },
    );

    it('should render alert for video files and firefox', () => {
        const pub = {
            rek_pid: 'UQ:185044',
            rek_title_xsdmf_id: 10766,
            /* eslint-disable-next-line max-len */
            rek_title:
                'An experimental study of tidal bore propagation: The impact of bridge piers and channel constriction',
            rek_description_xsdmf_id: 11455,
            rek_description:
                'A tidal bore is an unsteady flow motion generated by the rapid water level rise at the river mouth during the early flood tide when the tidal range exceeds 4 to 6 m, the estuary bathymetry amplifies the tidal wave and the freshwater level is low. The tidal bore is an abrupt rise in water depth associated with a discontinuity in water depth and velocity at the bore front. The present study examines the turbulence and turbulent mixing generated by the passage of an undular tidal bore in a short channel constriction such as a set of bridge piers. Some new experiments were conducted in a large rectangular prismatic channel. Then a short channel constriction that was a 1/20 scale model of the Pont Aubaud on the Sélune River in the Baie du Mont Saint Michel was installed. The free-surface properties of undular tidal bores were carefully documented for both configurations. The analysis of the parametric relationship between momentum function and specific energy showed that the undular flow properties were restricted to the subcritical branch of the M-E diagram, while the quantitative results indicated that the effects of streamline curvature could not be ignored. The free-surface undulation profiles exhibited a quasi-periodic shape, but both field measurements and laboratory observations demonstrated that neither the linear wave theory nor the Boussinesq equation theory captured the fine details of the free-surface profiles. An analysis of the potential energy of the undular tidal bore showed that the potential energy of the free-surface undulations represented up to 30% of the potential energy of the tidal bore. The presence of the channel constriction had a major impact on the free-surface properties. In the channel throat, the wave motion was three-dimensional, pseudo-chaotic and energetic and the undular bore lost nearly one third of its potential energy per surface area as it propagated through the channel constriction. The velocity data sets suggested the upstream advection of energetic turbulent events and vorticity behind the bore front. It is proposed that these energetic turbulent events were some macro-turbulence generated by secondary currents. With the channel constriction, some intense large-scale turbulence was further produced by the constriction. The proposed mechanism was consistent with some field observations in the Daly River tidal bore in 2003. Overall the presence of a channel constriction (e.g. bridge piers) does impact onto the bore propagation. It is associated with some energy loss and the development of large-scale coherent structures, and these processes might induce some river bed scour on the vicinity of the bridge piers. The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}.',
            rek_display_type_xsdmf_id: 3673,
            rek_display_type: 181,
            rek_status_xsdmf_id: 3680,
            rek_status: 2,
            rek_date_xsdmf_id: 6510,
            rek_date: '2009-01-01T00:00:00Z',
            rek_object_type_xsdmf_id: 3674,
            rek_object_type: 3,
            rek_depositor_xsdmf_id: 7578,
            rek_depositor: 737,
            rek_created_date_xsdmf_id: 3677,
            rek_created_date: '2009-10-20T07:52:41Z',
            rek_updated_date_xsdmf_id: 3678,
            rek_updated_date: '2018-07-03T05:27:09Z',
            rek_file_downloads: 1579,
            rek_citation: '',
            rek_genre_xsdmf_id: 7204,
            rek_genre: 'Department Technical Report',
            rek_genre_type_xsdmf_id: null,
            rek_genre_type: null,
            rek_formatted_title_xsdmf_id: null,
            rek_formatted_title: null,
            rek_formatted_abstract_xsdmf_id: null,
            rek_formatted_abstract: null,
            rek_depositor_affiliation_xsdmf_id: 11881,
            rek_depositor_affiliation: 891,
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
                    rek_author_id: 28884294,
                    rek_author_pid: 'UQ:185044',
                    rek_author_xsdmf_id: 6468,
                    rek_author: 'Chanson, Hubert',
                    rek_author_order: 1,
                },
            ],
            fez_record_search_key_author_affiliation_country: [],
            fez_record_search_key_author_affiliation_full_address: [],
            fez_record_search_key_author_affiliation_id: [],
            fez_record_search_key_author_affiliation_name: [],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: 28256092,
                    rek_author_id_pid: 'UQ:185044',
                    rek_author_id_xsdmf_id: 6463,
                    rek_author_id: 193,
                    rek_author_id_order: 1,
                    rek_author_id_lookup: 'Chanson, Hubert',
                },
            ],
            fez_record_search_key_contributor: [],
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_corresponding_country: [],
            fez_record_search_key_corresponding_email: [],
            fez_record_search_key_corresponding_name: [],
            fez_record_search_key_corresponding_organisation: [],
            fez_record_search_key_datastream_policy: null,
            fez_record_search_key_end_page: {
                rek_end_page_id: 5501977,
                rek_end_page_pid: 'UQ:185044',
                rek_end_page_xsdmf_id: 10776,
                rek_end_page: '104',
            },
            fez_record_search_key_file_attachment_access_condition: [],
            fez_record_search_key_file_attachment_embargo_date: [],
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name_id: 3880147,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_1.mov',
                    rek_file_attachment_name_order: 1,
                },
                {
                    rek_file_attachment_name_id: 3880148,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_2.mov',
                    rek_file_attachment_name_order: 2,
                },
                {
                    rek_file_attachment_name_id: 3880149,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_3.mov',
                    rek_file_attachment_name_order: 3,
                },
                {
                    rek_file_attachment_name_id: 3880150,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_4.mov',
                    rek_file_attachment_name_order: 4,
                },
                {
                    rek_file_attachment_name_id: 3880151,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_5.mov',
                    rek_file_attachment_name_order: 5,
                },
                {
                    rek_file_attachment_name_id: 3880152,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'ch7409_report.pdf',
                    rek_file_attachment_name_order: 6,
                },
                {
                    rek_file_attachment_name_id: 3880153,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_1.xml',
                    rek_file_attachment_name_order: 7,
                },
                {
                    rek_file_attachment_name_id: 3880154,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_2.xml',
                    rek_file_attachment_name_order: 8,
                },
                {
                    rek_file_attachment_name_id: 3880155,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_3.xml',
                    rek_file_attachment_name_order: 9,
                },
                {
                    rek_file_attachment_name_id: 3880156,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_4.xml',
                    rek_file_attachment_name_order: 10,
                },
                {
                    rek_file_attachment_name_id: 3880157,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_5.xml',
                    rek_file_attachment_name_order: 11,
                },
                {
                    rek_file_attachment_name_id: 3880158,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_ch7409_report.xml',
                    rek_file_attachment_name_order: 12,
                },
                {
                    rek_file_attachment_name_id: 3880159,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_1.flv',
                    rek_file_attachment_name_order: 13,
                },
                {
                    rek_file_attachment_name_id: 3880160,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_2.flv',
                    rek_file_attachment_name_order: 14,
                },
                {
                    rek_file_attachment_name_id: 3880161,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_3.flv',
                    rek_file_attachment_name_order: 15,
                },
                {
                    rek_file_attachment_name_id: 3880162,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_4.flv',
                    rek_file_attachment_name_order: 16,
                },
                {
                    rek_file_attachment_name_id: 3880163,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_5.flv',
                    rek_file_attachment_name_order: 17,
                },
                {
                    rek_file_attachment_name_id: 3880164,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_1.jpg',
                    rek_file_attachment_name_order: 18,
                },
                {
                    rek_file_attachment_name_id: 3880165,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_2.jpg',
                    rek_file_attachment_name_order: 19,
                },
                {
                    rek_file_attachment_name_id: 3880166,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_3.jpg',
                    rek_file_attachment_name_order: 20,
                },
                {
                    rek_file_attachment_name_id: 3880167,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_4.jpg',
                    rek_file_attachment_name_order: 21,
                },
                {
                    rek_file_attachment_name_id: 3880168,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_5.jpg',
                    rek_file_attachment_name_order: 22,
                },
            ],
            fez_record_search_key_grant_acronym: [],
            fez_record_search_key_grant_agency: [],
            fez_record_search_key_grant_agency_id: [],
            fez_record_search_key_grant_text: [],
            fez_record_search_key_herdc_code: null,
            fez_record_search_key_herdc_status: null,
            fez_record_search_key_institutional_status: null,
            fez_record_search_key_isderivationof: [],
            fez_record_search_key_isi_loc: null,
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof_id: 11517593,
                    rek_ismemberof_pid: 'UQ:185044',
                    rek_ismemberof_xsdmf_id: 149,
                    rek_ismemberof: 'UQ:195545',
                    rek_ismemberof_order: 1,
                    rek_ismemberof_lookup: 'School of Civil Engineering Publications',
                },
            ],
            fez_record_search_key_keywords: [
                {
                    rek_keywords_id: 29165376,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Tidal bores',
                    rek_keywords_order: 1,
                },
                {
                    rek_keywords_id: 29165377,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Turbulence',
                    rek_keywords_order: 2,
                },
                {
                    rek_keywords_id: 29165378,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Positive surges',
                    rek_keywords_order: 3,
                },
                {
                    rek_keywords_id: 29165379,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bridge piers',
                    rek_keywords_order: 4,
                },
                {
                    rek_keywords_id: 29165380,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Physical modelling',
                    rek_keywords_order: 5,
                },
                {
                    rek_keywords_id: 29165381,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Energy Dissipation',
                    rek_keywords_order: 6,
                },
                {
                    rek_keywords_id: 29165382,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Wave transformation',
                    rek_keywords_order: 7,
                },
                {
                    rek_keywords_id: 29165383,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bore front',
                    rek_keywords_order: 8,
                },
                {
                    rek_keywords_id: 29165384,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Turbulent mixing',
                    rek_keywords_order: 9,
                },
                {
                    rek_keywords_id: 29165385,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Secondary currents',
                    rek_keywords_order: 10,
                },
                {
                    rek_keywords_id: 29165386,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bridge structures',
                    rek_keywords_order: 11,
                },
            ],
            fez_record_search_key_language: [
                {
                    rek_language_id: 5225705,
                    rek_language_pid: 'UQ:185044',
                    rek_language_xsdmf_id: 10772,
                    rek_language: 'eng',
                    rek_language_order: 1,
                },
            ],
            fez_record_search_key_link: [],
            fez_record_search_key_link_description: [],
            fez_record_search_key_notes: {
                rek_notes_id: 1110911,
                rek_notes_pid: 'UQ:185044',
                rek_notes_xsdmf_id: 12446,
                rek_notes:
                    'The full bibliographic details are: CHANSON, H. (2009). "An Experimental Study of Tidal Bore Propagation: the Impact of Bridge Piers and Channel Constriction." Hydraulic Model Report No. CH74/08, School of Civil Engineering, The University of Queensland, Brisbane, Australia, 110 pages & 5 movie files (ISBN 9781864999600). The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}. All the movies are Copyrights Hubert CHANSON 2009.',
            },
            fez_record_search_key_oa_status: {
                rek_oa_status_id: 319686,
                rek_oa_status_pid: 'UQ:185044',
                rek_oa_status_xsdmf_id: 16978,
                rek_oa_status: 453697,
                rek_oa_status_lookup: 'Other',
            },
            fez_record_search_key_org_name: {
                rek_org_name_id: 349788,
                rek_org_name_pid: 'UQ:185044',
                rek_org_name_xsdmf_id: 6512,
                rek_org_name: 'The University of Queensland',
            },
            fez_record_search_key_org_unit_name: {
                rek_org_unit_name_id: 339387,
                rek_org_unit_name_pid: 'UQ:185044',
                rek_org_unit_name_xsdmf_id: 6505,
                rek_org_unit_name: 'Civil Engneering',
            },
            fez_record_search_key_publisher: {
                rek_publisher_id: 4431611,
                rek_publisher_pid: 'UQ:185044',
                rek_publisher_xsdmf_id: 6508,
                rek_publisher: 'School of Civil Engineering, The University of Queensland',
            },
            fez_record_search_key_refereed: null,
            fez_record_search_key_refereed_source: {
                rek_refereed_source_id: 1182183,
                rek_refereed_source_pid: 'UQ:185044',
                rek_refereed_source_xsdmf_id: 16623,
                rek_refereed_source: '453638',
                rek_refereed_source_lookup: 'Not yet assessed',
            },
            fez_record_search_key_report_number: {
                rek_report_number_id: 16061,
                rek_report_number_pid: 'UQ:185044',
                rek_report_number_xsdmf_id: 6502,
                rek_report_number: 'CH74/09',
            },
            fez_record_search_key_scopus_id: null,
            fez_record_search_key_series: {
                rek_series_id: 193574,
                rek_series_pid: 'UQ:185044',
                rek_series_xsdmf_id: 6503,
                rek_series: 'Hydraulic Model Report CH',
            },
            fez_record_search_key_start_page: {
                rek_start_page_id: 5572241,
                rek_start_page_pid: 'UQ:185044',
                rek_start_page_xsdmf_id: 10775,
                rek_start_page: '1',
            },
            fez_record_search_key_subject: [
                {
                    rek_subject_id: 9094390,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452292,
                    rek_subject_order: 1,
                    rek_subject_lookup: '09 Engineering',
                },
                {
                    rek_subject_id: 9094391,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452329,
                    rek_subject_order: 2,
                    rek_subject_lookup: '0905 Civil Engineering',
                },
                {
                    rek_subject_id: 9094392,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452338,
                    rek_subject_order: 3,
                    rek_subject_lookup: '090509 Water Resources Engineering',
                },
            ],
            fez_record_search_key_total_pages: {
                rek_total_pages_id: 5481094,
                rek_total_pages_pid: 'UQ:185044',
                rek_total_pages_xsdmf_id: 10777,
                rek_total_pages: '110',
            },
            fez_record_search_key_translated_title: null,
            fez_record_search_key_wok_doc_types: [],
            fez_record_search_key_issn: [],
            fez_record_search_key_doi: null,
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_1.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 1',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_2.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 2',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2750166,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_3.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 3',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_4.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 4',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4500146,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_5.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 5',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1175050,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'ch7409_report.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Technical report PDF file',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6998485,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'Chanson_movie_1.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Movie 1',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'D',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_1.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_1.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_2.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_2.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_3.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_3.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_4.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_4.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_5.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_5.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_UQ_185044.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for PID - UQ:185044',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3705,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_1.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_2.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_3.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_4.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_5.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_ch7409_report.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 277266,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_Chanson_movie_1.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 530,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_1.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 340806,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_2.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 357167,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_3.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 371437,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_4.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 551102,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_5.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 286470,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_1.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 5252,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_2.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6732,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_3.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 5487,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_4.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 9800,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_5.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 7236,
                },
            ],
            fez_matched_journals: [],
            fez_record_search_key_has_datasets: [],
            fez_record_search_key_has_related_datasets: [],
            fez_record_search_key_has_derivations: [],
            rek_status_lookup: 'Published',
            rek_object_type_lookup: 'Record',
            rek_wok_doc_type_lookup: null,
            rek_display_type_lookup: 'Department Technical Report',
            rek_scopus_doc_type_lookup: null,
            rek_pubmed_doc_type_lookup: null,
        };
        Object.defineProperty(window.navigator, 'userAgent', { value: 'FireFox' });
        const wrapper = setup({ publication: pub });
        // wrapper.instance().hasVideo === true;
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('getFileData{} branch 1', () => {
        const pub = {
            rek_pid: 'UQ:185044',
            rek_title_xsdmf_id: 10766,
            rek_title:
                'An experimental study of tidal bore propagation: ' +
                'The impact of bridge piers and channel constriction',
            rek_description_xsdmf_id: 11455,
            rek_description:
                'A tidal bore is an unsteady flow motion generated by the rapid water level rise at the river mouth during the early flood tide when the tidal range exceeds 4 to 6 m, the estuary bathymetry amplifies the tidal wave and the freshwater level is low. The tidal bore is an abrupt rise in water depth associated with a discontinuity in water depth and velocity at the bore front. The present study examines the turbulence and turbulent mixing generated by the passage of an undular tidal bore in a short channel constriction such as a set of bridge piers. Some new experiments were conducted in a large rectangular prismatic channel. Then a short channel constriction that was a 1/20 scale model of the Pont Aubaud on the Sélune River in the Baie du Mont Saint Michel was installed. The free-surface properties of undular tidal bores were carefully documented for both configurations. The analysis of the parametric relationship between momentum function and specific energy showed that the undular flow properties were restricted to the subcritical branch of the M-E diagram, while the quantitative results indicated that the effects of streamline curvature could not be ignored. The free-surface undulation profiles exhibited a quasi-periodic shape, but both field measurements and laboratory observations demonstrated that neither the linear wave theory nor the Boussinesq equation theory captured the fine details of the free-surface profiles. An analysis of the potential energy of the undular tidal bore showed that the potential energy of the free-surface undulations represented up to 30% of the potential energy of the tidal bore. The presence of the channel constriction had a major impact on the free-surface properties. In the channel throat, the wave motion was three-dimensional, pseudo-chaotic and energetic and the undular bore lost nearly one third of its potential energy per surface area as it propagated through the channel constriction. The velocity data sets suggested the upstream advection of energetic turbulent events and vorticity behind the bore front. It is proposed that these energetic turbulent events were some macro-turbulence generated by secondary currents. With the channel constriction, some intense large-scale turbulence was further produced by the constriction. The proposed mechanism was consistent with some field observations in the Daly River tidal bore in 2003. Overall the presence of a channel constriction (e.g. bridge piers) does impact onto the bore propagation. It is associated with some energy loss and the development of large-scale coherent structures, and these processes might induce some river bed scour on the vicinity of the bridge piers. The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}.',
            rek_display_type_xsdmf_id: 3673,
            rek_display_type: 181,
            rek_status_xsdmf_id: 3680,
            rek_status: 2,
            rek_date_xsdmf_id: 6510,
            rek_date: '2009-01-01T00:00:00Z',
            rek_object_type_xsdmf_id: 3674,
            rek_object_type: 3,
            rek_depositor_xsdmf_id: 7578,
            rek_depositor: 737,
            rek_created_date_xsdmf_id: 3677,
            rek_created_date: '2009-10-20T07:52:41Z',
            rek_updated_date_xsdmf_id: 3678,
            rek_updated_date: '2018-07-03T05:27:09Z',
            rek_file_downloads: 1579,
            rek_citation: '',
            rek_genre_xsdmf_id: 7204,
            rek_genre: 'Department Technical Report',
            rek_genre_type_xsdmf_id: null,
            rek_genre_type: null,
            rek_formatted_title_xsdmf_id: null,
            rek_formatted_title: null,
            rek_formatted_abstract_xsdmf_id: null,
            rek_formatted_abstract: null,
            rek_depositor_affiliation_xsdmf_id: 11881,
            rek_depositor_affiliation: 891,
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
                    rek_author_id: 28884294,
                    rek_author_pid: 'UQ:185044',
                    rek_author_xsdmf_id: 6468,
                    rek_author: 'Chanson, Hubert',
                    rek_author_order: 1,
                },
            ],
            fez_record_search_key_author_affiliation_country: [],
            fez_record_search_key_author_affiliation_full_address: [],
            fez_record_search_key_author_affiliation_id: [],
            fez_record_search_key_author_affiliation_name: [],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: 28256092,
                    rek_author_id_pid: 'UQ:185044',
                    rek_author_id_xsdmf_id: 6463,
                    rek_author_id: 193,
                    rek_author_id_order: 1,
                    rek_author_id_lookup: 'Chanson, Hubert',
                },
            ],
            fez_record_search_key_contributor: [],
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_corresponding_country: [],
            fez_record_search_key_corresponding_email: [],
            fez_record_search_key_corresponding_name: [],
            fez_record_search_key_corresponding_organisation: [],
            fez_record_search_key_datastream_policy: null,
            fez_record_search_key_end_page: {
                rek_end_page_id: 5501977,
                rek_end_page_pid: 'UQ:185044',
                rek_end_page_xsdmf_id: 10776,
                rek_end_page: '104',
            },
            fez_record_search_key_file_attachment_access_condition: [],
            fez_record_search_key_file_attachment_embargo_date: [],
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name_id: 3880147,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_1.mov',
                    rek_file_attachment_name_order: 1,
                },
                {
                    rek_file_attachment_name_id: 3880148,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_2.mov',
                    rek_file_attachment_name_order: 2,
                },
                {
                    rek_file_attachment_name_id: 3880149,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_3.mov',
                    rek_file_attachment_name_order: 3,
                },
                {
                    rek_file_attachment_name_id: 3880150,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_4.mov',
                    rek_file_attachment_name_order: 4,
                },
                {
                    rek_file_attachment_name_id: 3880151,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'CH7409_movie_5.mov',
                    rek_file_attachment_name_order: 5,
                },
                {
                    rek_file_attachment_name_id: 3880152,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'ch7409_report.pdf',
                    rek_file_attachment_name_order: 6,
                },
                {
                    rek_file_attachment_name_id: 3880153,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_1.xml',
                    rek_file_attachment_name_order: 7,
                },
                {
                    rek_file_attachment_name_id: 3880154,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_2.xml',
                    rek_file_attachment_name_order: 8,
                },
                {
                    rek_file_attachment_name_id: 3880155,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_3.xml',
                    rek_file_attachment_name_order: 9,
                },
                {
                    rek_file_attachment_name_id: 3880156,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_4.xml',
                    rek_file_attachment_name_order: 10,
                },
                {
                    rek_file_attachment_name_id: 3880157,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_CH7409_movie_5.xml',
                    rek_file_attachment_name_order: 11,
                },
                {
                    rek_file_attachment_name_id: 3880158,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'presmd_ch7409_report.xml',
                    rek_file_attachment_name_order: 12,
                },
                {
                    rek_file_attachment_name_id: 3880159,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_1.flv',
                    rek_file_attachment_name_order: 13,
                },
                {
                    rek_file_attachment_name_id: 3880160,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_2.flv',
                    rek_file_attachment_name_order: 14,
                },
                {
                    rek_file_attachment_name_id: 3880161,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_3.flv',
                    rek_file_attachment_name_order: 15,
                },
                {
                    rek_file_attachment_name_id: 3880162,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_4.flv',
                    rek_file_attachment_name_order: 16,
                },
                {
                    rek_file_attachment_name_id: 3880163,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'stream_CH7409_movie_5.flv',
                    rek_file_attachment_name_order: 17,
                },
                {
                    rek_file_attachment_name_id: 3880164,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_1.jpg',
                    rek_file_attachment_name_order: 18,
                },
                {
                    rek_file_attachment_name_id: 3880165,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_2.jpg',
                    rek_file_attachment_name_order: 19,
                },
                {
                    rek_file_attachment_name_id: 3880166,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_3.jpg',
                    rek_file_attachment_name_order: 20,
                },
                {
                    rek_file_attachment_name_id: 3880167,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_4.jpg',
                    rek_file_attachment_name_order: 21,
                },
                {
                    rek_file_attachment_name_id: 3880168,
                    rek_file_attachment_name_pid: 'UQ:185044',
                    rek_file_attachment_name_xsdmf_id: 6562,
                    rek_file_attachment_name: 'thumbnail_CH7409_movie_5.jpg',
                    rek_file_attachment_name_order: 22,
                },
            ],
            fez_record_search_key_grant_acronym: [],
            fez_record_search_key_grant_agency: [],
            fez_record_search_key_grant_agency_id: [],
            fez_record_search_key_grant_text: [],
            fez_record_search_key_herdc_code: null,
            fez_record_search_key_herdc_status: null,
            fez_record_search_key_institutional_status: null,
            fez_record_search_key_isderivationof: [],
            fez_record_search_key_isi_loc: null,
            fez_record_search_key_ismemberof: [
                {
                    rek_ismemberof_id: 11517593,
                    rek_ismemberof_pid: 'UQ:185044',
                    rek_ismemberof_xsdmf_id: 149,
                    rek_ismemberof: 'UQ:195545',
                    rek_ismemberof_order: 1,
                    rek_ismemberof_lookup: 'School of Civil Engineering Publications',
                },
            ],
            fez_record_search_key_keywords: [
                {
                    rek_keywords_id: 29165376,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Tidal bores',
                    rek_keywords_order: 1,
                },
                {
                    rek_keywords_id: 29165377,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Turbulence',
                    rek_keywords_order: 2,
                },
                {
                    rek_keywords_id: 29165378,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Positive surges',
                    rek_keywords_order: 3,
                },
                {
                    rek_keywords_id: 29165379,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bridge piers',
                    rek_keywords_order: 4,
                },
                {
                    rek_keywords_id: 29165380,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Physical modelling',
                    rek_keywords_order: 5,
                },
                {
                    rek_keywords_id: 29165381,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Energy Dissipation',
                    rek_keywords_order: 6,
                },
                {
                    rek_keywords_id: 29165382,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Wave transformation',
                    rek_keywords_order: 7,
                },
                {
                    rek_keywords_id: 29165383,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bore front',
                    rek_keywords_order: 8,
                },
                {
                    rek_keywords_id: 29165384,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Turbulent mixing',
                    rek_keywords_order: 9,
                },
                {
                    rek_keywords_id: 29165385,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Secondary currents',
                    rek_keywords_order: 10,
                },
                {
                    rek_keywords_id: 29165386,
                    rek_keywords_pid: 'UQ:185044',
                    rek_keywords_xsdmf_id: 7952,
                    rek_keywords: 'Bridge structures',
                    rek_keywords_order: 11,
                },
            ],
            fez_record_search_key_language: [
                {
                    rek_language_id: 5225705,
                    rek_language_pid: 'UQ:185044',
                    rek_language_xsdmf_id: 10772,
                    rek_language: 'eng',
                    rek_language_order: 1,
                },
            ],
            fez_record_search_key_link: [],
            fez_record_search_key_link_description: [],
            fez_record_search_key_notes: {
                rek_notes_id: 1110911,
                rek_notes_pid: 'UQ:185044',
                rek_notes_xsdmf_id: 12446,
                rek_notes:
                    'The full bibliographic details are: CHANSON, H. (2009). "An Experimental Study of Tidal Bore Propagation: the Impact of Bridge Piers and Channel Constriction." Hydraulic Model Report No. CH74/08, School of Civil Engineering, The University of Queensland, Brisbane, Australia, 110 pages & 5 movie files (ISBN 9781864999600). The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}. All the movies are Copyrights Hubert CHANSON 2009.',
            },
            fez_record_search_key_oa_status: {
                rek_oa_status_id: 319686,
                rek_oa_status_pid: 'UQ:185044',
                rek_oa_status_xsdmf_id: 16978,
                rek_oa_status: 453693,
                rek_oa_status_lookup: 'Other',
            },
            fez_record_search_key_org_name: {
                rek_org_name_id: 349788,
                rek_org_name_pid: 'UQ:185044',
                rek_org_name_xsdmf_id: 6512,
                rek_org_name: 'The University of Queensland',
            },
            fez_record_search_key_org_unit_name: {
                rek_org_unit_name_id: 339387,
                rek_org_unit_name_pid: 'UQ:185044',
                rek_org_unit_name_xsdmf_id: 6505,
                rek_org_unit_name: 'Civil Engneering',
            },
            fez_record_search_key_publisher: {
                rek_publisher_id: 4431611,
                rek_publisher_pid: 'UQ:185044',
                rek_publisher_xsdmf_id: 6508,
                rek_publisher: 'School of Civil Engineering, The University of Queensland',
            },
            fez_record_search_key_refereed: null,
            fez_record_search_key_refereed_source: {
                rek_refereed_source_id: 1182183,
                rek_refereed_source_pid: 'UQ:185044',
                rek_refereed_source_xsdmf_id: 16623,
                rek_refereed_source: '453638',
                rek_refereed_source_lookup: 'Not yet assessed',
            },
            fez_record_search_key_report_number: {
                rek_report_number_id: 16061,
                rek_report_number_pid: 'UQ:185044',
                rek_report_number_xsdmf_id: 6502,
                rek_report_number: 'CH74/09',
            },
            fez_record_search_key_scopus_id: null,
            fez_record_search_key_series: {
                rek_series_id: 193574,
                rek_series_pid: 'UQ:185044',
                rek_series_xsdmf_id: 6503,
                rek_series: 'Hydraulic Model Report CH',
            },
            fez_record_search_key_start_page: {
                rek_start_page_id: 5572241,
                rek_start_page_pid: 'UQ:185044',
                rek_start_page_xsdmf_id: 10775,
                rek_start_page: '1',
            },
            fez_record_search_key_subject: [
                {
                    rek_subject_id: 9094390,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452292,
                    rek_subject_order: 1,
                    rek_subject_lookup: '09 Engineering',
                },
                {
                    rek_subject_id: 9094391,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452329,
                    rek_subject_order: 2,
                    rek_subject_lookup: '0905 Civil Engineering',
                },
                {
                    rek_subject_id: 9094392,
                    rek_subject_pid: 'UQ:185044',
                    rek_subject_xsdmf_id: 6480,
                    rek_subject: 452338,
                    rek_subject_order: 3,
                    rek_subject_lookup: '090509 Water Resources Engineering',
                },
            ],
            fez_record_search_key_total_pages: {
                rek_total_pages_id: 5481094,
                rek_total_pages_pid: 'UQ:185044',
                rek_total_pages_xsdmf_id: 10777,
                rek_total_pages: '110',
            },
            fez_record_search_key_translated_title: null,
            fez_record_search_key_wok_doc_types: [],
            fez_record_search_key_issn: [],
            fez_record_search_key_doi: null,
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_1.mov',
                    dsi_embargo_date: '01-01-2001',
                    dsi_open_access: 1,
                    dsi_label: 'Movie 1',
                    dsi_mimetype: null,
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_2.mov',
                    dsi_embargo_date: '',
                    dsi_open_access: 1,
                    dsi_label: 'Movie 2',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2750166,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_3.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 3',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_4.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 4',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4500146,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'CH7409_movie_5.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Movie 5',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1175050,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'ch7409_report.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: 'Technical report PDF file',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6998485,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'Chanson_movie_1.mov',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Movie 1',
                    dsi_mimetype: 'video/quicktime',
                    dsi_copyright: null,
                    dsi_state: 'D',
                    dsi_size: 3000090,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_1.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_1.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_2.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_2.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_3.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_3.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_4.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_4.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_CH7409_movie_5.mov.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - CH7409_movie_5.mov',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3093,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'FezACML_UQ_185044.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for PID - UQ:185044',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3705,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_1.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_2.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_3.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_4.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_CH7409_movie_5.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1206,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_ch7409_report.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 277266,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'presmd_Chanson_movie_1.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 530,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_1.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 340806,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_2.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 357167,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_3.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 371437,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_4.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 551102,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'stream_CH7409_movie_5.flv',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'video/x-flv',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 286470,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_1.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 5252,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_2.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6732,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_3.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 5487,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_4.jpg',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 9800,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'thumbnail_CH7409_movie_5.jpg',
                    dsi_embargo_date: '2050-01-01T00:00:00.000Z',
                    dsi_open_access: 1,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 7236,
                },
            ],
            fez_matched_journals: [],
            fez_record_search_key_has_datasets: [],
            fez_record_search_key_has_related_datasets: [],
            fez_record_search_key_has_derivations: [],
            rek_status_lookup: 'Published',
            rek_object_type_lookup: 'Record',
            rek_wok_doc_type_lookup: null,
            rek_display_type_lookup: 'Department Technical Report',
            rek_scopus_doc_type_lookup: null,
            rek_pubmed_doc_type_lookup: null,
        };
        const wrapper = setup({ publication: pub });
        expect(JSON.stringify(wrapper.instance().getFileData(pub))).toMatchSnapshot();
    });

    it('Should render the correct icon for a valid transcoded file', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'testing image description',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 97786,
                    },
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'preview_image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'preview_image.jpg',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 65857,
                    },
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'thumbnail_image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'thumbnail_image.jpg',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3952,
                    },
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'web_image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'web_image.jpg',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 97345,
                    },
                ],
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render the correct icon for an invalid transcoded file', () => {
        const data = {
            publication: {
                ...journalArticle,
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:792099',
                        dsi_dsid: 'image.jpg',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: 'testing image description',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 97786,
                    },
                ],
            },
        };
        const wrapper = setup(data);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render audio files with _xt in their filename', () => {
        /* eslint-disable max-len */
        // prettier-ignore
        const publication = {
            ...journalArticle,
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'audio.wav',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'testing image description',
                    dsi_mimetype: 'audio/wav',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97786,
                },
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: 'audiotest_xt.mp3',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'testing image description',
                    dsi_mimetype: 'audio/wav',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97786,
                },
            ],
        };
        /* eslint-enable max-len */

        const wrapper = setup({ publication: publication, isAdmin: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
