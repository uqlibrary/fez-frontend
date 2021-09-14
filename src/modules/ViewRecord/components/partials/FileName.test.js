import React from 'react';
import { render, fireEvent, act } from 'test-utils';

import FileName from './FileName';

import { journalArticle } from 'mock/data/testing/records';

import mediaQuery from 'css-mediaquery';
const createMatchMedia = width => {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
};

function setup(testProps = {}) {
    const { previewFileName, ...rest } = testProps;
    const props = {
        id: 'test-file-name',
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: 'application/pdf',
        mediaUrl:
            (!!testProps.fileName && `https://espace.library.uq.edu.au/view/UQ:676287/${testProps.fileName}`) || '',
        previewMediaUrl:
            (!!previewFileName && `https://espace.library.uq.edu.au/view/UQ:676287/${previewFileName}`) || '',
        onFileSelect: jest.fn(),
        allowDownload: false,
        ...rest,
    };
    return render(<FileName {...props} />);
}

describe('File Name Component ', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render component and display file name only', () => {
        const { getByText, queryByTestId } = setup({});
        expect(queryByTestId('test-file-name')).toBeInTheDocument();
        expect(getByText('UQ676287_OA.pdf')).toBeInTheDocument();
    });

    it('should display file name link', () => {
        const { getByText, container } = setup({
            allowDownload: true,
            fileName: 'test.jpg',
            previewFileName: 'preview_test.jpg',
            checksums: { media: '111' },
        });
        expect(getByText('test.jpg')).toBeInTheDocument();
        expect(container.querySelector('a[title="test.jpg"][target="_blank"]')).toBeInTheDocument();
    });

    it('should render audio player', () => {
        const { getByText, queryByTestId, container } = setup({
            allowDownload: true,
            mimeType: 'audio/mp3',
            fileName: 'test.mp3',
            checksums: { media: '111' },
        });
        expect(getByText('test.mp3')).toBeInTheDocument();
        expect(queryByTestId('audioPlayer')).toBeInTheDocument();
        expect(container.querySelector('button[aria-label^="Click to play audio file"]')).toBeInTheDocument();
    });

    it('should run onFileSelect function on click', () => {
        const testFn = jest.fn();
        const { getByText } = setup({
            allowDownload: true,
            mimeType: 'image/jpeg',
            fileName: 'test.jpg',
            previewFileName: 'preview_test.jpg',
            onFileSelect: testFn,
        });
        act(() => {
            fireEvent.click(getByText('test.jpg'));
        });
        expect(testFn).toHaveBeenCalledTimes(1);
    });

    it('should run onFileSelect function on key press', () => {
        const testFn = jest.fn();
        const { getByText } = setup({
            allowDownload: true,
            fileName: 'test.mp4',
            previewFileName: 'preview_test.jpg',
            mimeType: 'video/mp4',
            onFileSelect: testFn,
        });
        act(() => {
            fireEvent.keyPress(getByText('test.mp4'), { key: 'Enter', code: 13, charCode: 13 });
        });
        expect(testFn).toHaveBeenCalledTimes(1);
    });
});
