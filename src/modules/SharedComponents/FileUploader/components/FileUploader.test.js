jest.dontMock('./FileUploader');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import {locale} from 'config';
import FileUploader from './FileUploader';
import Immutable from 'immutable';

let showSnackbar;
let app;

describe('File upload dropzone unit tests', () => {
    beforeEach(() => {
        const data = {};
        const metadata = locale.sharedComponents.files.fields.metadata;

        data[metadata.description] = 'test file description';
        data[metadata.accessCondition] = 1;
        data[metadata.embargoDate] = 'Thu May 25 2017 00:00:00 GMT+1000 (AEST)';

        const fileData = {
            file: {
                name: 's12345678_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        };

        const fileMetadata = Immutable.fromJS(Object.assign({}, fileData, data));

        showSnackbar = sinon.spy();

        const props = {
            form: 'testForm',
            openDialog: jest.fn(),
            setAcceptedFileList: jest.fn(),
            initializeDialog: jest.fn(),
            showSnackbar,
            fileMetadata
        };

        app = shallow(<FileUploader {...props} />);
    });

    it('validates the number of valid and invalid files', () => {
        const fileList = [
            {
                name: 's123456781_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456782_test_file_boot.iso',
                size: 241172480,
            },
            {
                name: 's123456783_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456784_test_file_boot.iso',
                size: 241172480,
            },
            {
                name: 's123456785_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456786_test_file_boot.iso',
                size: 241172480,
            },
            {
                name: 's123456787_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456788_test_file_boot.iso',
                size: 241172480,
            },
            {
                name: 's123456789_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's1234567810_test_file_boot.iso',
                size: 241172480,
            },
            {
                name: 's1234567811_test_file_boot.iso',
                size: 241172480,
            }
        ];

        const [validFiles, invalidFiles] = app.instance().validateNumberOfFiles(fileList, []);

        expect(validFiles.length).toEqual(10);
        expect(invalidFiles.length).toEqual(1);
    });

    it('validates the files names', () => {
        const fileList = [
            {
                name: '123456781_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456782_test_file_boot.jpg.iso',
                size: 241172480,
            },
            {
                name: 's123456783_test_file_archivehakljsdhfklasdh flkasdfhklsa=afaskdjfaskldfhj.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 'this_is_my_test_file_this_is_my_test_file_this_is_my_test_file.iso',
                size: 241172480,
            },
            {
                name: 's123456785_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        const [validFiles, invalidFiles] = app.instance().validateFilenameFormat(fileList, []);

        expect(validFiles.length).toEqual(2);
        expect(invalidFiles.length).toEqual(3);
    });

    it('opens the dialog', () => {
        const fileList = [
            {
                name: '123456781_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's123456782_test_file_boot.jpg.iso',
                size: 241172480,
            },
            {
                name: 's123456783_test_file_archivehakljsdhfklasdh flkasdfhklsa=afaskdjfaskldfhj.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 'this_is_my_test_file_this_is_my_test_file_this_is_my_test_file.iso',
                size: 241172480,
            },
            {
                name: 's123456785_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        app.instance().openDialog(fileList, []);
        expect(showSnackbar.calledOnce).toEqual(true);
    });

    it('fails to open the dialog', () => {
        app.instance().openDialog([], []);
        expect(showSnackbar.calledOnce).toEqual(true);
    });
});
