jest.dontMock('./ResearchReportCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ResearchReportCitation from './ResearchReportCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

import {researchReport} from 'mock/data/testing/records';


function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<ResearchReportCitation {...props} />);
    }

    return mount(<ResearchReportCitation {...props} />, {
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

describe('ResearchReportCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: researchReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record 1', () => {
        const wrapper = setup({ publication: researchReport });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty series view', () => {
        const wrapper = setup({
            publication: {
                ...researchReport,
                fez_record_search_key_series: {rek_series: null}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
