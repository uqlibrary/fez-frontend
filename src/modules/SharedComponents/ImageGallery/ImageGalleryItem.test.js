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
    it('should render a full gallery item with title and alert adornments', () => {
        const { getByTestId, getByText } = setup({ item: collectionSearchResultsImages.data[1] });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId('image-gallery-item-UQ:288583-title')).toBeInTheDocument();
        expect(getByText(collectionSearchResultsImages.data[1].rek_title)).toBeInTheDocument();
        expect(getByTestId('image-gallery-item-UQ:288583-alert')).toBeInTheDocument();
        expect(getByText(txt.components.imageGallery.alert.advisory)).toBeInTheDocument();
    });
    it('should render a full gallery item without title adornment', () => {
        const { getByTestId, getByText, queryByText, queryByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            withTitle: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(queryByTestId('image-gallery-item-UQ:288583-title')).not.toBeInTheDocument();
        expect(queryByText(collectionSearchResultsImages.data[1].rek_title)).not.toBeInTheDocument();
        expect(getByTestId('image-gallery-item-UQ:288583-alert')).toBeInTheDocument();
        expect(getByText(txt.components.imageGallery.alert.advisory)).toBeInTheDocument();
    });
    it('should render a full gallery item without alert adornment', () => {
        const { getByTestId, getByText, queryByText, queryByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            withAlert: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(getByTestId('image-gallery-item-UQ:288583-title')).toBeInTheDocument();
        expect(getByText(collectionSearchResultsImages.data[1].rek_title)).toBeInTheDocument();
        expect(queryByTestId('image-gallery-item-UQ:288583-alert')).not.toBeInTheDocument();
        expect(queryByText(txt.components.imageGallery.alert.advisory)).not.toBeInTheDocument();
    });
    it('should render a full gallery item without title or alert adornment', () => {
        const { getByTestId, queryByText, queryByTestId } = setup({
            item: collectionSearchResultsImages.data[1],
            withTitle: false,
            withAlert: false,
        });
        const galleryElement = getByTestId(`image-gallery-item-${collectionSearchResultsImages.data[1].rek_pid}`);
        expect(galleryElement).toBeInTheDocument();
        expect(queryByTestId('image-gallery-item-UQ:288583-title')).not.toBeInTheDocument();
        expect(queryByText(collectionSearchResultsImages.data[1].rek_title)).not.toBeInTheDocument();
        expect(queryByTestId('image-gallery-item-UQ:288583-alert')).not.toBeInTheDocument();
        expect(queryByText(txt.components.imageGallery.alert.advisory)).not.toBeInTheDocument();
    });
    describe('getAlertMessageText function', () => {
        it('should return a message with image unavailable text', () => {
            expect(getAlertMessageText({ unavailable: true, restricted: true, advisory: true })).toEqual(
                txt.components.imageGallery.alert.unavailable,
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
