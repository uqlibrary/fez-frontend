jest.dontMock('./JournalArticleCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import JournalArticleCitation from './JournalArticleCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {locale} from 'config';
import {claimedPublications} from 'mock/data/publications';
import {externalTitleSearchResultsList} from 'mock/data/search/external';


function setup({publication, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<JournalArticleCitation {...props} />);
    }

    return mount(<JournalArticleCitation {...props} />, {
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

describe('JournalArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: claimedPublications.data[0] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock external search record', () => {
        const wrapper = setup({ publication: externalTitleSearchResultsList.data[0] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with all items in the record', () => {
        const publication = {
            rek_pid: 'UQ:1111',
            rek_title: 'Test journal article title',
            fez_record_search_key_publisher: { rek_publisher: 'Test Publisher' },
            fez_record_search_key_journal_name: { rek_journal_name: 'Test journal name' },
            fez_record_search_key_author: [
                { rek_author: 'Smith, A', rek_author_order: 1},
                { rek_author: 'Smith, B', rek_author_order: 2},
                { rek_author: 'Smith, C', rek_author_order: 3}],
            fez_record_search_key_volume_number: { rek_volume_number: 'v1' },
            fez_record_search_key_issue_number: { rek_issue_number: 'issue 1' },
            fez_record_search_key_start_page: { rek_start_page: '1' },
            fez_record_search_key_end_page: { rek_end_page: '100' },
            fez_record_search_key_doi: { rek_doi: '10.0000/xxx0000000'}
        }
        const wrapper = setup({ publication });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
