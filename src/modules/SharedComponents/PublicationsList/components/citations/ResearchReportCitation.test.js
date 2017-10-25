jest.dontMock('./ResearchReportCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ResearchReportCitation from './ResearchReportCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {researchReport} from 'mock/data/testing/records';


function setup({publication, isShallow = true}) {
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
    injectTapEventPlugin();
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
        const wrapper = setup({ publication: researchReport, isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
