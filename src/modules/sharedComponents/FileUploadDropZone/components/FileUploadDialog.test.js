jest.dontMock('./FileUploadDialog');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import FileUploadDialog from './FileUploadDialog';

let app;
let increaseStep;
let uploadFile;
let closeDialog;
let cancelUpload;

function setup(fileList, stepperIndex = 2) {
    const acceptedFiles = fileList || [
        {
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        },
        {
            name: 's12345678_test_file_boot.iso',
            size: 241172480,
        }
    ];

    increaseStep = sinon.spy();
    uploadFile = sinon.spy();
    closeDialog = sinon.spy();
    cancelUpload = sinon.spy();

    const props = {
        acceptedFiles: acceptedFiles,
        form: 'testForm',
        isDialogOpen: true,
        isUploadCompleted: false,
        cancelUpload,
        closeDialog,
        decreaseStep: jest.fn(),
        increaseStep,
        openDialog: jest.fn(),
        reset: jest.fn(),
        resetSteps: jest.fn(),
        resetState: jest.fn(),
        showSnackbar: jest.fn(),
        uploadFile,
        stepperIndex,
        uploadProgress: {}
    };
    app = shallow(<FileUploadDialog {...props} />);
}

describe('File upload dialog unit tests', () => {
    it('updates the currentStep state', () => {
        // test if the ADD_FILE_DETAILS_STEP state is set
        setup();
        app.instance().setCurrentStep();
        expect(app.state('currentStep')).toEqual('ADD_FILE_DETAILS_STEP');

        // test if the GETTING_STARTED_STEP state is set
        app.instance().setCurrentStep();
        expect(app.state('currentStep')).toEqual('GETTING_STARTED_STEP');

        // test if the GETTING_STARTED_STEP state is set
        app.setState({currentStep: 'ADD_FILE_DETAILS_STEP' });
        app.instance().setCurrentStep('backwards');
        expect(app.state('currentStep')).toEqual('GETTING_STARTED_STEP');
    });

    it('returns the next button function', () => {
        // test if the the state is progressed
        setup();
        app.setState({currentStep: 'GETTING_STARTED_STEP'});
        app.instance().getNextButtonFunc();
        expect(app.state('currentStep')).toEqual('ADD_FILE_DETAILS_STEP');

        // test if the upload function is returned
        app.setState({currentStep: 'ADD_FILE_DETAILS_STEP'});
        app.instance().getNextButtonFunc();
        expect(uploadFile.calledOnce).toEqual(true);

        // test if the close function is returned
        setup([]);
        app.setState({currentStep: 'ADD_FILE_DETAILS_STEP'});
        app.instance().getNextButtonFunc();
        expect(closeDialog.calledOnce).toEqual(true);
    });

    it('returns the previous button function', () => {
        // test if the close function is returned
        setup();
        app.setState({currentStep: 'GETTING_STARTED_STEP'});
        app.instance().getPreviousButtonFunc();
        expect(closeDialog.calledOnce).toEqual(true);

        // test if the cancel function is returned
        setup([]);
        app.setState({currentStep: 'ADD_FILE_DETAILS_STEP'});
        app.instance().getPreviousButtonFunc();
        expect(cancelUpload.calledOnce).toEqual(true);

        const fileList = [
            {
                name: 's12345678_test_file_archive.zip',
                size: 5307669356,
                type: 'application/zip'
            },
            {
                name: 's12345678_test_file_boot.iso',
                size: 241172480,
            }
        ];

        // test if the state GETTING_STARTED_STEP is set
        setup(fileList, 0);
        app.setState({currentStep: 'ADD_FILE_DETAILS_STEP'});
        app.instance().getPreviousButtonFunc();
        expect(app.state('currentStep')).toEqual('GETTING_STARTED_STEP');

        // test the default case
        setup();
        app.setState({currentStep: 'SOME_STEP' });
        app.instance().getPreviousButtonFunc();
        expect(app.state('currentStep')).toEqual('SOME_STEP');
    });
});

