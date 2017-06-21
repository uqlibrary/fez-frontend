jest.dontMock('./PublicationTypeForm');

import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';
import Divider from 'material-ui/Divider';

import PublicationTypeForm from './PublicationTypeForm';
import {publicationTypeList} from 'mock/data/publicationTypes';

let typesList = [];
let popularTypesList = [];
let displayTypesList = [];

describe('Document type form integration tests', () => {
    function setup(dataSource = Immutable.fromJS(publicationTypeList)) {
        typesList = [
            {'id': 174, 'name': 'Book'},
            {'id': 177, 'name': 'Book Chapter'},
            {'id': 130, 'name': 'Conference Paper'},
            {'id': 179, 'name': 'Journal Article'}
        ];

        popularTypesList = ['Book', 'Book Chapter'];

        displayTypesList = [
            {'id': 174, 'name': 'Book'},
            {'id': 177, 'name': 'Book Chapter'},
            {'id': 0, 'name': 'divider'},
            {'id': 174, 'name': 'Book'},
            {'id': 177, 'name': 'Book Chapter'},
            {'id': 130, 'name': 'Conference Paper'},
            {'id': 179, 'name': 'Journal Article'}
        ];

        const props = {
            helpTitle: 'Help Title',
            helpText: 'Lorem Ipsum',
            title: 'Component Title',
            dataSource: dataSource,
            loadPublicationTypes: jest.fn(),
            formValues: Immutable.fromJS({publicationType: 179}),
            popularTypesList: popularTypesList
        };

        return shallow(<PublicationTypeForm {...props} />);
    }

    it('tests the createDisplayPublicationList function', () => {
        const app = setup();
        expect(app.instance().createDisplayPublicationList([], [])).toEqual([]);
        expect(app.instance().createDisplayPublicationList([], typesList)).toEqual(typesList);
        expect(app.instance().createDisplayPublicationList(popularTypesList, typesList)).toEqual(displayTypesList);
    });
});
