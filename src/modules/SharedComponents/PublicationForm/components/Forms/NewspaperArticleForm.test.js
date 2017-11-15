jest.dontMock('./NewspaperArticleForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import NewspaperArticleForm from './NewspaperArticleForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({submitting, subtypeVocabId, isShallow = true}){

    const props = {
        submitting: submitting || false, // : PropTypes.bool,
    };

    if(isShallow) {
        return shallow(<NewspaperArticleForm {...props} />);
    }

    return mount(<NewspaperArticleForm {...props} />, {
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

describe('NewspaperArticleForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 8 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(8);
    });

    it('component with 6 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(5);
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });
});
