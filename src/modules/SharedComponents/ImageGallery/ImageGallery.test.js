import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import ImageGallery, { getItemUrl, getItemsPerRow } from './ImageGallery';
import { collectionSearchResultsImages } from 'mock/data';

const setup = (props = {}, render = rtlRender) => {
    const testProps = {
        publicationsList: [],
        ...props,
    };
    return render(
        <WithRouter>
            <ImageGallery {...testProps} />
        </WithRouter>,
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

    describe('getItemUrl function', () => {
        it('should return a properly formatted URL string', () => {
            expect(getItemUrl('test')).toEqual('/view/test');
        });
    });
    describe('getItemsPerRow function', () => {
        it('should return itemsPerRow if passed', () => {
            expect(getItemsPerRow(10)).toEqual(10);
        });
        it('should return 4 if md=true', () => {
            expect(getItemsPerRow(null, false, true)).toEqual(4);
        });
        it('should return 3 if sm=true', () => {
            expect(getItemsPerRow(null, true, false)).toEqual(3);
        });
        it('should return 2 if sm & md = false', () => {
            expect(getItemsPerRow(null, false, false)).toEqual(2);
        });
    });
});
