import { FileUploader } from './FileUploader';
import { FILE_NAME_RESTRICTION, MIME_TYPE_WHITELIST } from '../config';
import FileUploaderContainer from './FileUploader';
const moment = require('moment');

const getProps = (testProps = {}) => ({
    fileRestrictionsConfig: {
        fileUploadLimit: 5,
        maxFileSize: 1,
        fileSizeUnit: 'K',
        fileNameRestrictions: FILE_NAME_RESTRICTION,
        mimeTypeWhitelist: MIME_TYPE_WHITELIST,
    },
    filesInQueue: [],
    // locale: locale,
    fileNameRestrictions: /.+/,
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(FileUploader, getProps(testProps));
}

describe('Component FileUploader', () => {
    const getMockFile = name => ({ fileData: new File([''], name), name: name, size: 0 });
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        const _File = window.File;
        const FILE = (data = [''], name) => new _File(data, name, { lastModified: 12345678912 });
        window.File = jest.fn((data, name) => FILE(data, name));
        // getMockFile = (name) => ({fileData: new File([''], name), name: name, size: 0});
    });
    afterEach(() => {
        MockDate.reset();
    });

    it('should render default component', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should mount and unmount container and clear file uploader', () => {
        const wrapper = getElement(
            FileUploaderContainer,
            getProps({
                isNtro: true,
                fileRestrictionsConfig: {
                    fileUploadLimit: 5,
                    maxFileSize: 1,
                    fileSizeUnit: 'B',
                    fileNameRestrictions: FILE_NAME_RESTRICTION,
                },
            }),
            { isShallow: false },
        );
        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();

        wrapper.unmount();
        expect(tree).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({ disabled: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render rows for uploaded files', () => {
        const wrapper = setup();

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();

        const files = [getMockFile('a.txt'), getMockFile('b.txt')];

        wrapper.instance()._handleDroppedFiles(files, {});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        const fileDataA = wrapper.instance().state.filesInQueue[0].fileData;
        expect(fileDataA.name).toEqual('a.txt');
        const fileDataB = wrapper.instance().state.filesInQueue[1].fileData;
        expect(fileDataB.name).toEqual('b.txt');

        wrapper.instance()._deleteFile({}, 0);
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.instance().state.isTermsAndConditionsAccepted).toBeFalsy();

        wrapper.instance()._deleteAllFiles();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.instance().state.filesInQueue.length).toEqual(0);
    });

    it('should render rows for uploaded files with access required', () => {
        const wrapper = setup({ requireOpenAccessStatus: true });

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();

        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const files = [fileA, fileB];

        wrapper.instance()._handleDroppedFiles(files, {});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._updateFileAccessCondition(fileA, 0, 8);
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._updateFileAccessCondition(fileA, 0, 9);
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();

        fileA.access_condition_id = 9;
        wrapper.instance()._updateFileEmbargoDate(fileA, 0, moment('10/10/2017', 'DD/MM/YYYY'));
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render rows for uploaded files with default access condition based on quick template Id', () => {
        const wrapper = setup({ defaultQuickTemplateId: 3 });

        expect(toJson(wrapper)).toMatchSnapshot();

        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const files = [fileA, fileB];

        wrapper.instance()._handleDroppedFiles(files, {});
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
        const fileDataA = wrapper.instance().state.filesInQueue[0].fileData;
        expect(fileDataA.name).toEqual('a.txt');
        expect(fileDataA.lastModified).toEqual(12345678912);
    });

    it(
        'should render rows for uploaded files with access condition dropdown ' +
            'based on quick template Id and require open access',
        () => {
            const wrapper = setup({ defaultQuickTemplateId: 3, requireOpenAccessStatus: true });

            expect(toJson(wrapper)).toMatchSnapshot();

            const fileA = getMockFile('a.txt');
            const fileB = getMockFile('b.txt');
            const files = [fileA, fileB];

            wrapper.instance()._handleDroppedFiles(files, {});
            wrapper.update();

            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.instance().state.filesInQueue[0].fileData.name).toEqual('a.txt');
            expect(wrapper.instance().state.filesInQueue[1].fileData.name).toEqual('b.txt');
        },
    );

    it('should set max files error message', () => {
        const wrapper = setup({ fileRestrictionsConfig: { fileUploadLimit: 3 } });

        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const fileC = getMockFile('c.txt');

        const accepted = [fileA, fileB, fileC];

        wrapper.instance()._handleDroppedFiles(accepted, { tooManyFiles: ['d.txt'] });
        wrapper.update();
        expect(wrapper.state().errorMessage).toEqual(
            'Maximum number of files (3) has been exceeded. File(s) (d.txt) will not be uploaded',
        );
    });

    it('should not reset file access or embargo date info when second lot of files dropped', () => {
        const wrapper = setup();

        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const fileC = getMockFile('c.txt');
        const fileD = getMockFile('d.txt');

        wrapper.instance()._handleDroppedFiles([fileA, fileB], {});
        wrapper.update();
        const fileDataA = wrapper.instance().state.filesInQueue[0].fileData;
        expect(fileDataA.name).toEqual('a.txt');
        expect(fileDataA.lastModified).toEqual(12345678912);

        const fileDataB = wrapper.instance().state.filesInQueue[1].fileData;
        expect(fileDataB.name).toEqual('b.txt');
        expect(fileDataB.lastModified).toEqual(12345678912);

        wrapper.instance()._updateFileAccessCondition(fileA, 0, 9);
        wrapper.update();
        expect(wrapper.instance().state.filesInQueue[0].access_condition_id).toEqual(9);

        wrapper.instance()._updateFileAccessCondition(fileB, 1, 8);
        wrapper.update();
        expect(wrapper.instance().state.filesInQueue[1].access_condition_id).toEqual(8);

        wrapper.instance()._handleDroppedFiles([fileC, fileD], {});
        wrapper.update();
        const fileDataC = wrapper.instance().state.filesInQueue[2].fileData;
        expect(fileDataC.name).toEqual('c.txt');
        expect(fileDataC.lastModified).toEqual(12345678912);

        const fileDataD = wrapper.instance().state.filesInQueue[3].fileData;
        expect(fileDataD.name).toEqual('d.txt');
        expect(fileDataD.lastModified).toEqual(12345678912);
    });

    it(
        'should accept terms and condition and reset back to not accepted state if ' +
            'access condition changed back to closed access',
        () => {
            const wrapper = setup({ requireOpenAccessStatus: true });

            const fileA = getMockFile('a.txt');

            wrapper.instance()._handleDroppedFiles([fileA], {});
            wrapper.update();
            const fileData = wrapper.instance().state.filesInQueue[0].fileData;
            expect(fileData.name).toEqual('a.txt');
            expect(fileData.lastModified).toEqual(12345678912);

            wrapper.instance()._updateFileAccessCondition(fileA, 0, 9);
            wrapper.update();
            expect(wrapper.instance().state.filesInQueue[0].access_condition_id).toEqual(9);

            wrapper.instance()._acceptTermsAndConditions(true);
            wrapper.update();
            expect(wrapper.state().isTermsAndConditionsAccepted).toBeTruthy();

            wrapper.instance()._updateFileAccessCondition(fileA, 0, 8);
            wrapper.update();
            expect(wrapper.instance().state.filesInQueue[0].access_condition_id).toEqual(8);

            expect(wrapper.state().isTermsAndConditionsAccepted).toBeFalsy();
        },
    );

    it(
        'should return false if any file has open access with date ' +
            'selected but the terms and conditions not accepted',
        () => {
            const wrapper = setup({ requireOpenAccessStatus: true });

            const fileA = getMockFile('a.txt');
            fileA.access_condition_id = 8;
            const fileB = getMockFile('b.txt');
            fileB.access_condition_id = 9;
            fileB.date = '2017-01-01';
            const fileC = getMockFile('c.txt');
            fileC.access_condition_id = 8;
            const fileD = getMockFile('d.txt');
            fileD.access_condition_id = 8;

            wrapper.state().filesInQueue = [fileA, fileB, fileC, fileD];
            wrapper.state().isTermsAndConditionsAccepted = false;
            expect(wrapper.instance().isFileUploadValid(wrapper.state())).toBeFalsy();
        },
    );

    it('should return true on if all files are closed access', () => {
        const wrapper = setup({ requireOpenAccessStatus: true });

        const fileA = getMockFile('a.txt');
        fileA.access_condition_id = 8;
        const fileB = getMockFile('b.txt');
        fileB.access_condition_id = 8;
        const fileC = getMockFile('c.txt');
        fileC.access_condition_id = 8;
        const fileD = getMockFile('d.txt');
        fileD.access_condition_id = 8;

        wrapper.state().filesInQueue = [fileA, fileB, fileC, fileD];
        wrapper.state().isTermsAndConditionsAccepted = false;
        expect(wrapper.instance().isFileUploadValid(wrapper.state())).toBeTruthy();
    });

    it('should return true on if any file is open access with date selected and terms and conditions accepted', () => {
        const wrapper = setup({ requireOpenAccessStatus: true });

        const fileA = getMockFile('a.txt');
        fileA.access_condition_id = 8;
        const fileB = getMockFile('b.txt');
        fileB.access_condition_id = 9;
        fileB.date = '2017-01-01';
        const fileC = getMockFile('c.txt');
        fileC.access_condition_id = 8;
        const fileD = getMockFile('d.txt');
        fileD.access_condition_id = 8;

        wrapper.state().filesInQueue = [fileA, fileB, fileC, fileD];
        wrapper.state().isTermsAndConditionsAccepted = true;
        expect(wrapper.instance().isFileUploadValid(wrapper.state())).toBeTruthy();
    });

    it('should return false on if access condition is not selected for any files', () => {
        const wrapper = setup({ requireOpenAccessStatus: true, isTermsAndConditionsAccepted: false });

        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const fileC = getMockFile('c.txt');
        const fileD = getMockFile('d.txt');

        wrapper.state().filesInQueue = [fileA, fileB, fileC, fileD];
        expect(wrapper.instance().isFileUploadValid(wrapper.state())).toBeFalsy();
    });

    it('should get correct error message based on errors object', () => {
        const wrapper = setup();

        expect(
            wrapper.instance().getErrorMessage({
                tooManyFiles: ['a.txt', 'b.txt'],
                duplicateFiles: ['c.txt', 'd.txt'],
                invalidFileNames: ['web_a.txt'],
                invalidMimeTypeFiles: ['web_a.txt'],
                notFiles: ['someFolder'],
                tooBigFiles: ['big_file.txt'],
            }),
        ).toEqual(
            'Maximum number of files (5) has been exceeded. File(s) (a.txt, b.txt) will not be uploaded; File(s)' +
                ' (c.txt, d.txt) are duplicates and have been ignored; File(s) (web_a.txt) have invalid file name;' +
                ' File(s) (web_a.txt) are not supported; Invalid files (someFolder); File(s) (big_file.txt)' +
                ' exceed maximum allowed upload file size',
        );
    });

    it('should get empty string as an error message', () => {
        const wrapper = setup();
        expect(
            wrapper.instance().getErrorMessage({
                tooManyFiles: [],
                duplicateFiles: [],
                invalidFileNames: [],
                invalidMimeTypeFiles: [],
                notFiles: [],
                tooBigFiles: [],
            }),
        ).toEqual('');
    });

    it('should update', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({
            requireOpenAccessStatus: false,
            onChange: onChangeFn,
        });
        const fileA = getMockFile('a.txt');
        wrapper.setState({
            filesInQueue: [fileA],
        });
        wrapper.update();

        expect(onChangeFn).toHaveBeenCalled();
    });

    it('should keep terms and conditions as accepted on file delete if any of remaining files are open access', () => {
        const wrapper = setup();
        const fileA = getMockFile('a.txt');
        const fileB = getMockFile('b.txt');
        const fileC = getMockFile('c.txt');
        wrapper.setState({
            filesInQueue: [fileA, fileB, fileC],
            isTermsAndConditionsAccepted: true,
        });
        wrapper.instance().isAnyOpenAccess = jest.fn(() => true);
        wrapper.instance()._deleteFile(null, 1);
        expect(wrapper.state().isTermsAndConditionsAccepted).toBe(true);
    });
});
