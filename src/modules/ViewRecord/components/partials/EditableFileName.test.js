import React from 'react';
import { render, fireEvent, act, AllTheProviders } from 'test-utils';

import EditableFileName from './EditableFileName';

import { journalArticle } from 'mock/data/testing/records';
import * as fileUploadConfig from '../../../SharedComponents/Toolbox/FileUploader/config';

import mediaQuery from 'css-mediaquery';

const createMatchMedia = width => {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
};

const id = 'test-file-name';
const editId = `${id}-edit`;
const resetId = `${id}-reset`;
const saveId = `${id}-save`;
const cancelId = `${id}-cancel`;
const editingId = `${id}-editing`;

function setup(testProps = {}) {
    const props = {
        id: id,
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: 'test.jpg',
        mimeType: 'image/jpg',
        previewFileName: 'preview_test.jpg',
        mediaUrl: 'https://espace.library.uq.edu.au/view/UQ:676287/test.jpg',
        previewMediaUrl: 'https://espace.library.uq.edu.au/view/UQ:676287/preview_test.jpg',
        onFileSelect: jest.fn(),
        fileRestrictionsConfig: {
            fileUploadLimit: fileUploadConfig.DEFAULT_FILE_UPLOAD_LIMIT,
            fileNameRestrictions: fileUploadConfig.FILE_NAME_RESTRICTION,
        },
        allowDownload: true,
        checksums: { media: '111' },
        ...testProps,
    };
    return render(
        <AllTheProviders>
            <EditableFileName {...props} />
        </AllTheProviders>,
    );
}

describe('Editable File Name Component ', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render a filename with edit control', () => {
        const { getByTestId, getByText } = setup({});

        const editId = `${id}-edit`;

        expect(getByText('test.jpg')).toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
    });

    it('should handle editing a filename', () => {
        const onFileNameChange = jest.fn();
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileNameChange,
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jpg' } });

        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jpg');

        act(() => {
            fireEvent.click(getByTestId(saveId));
        });

        expect(onFileSaveFilename).toHaveBeenCalled();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
        expect(getByTestId(resetId)).toBeInTheDocument();
        /* delete handleFileIsValid &  onFileCancelEdit */
    });

    it('should handle editing a filename using keyboard', () => {
        const onFileNameChange = jest.fn();
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileNameChange,
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jp' } });

        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jp');

        // test passthrough of keyPresses we dont want to specifically handle
        fireEvent.keyPress(getByTestId(editingId), { key: 'KeyG', charCode: 103, code: 'KeyG' });

        // test main enter key
        fireEvent.keyPress(getByTestId(editingId), { key: 'Enter', charCode: 13, code: 'Enter' });

        expect(onFileSaveFilename).toHaveBeenCalled();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
        expect(getByTestId(resetId)).toBeInTheDocument();

        // now with numpad
        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jpg' } });

        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jpg');

        fireEvent.keyPress(getByTestId(editingId), { key: 'NumpadEnter', charCode: 13, code: 'NumpadEnter' });

        expect(onFileSaveFilename).toHaveBeenCalled();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
        expect(getByTestId(resetId)).toBeInTheDocument();

        /* delete handleFileIsValid &  onFileCancelEdit */
    });

    it('should handle cancel editing a filename', () => {
        const onFileNameChange = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileNameChange,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jpg' } });

        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jpg');

        act(() => {
            fireEvent.click(getByTestId(cancelId));
        });

        expect(onFileNameChange).toHaveBeenNthCalledWith(2, 'test.jpg', true);

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
        expect(queryByTestId(resetId)).not.toBeInTheDocument();
        /* delete onFileSaveFilename handleFileIsValid &  onFileCancelEdit */
    });

    it('should handle resetting a renamed filename', () => {
        const onFileNameChange = jest.fn();
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileNameChange,
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jpg' } });

        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jpg');

        act(() => {
            fireEvent.click(getByTestId(saveId));
        });

        expect(onFileSaveFilename).toHaveBeenCalled();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();

        expect(getByTestId(resetId)).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId(resetId));
        });

        expect(onFileSaveFilename).toHaveBeenCalled();
        expect(onFileNameChange).toHaveBeenCalledWith('test.jpg');

        /* delete handleFileIsValid &  onFileCancelEdit */
    });

    it('should handle resetting to original name a filename renamed more than once', () => {
        const onFileNameChange = jest.fn();
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileNameChange,
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        // rename 1
        expect(getByTestId(editingId)).toBeInTheDocument();
        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed.jpg' } });
        expect(onFileNameChange).toHaveBeenCalledWith('renamed.jpg');
        act(() => {
            fireEvent.click(getByTestId(saveId));
        });
        expect(onFileSaveFilename).toHaveBeenCalled();

        // rename 2
        expect(getByTestId(editId)).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(getByTestId(editingId)).toBeInTheDocument();
        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed-again.jpg' } });
        expect(onFileNameChange).toHaveBeenCalledWith('renamed-again.jpg');
        act(() => {
            fireEvent.click(getByTestId(saveId));
        });
        expect(onFileSaveFilename).toHaveBeenCalled();

        // reset to original
        expect(getByTestId(resetId)).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId(resetId));
        });
        expect(onFileSaveFilename).toHaveBeenCalled();
        expect(onFileNameChange).toHaveBeenCalledWith('test.jpg');

        /* delete handleFileIsValid &  onFileCancelEdit */
    });
});
