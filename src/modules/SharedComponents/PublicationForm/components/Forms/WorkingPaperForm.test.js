jest.dontMock('./WorkingPaperForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import WorkingPaperForm from './WorkingPaperForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({submitting, isShallow = true}){

    const props = {
        submitting: submitting || false, // : PropTypes.bool
    };

    if(isShallow) {
        return shallow(<WorkingPaperForm {...props} />);
    }

    return mount(<WorkingPaperForm {...props} />, {
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

describe('WorkingPaperForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(11);
    });

    it('component with 3 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(2);
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
        expect(wrapper.instance().getNumbersOnly('Four')).toBe('');
        expect(wrapper.instance().getNumbersOnly('12Three')).toBe('12');
        expect(wrapper.instance().getNumbersOnly('  01Three')).toBe('01');
        expect(wrapper.instance().getNumbersOnly('124')).toBe('124');
    })
});
