jest.dontMock('./DataCollectionCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DataCollectionCitation from './DataCollectionCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {dataCollection} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<DataCollectionCitation {...props} />);
    }

    return mount(<DataCollectionCitation {...props} />, {
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

describe('DataCollectionCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: {...dataCollection}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with a missing title', () => {
        const wrapper = setup({ publication: {...dataCollection, rek_title: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with a missing date', () => {
        const wrapper = setup({ publication: {...dataCollection, rek_date: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with missing authors', () => {
        const wrapper = setup({ publication: {...dataCollection, fez_record_search_key_author: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with missing publisher', () => {
        const wrapper = setup({ publication: {...dataCollection, fez_record_search_key_publisher: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with missing document type', () => {
        const wrapper = setup({ publication: {...dataCollection, rek_display_type_lookup: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record with missing doi', () => {
        const wrapper = setup({ publication: {...dataCollection, fez_record_search_key_doi: null}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
