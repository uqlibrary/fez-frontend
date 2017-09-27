jest.dontMock('./CitationCounts');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import CitationCounts from './CitationCounts';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {myRecordsList} from 'mock/data';

function setup({publication, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<CitationCounts {...props} />);
    }

    return mount(<CitationCounts {...props} />, {
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

describe('CitationCounts renders ', () => {
    it('component with no metrics', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock record metrics', () => {
        const wrapper = setup({ publication: myRecordsList.data[0] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with all metrics', () => {
        const publication = {
            rek_pid: 'pid:111',
            rek_thomson_citation_count: 1,
            rek_scopus_citation_count: 1,
            rek_gs_citation_count: 1,
            rek_altmetric_score: 1,
            fez_record_search_key_oa_status: []
        };
        const wrapper = setup({publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.citationCount').length).toEqual(6);
    });
});
