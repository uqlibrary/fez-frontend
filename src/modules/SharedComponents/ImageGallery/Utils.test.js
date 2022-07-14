import {
    getThumbnail,
    getUrl,
    sortThumbnailsBySecurityStatus,
    filterMissingThumbnails,
    isViewableByUser,
} from './Utils';
import { collectionSearchResultsImages } from 'mock/data';

describe('ImageGallery Utils', () => {
    let publication;
    beforeEach(() => {
        publication = {
            ...collectionSearchResultsImages.data[0],
            fez_datastream_info: [
                {
                    dsi_id: 2935640,
                    dsi_pid: 'UQ:288612',
                    dsi_dsid: 'Slide_009.tif',
                    dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                    dsi_embargo_date: null,
                    dsi_open_access: 1,
                    dsi_label: '',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 56525440,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 2935636,
                    dsi_pid: 'UQ:288612',
                    dsi_dsid: 'thumbnail_Slide_009.jpg',
                    dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3267,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
            ],
        };
    });
    describe('getThumbnail', () => {
        it('should return a file object for a publication with thumbnail filename', () => {
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false, author: {}, account: {} });
            expect(fd).toEqual(
                expect.objectContaining({
                    fileName: 'Slide_009.tif',
                    thumbnailFileName: 'thumbnail_Slide_009.jpg',
                    checksums: { thumbnail: '809a13bc51a534624c5b6d6594e06da0' },
                    openAccessStatus: {
                        isOpenAccess: true,
                        embargoDate: null,
                        openAccessStatusId: 453697,
                        allowDownload: true,
                    },
                    securityStatus: true,
                    isWhiteListed: true,
                }),
            );
        });
        it('should return an file object with security=false for a publication with admin security restriction when user is anonymous', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            const fd = getThumbnail(testPublication, { isAdmin: false, isAuthor: false });
            expect(fd).toEqual(
                expect.objectContaining({
                    checksums: {
                        thumbnail: '809a13bc51a534624c5b6d6594e06da0',
                    },
                    fileName: 'Slide_009.tif',
                    isWhiteListed: true,
                    openAccessStatus: {
                        allowDownload: true,
                        embargoDate: null,
                        isOpenAccess: true,
                        openAccessStatusId: 453697,
                    },
                    securityStatus: false,
                    thumbnailFileName: 'thumbnail_Slide_009.jpg',
                }),
            );
        });
        it('should return a full data object for a publication with admin security restriction when user is admin', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            const fd = getThumbnail(testPublication, { isAdmin: true, isAuthor: false });
            expect(fd).toEqual(
                expect.objectContaining({
                    fileName: 'Slide_009.tif',
                    thumbnailFileName: 'thumbnail_Slide_009.jpg',
                    checksums: { thumbnail: '809a13bc51a534624c5b6d6594e06da0' },
                    openAccessStatus: {
                        isOpenAccess: true,
                        embargoDate: null,
                        openAccessStatusId: 453697,
                        allowDownload: true,
                    },
                    securityStatus: true,
                    isWhiteListed: true,
                }),
            );
        });
        it('should return an empty data object for a publication with author security restriction when user is anonymous', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 4,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            const fd = getThumbnail(testPublication, { isAdmin: false, isAuthor: false });
            expect(fd).toEqual(expect.objectContaining({}));
        });
        it('should return an full data object for a publication with author security restriction when user is admin', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 4,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            const fd = getThumbnail(testPublication, { isAdmin: true, isAuthor: false, account: { id: 1 } });
            expect(fd).toEqual(
                expect.objectContaining({
                    fileName: 'Slide_009.tif',
                    thumbnailFileName: 'thumbnail_Slide_009.jpg',
                    checksums: { thumbnail: '809a13bc51a534624c5b6d6594e06da0' },
                    openAccessStatus: {
                        isOpenAccess: true,
                        embargoDate: null,
                        openAccessStatusId: 453697,
                        allowDownload: true,
                    },
                    securityStatus: true,
                    isWhiteListed: true,
                }),
            );
        });
        it('should return an full data object for a publication with author security restriction when user is author', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 4,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            const fd = getThumbnail(testPublication, {
                isAdmin: false,
                isAuthor: true,
                author: { pol_id: 1 },
                account: { id: 1 },
            });
            expect(fd).toEqual(
                expect.objectContaining({
                    fileName: 'Slide_009.tif',
                    thumbnailFileName: 'thumbnail_Slide_009.jpg',
                    checksums: { thumbnail: '809a13bc51a534624c5b6d6594e06da0' },
                    openAccessStatus: {
                        isOpenAccess: true,
                        embargoDate: null,
                        openAccessStatusId: 453697,
                        allowDownload: true,
                    },
                    securityStatus: true,
                    isWhiteListed: true,
                }),
            );
        });
        it('should blacklist record if display type matches but subtype does not match whitelist', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            publication.rek_subtype = 'SomethingElse';
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false });
            expect(fd.isWhiteListed).toEqual(false);
        });
        it('should whitelist record if display type matches but subtype does not match whitelist for Admin user', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            publication.rek_subtype = 'SomethingElse';
            const fd = getThumbnail(publication, { isAdmin: true, isAuthor: false });
            expect(fd.isWhiteListed).toEqual(false);
        });
        it('should whitelist record if display type is Design and subtype is Non-NTRO', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            publication.rek_subtype = 'Non-NTRO';
            const fd = getThumbnail(publication, { isAdmin: true, isAuthor: false });
            expect(fd.isWhiteListed).toEqual(true);
        });
        it('should whitelist record if display type is Design and subtype null', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            publication.rek_subtype = null;
            const fd = getThumbnail(publication, { isAdmin: true, isAuthor: false });
            expect(fd.isWhiteListed).toEqual(true);
        });

        it('should set securityStatus to true (unlocked) if permissions do not allow access but is Admin read-only user', () => {
            const testPublication = {
                ...publication,
                fez_datastream_info: [
                    {
                        dsi_id: 2935640,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'Slide_009.tif',
                        dsi_checksum: 'b5b1e637087dc46cfcca3c606453fce7',
                        dsi_embargo_date: null,
                        dsi_open_access: 1,
                        dsi_label: '',
                        dsi_mimetype: 'image/tiff',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 56525440,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 1,
                    },
                    {
                        dsi_id: 2935636,
                        dsi_pid: 'UQ:288612',
                        dsi_dsid: 'thumbnail_Slide_009.jpg',
                        dsi_checksum: '809a13bc51a534624c5b6d6594e06da0',
                        dsi_embargo_date: null,
                        dsi_open_access: null,
                        dsi_label: '',
                        dsi_mimetype: 'image/jpeg',
                        dsi_copyright: null,
                        dsi_state: 'A',
                        dsi_size: 3267,
                        dsi_security_policy: 1,
                        dsi_security_inherited: 0,
                    },
                ],
            };
            // eslint-disable-next-line prettier/prettier
            const author = { pol_id: 1 };
            const fd = getThumbnail(testPublication, { isAdmin: false, isAuthor: false, author });
            expect(fd.securityStatus).toEqual(true);
        });
    });
    describe('getUrl', () => {
        it('should return a properly formatted URL string', () => {
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false });
            expect(getUrl(publication.rek_pid, fd.fileName, 'test')).toContain(
                '/view/UQ:288612/Slide_009.tif?dsi_version=db98827b0a5c6ce3e80296096863c88c',
            );
        });
    });

    describe('sortThumbnailsBySecurityStatus', () => {
        it('should return an array sorted by publicly accessible records first', () => {
            const unsorted = [
                { id: 1, securityStatus: false },
                { id: 2, securityStatus: true },
                { id: 3, securityStatus: true },
                { id: 4, securityStatus: true },
                { id: 5, securityStatus: false },
                { id: 6, securityStatus: false },
            ];
            const sorted = [
                { id: 2, securityStatus: true },
                { id: 3, securityStatus: true },
                { id: 4, securityStatus: true },
                { id: 1, securityStatus: false },
                { id: 5, securityStatus: false },
                { id: 6, securityStatus: false },
            ];

            expect(sortThumbnailsBySecurityStatus(unsorted)).toEqual(sorted);
        });
    });
    describe('filterMissingThumbnails', () => {
        it('should filter out records without a thumbnail', () => {
            const unfiltered = [
                { id: 1, thumbnailFileName: null },
                { id: 2, thumbnailFileName: 'path' },
                { id: 3, thumbnailFileName: null },
                { id: 4, thumbnailFileName: 'path' },
            ];
            const filtered = [
                { id: 2, thumbnailFileName: 'path' },
                { id: 4, thumbnailFileName: 'path' },
            ];

            expect(filterMissingThumbnails(unfiltered)).toEqual(filtered);
        });
    });
    describe('isViewableByUser', () => {
        let dataStreams;
        let props;
        beforeEach(() => {
            dataStreams = publication.fez_datastream_info;
            props = { isAdmin: false, isAuthor: false };
        });

        it('should return true for a valid file type', () => {
            expect(isViewableByUser(publication, dataStreams, props)).toEqual(true);
        });
        it('should return false for an invalid file type', () => {
            const testPublication = {
                ...publication,
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 11913978,
                        rek_ismemberof_pid: 'UQ:288583',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:413806',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:413806',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'Sydney Olympics 2000',
                    },
                ],
            };
            expect(isViewableByUser(testPublication, dataStreams, props)).toEqual(false);
        });
        it('should return true for an invalid file type if admin', () => {
            const newProps = { ...props, isAdmin: true };
            const testPublication = {
                ...publication,
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 11913978,
                        rek_ismemberof_pid: 'UQ:288583',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:413806',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:413806',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'Sydney Olympics 2000',
                    },
                ],
            };
            expect(isViewableByUser(testPublication, dataStreams, newProps)).toEqual(true);
        });
        it('should return true for an invalid file type if author', () => {
            const newProps = { ...props, author: { pol_id: 1 } };
            const testPublication = {
                ...publication,
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 11913978,
                        rek_ismemberof_pid: 'UQ:288583',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:413806',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:413806',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'Sydney Olympics 2000',
                    },
                ],
            };
            expect(isViewableByUser(testPublication, dataStreams, newProps)).toEqual(true);
        });
    });
});
