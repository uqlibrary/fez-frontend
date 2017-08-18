jest.dontMock('./ContributorRow');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ContributorRow from './ContributorRow';

function setup({index, contributor,
    canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDelete, showIdentifierLookup,
    showContributorAssignment, onContributorAssigned, contributorSuffix, disabled}){

    const props = {
        index: index, // PropTypes.number.isRequired,
        contributor: contributor || { nameAsPublished: 'A. Smith'}, // PropTypes.object.isRequired,
        canMoveUp, // PropTypes.bool,
        canMoveDown, // PropTypes.bool,
        onMoveUp, // PropTypes.func,
        onMoveDown, // PropTypes.func,
        onDelete, // PropTypes.func,
        showIdentifierLookup, // PropTypes.bool,
        showContributorAssignment, // PropTypes.bool,
        onContributorAssigned, // PropTypes.func,
        contributorSuffix, // PropTypes.string,
        disabled // PropTypes.bool
    };

    return shallow(<ContributorRow {...props} />);
}

describe('ContributorRow renders ', () => {
    it('a row with index and contributor set', () => {
        const wrapper = setup({index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
