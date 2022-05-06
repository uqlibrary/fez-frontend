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
    it('should make call to render a lock icon', () => {
        const setRestricted = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.rek_display_type_lookup = 'NotValidType';
        setup({ item, setRestricted });

        expect(setRestricted).toHaveBeenCalledWith(true);
    });
    it('should make call to render an advisory icon', () => {
        const setAdvisory = jest.fn();
        const item = collectionSearchResultsImages.data[0];
        item.fez_record_search_key_advisory_statement = {};
        item.fez_record_search_key_advisory_statement.rek_advisory_statement = 'This is an example advisory statement';
        setup({ item, setAdvisory });

        expect(setAdvisory).toHaveBeenCalledWith(true);
    });
    it('should make call to render both a lock icon and an advisory icon', () => {
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

    it("should render a locked item's image when admin logged in", () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[0], security: { isAdmin: true } });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
    });

    it("should render a locked item's image when item's author logged in", () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[0], security: { isAuthor: true } });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
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

    it('should render a placeholder image when no thumb to show', () => {
        const testItem = collectionSearchResultsImages.data[0];
        testItem.fez_datastream_info = null;
        const { getByTestId } = setup({ item: testItem });

        expect(
            getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`),
        ).toBeInTheDocument();
        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`)).toHaveAttribute(
            'src',
            config.thumbnailImage.defaultImageName,
        );
    });
    it('should render a placeholder image when thumb image fails to load', () => {
        const testItem = collectionSearchResultsImages.data[2];
        const mockGetUrl = jest.spyOn(utils, 'getUrl').mockImplementationOnce(() => 'broken-image-url.jpg');
        const { getByTestId } = setup({ item: testItem });

        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[2].rek_pid}`);

        expect(mockGetUrl).toHaveBeenCalled();
        expect(galleryElement).toBeInTheDocument();

        expect(galleryElement).toHaveAttribute('src', 'broken-image-url.jpg');

        // cause the image to fire the onError event (won't happen naturally)
        fireEvent.error(galleryElement);

        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(galleryElement).toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });
    it('should render a gallery image', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[5] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[5].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement).not.toHaveAttribute('src', config.thumbnailImage.defaultImageName);
    });
});
