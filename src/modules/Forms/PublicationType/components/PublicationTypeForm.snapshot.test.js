jest.dontMock('./PublicationTypeForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import PublicationTypeForm from './PublicationTypeForm';
import {publicationTypeList} from 'mock/data/publicationTypes';

function setup() {
    const popularTypesList = ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'];

    const props = {
        helpTitle: 'Help Title',
        helpText: 'Lorem Ipsum',
        title: 'Component Title',
        dataSource: Immutable.fromJS(publicationTypeList),
        loadPublicationTypes: jest.fn(),
        formValues: Immutable.fromJS({publicationType: 179}),
        popularTypesList: popularTypesList
    };

    return shallow(<PublicationTypeForm {...props} />);
}


describe('Document type form snapshot tests', () => {
    it('renders default document type component', () => {
        const app = setup();
        app.setState({selectedId: 3});
        const tree = toJson(app);
        expect(tree).toMatchSnapshot();
    });
});
