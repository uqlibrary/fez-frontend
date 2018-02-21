jest.dontMock('./ThesisForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ThesisForm from './ThesisForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({submitting, vocabId, isShallow = true}){

    const props = {
        submitting: submitting || false, // : PropTypes.bool,
        vocabId: vocabId || 0, // : PropTypes.number
    };

    if(isShallow) {
        return shallow(<ThesisForm {...props} />);
    }

    return mount(<ThesisForm {...props} />, {
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

describe('ThesisForm ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should normalize total pages field', () => {
        const wrapper = setup({});
        expect(wrapper.instance().getNumbersOnly('Four')).toBe('');
        expect(wrapper.instance().getNumbersOnly('12Three')).toBe('12');
        expect(wrapper.instance().getNumbersOnly('  01Three')).toBe('01');
        expect(wrapper.instance().getNumbersOnly('124')).toBe('124');
    })

    it('should render component with 12 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('should render component with 7 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(6);
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });
});
