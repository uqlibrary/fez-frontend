jest.dontMock('./GettingStarted');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import GettingStarted from './GettingStarted';

let closeDialog;
let reset;

function setup() {
    closeDialog = sinon.spy();
    reset = sinon.spy();

    const props = {
        form: 'testForm',
        nextPage: jest.fn(),
        closeDialog,
        reset
    };
    return shallow(<GettingStarted {...props} />);
}

describe('File upload getting started unit tests', () => {
    it('closes cancels the file upload', () => {
        const app = setup();
        app.instance().cancelFileUpload();

        expect(closeDialog.calledOnce).toEqual(true);
        expect(reset.calledOnce).toEqual(true);
    });
});
