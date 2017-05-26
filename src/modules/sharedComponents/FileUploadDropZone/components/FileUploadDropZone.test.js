jest.dontMock('./FileUploadDropZone');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import FileUploadDropZone from './FileUploadDropZone';

let showSnackbar;
let app;

describe('File upload dropzone unit tests', () => {
    beforeEach(() => {
        showSnackbar = sinon.spy();

        const props = {
            form: 'testForm',
            openDialog: jest.fn(),
            showSnackbar: showSnackbar
        };
        app = shallow(<FileUploadDropZone {...props} />);
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

        const {validFiles, invalidFiles} = app.instance().validateNumberOfFiles(fileList, []);

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

        const {filesToUpload, filesToReject} = app.instance().validateFilenameFormat(fileList, []);

        expect(filesToUpload.length).toEqual(2);
        expect(filesToReject.length).toEqual(3);
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
