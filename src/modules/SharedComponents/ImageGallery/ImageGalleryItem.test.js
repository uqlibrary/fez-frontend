import React from 'react';
import { render, WithRouter, fireEvent } from 'test-utils';

import ImageGalleryItem, { getAlertMessageText } from './ImageGalleryItem';
import { collectionSearchResultsImages } from 'mock/data';
import txt from 'locale/components';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const setup = (props = {}) => {
    const testProps = {
        item: { rek_pid: 0 },
        ...props,
    };
    return render(
        <WithRouter>
            <ImageGalleryItem {...testProps} />
        </WithRouter>,
    );
};

describe('Image Gallery Item', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render a full gallery item with lazy loading', () => {
        const { getByTestId, getByText } = setup({ item: collectionSearchResultsImages.data[1] });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByText(collectionSearchResultsImages.data[1].rek_title)).toBeInTheDocument();
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[1].rek_pid}`)).toHaveAttribute(
            'loading',
            'lazy',
        );
    });
    it('should render a full gallery item with eager loading', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[1], lazyLoading: false });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[1].rek_pid}`)).toHaveAttribute(
            'loading',
            'eager',
        );
    });

    it('should enable clickable gallery item if URL prop supplied', () => {
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.click(element);
        expect(mockUseNavigate).toHaveBeenCalledWith(pid);
    });

    it('should navigate to record view if Space is pressed on the keyboard while a gallery item has focus', () => {
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 32, code: 'Space' });

        expect(mockUseNavigate).toHaveBeenCalledWith(pid);
    });
    it('should navigate to record view if Enter is pressed on the keyboard while a gallery item has focus', () => {
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 13, code: 'Enter' });

        expect(mockUseNavigate).toHaveBeenCalledWith(pid);
    });
    it('should navigate to record view if NumPad Enter is pressed on the keyboard while a gallery item has focus', () => {
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 13, code: 'NumpadEnter' });

        expect(mockUseNavigate).toHaveBeenCalledWith(pid);
    });

    it('should not navigate to record view if a key other than space, enter or numpad enter is pressed on the keyboard while a gallery item has focus', () => {
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 100, code: 'KeyD' });

        expect(mockUseNavigate).not.toHaveBeenCalled();
    });
    it('should render a full gallery item with title and Restricted alert adornments', () => {
        const item = {
            ...collectionSearchResultsImages.data[0],
            rek_display_type_lookup: 'Image',
            fez_datastream_info: [
                {
                    dsi_id: 2706293,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'thumbnail_UQFL11_p0004.jpg',
                    dsi_checksum: 'c4a1e6e73b486f0ae46ef67e00e3285f',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2461,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2706296,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'UQFL11_p0004.tif',
                    dsi_checksum: '9091df099b9004d5f6b1929c9e3d29a6',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 47877132,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 1,
                },
            ],
        };
        const { getByTestId, getByText } = setup({ item: item });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-title`)).toBeInTheDocument();
        expect(getByText(item.rek_title)).toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-alert`)).toBeInTheDocument();
        expect(getByText(txt.components.imageGallery.alert.restricted)).toBeInTheDocument();
    });
    it('should render a full gallery item with title and Restricted & Advisory alert adornments', () => {
        const item = {
            ...collectionSearchResultsImages.data[0],
            rek_display_type_lookup: 'Image',
            fez_record_search_key_advisory_statement: {
                rek_advisory_statement_id: 23188,
                rek_advisory_statement_pid: 'UQ:375129',
                rek_advisory_statement_xsdmf_id: null,
                rek_advisory_statement:
                    'Aboriginal and Torres Strait Islander people are warned that this photograph may contain images of Aboriginal and Islander people now deceased.',
            },
            fez_datastream_info: [
                {
                    dsi_id: 2706293,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'thumbnail_UQFL11_p0004.jpg',
                    dsi_checksum: 'c4a1e6e73b486f0ae46ef67e00e3285f',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2461,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2706296,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'UQFL11_p0004.tif',
                    dsi_checksum: '9091df099b9004d5f6b1929c9e3d29a6',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 47877132,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 1,
                },
            ],
        };
        const { getByTestId, getByText } = setup({ item: item });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-title`)).toBeInTheDocument();
        expect(getByText(item.rek_title)).toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-alert`)).toBeInTheDocument();
        expect(getByText(txt.components.imageGallery.alert.restrictedAdvisory)).toBeInTheDocument();
    });
    it('should render a full gallery item without title and with Advisory adornments', () => {
        const item = {
            ...collectionSearchResultsImages.data[0],
            rek_display_type_lookup: 'Image',
            fez_record_search_key_advisory_statement: {
                rek_advisory_statement_id: 23188,
                rek_advisory_statement_pid: 'UQ:375129',
                rek_advisory_statement_xsdmf_id: null,
                rek_advisory_statement:
                    'Aboriginal and Torres Strait Islander people are warned that this photograph may contain images of Aboriginal and Islander people now deceased.',
            },
            fez_datastream_info: [
                {
                    dsi_id: 2706293,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'thumbnail_UQFL11_p0004.jpg',
                    dsi_checksum: 'c4a1e6e73b486f0ae46ef67e00e3285f',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2461,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2706296,
                    dsi_pid: 'UQ:375129',
                    dsi_dsid: 'UQFL11_p0004.tif',
                    dsi_checksum: '9091df099b9004d5f6b1929c9e3d29a6',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 47877132,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
            ],
        };
        const { getByTestId, getByText, queryByText, queryByTestId } = setup({
            item: item,
            withTitle: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(queryByTestId(`image-gallery-item-${item.rek_pid}-title`)).not.toBeInTheDocument();
        expect(queryByText(item.rek_title)).not.toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-alert`)).toBeInTheDocument();
        expect(getByText(txt.components.imageGallery.alert.advisory)).toBeInTheDocument();
    });
    it('should render a full gallery item without alert adornment', () => {
        const item = {
            ...collectionSearchResultsImages.data[1],
        };
        const { getByTestId, getByText, queryByText, queryByTestId } = setup({
            item: item,
            withAlert: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId(`image-gallery-item-${item.rek_pid}-title`)).toBeInTheDocument();
        expect(getByText(item.rek_title)).toBeInTheDocument();
        expect(queryByTestId(`image-gallery-item-${item.rek_pid}-alert`)).not.toBeInTheDocument();
        expect(queryByText(txt.components.imageGallery.alert.advisory)).not.toBeInTheDocument();
    });
    it('should render a full gallery item without title or alert adornment', () => {
        const item = {
            ...collectionSearchResultsImages.data[1],
        };
        const { getByTestId, queryByText, queryByTestId } = setup({
            item: item,
            withTitle: false,
            withAlert: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(queryByTestId(`image-gallery-item-${item.rek_pid}-title`)).not.toBeInTheDocument();
        expect(queryByText(item.rek_title)).not.toBeInTheDocument();
        expect(queryByTestId(`image-gallery-item-${item.rek_pid}-alert`)).not.toBeInTheDocument();
        expect(queryByText(txt.components.imageGallery.alert.advisory)).not.toBeInTheDocument();
    });
    it('should render a full gallery item with first publicly available thumbnail', () => {
        const item = {
            ...collectionSearchResultsImages.data[1],
            fez_record_search_key_advisory_statement: null,
            rek_display_type_lookup: 'Image',
            fez_datastream_info: [
                {
                    dsi_id: 2653452,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'presmd_UQFL553_b19f04_0040a.xml',
                    dsi_checksum: '524975d8b1c2df020da9a0425b58945f',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 20260,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653451,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'presmd_UQFL553_b19f04_0040x.xml',
                    dsi_checksum: 'c590bdc15cae18b82c5c2b4e6de98984',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 8142,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653450,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'preview_UQFL553_b19f04_0040a.jpg',
                    dsi_checksum: '1737c40edf1652509c974f410d5a4bef',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 27498,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653449,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'preview_UQFL553_b19f04_0040x.jpg',
                    dsi_checksum: 'b8ae8eb91d9c9e50751d06b670b3c6b2',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 55252,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653448,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'thumbnail_UQFL553_b19f04_0040a.jpg',
                    dsi_checksum: '76d2733d15c547571993a474de90f608',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 3325,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653447,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'thumbnail_UQFL553_b19f04_0040x.jpg',
                    dsi_checksum: '5ee305cf682b34dc16d9a12edfd21f08',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 2677,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2652615,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'UQFL553_b19f04_0040a.tif',
                    dsi_checksum: '01de7c1658b7f230b35c1924f04d6d99',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Restricted access',
                    dsi_mimetype: 'image/tiff',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 347594176,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653453,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'UQFL553_b19f04_0040x.jpg',
                    dsi_checksum: '580487810587725067831ddeeced2219',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 958644,
                    dsi_security_policy: 5,
                    dsi_security_inherited: 1,
                },
                {
                    dsi_id: 2653446,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'web_UQFL553_b19f04_0040a.jpg',
                    dsi_checksum: '2003172acf19c6f59070d6571749cf93',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 166289,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
                {
                    dsi_id: 2653445,
                    dsi_pid: 'UQ:412662',
                    dsi_dsid: 'web_UQFL553_b19f04_0040x.jpg',
                    dsi_checksum: '30d20d6f0bcce546eb204ea7b915157d',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 92932,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
            ],
        };
        const { getByTestId } = setup({ item: item });
        const galleryElement = getByTestId(`image-gallery-item-${item.rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        const galleryImageElement = getByTestId(`imageGalleryItemImage-${item.rek_pid}`);
        expect(galleryImageElement).toBeInTheDocument();
        // expect the 2nd thumbnail from the datastream above to be used
        // as it's the only one with public access on parent file
        expect(galleryImageElement.getAttribute('src')).toContain('thumbnail_UQFL553_b19f04_0040x.jpg');
    });

    describe('getAlertMessageText function', () => {
        it('should return a message with image unavailable text', () => {
            expect(getAlertMessageText({ unavailable: true, restricted: false, advisory: false })).toEqual(
                txt.components.imageGallery.alert.unavailable,
            );
        });
        it('should return a message with advisory text', () => {
            expect(getAlertMessageText({ unavailable: true, restricted: true, advisory: true })).toEqual(
                txt.components.imageGallery.alert.advisory,
            );
        });
        it('should return a message with restricted and advisory title text', () => {
            expect(getAlertMessageText({ unavailable: false, restricted: true, advisory: true })).toEqual(
                txt.components.imageGallery.alert.restrictedAdvisory,
            );
        });
        it('should return a message with restricted title text', () => {
            expect(getAlertMessageText({ unavailable: false, restricted: true, advisory: false })).toEqual(
                txt.components.imageGallery.alert.restricted,
            );
        });
        it('should return a message with advisory title text', () => {
            expect(getAlertMessageText({ unavailable: false, restricted: false, advisory: true })).toEqual(
                txt.components.imageGallery.alert.advisory,
            );
        });
        it('should return no title text', () => {
            expect(getAlertMessageText({ unavailable: false, restricted: false, advisory: false })).toBeNull();
        });
    });
});
