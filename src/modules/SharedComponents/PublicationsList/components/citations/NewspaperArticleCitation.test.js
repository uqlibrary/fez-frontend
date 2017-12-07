jest.dontMock('./NewspaperArticleCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import NewspaperArticleCitation from './NewspaperArticleCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {newspaperArticle} from 'mock/data/testing/records';

function setup({publication, isShallow = false}) {
    const props = {
        publication: publication || {}, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<NewspaperArticleCitation {...props} />);
    }

    return mount(<NewspaperArticleCitation {...props} />, {
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

describe('NewspaperArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: newspaperArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty end page view', () => {
        const wrapper = setup({
            publication: {
                ...newspaperArticle,
                fez_record_search_key_end_page: {rek_end_page: null}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
