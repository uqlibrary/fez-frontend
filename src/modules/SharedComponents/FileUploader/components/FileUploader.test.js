jest.dontMock('./FileUploader');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import FileUploader from './FileUploader';
import Immutable from 'immutable';

let showSnackbar;
let setAcceptedFileList;
let app;

describe('File upload dropzone unit tests', () => {
    beforeEach(() => {
        const acceptedFiles = Immutable.fromJS([
            {
                name: 's12345678_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ]);

        showSnackbar = sinon.spy();
        setAcceptedFileList = sinon.spy();

        const props = {
            acceptedFiles,
            form: 'testForm',
            setAcceptedFileList,
            showSnackbar: showSnackbar
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

        const validFiles = app.instance().validateNumberOfFiles(fileList);

        expect(validFiles.length).toEqual(2);
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

        const validFiles = app.instance().validateFilenameFormat(fileList);

        expect(validFiles.length).toEqual(2);
    });

    it('filters out duplicate files', () => {
        let fileData = [
            {
                name: 's12345678_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        let validFiles = app.instance().validateFileDoesNotExist(fileData);

        expect(validFiles.length).toEqual(2);

        fileData = [
            {
                name: 'afile.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        validFiles = app.instance().validateFileDoesNotExist(fileData);

        expect(validFiles.length).toEqual(2);
    });

    it('sets the accepted list in the state', () => {
        const fileData = [
            {
                name: 'afile.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        app.instance().setAcceptedFileList(fileData);
        expect(setAcceptedFileList.calledOnce).toEqual(true);
    });

    it('fires the snackbar due to invalid filename', () => {
        const fileData = [
            {
                name: '1af ile.zip',
                size: 5307669356,
                type: 'application/zip'
            }
        ];

        app.instance().setAcceptedFileList(fileData);
        expect(setAcceptedFileList.calledOnce).toEqual(false);
        expect(showSnackbar.called).toEqual(true);
    });
});
