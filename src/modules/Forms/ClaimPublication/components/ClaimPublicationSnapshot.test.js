jest.dontMock('./ClaimPublicationForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import ClaimPublicationForm from './ClaimPublicationForm';
import {externalDoiSearchResultList} from '../../../../mock/data/publicationSearch';

function setup(ds) {
    const props = {
        history: {},
        cancelThisPublicationClaim: jest.fn(),
        claimThisPublication: jest.fn(),
        entry: Immutable.fromJS(ds[0])
    };
    return shallow(<ClaimPublicationForm {...props} />);
}


describe('Document type form integration tests', () => {
    it('renders default document type component', () => {
        const app = setup(externalDoiSearchResultList);
        expect(toJson(app)).toMatchSnapshot();
    });
});
