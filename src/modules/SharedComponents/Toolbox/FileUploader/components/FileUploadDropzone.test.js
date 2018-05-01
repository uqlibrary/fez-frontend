import FileUploadDropzone from './FileUploadDropzone';

function setup(testProps, isShallow = true) {
    const props = {
        onDrop: jest.fn(),
        locale: {},
        maxSize: 1000,
        fileNameRestrictions: /.+/,
        ...testProps,
    };
    return getElement(FileUploadDropzone, props, isShallow);
}

describe('Component FileUploadDropzone', () => {
    let getMockFile;

    beforeEach(() => {
        const _File = window.File;
        const FILE = (data = [''], name) => new _File(data, name, {lastModified: 12345678912});
        window.File = jest.fn((data, name) => FILE(data, name));
        getMockFile = (name) => new File([''], name);
    });

    it('should render component with default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({disabled: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should open files selection dialog', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();

        const testFn = jest.fn();

        wrapper.find('FileUploadDropzone').instance().dropzoneRef.open = testFn;
        wrapper.find('FileUploadDropzone').instance()._onKeyPress();

        wrapper.update();
        expect(testFn).toHaveBeenCalled();
    });

    it('should remove duplicate files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt', 'c.txt']);

        expect(uniqueFiles.length).toEqual(1);
        expect(duplicateFiles.length).toEqual(1);
    });

    it('should not remove any files if there are no duplicate files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files', () => {
        const wrapper = setup({});

        const files = [];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(0);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should remove files with invalid names', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt')];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(1);
        expect(invalidFileNames.length).toEqual(1);
    });

    it('should not remove any files if there are no invalid names of files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('a.txt')];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(2);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied', () => {
        const wrapper = setup({});

        const files = [];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(0);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should remove files exceeding max allowed number of files in removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 2);

        expect(limitedFiles.length).toEqual(2);
        expect(tooManyFiles.length).toEqual(1);
    });

    it('should not remove any files if number doesn\'t exceed max allowed number of files in removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 4);

        expect(limitedFiles.length).toEqual(3);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied to removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 3);

        expect(limitedFiles.length).toEqual(0);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should filter folders out from the file list in removeDroppedFolders', async () => {
        const wrapper = setup({});

        const file_a = getMockFile('a.txt');
        file_a.slice = (x, y) => true;
        const file_b = getMockFile('droppedFolder');
        file_b.slice = (x, y) => false;
        const file_c = getMockFile('c.txt');
        file_c.slice = (x, y) => true;

        const accepted = [file_a, file_b, file_c];
        const errors = [];

        wrapper.instance().readFile = jest.fn((file, errors, resolve) => {
            file.slice() ? resolve(file) : resolve(false);
        });

        await expect(wrapper.instance().removeDroppedFolders(accepted, errors)).resolves.toEqual([file_a, false, file_c]);
    });

    it('should set all error messages', async () => {
        const file_a = getMockFile('a.txt');
        const file_b = getMockFile('b.txt');
        const file_b_dup = getMockFile('b.txt');
        const file_c = getMockFile('c.txt');
        const file_d = getMockFile('web_d.txt');
        const file_e = getMockFile('e.txt');
        const file_f = getMockFile('f.txt');
        const file_g = getMockFile('g.txt');
        const onDropTestFn = jest.fn();

        const wrapper = setup({
            fileUploadLimit: 4,
            filesInQueue: [file_a.name, file_b.name],
            onDrop: onDropTestFn,
            fileNameRestrictions: /^(?=^\S*$)(?=^[^\.]+\.[^\.]+$)(?=.{1,45}$)(?!(web_|preview_|thumbnail_|stream_|fezacml_|presmd_))[a-z][a-z\d\-_\.]+/
        });

        const expectedFiles = [file_c, file_f].map(file => ({fileData: file, name: file.name, size: file.size}));
        const expectedError = {
            tooBigFiles: ['e.txt'],
            notFiles: [],
            invalidFileNames: ['web_d.txt'],
            duplicateFiles: ['b.txt'],
            tooManyFiles: ['g.txt']
        };

        const accepted = [file_b_dup, file_c, file_d, file_f, file_g];
        wrapper.instance().removeDroppedFolders = jest.fn((accepted, {}) => new Promise(resolve => resolve([file_b_dup, file_c, file_d, file_f, file_g])));

        await wrapper.instance()._onDrop(accepted, [file_e]);
        // wrapper.update();
        expect(onDropTestFn).toHaveBeenCalledWith(expectedFiles, expectedError);
    });
});
