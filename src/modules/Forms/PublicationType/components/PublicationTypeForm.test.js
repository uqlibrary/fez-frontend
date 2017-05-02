jest.dontMock('./PublicationTypeForm');

import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';
import Divider from 'material-ui/Divider';

import PublicationTypeForm from './PublicationTypeForm';
import {publicationTypeList} from '../../../../mock/data/publicationTypes';

let popularTypesResult = [];
let popularTypesList = [];
let app;

describe('Document type form integration tests', () => {
    beforeEach(() => {
        popularTypesResult = [
            {'id': 174, 'name': 'Book'},
            {'id': 177, 'name': 'Book Chapter'},
            {'id': 130, 'name': 'Conference Paper'},
            {'id': 179, 'name': 'Journal Article'}
        ];

        popularTypesList = ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'];

        const props = {
            helpTitle: 'Help Title',
            helpText: 'Lorem Ipsum',
            title: 'Component Title',
            publicationTypeList: Immutable.fromJS(publicationTypeList),
            loadPublicationTypes: jest.fn(),
            popularTypesList: popularTypesList
        };

        app = shallow(<PublicationTypeForm {...props} />);
    });

    it('test the createPopularTypesList function', () => {
        expect(app.instance().createPopularTypesList(popularTypesList, Immutable.fromJS(publicationTypeList))).toEqual(popularTypesResult);
    });

    it('test the addListDivider function', () => {
        // check if we get an empty array back
        expect(app.instance().addListDivider([])).toEqual([]);

        // check if we get the divider added to the array
        const resultTestList = popularTypesResult;
        resultTestList.push({'id': 'divider', 'divider': <Divider key="divider"/>});

        // check that the divider is added
        expect(app.instance().addListDivider(popularTypesResult)).toEqual(resultTestList);

        // check that a non-array type does not have the divider added
        expect(app.instance().addListDivider(Immutable.fromJS(publicationTypeList))).toEqual(Immutable.fromJS(publicationTypeList));
    });

    it('test the mergeLists function', () => {
        const resultTestList = popularTypesResult.concat(popularTypesResult);
        expect(app.instance().mergeLists(popularTypesResult, Immutable.fromJS(popularTypesResult))).toEqual(resultTestList);
    });
});
