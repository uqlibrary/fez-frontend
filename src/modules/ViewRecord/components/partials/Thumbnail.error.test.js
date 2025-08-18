import React from 'react';
import Thumbnail from './Thumbnail';
import { rtlRender, waitForElementToBeRemoved } from 'test-utils';

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
describe('Error handling', () => {
    it('should show a broken thumbnail icon when the thumbnail wont load.', async () => {
        Object.defineProperty(window.Image.prototype, 'src', {
            set() {
                setTimeout(() => this.onerror(new Error('mocked error')), 100);
            },
        });
        const { getByRole, getByTestId } = setup({
            fileName: 'video.mov',
            mediaUrl: 'error.flv',
            mimeType: 'application/octet-stream',
        });
        await waitForElementToBeRemoved(getByRole('progressbar'));
        expect(getByTestId('video.mov-error')).toBeInTheDocument();
    });
});
