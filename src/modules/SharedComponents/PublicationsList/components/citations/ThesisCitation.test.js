jest.dontMock('./ThesisCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ThesisCitation from './ThesisCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {thesis} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<ThesisCitation {...props} />);
    }

    return mount(<ThesisCitation {...props} />, {
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

describe('ThesisCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: thesis });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view', () => {
        const wrapper = setup({
            publication: {
                ...thesis,
                fez_record_search_key_doi: {rek_doi: null}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
