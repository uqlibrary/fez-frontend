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

function setup({publication, prefix, suffix, isShallow = false}) {
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

    it('should render component with ten authors and show more link', () => {
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
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 4
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 5
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 6
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 7
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 8
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 9
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 10
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 11
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 12
                }
            ]
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().showMore).toBeFalsy();
        expect(wrapper.find('.citationAuthor').length).toEqual(10);
        expect(wrapper.find('.citationShowMoreAuthors').length).toEqual(1);
        expect(wrapper.find('.citationShowMoreAuthors').text()).toEqual(' 2 more... ');

        wrapper.instance()._toggleShowMore();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().showMore).toBeTruthy();
        expect(wrapper.find('.citationAuthor').length).toEqual(12);
        expect(wrapper.find('.citationShowMoreAuthors').text()).toEqual(' Show less ');
    });
});
