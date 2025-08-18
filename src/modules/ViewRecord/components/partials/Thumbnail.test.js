import React from 'react';
import Thumbnail from './Thumbnail';
import { rtlRender, fireEvent, within } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        mediaUrl: '/test/mediaUrl',
        previewMediaUrl: '/test/preview/mediaUrl',
        thumbnailMediaUrl: '/test/thumbnail/mediaUrl',
        thumbnailFileName: 'thumbnail.jpg',
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
        fireEvent.keyPress(getByTitle('Click to open a preview of /test/mediaUrl'), { key: 'Enter', keyCode: 13 });
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
});
