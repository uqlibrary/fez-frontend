jest.dontMock('./PublicationTypeForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import PublicationTypeForm from './PublicationTypeForm';

function setup() {
    const publicationSubTypeList = [
        {'id': 1, 'label': 'Article (original research)'},
        {'id': 2, 'label': 'Critical review of research, literature review, critical commentary'},
        {'id': 3, 'label': 'Letter to editor, brief commentary or brief communication'},
        {'id': 4, 'label': 'Correction/erratum'},
        {'id': 5, 'label': 'Review of book, film, TV, video, software, performance, music etc ...'},
        {'id': 6, 'label': 'Editorial'},
        {'id': 7, 'label': 'Discussion - respones, round table/panel discussions. Q&A, reply'},
        {'id': 8, 'label': 'Creative work'},
        {'id': 9, 'label': 'Others'}
    ];

    const props = {
        helpTitle: 'Help Title',
        helpText: 'Lorem Ipsum',
        title: 'Component Title',
        publicationTypeList: Immutable.fromJS(publicationSubTypeList),
        loadPublicationTypes: jest.fn()
    };

    return shallow(<PublicationTypeForm {...props} />);
}


describe('Document type form integration tests', () => {
    it('renders default document type component', () => {
        const app = setup();
        app.setState({selectedId: 3});
        const tree = toJson(app);
        expect(tree).toMatchSnapshot();
    });
});
