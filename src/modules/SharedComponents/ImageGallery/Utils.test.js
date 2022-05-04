import { getThumbnail, getUrl } from './Utils';
import { collectionSearchResultsImages } from 'mock/data';

describe('ImageGallery Utils', () => {
    let publication;
    beforeEach(() => {
        publication = collectionSearchResultsImages.data[0];
    });
    describe('getThumbnail', () => {
        it('should return file data object for a publication', () => {
            const fd = getThumbnail(publication, false, false);
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
            const fd = getThumbnail(publication, false, false);
            expect(fd.isWhiteListed).toEqual(false);
        });
        it('should whitelist record if display type matches but subtype does not match whitelist for Admin user', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            const fd = getThumbnail(publication, false, false);
            expect(fd.isWhiteListed).toEqual(false);
        });
        it('should whitelist record if display type and subtype match whitelist', () => {
            // eslint-disable-next-line prettier/prettier
            publication.rek_display_type_lookup = 'Design';
            publication.rek_subtype = 'Non-NTRO';
            const fd = getThumbnail(publication, true, false);
            expect(fd.isWhiteListed).toEqual(true);
        });
        it('should set securityStatus to false (locked) if permissions do not allow access', () => {
            const fd = getThumbnail(publication, false, false);
            expect(fd.securityStatus).toEqual(false);
        });
        it('should set securityStatus to true (unlocked) if permissions do not allow access but is Admin user', () => {
            const fd = getThumbnail(publication, true, false);
            expect(fd.securityStatus).toEqual(true);
        });
    });
    describe('getUrl', () => {
        it('should return a properly formatted URL string', () => {
            const fd = getThumbnail(publication, false, false);
            expect(getUrl(publication.rek_pid, fd.fileName, 'test')).toEqual(
                'https://espace.library.uq.edu.au/view/UQ:288612/Slide_009.tif?dsi_version=db98827b0a5c6ce3e80296096863c88c',
            );
        });
    });
});
