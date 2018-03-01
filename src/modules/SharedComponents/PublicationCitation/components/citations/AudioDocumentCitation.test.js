jest.dontMock('./AudioDocumentCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AudioDocumentCitation from './AudioDocumentCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {audioDocument} from 'mock/data/testing/records';


function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<AudioDocumentCitation {...props} />);
    }

    return mount(<AudioDocumentCitation {...props} />, {
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

describe('AudioDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: audioDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const wrapper = setup({ publication: {...audioDocument, fez_record_search_key_doi: {}} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
