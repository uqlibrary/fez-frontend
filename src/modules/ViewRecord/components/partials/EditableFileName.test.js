import React from 'react';
import { rtlRender, fireEvent, act, AllTheProviders, screen } from 'test-utils';

import EditableFileName from './EditableFileName';

import { journalArticle } from 'mock/data/testing/records';

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

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        id,
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: 'test.jpg',
        mimeType: 'image/jpg',
        previewFileName: 'preview_test.jpg',
        mediaUrl: 'https://espace.library.uq.edu.au/view/UQ:676287/test.jpg',
        previewMediaUrl: 'https://espace.library.uq.edu.au/view/UQ:676287/preview_test.jpg',
        onFileSelect: jest.fn(),
        checkFileNameForErrors: jest.fn(() => true),
        allowDownload: true,
        checksums: { media: '111' },
        isEdited: false,
        ...testProps,
    };
    return renderer(
        <AllTheProviders>
            <EditableFileName {...props} />
        </AllTheProviders>,
    );
}

describe('Editable File Name Component ', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(1024);
    });

    it('should render a filename with edit control', () => {
        const { getByTestId, getByText } = setup({});

        expect(getByText('test.jpg')).toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
    });

    it('should handle editing a filename', () => {
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });

        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed' } });

        act(() => {
            fireEvent.click(getByTestId(saveId));
        });

        expect(onFileSaveFilename).toHaveBeenCalledWith('test.jpg', 'renamed.jpg');

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
    });

    it('should handle editing a filename using keyboard', () => {
        const onFileSaveFilename = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed' } });

        // test passthrough of keyPresses we dont want to specifically handle
        fireEvent.keyPress(getByTestId(editingId), { key: 'Keyd', charCode: 100, code: 'Keyd' });

        // test main enter key
        fireEvent.keyPress(getByTestId(editingId), { key: 'Enter', charCode: 13, code: 'Enter' });

        expect(onFileSaveFilename).toHaveBeenCalledWith('test.jpg', 'renamed.jpg');

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();

        // now with numpad
        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed' } });

        fireEvent.keyPress(getByTestId(editingId), { key: 'NumpadEnter', charCode: 13, code: 'NumpadEnter' });

        expect(onFileSaveFilename).toHaveBeenCalled();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
    });

    it('should handle cancel editing a filename', () => {
        const { getByTestId, queryByTestId, getByText } = setup();

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed' } });

        act(() => {
            fireEvent.click(getByTestId(cancelId));
        });

        expect(getByText('test.jpg')).toBeInTheDocument();

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();
    });

    it('should handle resetting a renamed filename', () => {
        const onFileNameChange = jest.fn();
        const onFileSaveFilename = jest.fn();

        const { rerender, getByTestId, queryByTestId } = setup({
            onFileNameChange,
            onFileSaveFilename,
        });

        expect(getByTestId(editId)).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId(editId));
        });
        expect(queryByTestId(editId)).not.toBeInTheDocument();

        expect(getByTestId(editingId)).toBeInTheDocument();

        fireEvent.change(getByTestId(editingId), { target: { value: 'renamed' } });

        act(() => {
            fireEvent.click(getByTestId(saveId));
        });

        expect(onFileSaveFilename).toHaveBeenCalledWith('test.jpg', 'renamed.jpg');

        expect(queryByTestId(editingId)).not.toBeInTheDocument();
        expect(getByTestId(editId)).toBeInTheDocument();

        setup(
            {
                fileName: 'renamed.jpg',
                isEdited: true,
            },
            rerender,
        );

        expect(getByTestId(resetId)).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId(resetId));
        });

        expect(onFileNameChange).toHaveBeenCalledWith('test.jpg');
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
