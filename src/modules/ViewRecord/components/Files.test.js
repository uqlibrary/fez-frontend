import { journalArticle } from 'mock/data/testing/records';
import { default as fileDataRecord } from 'mock/data/testing/fileData';
import Files from './Files';
import { FilesClass } from './Files';
import * as mock from 'mock/data';

function setup(testProps, args = { isShallow: true }) {
    const props = {
        theme: {},
        isAdmin: testProps.isAdmin || true,
        publication: testProps.publication || journalArticle,
        hideCulturalSensitivityStatement: false,
        setHideCulturalSensitivityStatement: jest.fn(),
        classes: { header: 'header' },
        authorDetails: testProps.authorDetails || mock.accounts.uqresearcher,
        author: testProps.author || mock.currentAuthor.uqresearcher,
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

        wrapper.instance().renderFileIcon('UQ:1', 'image/jpg', 'test.tiff', 'thumbnail_test.jpg', 'preview_test.jpg');
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

    it('should return checksums', () => {
        const wrapper = setup({});
        const dataStreams = [
            {
                dsi_dsid: 'image.tiff',
                dsi_checksum: '111',
            },
            {
                dsi_dsid: 'thumbnail_image_t.jpg',
                dsi_checksum: '222',
            },
            {
                dsi_dsid: 'preview_image_t.jpg',
                dsi_checksum: '333',
            },
        ];
        expect(
            wrapper
                .instance()
                .getChecksums(dataStreams[0], dataStreams[1].dsi_dsid, dataStreams[2].dsi_dsid, '', dataStreams),
        ).toEqual({
            media: dataStreams[0].dsi_checksum,
            thumbnail: dataStreams[1].dsi_checksum,
            preview: dataStreams[2].dsi_checksum,
            web: undefined,
        });
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
        const publication = {
            ...journalArticle,
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
                    dsi_security_policy: 1,
                },
                ...journalArticle.fez_datastream_info.slice(1),
            ],
        };

        const wrapper = setup({ publication, isAdmin: true });
        expect(toJson(wrapper)).toMatchSnapshot();
        const wrapper2 = setup({ publication, isAdmin: false });
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

    it('getFileData{} branch 1', () => {
        const wrapper = setup({ publication: fileDataRecord });
        expect(JSON.stringify(wrapper.instance().getFileData(fileDataRecord))).toMatchSnapshot();
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

    it('should render audio files with _xt in their filename for admins', () => {
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

        const wrapper = setup({ publication: publication, isAdmin: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show a blacklisted collection member when the user is an admin', () => {
        const wrapper = setup({
            account: mock.accounts.uqstaff,
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
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_pid: 'UQ:792099',
                        rek_ismemberof: 'UQ:413806',
                        rek_ismemberof_order: 1,
                    },
                ],
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'No statement' },
            },
            hideCulturalSensitivityStatement: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
