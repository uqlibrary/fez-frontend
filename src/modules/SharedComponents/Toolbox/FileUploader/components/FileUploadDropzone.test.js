import React from 'react';
import FileUploadDropzone, { removeInvalidFileNames } from './FileUploadDropzone';
import { FILE_NAME_RESTRICTION, MIME_TYPE_WHITELIST } from '../config';
import { rtlRender, fireEvent } from 'test-utils';

import { FormValuesContext } from 'context';
import Immutable from 'immutable';

function setup(testProps = {}, formValues = {}) {
    const props = {
        classes: {},
        onDrop: jest.fn(),
        locale: {},
        maxSize: 1000,
        fileNameRestrictions: /.+/,
        mimeTypeWhitelist: MIME_TYPE_WHITELIST,
        ...testProps,
    };
    return rtlRender(
        <FormValuesContext.Provider value={{ formValues }}>
            <FileUploadDropzone {...props} />
        </FormValuesContext.Provider>,
    );
}

describe('Component FileUploadDropzone', () => {
    let getMockFile;

    beforeEach(() => {
        const _File = window.File;
        const FILE = (data = [''], name) => new _File(data, name, { lastModified: 12345678912 });
        window.File = jest.fn((data, name) => FILE(data, name));
        getMockFile = name => new File([''], name);
    });

    it('should render component with default props', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    /* it('should open files selection dialog', () => {
        const wrapper = setup({}, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();

        const testFn = jest.fn();

        wrapper.find('FileUploadDropzone').instance().dropzoneRef.open = testFn;
        wrapper
            .find('FileUploadDropzone')
            .instance()
            ._onKeyPress();

        wrapper.update();
        expect(testFn).toHaveBeenCalled();
    });*/

    it('should remove duplicate files', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn });
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        // drag and drop same files twice
        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [file, file],
                types: ['Files', 'Files'],
            },
        });
        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file, name: 'hello.png', size: 5 }],
            expect.objectContaining({ sameFileNameWithDifferentExt: ['hello.png'] }),
        );
    });

    it('should remove files with same filename but different extension from dropped incoming files', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn });
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [file, new File(['hello'], 'hello.txt', { type: 'text/plain' })],
                types: ['Files', 'Files'],
            },
        });
        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file, name: 'hello.png', size: 5 }],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: ['hello.txt'] }),
        );
    });

    it('should remove files with same filename but different extension from dropped incoming files if already exist', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup(
            { onDrop: onDropFn },
            { fez_datastream_info: Immutable.List([{ dsi_dsid: 'hello.txt' }]) },
        );
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: { files: [file], types: ['Files'] },
        });
        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: ['hello.png'] }),
        );
    });

    it('should remove files with same filename but different extension and different casing from dropped incoming files if already exist', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup(
            { onDrop: onDropFn },
            { fez_datastream_info: Immutable.List([{ dsi_dsid: 'FiLeA.pdf' }]) },
        );
        const file = new File(['hello'], 'fileb.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [new File(['hello'], 'filea.png', { type: 'image/png' }), file],
                types: ['Files', 'Files'],
            },
        });
        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file, name: 'fileb.png', size: 5 }],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: ['filea.png'] }),
        );
    });

    it('should remove files with same filename but different extension from dropped incoming files if already exist or uses a renamed file name', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup(
            { onDrop: onDropFn },
            { fez_datastream_info: Immutable.List([{ dsi_dsid: 'filec.pdf', dsi_dsid_new: 'filea.pdf' }]) },
        );
        const file = new File(['hello'], 'fileb.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [new File(['hello'], 'filea.png', { type: 'image/png' }), file],
                types: ['Files', 'Files'],
            },
        });
        await new Promise(r => setTimeout(r, 80));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file, name: 'fileb.png', size: 5 }],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: ['filea.png'] }),
        );
    });

    it('should remove duplicate filenames if duplicated in both dropped and existing', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup(
            { onDrop: onDropFn },
            { fez_datastream_info: Immutable.List([{ dsi_dsid: 'a.pdf' }]) },
        );
        const file = new File(['hello'], 'b.pdf', { type: 'application/pdf' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [
                    new File(['hello'], 'a.png', { type: 'image/png' }),
                    file,
                    new File(['hello'], 'b.png', { type: 'image/png' }),
                ],
                types: ['Files', 'Files'],
            },
        });
        await new Promise(r => setTimeout(r, 80));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file, name: 'b.pdf', size: 5 }],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: ['b.png', 'a.png'] }),
        );
    });

    it(
        'should remove files with same filename but different extension ' +
            'from dropped incoming files and already queued files',
        async () => {
            const onDropFn = jest.fn();
            const { getByTestId } = setup({
                onDrop: onDropFn,
                filesInQueue: ['c.pdf', 'd.pdf', 'b.pdf'],
            });
            const file = new File(['hello'], 'a.pdf', { type: 'application/pdf' });

            fireEvent.drop(getByTestId('fez-datastream-info-input'), {
                dataTransfer: {
                    files: [
                        file,
                        new File(['hello'], 'a.png', { type: 'image/png' }),
                        new File(['hello'], 'b.pdf', { type: 'application/pdf' }),
                    ],
                    types: ['Files', 'Files', 'Files'],
                },
            });

            await new Promise(r => setTimeout(r, 80));

            expect(onDropFn).toHaveBeenCalledWith(
                [{ fileData: file, name: 'a.pdf', size: 5 }],
                expect.objectContaining({ duplicateFiles: ['b.pdf'], sameFileNameWithDifferentExt: ['a.png'] }),
            );
        },
    );

    it(
        'should remove files with same filename but different extension from dropped ' +
            'incoming files and already queued files 2',
        async () => {
            const onDropFn = jest.fn();
            const { getByTestId } = setup({
                onDrop: onDropFn,
                filesInQueue: ['c.pdf', 'd.pdf', 'b.pdf'],
            });
            const file = new File(['hello'], 'a.png', { type: 'image/png' });

            fireEvent.drop(getByTestId('fez-datastream-info-input'), {
                dataTransfer: {
                    files: [
                        file,
                        new File(['hello'], 'd.pdf', { type: 'application/pdf' }),
                        new File(['hello'], 'b.pdf', { type: 'application/pdf' }),
                    ],
                    types: ['Files', 'Files', 'Files'],
                },
            });

            await new Promise(r => setTimeout(r, 80));

            expect(onDropFn).toHaveBeenCalledWith(
                [{ fileData: file, name: 'a.png', size: 5 }],
                expect.objectContaining({ duplicateFiles: ['d.pdf', 'b.pdf'], sameFileNameWithDifferentExt: [] }),
            );
        },
    );

    it('should not remove any files if there are no duplicate files', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({
            onDrop: onDropFn,
            filesInQueue: ['c.pdf', 'd.pdf'],
        });
        const file1 = new File(['hello'], 'a.png', { type: 'image/png' });
        const file2 = new File(['hello'], 'b.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [file1, file2],
                types: ['Files', 'Files'],
            },
        });

        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [
                { fileData: file1, name: 'a.png', size: 5 },
                { fileData: file2, name: 'b.png', size: 5 },
            ],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: [] }),
        );
    });

    it('should not remove any files if there are no files', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn, filesInQueue: ['c.pdf', 'd.pdf'] });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: { files: [], types: [] },
        });

        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: [] }),
        );
    });

    it('should not remove any files if multipart zip files have been uploaded', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn });
        const file1 = new File(['hello'], 'a.001.zip', { type: 'application/zip' });
        const file2 = new File(['hello'], 'a.002.zip', { type: 'application/zip' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: { files: [file1, file2], types: [] },
        });

        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [
                { fileData: file1, name: 'a.001.zip', size: 5 },
                { fileData: file2, name: 'a.002.zip', size: 5 },
            ],
            expect.objectContaining({ duplicateFiles: [], sameFileNameWithDifferentExt: [] }),
        );
    });

    it('should remove files with invalid names', () => {
        const files = [getMockFile('c.txt'), getMockFile('1.txt')];
        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(1);
        expect(invalidFileNames.length).toEqual(1);
    });

    it('should not remove any files if there are no invalid names of files', () => {
        const files = [getMockFile('c.txt'), getMockFile('a.txt')];
        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(2);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied', () => {
        const files = [];
        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(0);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should remove files with invalid mime type', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn });
        const file1 = new File(['hello'], 'a.png', { type: 'image/png' });
        const file2 = new File(['hello'], 'b.txt', { type: 'text/plain' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: { files: [file1, file2], types: [] },
        });

        await new Promise(r => setTimeout(r, 50));

        // should not remove any files if number doesn't exceed max allowed number of files
        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file1, name: 'a.png', size: 5 }],
            expect.objectContaining({ invalidMimeTypeFiles: ['b.txt'], tooManyFiles: [] }),
        );
    });

    it('should remove files exceeding max allowed number of files in removeTooManyFiles', async () => {
        const onDropFn = jest.fn();
        const { getByTestId } = setup({ onDrop: onDropFn, fileUploadLimit: 1 });
        const file1 = new File(['hello'], 'a.png', { type: 'image/png' });
        const file2 = new File(['hello'], 'b.png', { type: 'image/png' });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: { files: [file1, file2], types: [] },
        });

        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [{ fileData: file1, name: 'a.png', size: 5 }],
            expect.objectContaining({ tooManyFiles: ['b.png'] }),
        );
    });

    // TODO:: need to find a way to mock a folder drop
    /* it('should filter folders out from the file list in removeDroppedFolders', async () => {
        const wrapper = setup();

        const fileA = getMockFile('a.txt');
        fileA.slice = () => true;
        const fileB = getMockFile('droppedFolder');
        fileB.slice = () => false;
        const fileC = getMockFile('c.txt');
        fileC.slice = () => true;

        const accepted = [fileA, fileB, fileC];
        const errors = [];

        wrapper.instance().readFile = jest.fn((file, errors, resolve) => {
            file.slice() ? resolve(file) : resolve(false);
        });

        await expect(wrapper.instance().removeDroppedFolders(accepted, errors)).resolves.toEqual([fileA, false, fileC]);
    }); */

    it('should set all error messages', async () => {
        const fileADoc = new File(['hello'], 'a.doc');
        const fileBDup = new File(['hello'], 'b.txt');
        const fileC = new File(['hello'], 'c.txt');
        const fileD = new File(['hello'], 'web_d.txt');
        const fileE = new File(['hellomaxsize'], 'e.txt');
        const fileF = new File(['hello'], 'f.txt');
        const fileG = new File(['hello'], 'g.txt');
        const fileGDoc = new File(['hello'], 'g.doc');
        const onDropFn = jest.fn();
        const { getByTestId } = setup({
            fileUploadLimit: 4,
            maxSize: 5,
            filesInQueue: ['a.txt', 'b.txt'],
            onDrop: onDropFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION,
            mimeTypeWhitelist: { txt: 'text/plain' },
        });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [fileBDup, fileC, fileD, fileE, fileF, fileG, fileADoc, fileGDoc],
                types: ['Files', 'Files', 'Files', 'Files', 'Files', 'Files', 'Files'],
            },
        });

        await new Promise(r => setTimeout(r, 50));

        const expectedError = {
            tooBigFiles: ['e.txt'],
            notFiles: [],
            sameFileNameWithDifferentExt: ['g.doc', 'a.doc'],
            invalidFileNames: ['web_d.txt'],
            invalidMimeTypeFiles: [],
            duplicateFiles: ['b.txt'],
            tooManyFiles: ['g.txt'],
        };

        expect(onDropFn).toHaveBeenCalledWith(
            [
                { fileData: fileC, name: 'c.txt', size: 5 },
                { fileData: fileF, name: 'f.txt', size: 5 },
            ],
            expectedError,
        );
    });

    it('should set all correct error messages for filenames with comma', async () => {
        const fileG = new File(['hello'], 'g.txt');
        const fileA = new File(['hello'], 'i,am.txt');
        const fileH = new File(['hello'], 'excel,txt');
        const fileI = new File(['hello'], 'excel,xls.txt');
        const onDropFn = jest.fn();

        const { getByTestId } = setup({
            fileUploadLimit: 4,
            filesInQueue: [],
            onDrop: onDropFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION,
            mimeTypeWhitelist: { txt: 'text/plain' },
        });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [fileG, fileA, fileH, fileI],
                types: ['Files', 'Files', 'Files', 'Files'],
            },
        });

        await new Promise(r => setTimeout(r, 50));

        const expectedError = {
            tooBigFiles: [],
            notFiles: [],
            sameFileNameWithDifferentExt: [],
            invalidFileNames: ['i,am.txt', 'excel,txt', 'excel,xls.txt'],
            invalidMimeTypeFiles: [],
            duplicateFiles: [],
            tooManyFiles: [],
        };

        expect(onDropFn).toHaveBeenCalledWith([{ fileData: fileG, name: 'g.txt', size: 5 }], expectedError);
    });

    /*
    it('should call onerror if fail on read file', () => {
        const wrapper = setup();
        const result = wrapper.instance().onReadFileError(
            { name: 'test' },
            [],
            jest.fn(result => result),
        )();
        expect(result).toBeFalsy();

        const file = wrapper.instance().onReadFileLoad({ name: 'test' }, jest.fn())();
        expect(file).toBeUndefined();
    });*/

    it('should allow multipart zip files with valid part format (000 - 999)', () => {
        const fileA = getMockFile('test.000.zip');
        const fileB = getMockFile('test.111.zip');
        const fileC = getMockFile('test.999.zip');
        const fileD = getMockFile('test.abc.zip');
        const fileE = getMockFile('test.89.zip');
        const fileF = getMockFile('test.222.zip');
        const fileG = getMockFile('test.0123.zip');

        const files = [fileA, fileB, fileC, fileD, fileE, fileF, fileG];

        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(4);
        expect(invalidFileNames.length).toEqual(3);
    });

    it('should allow multipart zip mime type files with part format', async () => {
        const fileA = new File(['hello'], 'test.000.zip');
        const fileB = new File(['hello'], 'test.part1.zip');
        const fileC = new File(['hello'], 'test.r00.zip');
        const onDropFn = jest.fn();

        const { getByTestId } = setup({
            onDrop: onDropFn,
            mimeTypeWhitelist: MIME_TYPE_WHITELIST,
        });

        fireEvent.drop(getByTestId('fez-datastream-info-input'), {
            dataTransfer: {
                files: [fileA, fileB, fileC],
                types: ['Files', 'Files', 'Files'],
            },
        });

        await new Promise(r => setTimeout(r, 50));

        expect(onDropFn).toHaveBeenCalledWith(
            [
                { fileData: fileA, name: 'test.000.zip', size: 5 },
                { fileData: fileB, name: 'test.part1.zip', size: 5 },
                { fileData: fileC, name: 'test.r00.zip', size: 5 },
            ],
            expect.objectContaining({ invalidMimeTypeFiles: [] }),
        );
    });

    it('should allow multipart zip files with valid part format (r01 - r999)', () => {
        const fileA = getMockFile('test.r00.zip');
        const fileB = getMockFile('test.r11.zip');
        const fileC = getMockFile('test.r9.zip');
        const fileD = getMockFile('test.abc.zip');
        const fileE = getMockFile('test.89.zip');
        const fileF = getMockFile('test.r222.zip');
        const fileG = getMockFile('test.r0222.zip');

        const files = [fileA, fileB, fileC, fileD, fileE, fileF, fileG];

        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(4);
    });

    it('should allow multipart zip files with valid part format (part1 - part999)', () => {
        const fileA = getMockFile('test.part1.zip');
        const fileB = getMockFile('test.part8888.zip');
        const fileC = getMockFile('test.part342.zip');
        const fileD = getMockFile('test.part33.zip');
        const fileE = getMockFile('test.rpart89.zip');

        const files = [fileA, fileB, fileC, fileD, fileE];

        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(2);
    });

    it('should allow multipart zip files with valid part format (part1 - part999)', () => {
        const fileA = getMockFile('test.part1.zip');
        const fileB = getMockFile('test.part8888.zip');
        const fileC = getMockFile('test.part342.zip');
        const fileD = getMockFile('test.part33.zip');
        const fileE = getMockFile('test.rpart89.zip');

        const files = [fileA, fileB, fileC, fileD, fileE];

        const { validFiles, invalidFileNames } = removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(2);
    });
});
