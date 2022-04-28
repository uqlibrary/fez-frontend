import React from 'react';
import { render, AllTheProviders } from 'test-utils';

import ImageGalleryItem from './ImageGalleryItem';
import { collectionSearchResultsImages } from 'mock/data';

const setup = (props = {}) => {
    const testProps = {
        item: { rek_pid: 0 },
        ...props,
    };
    return render(
        <AllTheProviders>
            <ImageGalleryItem {...testProps} />
        </AllTheProviders>,
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
});
