jest.dontMock('./ResearchReportForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ResearchReportForm from './ResearchReportForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({submitting, isShallow = true}){

    const props = {
        submitting: submitting || false, // : PropTypes.bool
    };

    if(isShallow) {
        return shallow(<ResearchReportForm {...props} />);
    }

    return mount(<ResearchReportForm {...props} />, {
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

describe('ResearchReportForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with 4 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(3);
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should normalize total pages field', () => {
        const wrapper = setup({});
        expect(wrapper.instance().normalizeTotalPages('Four')).toBe('');
        expect(wrapper.instance().normalizeTotalPages('12Three')).toBe('12');
        expect(wrapper.instance().normalizeTotalPages('  01Three')).toBe('01');
        expect(wrapper.instance().normalizeTotalPages('124')).toBe('124');
    })
});
