jest.dontMock('./PublicationSearchForm');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationSearchForm from './PublicationSearchForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {locale} from 'locale';


function setup({isShallow = true}){

    const props = {
        locale: locale.pages.addRecord.step1
    };

    if(isShallow) {
        return shallow(<PublicationSearchForm {...props} />);
    }

    return mount(<PublicationSearchForm {...props} />, {
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

describe('PublicationSearchForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });
});
