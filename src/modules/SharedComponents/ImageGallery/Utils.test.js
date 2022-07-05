import { getThumbnail, getUrl, sortThumbnailsBySecurityStatus, filterMissingThumbnails } from './Utils';
import { collectionSearchResultsImages } from 'mock/data';

describe('ImageGallery Utils', () => {
    let publication;
    beforeEach(() => {
        publication = collectionSearchResultsImages.data[0];
    });
    describe('getThumbnail', () => {
        it('should return file data object for a publication', () => {
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false });
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
                    securityStatus: false,
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
        it('should set securityStatus to false (locked) if permissions do not allow access', () => {
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false });
            expect(fd.securityStatus).toEqual(false);
        });
        it('should set securityStatus to true (unlocked) if permissions do not allow access but is Admin user', () => {
            const fd = getThumbnail(publication, { isAdmin: true, isAuthor: false });
            expect(fd.securityStatus).toEqual(true);
        });
        it('should set securityStatus to true (unlocked) if permissions do not allow access but is Admin read-only user', () => {
            // eslint-disable-next-line prettier/prettier
            const author = { pol_id: 1 };
            const fd = getThumbnail(publication, { isAdmin: false, isAuthor: false, author });
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
});
