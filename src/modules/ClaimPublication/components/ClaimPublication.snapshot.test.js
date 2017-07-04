jest.dontMock('./ClaimPublication');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import ClaimPublication from './ClaimPublication';
import {externalDoiSearchResultList} from '../../../mock/data/publicationSearch';

function setup(ds) {
    const props = {
        claimPublicationResults: Immutable.fromJS(ds),
        loadUsersPublications: jest.fn(),
        markPublicationsNotMine: jest.fn()
    };
    return shallow(<ClaimPublication {...props} />);
}

describe('Add record page snapshots tests', () => {
    it('renders default add record page', () => {
        const app = setup(externalDoiSearchResultList);
        expect(toJson(app)).toMatchSnapshot();
    });
});
