import React from 'react';
import { render, WithRouter, act, fireEvent } from 'test-utils';

import ImageGalleryItem from './ImageGalleryItem';
import { collectionSearchResultsImages } from 'mock/data';

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
});
