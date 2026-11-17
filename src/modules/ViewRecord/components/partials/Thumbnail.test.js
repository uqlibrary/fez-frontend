import React from 'react';
import Thumbnail from './Thumbnail';
import { rtlRender, fireEvent, within } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        mediaUrl: '/test/mediaUrl',
        previewMediaUrl: '/test/preview/mediaUrl',
        thumbnailMediaUrl: '/test/thumbnail/mediaUrl',
        mimeType: 'image/jpeg',
        onClick: jest.fn(),
        classes: {
            image: '',
        },
        ...testProps,
    };
    return rtlRender(<Thumbnail {...props} />);
}

describe('Thumbnail component', () => {
    it('should render component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should run onClick function on click', () => {
        const onClick = jest.fn();
        const { getByTitle } = setup({ onClick: onClick });
        fireEvent.click(getByTitle('Click to open a preview of /test/mediaUrl'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be a focusable button that activates with Enter and Space only', () => {
        const onClick = jest.fn();
        const { getByRole } = setup({ onClick, fileName: 'image.jpg', securityStatus: true });
        const button = getByRole('button', { name: 'Click to open a preview of image.jpg' });
        expect(button).toHaveAttribute('tabindex', '0');

        fireEvent.keyDown(button, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(button, { key: ' ' });
        expect(onClick).toHaveBeenCalledTimes(2);
        fireEvent.keyDown(button, { key: 'Tab' });
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('should render a lock icon with empty security status', () => {
        const { getByTestId } = setup();
        expect(getByTestId('LockIcon')).toBeInTheDocument();
    });

    it('should render image with security status', () => {
        const { queryByTestId, getByRole } = setup({ securityStatus: true });
        expect(getByRole('progressbar')).toBeInTheDocument();
        expect(queryByTestId('LockIcon')).not.toBeInTheDocument();
    });
    it('should render external link with a progress bar for FLV files', () => {
        const { getByRole } = setup({
            fileName: 'video.mov',
            mediaUrl: 'video.flv',
            mimeType: 'application/octet-stream',
        });

        const element = getByRole('link', { title: 'video.mov' });
        expect(element).toHaveAttribute('href', 'video.flv');
        expect(within(element).getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render PDF files as a thumbnail only plus link to original', () => {
        const { getByRole } = setup({
            fileName: 'original.pdf',
            mediaUrl: 'pdf.jpg',
            thumbnailFileName: 'thumbnail.jpg',
            mimeType: 'application/pdf',
        });
        const element = getByRole('link', { title: 'original.pdf' });
        expect(element).toHaveAttribute('href', 'pdf.jpg');
        expect(within(element).getByRole('progressbar')).toBeInTheDocument();
    });

    it('should name the PDF link after the original file, not the thumbnail', () => {
        const { getByRole } = setup({
            fileName: 'original.pdf',
            mediaUrl: 'pdf.jpg',
            thumbnailFileName: 'thumbnail.jpg',
            mimeType: 'application/pdf',
        });
        expect(getByRole('link', { name: 'Open original.pdf in a new tab' })).toHaveAttribute('href', 'pdf.jpg');
    });

    it('should name the preview link after the original file, not the media url', () => {
        const { getByLabelText } = setup({ fileName: 'image.jpg', securityStatus: true });
        const link = getByLabelText('Click to open a preview of image.jpg');
        expect(link).toHaveAttribute('title', 'Click to open a preview of image.jpg');
    });
});
