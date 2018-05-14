jest.dontMock('./ConferenceProceedingsCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ConferenceProceedingsCitation from './ConferenceProceedingsCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

import {conferenceProceedings} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if (isShallow) {
        return shallow(<ConferenceProceedingsCitation {...props} />);
    }

    return mount(<ConferenceProceedingsCitation {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {

});

describe('ConferenceProceedingsCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({publication: conferenceProceedings});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const wrapper = setup({ publication: {...conferenceProceedings, fez_record_search_key_doi: {rek_doi: null}} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
