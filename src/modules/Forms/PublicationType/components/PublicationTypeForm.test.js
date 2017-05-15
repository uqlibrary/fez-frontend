jest.dontMock('./PublicationTypeForm');

import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';
import Divider from 'material-ui/Divider';

import PublicationTypeForm from './PublicationTypeForm';
import {publicationTypeList} from '../../../../mock/data/publicationTypes';

let popularTypesResult = [];
let popularTypesList = [];

describe('Document type form integration tests', () => {
    function setup(dataSource = Immutable.fromJS(publicationTypeList)) {
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
            dataSource: dataSource,
            loadPublicationTypes: jest.fn(),
            formValues: Immutable.fromJS({publicationType: 179}),
            popularTypesList: popularTypesList
        };

        return shallow(<PublicationTypeForm {...props} />);
    }

    it('tests the createPopularTypesList function', () => {
        const app = setup();
        expect(app.instance().createPopularTypesList(popularTypesList, Immutable.fromJS(publicationTypeList))).toEqual(popularTypesResult);
    });

    it('tests the addListDivider function', () => {
        const app = setup();
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

    it('tests the mergeLists function', () => {
        const app = setup();
        const resultTestList = popularTypesResult.concat(popularTypesResult);
        expect(app.instance().mergeLists(popularTypesResult, Immutable.fromJS(popularTypesResult))).toEqual(resultTestList);
    });

    it('tests the createCompletePublicationList function', () => {
        const app = setup();
        let resultTestList = popularTypesResult;
        resultTestList.push({'id': 'divider', 'divider': <Divider key="divider"/>});
        resultTestList = resultTestList.concat(publicationTypeList);

        expect(app.instance().createCompletePublicationList()).toEqual(resultTestList);

        // test for an empty data source
        const appEmptyDS = setup(Immutable.fromJS([]));
        expect(appEmptyDS.instance().createCompletePublicationList()).toEqual([]);
    });
});