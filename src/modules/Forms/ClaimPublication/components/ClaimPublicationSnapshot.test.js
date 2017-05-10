jest.dontMock('./ClaimPublicationForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ClaimPublicationForm from './ClaimPublicationForm';

function setup() {
    const props = {
        history: {},
        cancelThisPublicationClaim: jest.fn(),
        claimThisPublication: jest.fn()
    };
    return shallow(<ClaimPublicationForm {...props} />);
}


describe('Document type form integration tests', () => {
    it('renders default document type component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
