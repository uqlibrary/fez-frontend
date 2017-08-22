jest.dontMock('./ContributorRow');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ContributorRow from './ContributorRow';
import {authorsSearch} from 'mock/data/authors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import spy from 'sinon';

function setup({index, contributor,
    canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDelete, showIdentifierLookup,
    showContributorAssignment, disabledContributorAssignment, onContributorAssigned,
    contributorSuffix, disabled, isShallow = true}){

    const props = {
        index: index, // PropTypes.number.isRequired,
        contributor: contributor || { nameAsPublished: 'A. Smith'}, // PropTypes.object.isRequired,
        canMoveUp: canMoveUp || false, // PropTypes.bool,
        canMoveDown: canMoveDown || false, // PropTypes.bool,
        onMoveUp, // PropTypes.func,
        onMoveDown, // PropTypes.func,
        onDelete, // PropTypes.func,
        showIdentifierLookup: showIdentifierLookup || false, // PropTypes.bool,
        showContributorAssignment: showContributorAssignment || false, // PropTypes.bool,
        disabledContributorAssignment: disabledContributorAssignment || false, //: PropTypes.bool,
        onContributorAssigned, // PropTypes.func,
        contributorSuffix, // PropTypes.string,
        disabled: disabled || false // PropTypes.bool
    };

    if(isShallow) {
        return shallow(<ContributorRow {...props} />);
    }

    return mount(<ContributorRow {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });

}


beforeAll(() => {
    injectTapEventPlugin();
});

describe('ContributorRow renders ', () => {
    it('a row with index and contributor set, renders only name and delete button', () => {
        const wrapper = setup({index: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor with author details set, contributor author details, and delete button', () => {
        const contributor = {
            nameAsPublished: "J. Smith",
            ...authorsSearch[0]
        };
        const wrapper = setup({contributor, index: 0, showIdentifierLookup: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set, renders reorder buttons, contributor assignment, and delete button', () => {
        const wrapper = setup({index: 0, canMoveUp: true, canMoveDown: true, showContributorAssignment: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and contributor set calls move up function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveUp: true, onMoveUp: testFunction, isShallow: false});
        wrapper.instance()._onMoveUp();
        const button = wrapper.find('IconButton .reorderUp button');
        expect(button.length).toBe(1);
        expect(testFunction).toBeCalled();

        const buttonDown = wrapper.find('IconButton .reorderDown button');
        expect(buttonDown.length).toBe(0);
    });


    it('a row with index and contributor set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveDown: true, onMoveDown: testFunction, isShallow: false});

        const button = wrapper.find('IconButton .reorderDown button');
        expect(button.length).toBe(1);

        wrapper.instance()._onMoveDown();
        expect(testFunction).toBeCalled;

        const buttonUp = wrapper.find('IconButton .reorderUp button');
        expect(buttonUp.length).toBe(0);
        testFunction.mockReset();
    });

    it('a row with index and contributor set calls assignment function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, showContributorAssignment: true, onContributorAssigned: testFunction, isShallow: false});
        const checkbox = wrapper.find('Checkbox .contributorAssignment input');
        expect(checkbox.length).toBe(1);
        wrapper.instance()._onContributorAssigned();
        expect(testFunction).toBeCalled;
    });

    it('a row with index and contributor set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, onDelete: testFunction, isShallow: false});
        wrapper.instance()._deleteRecord();
        expect(toJson(wrapper)).toMatchSnapshot();
        const button = wrapper.find('IconButton .contributorDelete button');
        expect(button.length).toBe(1);
        expect(testFunction).toBeCalled;
    });
});
