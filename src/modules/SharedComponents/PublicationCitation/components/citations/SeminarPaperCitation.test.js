jest.dontMock('./SeminarPaperCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import SeminarPaperCitation from './SeminarPaperCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

import {seminarPaper} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<SeminarPaperCitation {...props} />);
    }

    return mount(<SeminarPaperCitation {...props} />, {
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

describe('SeminarPaperCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: seminarPaper });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
