jest.dontMock('./CitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import CitationView from './CitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {researchReport} from 'mock/data/testing/records';


function setup({prefix, suffix, className, value, isShallow = false}) {
    const props = {
        prefix: prefix || ' ', // : PropTypes.string,
        suffix: suffix || '.', // : PropTypes.string,
        value: value,
        className: className || '', // : PropTypes.string,
    };

    if(isShallow) {
        return shallow(<CitationView {...props}/>);
    }

    return mount(<CitationView {...props} />, {
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

describe('CitationView test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with correct props', () => {
        const wrapper = setup({prefix: ' ', suffix: ':', className: 'citationClassName', value: 'Some text' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with correct suffix', () => {
        const wrapper = setup({prefix: ' ', suffix: '.', className: 'citationClassName', value: 'Some text.' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with no prefix or suffix', () => {
        const wrapper = setup({prefix: ' ', suffix: '.', className: 'citationClassName' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with no className', () => {
        const wrapper = setup({value: 'Some text.'});
        expect(toJson(wrapper)).toMatchSnapshot();
    })
});
