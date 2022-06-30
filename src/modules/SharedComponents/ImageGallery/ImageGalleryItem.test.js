import React from 'react';
import { render, WithRouter, act, fireEvent } from 'test-utils';

import ImageGalleryItem, { getAlertMessageText } from './ImageGalleryItem';
import { collectionSearchResultsImages } from 'mock/data';
import txt from 'locale/components';

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
        const testHistory = jest.fn();
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
            history: { push: testHistory },
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        act(() => {
            fireEvent.click(element);
        });
        expect(testHistory).toHaveBeenCalledWith(pid);
    });

    it('should navigate to record view if Space is pressed on the keyboard while a gallery item has focus', () => {
        const testHistory = jest.fn();
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
            history: { push: testHistory },
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 32, code: 'Space' });

        expect(testHistory).toHaveBeenCalledWith(pid);
    });
    it('should navigate to record view if Enter is pressed on the keyboard while a gallery item has focus', () => {
        const testHistory = jest.fn();
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
            history: { push: testHistory },
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 13, code: 'Enter' });

        expect(testHistory).toHaveBeenCalledWith(pid);
    });
    it('should navigate to record view if NumPad Enter is pressed on the keyboard while a gallery item has focus', () => {
        const testHistory = jest.fn();
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
            history: { push: testHistory },
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 13, code: 'NumpadEnter' });

        expect(testHistory).toHaveBeenCalledWith(pid);
    });

    it('should not navigate to record view if a key other than space, enter or numpad enter is pressed on the keyboard while a gallery item has focus', () => {
        const testHistory = jest.fn();
        const pid = collectionSearchResultsImages.data[1].rek_pid;
        const { getByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            url: pid,
            history: { push: testHistory },
        });
        const element = getByTestId(`image-gallery-item-${pid}`);
        expect(element).toBeInTheDocument();
        fireEvent.keyPress(element, { charCode: 100, code: 'KeyD' });

        expect(testHistory).not.toHaveBeenCalled();
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
