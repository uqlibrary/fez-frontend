import React from 'react';
import { FileIcon } from './FileIcon';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        mimeType: '',
        ...testProps,
    };

    return rtlRender(<FileIcon {...props} />);
}

describe('FileIcon component', () => {
    it('should render the default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render a thumbnail when applicable', () => {
        const { container } = setup({
            pid: 'UQ:123456',
            allowDownload: true,
            thumbnailFileName: 'thumbnail_test.jpg',
            webFileName: 'web_test.jpg',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render a thumbnail without web file when applicable', () => {
        const { container } = setup({
            pid: 'UQ:123456',
            allowDownload: true,
            thumbnailFileName: 'thumbnail_test.jpg',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render VolumeUp for audio', () => {
        const { container } = setup({ mimeType: 'audio/wav' });
        expect(container).toMatchSnapshot();
    });

    it('should render PictureAsPdf for PDF', () => {
        const { container } = setup({ mimeType: 'application/pdf' });
        expect(container).toMatchSnapshot();
    });

    it('should render Image for image', () => {
        const { container } = setup({ mimeType: 'image/png' });
        expect(container).toMatchSnapshot();
    });

    it('should render Videocam for video', () => {
        const { container } = setup({ mimeType: 'video/mp4' });
        expect(container).toMatchSnapshot();
    });
});
