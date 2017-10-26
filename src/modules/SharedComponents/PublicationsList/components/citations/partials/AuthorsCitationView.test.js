jest.dontMock('./AuthorsCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorsCitationView from './AuthorsCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {locale} from 'config';

function setup({publication, prefix, suffix, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
        prefix: prefix,
        suffix: suffix
    };

    if(isShallow) {
        return shallow(<AuthorsCitationView {...props} />);
    }

    return mount(<AuthorsCitationView {...props} />, {
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

describe('AuthorsCitationView test ', () => {
    it('should render component with no authors', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with one author', () => {
        const testObject = {
            "fez_record_search_key_author": [{
                "rek_author_id": null,
                "rek_author_pid": "UQ:678742",
                "rek_author": "Pedroso, Marcelo Monteiro",
                "rek_author_order": 1
            }]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with two authors', () => {
        const testObject = {
            "fez_record_search_key_author": [
                {
                "rek_author_id": null,
                "rek_author_pid": "UQ:678742",
                "rek_author": "Pedroso, Marcelo Monteiro",
                "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Smith, J",
                    "rek_author_order": 2
                }
            ]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with three authors', () => {
        const testObject = {
            "fez_record_search_key_author": [
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Pedroso, Marcelo Monteiro",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Smith, J",
                    "rek_author_order": 2
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 3
                }
            ]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with three authors with prefix/suffix', () => {
        const testObject = {
            "fez_record_search_key_author": [
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Pedroso, Marcelo Monteiro",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Smith, J",
                    "rek_author_order": 2
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 3
                }
            ]
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
