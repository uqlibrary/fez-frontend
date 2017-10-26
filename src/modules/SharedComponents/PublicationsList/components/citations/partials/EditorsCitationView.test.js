jest.dontMock('./EditorsCitationView');
jest.dontMock('./AuthorsCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import EditorsCitationView from './EditorsCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({publication, isShallow = true}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<EditorsCitationView {...props} />);
    }

    return mount(<EditorsCitationView {...props} />, {
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

describe('EditorsCitationView test ', () => {
    it('should render component with no contributors', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with one contributor', () => {
        const testObject = {
            "fez_record_search_key_contributor": [{
                "rek_contributor_id": null,
                "rek_contributor_pid": "UQ:678742",
                "rek_contributor": "Pedroso, Marcelo Monteiro",
                "rek_contributor_order": 1
            }]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with two contributors', () => {
        const testObject = {
            "fez_record_search_key_contributor": [
                {
                "rek_contributor_id": null,
                "rek_contributor_pid": "UQ:678742",
                "rek_contributor": "Pedroso, Marcelo Monteiro",
                "rek_contributor_order": 1
                },
                {
                    "rek_contributor_id": null,
                    "rek_contributor_pid": "UQ:678742",
                    "rek_contributor": "Smith, J",
                    "rek_contributor_order": 2
                }
            ]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with three contributors', () => {
        const testObject = {
            "fez_record_search_key_contributor": [
                {
                    "rek_contributor_id": null,
                    "rek_contributor_pid": "UQ:678742",
                    "rek_contributor": "Pedroso, Marcelo Monteiro",
                    "rek_contributor_order": 1
                },
                {
                    "rek_contributor_id": null,
                    "rek_contributor_pid": "UQ:678742",
                    "rek_contributor": "Smith, J",
                    "rek_contributor_order": 2
                },
                {
                    "rek_contributor_id": null,
                    "rek_contributor_pid": "UQ:678742",
                    "rek_contributor": "Andersen, J",
                    "rek_contributor_order": 3
                }
            ]
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
