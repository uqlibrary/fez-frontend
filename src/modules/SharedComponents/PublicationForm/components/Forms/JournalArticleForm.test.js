jest.dontMock('./JournalArticleForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import JournalArticleForm from './JournalArticleForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({submitting, vocabId, isShallow = true}){

    const props = {
        submitting: submitting || false, // : PropTypes.bool,
        vocabId: vocabId || 0, // : PropTypes.number
    };

    if(isShallow) {
        return shallow(<JournalArticleForm {...props} />);
    }

    return mount(<JournalArticleForm {...props} />, {
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

describe('JournalArticleForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with 5 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(5);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });
});
