jest.dontMock('./ContributorRowHeader');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ContributorRowHeader from './ContributorRowHeader';

function setup({onDeleteAll, showIdentifierLookup, showContributorAssignment, disabled}){

    const props = {
        onDeleteAll: onDeleteAll || jest.fn(), // : PropTypes.func.isRequired,
        showIdentifierLookup: showIdentifierLookup || false, // : PropTypes.bool,
        showContributorAssignment: showContributorAssignment || false, // : PropTypes.bool,
        // locale, // : PropTypes.object,
        disabled: disabled || false // : PropTypes.bool
    };

    return shallow(<ContributorRowHeader {...props} />);
}

describe('ContributorRowHeader renders ', () => {

    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with all options', () => {
        const wrapper = setup({ showIdentifierLookup: true, showContributorAssignment: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
