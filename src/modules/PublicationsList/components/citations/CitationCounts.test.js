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

function _citationId(citationSource) {
    let location = '';
    if(citationSource === 'wos') {
        if(this.props.publication.fez_record_search_key_isi_loc && this.props.publication.fez_record_search_key_isi_loc.rek_isi_loc) {
            location = this.props.publication.fez_record_search_key_isi_loc.rek_isi_loc;
        }
    } else if (citationSource === 'scopus') {
        if(this.props.publication.fez_record_search_key_scopus_id && this.props.publication.fez_record_search_key_scopus_id.rek_scopus_id) {
            location = this.props.publication.fez_record_search_key_scopus_id.rek_scopus_id;
        }
    } else if (citationSource === 'altmetric') {
        if(this.props.publication.rek_altmetric_id) {
            location = this.props.publication.rek_altmetric_id;
        }
    }
    return location;
}

function setup({publication, citationId=jest.fn(), isShallow = true}) {

    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
        citationId: citationId
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
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693
            }
        };
        const wrapper = setup({publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.citationCount').length).toEqual(6);
    });

    it('component with non rendering oa status', () => {
        const publication = {
            rek_pid: 'pid:111',
            rek_thomson_citation_count: 1,
            rek_scopus_citation_count: 1,
            rek_gs_citation_count: 1,
            rek_altmetric_score: 1,
            fez_record_search_key_oa_status: {
                rek_oa_status: 453698
            }
        };
        const wrapper = setup({publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.citationCount').length).toEqual(5);
    });
});
