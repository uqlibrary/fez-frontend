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


function setup({prefix, suffix, citationClass, citation, isShallow = true}) {
    const props = {
        prefix: prefix || '', // : PropTypes.string,
        suffix: suffix || '', // : PropTypes.string,
        citationClass: citationClass || '', // : PropTypes.string,
    };

    if(isShallow) {
        return shallow(<CitationView {...props}>{citation}</CitationView>);
    }

    return mount(<CitationView {...props}>{citation}</CitationView>, {
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

describe('CitationView renders ', () => {
    it('component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with correct props', () => {
        const wrapper = setup({prefix: ' ', suffix: ':', citationClass: 'citationClassName', citation: 'Some text', isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with correct suffix', () => {
        const wrapper = setup({prefix: ' ', suffix: '.', citationClass: 'citationClassName', citation: 'Some text.', isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
