jest.dontMock('./AuthorsCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorsCitationView from './AuthorsCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';

function setup({publication, prefix, suffix, className, initialNumberOfAuthors = 10, thresholdNumberOfAuthors = 3, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
        prefix: prefix,
        suffix: suffix,
        className: className || '',
        initialNumberOfAuthors: initialNumberOfAuthors,
        thresholdNumberOfAuthors: thresholdNumberOfAuthors,

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
        expect(wrapper.find('.empty').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set class on component with no authors', () => {
        const wrapper = setup({className: 'myClass'});
        expect(wrapper.find('.myClass.empty').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 1 author', () => {
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

    it('should render component with 2 authors', () => {
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

    it('should render component with 3 authors', () => {
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

    it('should render component with 3 authors with prefix/suffix', () => {
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

    it('should render component with 10 authors and show more link', () => {
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
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.', thresholdNumberOfAuthors: 0});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().hasMoreAuthors).toEqual(true);
        expect(wrapper.state().toggleShowMoreLink).toEqual(true);
        expect(wrapper.state().authors.length).toEqual(12);
        expect(wrapper.find('.citationAuthor').length).toEqual(10);
        expect(wrapper.find('.citationShowMoreAuthors').length).toEqual(1);
        expect(wrapper.find('.citationShowMoreAuthors').text()).toEqual('Show 2 more...');

        wrapper.instance()._toggleShowMore({preventDefault: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().toggleShowMoreLink).toEqual(false);
        expect(wrapper.find('.citationAuthor').length).toEqual(12);
        expect(wrapper.find('.citationShowMoreAuthors').text()).toEqual('Show less');
    });

    it('should render component with exactly 10 authors', () => {
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
                }
            ]
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.',});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().hasMoreAuthors).toEqual(false);
        expect(wrapper.state().toggleShowMoreLink).toEqual(false);
        expect(wrapper.state().authors.length).toEqual(10);
        expect(wrapper.find('.citationAuthor').length).toEqual(10);
        expect(wrapper.find('.citationShowMoreAuthors').length).toEqual(0);
    });

    it('should render component with 10 authors (8 initial number and threshold 2)', () => {
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
                }
            ]
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.', initialNumberOfAuthors: 8, thresholdNumberOfAuthors: 2});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().hasMoreAuthors).toEqual(false);
        expect(wrapper.state().toggleShowMoreLink).toEqual(false);
        expect(wrapper.state().authors.length).toEqual(10);
        expect(wrapper.find('.citationAuthor').length).toEqual(10);
        expect(wrapper.find('.citationShowMoreAuthors').length).toEqual(0);
    });

    it('should render component with 3 authors with prefix/suffix without changing original data structure', () => {
        const testObject = {
            "fez_record_search_key_author": [
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Pedroso, Marcelo Monteiro",
                    "rek_author_order": 3
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Smith, J",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 2
                }
            ]
        };

        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testObject).toEqual({
            "fez_record_search_key_author": [
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Pedroso, Marcelo Monteiro",
                    "rek_author_order": 3
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Smith, J",
                    "rek_author_order": 1
                },
                {
                    "rek_author_id": null,
                    "rek_author_pid": "UQ:678742",
                    "rek_author": "Andersen, J",
                    "rek_author_order": 2
                }
            ]
        });
    });
});
