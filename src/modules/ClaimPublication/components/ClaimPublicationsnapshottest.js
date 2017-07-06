jest.dontMock('./ClaimPublication');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import ClaimPublication from './ClaimPublication';
import {claimPublication} from 'mock/data/claimPublication';

// TODO: rename this test back to ClaimPublication.snapshot.test

function setup(ds) {
    const account = {
        firstName: 'Isaac',
        id: 'uqinewton',
        lastName: 'NEWTON',
        mail: 'i.neweton@uq.edu.au',
        name: 'Isaac Newton',
        type: 3
    };

    const props = {
        claimPublicationResults: Immutable.fromJS(ds),
        loadUsersPublications: jest.fn(),
        markPublicationsNotMine: jest.fn(),
        account,
        dispatch: jest.fn(),
        loadingSearch: false
    };
    return shallow(<ClaimPublication {...props} />);
}

describe('Add record page snapshots tests', () => {
    it('renders default add record page', () => {
        const app = setup(claimPublication);
        expect(toJson(app)).toMatchSnapshot();
    });
});
