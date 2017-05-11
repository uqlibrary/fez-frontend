jest.dontMock('./ClaimPublicationRow');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import ClaimPublicationRow from './ClaimPublicationRow';
import {externalDoiSearchResultList} from '../../../../mock/data/publicationSearch';

function setup(ds) {
    const props = {
        entry: Immutable.fromJS(ds[0])
    };
    return shallow(<ClaimPublicationRow {...props} />);
}

describe('Publication row results snapshots tests', () => {
    it('renders default publication row', () => {
        const app = setup(externalDoiSearchResultList);
        expect(toJson(app)).toMatchSnapshot();
    });
});
