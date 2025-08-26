import React from 'react';
import { journalArticle } from 'mock/data/testing/records';
import { default as fileDataRecord } from 'mock/data/testing/fileData';
import Files, { formatBytes, getFileOpenAccessStatus, untranscodedItem } from './Files';
import * as mock from 'mock/data';
import {
    AV_CHECK_STATE_CLEAN,
    AV_CHECK_STATE_INFECTED,
    AV_CHECK_STATE_UNSCANNABLE,
    CURRENT_LICENCES,
    SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
    SENSITIVE_HANDLING_NOTE_TYPE,
} from 'config/general';
import { getTestId as getAvStateIconTestId } from 'modules/SharedComponents/Toolbox/FileAvStateIcon/FileAvStateIcon';
import { getTestId as getThumbTestId } from './partials/Thumbnail';
import { sanitiseId } from 'helpers/general';
import { getAvState } from 'helpers/datastreams';
import { createFezDatastreamInfoArray, withDatastreams, rtlRender, WithRouter, fireEvent, act } from 'test-utils';

jest.mock('./MediaPreview');

function setup(testProps) {
    const props = {
        theme: {},
        isAdmin: testProps.isAdmin || true,
        publication: testProps.publication || journalArticle,
        classes: { header: 'header' },
        authorDetails: testProps.authorDetails || mock.accounts.uqresearcher,
        author: testProps.author || mock.currentAuthor.uqresearcher.data,
        ...testProps,
    };
    return rtlRender(
        <WithRouter>
            <Files {...props} />
        </WithRouter>,
    );
}

