import React from 'react';
import { render, AllTheProviders } from 'test-utils';

import ImageGalleryItemImage from './ImageGalleryItemImage';
import { collectionSearchResultsImages } from 'mock/data';

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
    it('should render a lock icon', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[0] });
        const galleryElement = getByTestId(
            `imageGalleryItemImage-Locked-${collectionSearchResultsImages.data[0].rek_pid}`,
        );
        expect(galleryElement).toBeInTheDocument();
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

    it('should render a gallery image', () => {
        const { getByTestId } = setup({ item: collectionSearchResultsImages.data[1] });
        const galleryElement = getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
    });

    it('should render an image element with undefined source attribute when no thumb to show and optional flag is not set', () => {
        const testItem = collectionSearchResultsImages.data[0];
        testItem.fez_datastream_info = null;
        const { getByTestId } = setup({ item: testItem });

        expect(
            getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`),
        ).toBeInTheDocument();
        // In reality JS onError will kick in to show a fallback image when image src is invalid
        expect(getByTestId(`imageGalleryItemImage-${collectionSearchResultsImages.data[0].rek_pid}`)).toHaveAttribute(
            'src',
            'undefined',
        );
    });

    it('should render an empty element when no thumb to show and optional flag is set', () => {
        const testItem = collectionSearchResultsImages.data[0];
        testItem.fez_datastream_info = null;
        const { container } = setup({ item: testItem, optional: true });

        expect(container).toBeEmptyDOMElement();
    });
});
