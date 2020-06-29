import { FileUploadDropzone } from './FileUploadDropzone';
import FileUploadDropzoneWithStyles from './FileUploadDropzone';
import { FILE_NAME_RESTRICTION, MIME_TYPE_WHITELIST } from '../config';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        classes: {},
        onDrop: jest.fn(),
        locale: {},
        maxSize: 1000,
        fileNameRestrictions: /.+/,
        mimeTypeWhitelist: MIME_TYPE_WHITELIST,
        ...testProps,
    };
    return getElement(FileUploadDropzone, props, args);
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
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({ disabled: true }, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should open files selection dialog', () => {
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
    });

    it('should remove duplicate files', () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const { uniqueFiles, duplicateFiles } = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt', 'c.txt']);

        expect(uniqueFiles.length).toEqual(1);
        expect(duplicateFiles.length).toEqual(1);
    });

    it('should remove files with same filename but different extension from dropped incoming files', () => {
        const wrapper = setup();

        const files = [getMockFile('a.txt'), getMockFile('a.doc'), getMockFile('b.txt')];
        const { uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt } = wrapper
            .instance()
            .removeDuplicate(files, []);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
        expect(sameFileNameWithDifferentExt.length).toEqual(1);
    });

    it(
        'should remove files with same filename but different extension ' +
            'from dropped incoming files and already queued files',
        () => {
            const wrapper = setup({});

            const queuedFiles = ['c.txt', 'd.txt', 'b.txt'];
            const files = [getMockFile('a.txt'), getMockFile('a.doc'), getMockFile('b.txt')];
            const { uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt } = wrapper
                .instance()
                .removeDuplicate(files, queuedFiles);

            expect(uniqueFiles.length).toEqual(1);
            expect(uniqueFiles).toEqual([getMockFile('a.txt')]);

            expect(duplicateFiles.length).toEqual(1);
            expect(duplicateFiles).toEqual(['b.txt']);

            expect(sameFileNameWithDifferentExt.length).toEqual(1);
            expect(sameFileNameWithDifferentExt).toEqual(['a.doc']);
        },
    );

    it(
        'should remove files with same filename but different extension from dropped ' +
            'incoming files and already queued files 2',
        () => {
            const wrapper = setup();

            const queuedFiles = ['c.txt', 'd.txt', 'b.txt'];
            const files = [getMockFile('a.doc'), getMockFile('d.txt'), getMockFile('b.txt')];
            const { uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt } = wrapper
                .instance()
                .removeDuplicate(files, queuedFiles);

            expect(uniqueFiles.length).toEqual(1);
            expect(uniqueFiles).toEqual([getMockFile('a.doc')]);

            expect(duplicateFiles.length).toEqual(2);
            expect(duplicateFiles).toEqual(['d.txt', 'b.txt']);

            expect(sameFileNameWithDifferentExt.length).toEqual(0);
        },
    );

    it('should not remove any files if there are no duplicate files', () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const { uniqueFiles, duplicateFiles } = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files', () => {
        const wrapper = setup();

        const files = [];
        const { uniqueFiles, duplicateFiles } = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(0);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should not remove any files if multipart zip files have been uploaded', () => {
        const wrapper = setup();

        const files = [getMockFile('a.001.zip'), getMockFile('a.002.zip')];
        const { uniqueFiles, duplicateFiles } = wrapper.instance().removeDuplicate(files, []);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should remove files with invalid names', () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('1.txt')];
        const { validFiles, invalidFileNames } = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(1);
        expect(invalidFileNames.length).toEqual(1);
    });

    it('should not remove any files if there are no invalid names of files', () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('a.txt')];
        const { validFiles, invalidFileNames } = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(2);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied', () => {
        const wrapper = setup();

        const files = [];
        const { validFiles, invalidFileNames } = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(0);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should remove files with invalid mime type', () => {
        const wrapper = setup();

        const files = [getMockFile('a.JPG'), getMockFile('b.txt')];
        const { validMimeTypeFiles, invalidMimeTypeFiles } = wrapper
            .instance()
            .removeInvalidMimeTypes(files, MIME_TYPE_WHITELIST);

        expect(validMimeTypeFiles.length).toEqual(1);
        expect(invalidMimeTypeFiles.length).toEqual(1);
    });

    it('should remove files exceeding max allowed number of files in removeTooManyFiles', () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const { limitedFiles, tooManyFiles } = wrapper.instance().removeTooManyFiles(files, 2);

        expect(limitedFiles.length).toEqual(2);
        expect(tooManyFiles.length).toEqual(1);
    });

    it("should not remove any files if number doesn't exceed max allowed number of files in removeTooManyFiles", () => {
        const wrapper = setup();

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const { limitedFiles, tooManyFiles } = wrapper.instance().removeTooManyFiles(files, 4);

        expect(limitedFiles.length).toEqual(3);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied to removeTooManyFiles', () => {
        const wrapper = setup();

        const files = [];
        const { limitedFiles, tooManyFiles } = wrapper.instance().removeTooManyFiles(files, 3);

        expect(limitedFiles.length).toEqual(0);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should filter folders out from the file list in removeDroppedFolders', async () => {
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
    });

    it('should set all error messages', async () => {
        const fileA = getMockFile('a.txt');
        const fileADoc = getMockFile('a.doc');
        const fileB = getMockFile('b.txt');
        const fileBDup = getMockFile('b.txt');
        const fileC = getMockFile('c.txt');
        const fileD = getMockFile('web_d.txt');
        const fileE = getMockFile('e.txt');
        const fileF = getMockFile('f.txt');
        const fileG = getMockFile('g.txt');
        const fileGDoc = getMockFile('g.doc');
        const onDropTestFn = jest.fn();

        const wrapper = setup({
            fileUploadLimit: 4,
            filesInQueue: [fileA.name, fileB.name],
            onDrop: onDropTestFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION,
            mimeTypeWhitelist: { txt: 'text/plain' },
        });

        const expectedFiles = [fileC, fileF].map(file => ({ fileData: file, name: file.name, size: file.size }));
        const expectedError = {
            tooBigFiles: ['e.txt'],
            notFiles: [],
            sameFileNameWithDifferentExt: ['g.doc', 'a.doc'],
            invalidFileNames: ['web_d.txt'],
            invalidMimeTypeFiles: [],
            duplicateFiles: ['b.txt'],
            tooManyFiles: ['g.txt'],
        };

        const accepted = [fileBDup, fileC, fileD, fileF, fileG, fileADoc, fileGDoc];
        wrapper.instance().removeDroppedFolders = jest.fn((accepted, {}) => new Promise(resolve => resolve(accepted)));

        await wrapper.instance()._onDrop(accepted, [fileE]);
        // wrapper.update();
        expect(onDropTestFn).toHaveBeenCalledWith(expectedFiles, expectedError);
    });

    it('should set all correct error messages for filenames with comma', async () => {
        const fileG = getMockFile('g.txt');
        const fileA = getMockFile('i,am.txt');
        const fileH = getMockFile('excel,txt');
        const fileI = getMockFile('excel,xls.txt');
        const onDropTestFn = jest.fn();

        const wrapper = setup({
            fileUploadLimit: 4,
            filesInQueue: [],
            onDrop: onDropTestFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION,
            mimeTypeWhitelist: { txt: 'text/plain' },
        });

        const expectedFiles = [fileG].map(file => ({ fileData: file, name: file.name, size: file.size }));
        const expectedError = {
            tooBigFiles: [],
            notFiles: [],
            sameFileNameWithDifferentExt: [],
            invalidFileNames: ['i,am.txt', 'excel,txt', 'excel,xls.txt'],
            invalidMimeTypeFiles: [],
            duplicateFiles: [],
            tooManyFiles: [],
        };

        const accepted = [fileG, fileA, fileH, fileI];
        wrapper.instance().removeDroppedFolders = jest.fn(
            (accepted, {}) => new Promise(resolve => resolve([fileG, fileA, fileH, fileI])),
        );

        await wrapper.instance()._onDrop(accepted, []);
        // wrapper.update();
        expect(onDropTestFn).toHaveBeenCalledWith(expectedFiles, expectedError);
    });

    it('should render with styles', () => {
        const wrapper = getElement(FileUploadDropzoneWithStyles, {
            onDrop: jest.fn(),
            maxSize: 8,
            locale: {},
            fileNameRestrictions: /.+/,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should read file', () => {
        const wrapper = setup();
        const readAsDataURLFn = jest.fn(slice => slice);
        window.FileReader = jest.fn(() => ({
            readAsDataURL: readAsDataURLFn,
        }));
        const result = wrapper.instance().readFile('this is test file', [], Promise.resolve);
        expect(result).toBe('this is te');
    });

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
    });

    it('should allow multipart zip files with valid part format (000 - 999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION,
        });

        const fileA = getMockFile('test.000.zip');
        const fileB = getMockFile('test.111.zip');
        const fileC = getMockFile('test.999.zip');
        const fileD = getMockFile('test.abc.zip');
        const fileE = getMockFile('test.89.zip');
        const fileF = getMockFile('test.222.zip');
        const fileG = getMockFile('test.0123.zip');

        const files = [fileA, fileB, fileC, fileD, fileE, fileF, fileG];

        const { validFiles, invalidFileNames } = wrapper
            .instance()
            .removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(4);
        expect(invalidFileNames.length).toEqual(3);
    });

    it('should allow multipart zip mime type files with part format', () => {
        const wrapper = setup();

        const fileA = getMockFile('test.000.zip');
        const fileB = getMockFile('test.part1.zip');
        const fileC = getMockFile('test.r00.zip');

        const files = [fileA, fileB, fileC];

        const { validMimeTypeFiles, invalidMimeTypeFiles } = wrapper
            .instance()
            .removeInvalidMimeTypes(files, MIME_TYPE_WHITELIST);

        expect(validMimeTypeFiles.length).toEqual(3);
        expect(invalidMimeTypeFiles.length).toEqual(0);
    });

    it('should allow multipart zip files with valid part format (r01 - r999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION,
        });

        const fileA = getMockFile('test.r00.zip');
        const fileB = getMockFile('test.r11.zip');
        const fileC = getMockFile('test.r9.zip');
        const fileD = getMockFile('test.abc.zip');
        const fileE = getMockFile('test.89.zip');
        const fileF = getMockFile('test.r222.zip');
        const fileG = getMockFile('test.r0222.zip');

        const files = [fileA, fileB, fileC, fileD, fileE, fileF, fileG];

        const { validFiles, invalidFileNames } = wrapper
            .instance()
            .removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(4);
    });

    it('should allow multipart zip files with valid part format (part1 - part999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION,
        });

        const fileA = getMockFile('test.part1.zip');
        const fileB = getMockFile('test.part8888.zip');
        const fileC = getMockFile('test.part342.zip');
        const fileD = getMockFile('test.part33.zip');
        const fileE = getMockFile('test.rpart89.zip');

        const files = [fileA, fileB, fileC, fileD, fileE];

        const { validFiles, invalidFileNames } = wrapper
            .instance()
            .removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(2);
    });

    it('should allow multipart zip files with valid part format (part1 - part999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION,
        });

        const fileA = getMockFile('test.part1.zip');
        const fileB = getMockFile('test.part8888.zip');
        const fileC = getMockFile('test.part342.zip');
        const fileD = getMockFile('test.part33.zip');
        const fileE = getMockFile('test.rpart89.zip');

        const files = [fileA, fileB, fileC, fileD, fileE];

        const { validFiles, invalidFileNames } = wrapper
            .instance()
            .removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(2);
    });
});
