jest.dontMock('./PageCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PageCitationView from './PageCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {conferencePaper} from 'mock/data/testing/records';


function setup({publication, searchKey, className, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
        searchKey: searchKey,
        className: className
    };

    if (isShallow) {
        return shallow(<PageCitationView {...props} />);
    }

    return mount(<PageCitationView {...props} />, {
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

describe('PageCitationView test ', () => {
    it('should render component with a mock espace record', () => {
        const wrapper = setup({
            publication: conferencePaper,
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page'
            },
            className: 'citationPage'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('nothing if search key not found', () => {
        const wrapper = setup({
            publication: {},
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page'
            },
            className: 'citationPage'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
