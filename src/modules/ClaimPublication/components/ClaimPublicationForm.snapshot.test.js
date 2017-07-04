jest.dontMock('./ClaimPublicationForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ClaimPublicationForm from './ClaimPublicationForm';
import {claimPublication} from 'mock/data/claimPublication';

function setup(ds) {
    const props = {
        history: {},
        entry: ds.rows[0]
    };
    return shallow(<ClaimPublicationForm {...props} />);
}


describe('Claim publication page test', () => {
    it('renders default claim publication test', () => {
        const app = setup(claimPublication);
        expect(toJson(app)).toMatchSnapshot();
    });
});
