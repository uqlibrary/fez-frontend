import React from 'react';
import { render, AllTheProviders } from 'test-utils';

import ImageGallery from './ImageGallery';
import { collectionSearchResultsImages } from 'mock/data';

const setup = (props = {}) => {
    const testProps = {
        publicationsList: [],
        ...props,
    };
    return render(
        <AllTheProviders>
            <ImageGallery {...testProps} />
        </AllTheProviders>,
    );
};

describe('Image Gallery', () => {
    it('should render an empty gallery', () => {
        const { getByTestId } = setup();
        const galleryElement = getByTestId('image-gallery');
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement.querySelectorAll('li').length).toEqual(0);
    });

    it('should render a populated gallery', () => {
        const { getByTestId } = setup({ publicationsList: collectionSearchResultsImages.data });
        const galleryElement = getByTestId('image-gallery');
        expect(galleryElement).toBeInTheDocument();
        expect(galleryElement.querySelectorAll('li').length).toEqual(20);
    });
});
