jest.dontMock('./GenericDocumentCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import GenericDocumentCitation from './GenericDocumentCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {generic} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<GenericDocumentCitation {...props} />);
    }

    return mount(<GenericDocumentCitation {...props} />, {
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

describe('GenericDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: generic });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty publisher and title', () => {
        const wrapper = setup({
            publication: {
                ...generic,
                fez_record_search_key_publisher: {rek_publisher: null},
                rek_title: null
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component when no title', () => {
        delete generic.rek_title;
        const wrapper = setup({
            publication: generic
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