describe('Files Component ', () => {
    const MockDate = require('mockdate');
    const MediaPreviewMock = require('./MediaPreview');
    let filenameUrl;
    let mediaUrlState;
    let previewMediaUrlState;
    let mimeTypeState;
    let videoErrorMsgState;
    let videoErrorCodeState;
    let videoLoadingState;
    let imageErrorState;
    let mockOnVideoLoad;
    let mockOnVideoFailed;
    let mockOnImageFailed;
    let mockOnClose;
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        MediaPreviewMock.MediaPreview.mockImplementation(
            ({
                fileName,
                mediaUrl,
                previewMediaUrl,
                mimeType,
                videoErrorMsg,
                videoErrorCode,
                videoLoading,
                imageError,
                onVideoLoad,
                onVideoFailed,
                onImageFailed,
                onClose,
            }) => {
                mockOnVideoLoad = onVideoLoad;
                mockOnVideoFailed = onVideoFailed;
                mockOnImageFailed = onImageFailed;
                mockOnClose = onClose;
                filenameUrl = fileName;
                videoLoadingState = videoLoading;
                mediaUrlState = mediaUrl;
                previewMediaUrlState = previewMediaUrl;
                mimeTypeState = mimeType;
                videoLoadingState = videoLoading;
                imageErrorState = imageError;
                videoErrorCodeState = videoErrorCode;
                videoErrorMsgState = videoErrorMsg;

                return <div>Mock Media Preview</div>;
            },
        );
    });

    afterEach(() => {
        MockDate.reset();
        // eslint-disable-next-line max-len
        mockOnVideoLoad =
            mockOnVideoFailed =
            mockOnClose =
            mockOnImageFailed =
            mockOnImageFailed =
            filenameUrl =
            videoLoadingState =
            mediaUrlState =
            previewMediaUrlState =
            mimeTypeState =
            videoLoadingState =
            imageErrorState =
            videoErrorCodeState =
            videoErrorMsgState =
                undefined;
    });

    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should not render advisory statement', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: null,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render advisory statement', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render advisory statement', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'hello' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render sensitive handling note - scenario 1', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_TYPE.find(item => item.value !== 'Other')
                        .value,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: 'test',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render sensitive handling note - scenario 2', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: null,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render sensitive handling note', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_TYPE.find(item => item.value !== 'Other')
                        .value,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render sensitive handling note - other', () => {
        const { container } = setup({
            publication: {
                ...journalArticle,
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: 'test',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render an image as the original filename with no thumb or preview', () => {
        const { container } = setup({
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
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: 'test',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should not render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_datastream_info;
        const { container } = setup({ publication: publication });
        expect(container).toMatchSnapshot();
    });

    it('should have helper to render bytes correctly', () => {
        expect(formatBytes(0)).toEqual('0 Bytes');
        expect(formatBytes(1024)).toEqual('1 KB');
        expect(formatBytes(1048576)).toEqual('1 MB');
    });

    it('should render icon for mimeType', () => {
        const { container } = setup({
            publication: {
                rek_pid: 'UQ:1',
                // note: this might not represent real data, as attachments with same (extensionless) filenames are not
                // allowed
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'random.txt',
                        dsi_order: null,
                        dsi_mimetype: 'blablabla',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'test.jpg',
                        dsi_order: null,
                        dsi_mimetype: 'image/jpg',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'test.mov',
                        dsi_order: 1,
                        dsi_mimetype: 'video/quicktime',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'apple.mxf',
                        dsi_order: 1,
                        dsi_mimetype: 'application/mxf',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'test.mp3',
                        dsi_order: 2,
                        dsi_mimetype: 'audio/mp3',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'test.pdf',
                        dsi_order: 7,
                        dsi_mimetype: 'app/pdf',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'test.tiff',
                        dsi_order: 5,
                        dsi_mimetype: 'image/jpg',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'thumbnail_test.jpg',
                        dsi_order: 6,
                        dsi_mimetype: 'image/jpg',
                    },
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'preview_test.jpg',
                        dsi_order: 7,
                        dsi_mimetype: 'image/jpg',
                    },
                ],
                fez_record_search_key_file_attachment_name: [
                    {
                        rek_file_attachment_name: 'test.txt',
                        rek_file_attachment_name_order: 1,
                    },
                    {
                        rek_file_attachment_name: 'test.jpg',
                        rek_file_attachment_name_order: 2,
                    },
                    {
                        rek_file_attachment_name: 'test.mov',
                        rek_file_attachment_name_order: 3,
                    },
                    {
                        rek_file_attachment_name: 'test.mp3',
                        rek_file_attachment_name_order: 4,
                    },
                    {
                        rek_file_attachment_name: 'test.pdf',
                        rek_file_attachment_name_order: 5,
                    },
                    {
                        rek_file_attachment_name: 'test.tiff',
                        rek_file_attachment_name_order: 6,
                    },
                    {
                        rek_file_attachment_name: 'thumbnail_test.jpg',
                        rek_file_attachment_name_order: 7,
                    },
                    {
                        rek_file_attachment_name: 'preview_test.jpg',
                        rek_file_attachment_name_order: 8,
                    },
                    {
                        rek_file_attachment_name: 'test.mxf',
                        rek_file_attachment_name_order: 9,
                    },
                ],
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should set state on showPreview', () => {
        const pid = 'UQ:1';
        const filename = 'filename.jpg';
        const previewFilename = 'preview_filename_t.jpg';
        const mimeType = 'image/jpeg';
        const { getByText } = setup({
            publication: {
                rek_pid: pid,
                fez_datastream_info: [
                    {
                        dsi_pid: pid,
                        dsi_dsid: filename,
                        dsi_mimetype: mimeType,
                        dsi_order: 2,
                        dsi_security_inherited: 0,
                        dsi_security_policy: 5,
                    },
                    {
                        dsi_pid: pid,
                        dsi_dsid: previewFilename,
                        dsi_mimetype: mimeType,
                        dsi_order: 1,
                        dsi_security_inherited: 0,
                        dsi_security_policy: 1,
                    },
                ],
            },
        });

        fireEvent.click(getByText('filename.jpg'));

        expect(filenameUrl).toContain(`view/${pid}/${filename}`);
        expect(previewMediaUrlState).toContain(`view/${pid}/${previewFilename}`);
        expect(mediaUrlState).toContain(`view/${pid}/${filename}`);
        expect(mimeTypeState).toEqual(mimeType);
    });

    it('should set video loading state correctly', () => {
        const { getByText } = setup({
            publication: {
                rek_pid: 'UQ:1',
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'filename.mp4',
                        dsi_mimetype: 'video/mp4',
                        dsi_security_inherited: 0,
                        dsi_security_policy: 5,
                    },
                ],
            },
        });

        expect(videoLoadingState).toBeUndefined();
        const filenameLink = getByText('filename.mp4');

        fireEvent.click(filenameLink);
        expect(videoLoadingState).toBeTruthy();
        act(() => {
            mockOnVideoLoad();
        });
        expect(videoLoadingState).toBeFalsy();
    });

    it('should set video load error flags', () => {
        const { getByText } = setup({
            publication: {
                rek_pid: 'UQ:1',
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'filename.mp4',
                        dsi_mimetype: 'video/mp4',
                        dsi_security_inherited: 0,
                        dsi_security_policy: 5,
                    },
                ],
            },
        });
        expect(videoLoadingState).toBeUndefined();
        const filenameLink = getByText('filename.mp4');

        fireEvent.click(filenameLink);
        expect(videoLoadingState).toBeTruthy();
        const code = 1234;
        const message = 'video failed';
        act(() => {
            mockOnVideoFailed({ target: { error: { code, message } } });
        });
        expect(videoErrorCodeState).toEqual(code);
        expect(videoErrorMsgState).toEqual(message);
    });

    it('should set image error flag', () => {
        const { getByText } = setup({
            publication: {
                rek_pid: 'UQ:1',
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'filename.jpg',
                        dsi_mimetype: 'image/jpg',
                        dsi_security_inherited: 0,
                        dsi_security_policy: 5,
                    },
                ],
            },
        });
        expect(imageErrorState).toBeUndefined();
        fireEvent.click(getByText('filename.jpg'));
        act(() => {
            mockOnImageFailed();
        });
        expect(imageErrorState).toBeTruthy();
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 4,
                },
            ],
        };
        const props = { isAdmin: false };
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0], props),
        ).toEqual({
            embargoDate: '1st December 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
            allowDownload: false,
        });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1], props),
        ).toEqual({
            embargoDate: '1st November 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
            allowDownload: false,
        });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2], props),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695, allowDownload: true });
        expect(
            getFileOpenAccessStatus(
                {
                    ...publicationEmbargoOAFile,
                    fez_record_search_key_license: { rek_license: CURRENT_LICENCES[0].value },
                },
                publicationEmbargoOAFile.fez_datastream_info[2],
                props,
            ),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695, allowDownload: false });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3], props),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695, allowDownload: false });
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 5,
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
                    dsi_security_policy: 4,
                },
            ],
        };

        const props = { isAdmin: true, isAuthor: true };

        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0], props),
        ).toEqual({
            embargoDate: '1st December 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
            allowDownload: false,
        });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1], props),
        ).toEqual({
            embargoDate: '1st November 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
            securityStatus: true,
            allowDownload: false,
        });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2], props),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695, allowDownload: true });
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3], props),
        ).toEqual({ embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695, allowDownload: false });
    });

    it('should hide preview on close', () => {
        const { getByText, queryByText } = setup({
            publication: {
                rek_pid: 'UQ:1',
                fez_datastream_info: [
                    {
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'filename.jpg',
                        dsi_mimetype: 'image/jpg',
                        dsi_security_inherited: 0,
                        dsi_security_policy: 5,
                    },
                ],
            },
        });
        fireEvent.click(getByText('filename.jpg'));

        expect(getByText('Mock Media Preview')).toBeInTheDocument();
        act(() => {
            mockOnClose();
        });
        expect(queryByText('Mock Media Preview')).not.toBeInTheDocument();
    });

    it('should have a helper to return the file name with an _xt suffix', () => {
        const fileName = 'test_xt.jpg';
        expect(untranscodedItem(fileName)).toEqual('test');
    });

    it('should append dis_version to the media url based on checksum', () => {
        const { getByText } = setup({
            publication: {
                rek_pid: 'UQ:1',
                fez_datastream_info: [
                    {
                        dsi_id: 1,
                        dsi_pid: 'UQ:1',
                        dsi_dsid: 'image.tiff',
                        dsi_checksum: '111', // checksums.media
                        dsi_label: 'testing image description',
                        dsi_mimetype: 'image/jpeg',
                        dsi_state: 'A',
                        dsi_size: 97786,
                        dsi_security_policy: 5,
                    },
                ],
            },
        });

        expect(mediaUrlState).toBeUndefined();
        fireEvent.click(getByText('image.tiff'));
        expect(mediaUrlState).toContain('image.tiff?dsi_version=e724876eb32bf2c2d42ffa8957d8c8f1');
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
                    dsi_security_policy: 5,
                },

                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA_1.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                    dsi_security_policy: 4,
                },
            ],
        };
        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0], {}),
        ).toEqual({ embargoDate: null, isOpenAccess: false, openAccessStatusId: null, allowDownload: true });

        expect(
            getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1], {}),
        ).toEqual({ embargoDate: null, isOpenAccess: false, openAccessStatusId: null, allowDownload: false });
    });

    it('should not show embargoed files to non-admins', () => {
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

        const { queryByText } = setup({ publication, isAdmin: false });
        expect(queryByText('image.jpg')).toBeNull();
    });

    it('should show embargoed files to admins', () => {
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

        const { queryByText } = setup({ publication, isAdmin: true });
        expect(queryByText('image.jpg')).toBeInTheDocument();
    });

    it('should render component', () => {
        const { container } = setup({ publication: fileDataRecord });
        expect(container).toMatchSnapshot();
    });

    it('should render component for public users', () => {
        const { container } = setup({ publication: fileDataRecord, isAdmin: false, author: null });
        expect(container).toMatchSnapshot();
    });

    it('should render files based on security policy correctly', () => {
        const publication = {
            ...fileDataRecord,
            fez_record_search_key_license: { rek_license: CURRENT_LICENCES[0].value },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'test_compressed.pdf',
                    dsi_open_access: 1,
                    dsi_mimetype: 'application/pdf',
                    dsi_state: 'A',
                    dsi_order: null,
                    dsi_size: 587005,
                    dsi_security_inherited: 0,
                    dsi_security_policy: 5,
                },
                {
                    dsi_pid: 'UQ:185044',
                    dsi_dsid: 'test_compressed_t.jpg',
                    dsi_open_access: 1,
                    dsi_mimetype: 'image/jpeg',
                    dsi_state: 'A',
                    dsi_order: 0,
                    dsi_size: 587005,
                    dsi_security_inherited: 1,
                    dsi_security_policy: 1,
                    dsi_av_check_state: AV_CHECK_STATE_INFECTED,
                    dsi_av_check_date: '2000-01-01 00:00:00',
                },
            ],
        };
        const { container } = setup({ publication: publication });
        expect(container).toMatchSnapshot();
    });

    it('should show files for admin users', () => {
        const { container } = setup({
            publication: { ...fileDataRecord, fez_datastream_info: [] },
            isAdmin: false,
            author: mock.currentAuthor.uqstaff.data,
        });
        expect(container).toMatchSnapshot();
    });

    it('Should render the correct icon for a valid transcoded file', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
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
        const { container } = setup(data);
        expect(container).toMatchSnapshot();
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

        const { container } = setup({ publication: publication, isAdmin: true });
        expect(container).toMatchSnapshot();
    });

    it('should show a blacklisted collection member when the user is an admin', () => {
        const { container } = setup({
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
                fez_record_search_key_sensitive_handling_note_id: {
                    rek_sensitive_handling_note_id: SENSITIVE_HANDLING_NOTE_OTHER_TYPE,
                },
                fez_record_search_key_sensitive_handling_note_other: {
                    rek_sensitive_handling_note_other: 'test',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    describe('AV Check', () => {
        const sources = [
            {
                dsi_dsid: 'cats.tiff',
            },
            {
                dsi_dsid: 'dogs.tiff',
                dsi_av_check_state: AV_CHECK_STATE_INFECTED,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'birds.tiff',
                dsi_av_check_state: AV_CHECK_STATE_CLEAN,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
            {
                dsi_dsid: 'fish.tiff',
                dsi_av_check_state: AV_CHECK_STATE_UNSCANNABLE,
                dsi_av_check_date: '2000-01-01 00:00:00',
            },
        ];

        it('should render the proper av status icon', () => {
            const anotherSources = [
                ...sources,
                {
                    dsi_dsid: 'interview.wav',
                    dsi_av_check_state: AV_CHECK_STATE_CLEAN,
                    dsi_av_check_date: '2000-01-01 00:00:00',
                },
                {
                    dsi_dsid: 'big-file.zip',
                    dsi_av_check_state: AV_CHECK_STATE_UNSCANNABLE,
                    dsi_av_check_date: '2000-01-01 00:00:00',
                },
            ];
            const fezDatastreamInfo = createFezDatastreamInfoArray(anotherSources, journalArticle.rek_pid);
            const { queryByTestId } = setup(
                { publication: { ...journalArticle, fez_datastream_info: fezDatastreamInfo } },
                { renderer: rtlRender },
            );

            expect(fezDatastreamInfo).toMatchSnapshot();
            withDatastreams(anotherSources, fezDatastreamInfo, (item, source, isDerivative) => {
                const idPrefix = sanitiseId(item.dsi_pid, item.dsi_dsid);
                const avStateIcon = queryByTestId(
                    getAvStateIconTestId(getAvState(source.dsi_av_check_state), idPrefix),
                );
                if (!isDerivative) {
                    expect(avStateIcon).toBeInTheDocument();
                    return;
                }
                expect(avStateIcon).not.toBeInTheDocument();
                expect(queryByTestId(getAvStateIconTestId(getAvState(), idPrefix))).not.toBeInTheDocument();
            });
        });

        it('should not render preview button for infected file', () => {
            const fezDatastreamInfo = createFezDatastreamInfoArray(sources, journalArticle.rek_pid);
            const { queryByTestId } = setup(
                {
                    publication: {
                        ...journalArticle,
                        fez_datastream_info: fezDatastreamInfo,
                        fez_record_search_key_oa_status: {
                            rek_oa_status: 453695,
                        },
                    },
                },
                { renderer: rtlRender },
            );

            expect(fezDatastreamInfo).toMatchSnapshot();
            withDatastreams(sources, fezDatastreamInfo, (item, source, isDerivative) => {
                const thumbnail = queryByTestId(getThumbTestId(item.dsi_dsid));
                if (!isDerivative) {
                    if (item.dsi_av_check_state === AV_CHECK_STATE_INFECTED) {
                        expect(thumbnail).not.toBeInTheDocument();
                        return;
                    }
                    expect(thumbnail).toBeInTheDocument();
                    return;
                }
                expect(thumbnail).not.toBeInTheDocument();
            });
        });
    });
});
