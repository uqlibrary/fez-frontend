jest.dontMock('./Metadata');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import {documentAccessTypes} from 'mock/data/documentAccessTypes';
import Metadata from './Metadata';

const accessConditionId = 3;

function setup(ds, stepperIndex) {
    const file = {
        name: 's12345678_test_file_archive.zip',
        size: 'application/pdf',
        type: 5307669356
    };

    const props = {
        dataSource: ds,
        stepperIndex,
        file,
        handleSubmit: jest.fn(),
        form: 'testForm',
        formValues: Immutable.fromJS({'filesAccessConditions-0': accessConditionId})
    };
    return shallow(<Metadata {...props} />);
}

describe('File upload metadata snapshots tests', () => {
    it('renders default file upload metadata component', () => {
        const app = setup(documentAccessTypes, 0);
        expect(toJson(app)).toMatchSnapshot();
    });

    it('sets the previous button to decreaseStep function', () => {
        const app = setup(documentAccessTypes, 1);
        expect(toJson(app)).toMatchSnapshot();
    });
});
