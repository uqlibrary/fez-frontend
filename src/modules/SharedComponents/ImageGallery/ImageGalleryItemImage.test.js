import React from 'react';
import { render, AllTheProviders, fireEvent } from 'test-utils';

import ImageGalleryItemImage from './ImageGalleryItemImage';
import { collectionSearchResultsImages } from 'mock/data';
import config from 'config/imageGalleryConfig';
import * as utils from './Utils';

const setup = (props = {}) => {
    const testProps = {
        item: { rek_pid: 0 },
        ...props,
    };
    return render(
        <AllTheProviders>
            <ImageGalleryItemImage {...testProps} />
        </AllTheProviders>,
    );
};

describe('Image Gallery Item Image', () => {
    beforeEach(() => {
        config.thumbnailImage.defaultImageName = 'image_unavailable.svg';
    });

    it('should make call when image is restricted', () => {
        const setRestricted = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        setup({ item, setRestricted });

        expect(setRestricted).toHaveBeenCalledWith(true);
    });

    it('should make call when image contains an advisory statement', () => {
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setAdvisory });

        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should make call when image is restricted and contains an advisory statement', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory });

        expect(setRestricted).toHaveBeenCalledWith(true);
        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should make "advisory" call when image has an advisory statement even when admin logged in', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory, security: { isAdmin: true } });

        expect(setRestricted).not.toHaveBeenCalled();
        expect(setAdvisory).toHaveBeenCalled();
    });

    it('should NOT make a "restricted" call when image is restricted and contains an advisory statement when author logged in', () => {
        const setRestricted = jest.fn();
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setRestricted, setAdvisory, security: { isAdmin: false, isAuthor: true } });

        expect(setRestricted).not.toHaveBeenCalled();
        expect(setAdvisory).toHaveBeenCalledWith(true);
    });

    it('should render a placeholder image when security access is denied', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[4] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[4].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });
    it('should render a gallery image when security access is denied but admin user', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[4], security: { isAdmin: true } });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[4].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).not.toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });

    it('should render a placeholder image when no thumb to show and make a call to the image unavailable function', () => {
        const setUnavailable = jest.fn();
        const testItem = collectionSearchResultsImages.data[0];
        testItem.fez_datastream_info = null;
        const { getByTestId } = setup({ item: testItem, setUnavailable });

        expect(
            getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`),
        ).toBeInTheDocument();
        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`)).toHaveAttribute(
            'src',
            config.thumbnailImage.defaultImageName,
        );
        expect(setUnavailable).toHaveBeenCalledWith(true);
    });
    it('should render a placeholder image when thumb image fails to load and make a call to the image unavailable function', () => {
        const setUnavailable = jest.fn();
        const testItem = collectionSearchResultsImages.data[2];
        const mockGetUrl = jest.spyOn(utils, 'getUrl').mockImplementationOnce(() => 'broken-image-url.jpg');
        const { getByTestId } = setup({ item: testItem, setUnavailable });

        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[2].rek_pid}`);

        expect(mockGetUrl).toHaveBeenCalled();
        expect(galleryElement).toBeInTheDocument();

        expect(galleryElement).toHaveAttribute('src', 'broken-image-url.jpg');

        // cause the image to fire the onError event (won't happen naturally)
        fireEvent.error(galleryElement);

        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(galleryElement).toHaveAttribute('src', config.thumbnailImage.defaultImageName);

        expect(setUnavailable).toHaveBeenCalledWith(true);
    });
    it('should render a gallery image', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[5] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[5].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).not.toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });

    it('should render the second choice thumbnail if first thumb is author restricted and user is anon', () => {
        const item = {
            ...collectionSearchResultsImages.data[5],
            fez_datastream_info: [
                {
                    dsi_id: 2713119,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Capture.jpg',
                    dsi_checksum: '7c70480bab92cf1a947e3e37051933d7',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 92135,
                    dsi_security_policy: 4,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464520,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_Capture.xml',
                    dsi_checksum: 'a903fff38f0de59d6e1f2bb9428e5762',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '/var/cache/tmp/presmd_Capture.xml',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6548,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2709059,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_RofHon2015.xml',
                    dsi_checksum: 'cbf08285a493e841b4d90331203ee8c4',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 144393,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2703834,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_Roll2015.xml',
                    dsi_checksum: 'e85b8fd55869017b2a3dd9880dad8100',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1248,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2718204,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_RollHon.xml',
                    dsi_checksum: 'b5c0541680fecf5ba10610c1dfabfedd',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1246,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464522,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'preview_Capture.jpg',
                    dsi_checksum: '6cd172a9d5fbde5fa5195b874ff8304e',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'preview_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 51898,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3726020,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Rohservice_20.pdf',
                    dsi_checksum: 'ecc1243ffa6538a552aef07c83393162',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 7325007,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 3710132,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Roh_18.pdf',
                    dsi_checksum: '4458e9ee7fee2722a27dba611ea305fc',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1318324,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 3464521,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Capture.jpg',
                    dsi_checksum: '68f32fa70051ebb3584d3226440fa31e',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'thumbnail_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4470,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3726021,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Rohservice_20_t.jpg',
                    dsi_checksum: '51079dee08d30815e6faf62362a8f95b',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4718,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3710133,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Roh_18_t.jpg',
                    dsi_checksum: 'c470cb09806212814d3493a856f8eac1',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4722,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464523,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'web_Capture.jpg',
                    dsi_checksum: '9868dd93349d859732e9120812332b8c',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'web_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 80503,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
            ],
        };
        const { getByTestId } = setup({ item });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[5].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement.getAttribute('src')).toContain('thumbnail_Rohservice_20_t.jpg');
    });
    it('should render the first choice thumbnail if first thumb is author restricted and user is admin', () => {
        const item = {
            ...collectionSearchResultsImages.data[5],
            fez_datastream_info: [
                {
                    dsi_id: 2713119,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Capture.jpg',
                    dsi_checksum: '7c70480bab92cf1a947e3e37051933d7',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 92135,
                    dsi_security_policy: 4,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464520,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_Capture.xml',
                    dsi_checksum: 'a903fff38f0de59d6e1f2bb9428e5762',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '/var/cache/tmp/presmd_Capture.xml',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 6548,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2709059,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_RofHon2015.xml',
                    dsi_checksum: 'cbf08285a493e841b4d90331203ee8c4',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 144393,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2703834,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_Roll2015.xml',
                    dsi_checksum: 'e85b8fd55869017b2a3dd9880dad8100',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1248,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2718204,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'presmd_RollHon.xml',
                    dsi_checksum: 'b5c0541680fecf5ba10610c1dfabfedd',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1246,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464522,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'preview_Capture.jpg',
                    dsi_checksum: '6cd172a9d5fbde5fa5195b874ff8304e',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'preview_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 51898,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3726020,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Rohservice_20.pdf',
                    dsi_checksum: 'ecc1243ffa6538a552aef07c83393162',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 7325007,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 3710132,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'Roh_18.pdf',
                    dsi_checksum: '4458e9ee7fee2722a27dba611ea305fc',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1318324,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 3464521,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Capture.jpg',
                    dsi_checksum: '68f32fa70051ebb3584d3226440fa31e',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'thumbnail_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4470,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3726021,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Rohservice_20_t.jpg',
                    dsi_checksum: '51079dee08d30815e6faf62362a8f95b',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4718,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3710133,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'thumbnail_Roh_18_t.jpg',
                    dsi_checksum: 'c470cb09806212814d3493a856f8eac1',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: null,
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 4722,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 3464523,
                    dsi_pid: 'UQ:371797',
                    dsi_dsid: 'web_Capture.jpg',
                    dsi_checksum: '9868dd93349d859732e9120812332b8c',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'web_Capture.jpg',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 80503,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
            ],
        };
        const { getByTestId } = setup({ item, security: { isAdmin: true, account: { id: 1 } } });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[5].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement.getAttribute('src')).toContain('thumbnail_Capture.jpg');
    });
});
