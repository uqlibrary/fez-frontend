jest.dontMock('./ClaimPublicationForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ClaimPublicationForm from './ClaimPublicationForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {journalArticle} from 'mock/data/testing/records';

function setup({initialValues, isShallow = true}){

    const props = {
        initialValues: initialValues ? Immutable.Map(initialValues) : Immutable.Map({})
    };

    if(isShallow) {
        return shallow(<ClaimPublicationForm {...props} />);
    }

    return mount(<ClaimPublicationForm {...props} />, {
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


describe('ClaimPublicationForm renders ', () => {
    it('all fields ', () => {
        const wrapper = setup({initialValues:{publication: Immutable.Map(journalArticle), author: Immutable.Map({})}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('only citation and error message', () => {
        journalArticle.fez_record_search_key_author_id[0].rek_author_id = 410;
        const wrapper = setup({initialValues:{publication: Immutable.Map(journalArticle), author: Immutable.Map({aut_id: 410})}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
