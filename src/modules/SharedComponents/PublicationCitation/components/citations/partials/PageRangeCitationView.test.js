jest.dontMock('./PageRangeCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PageRangeCitationView from './PageRangeCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {conferencePaper} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if (isShallow) {
        return shallow(<PageRangeCitationView {...props} />);
    }

    return mount(<PageRangeCitationView {...props} />, {
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

describe('PageRangeCitationView test ', () => {
    it('should render nothing if search key not found', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage only', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 11
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render endPage only', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_end_page: {
                    rek_end_page: 11
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage to endPage', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 17
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage only if end page is empty', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13
                },
                fez_record_search_key_end_page: {}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
