jest.dontMock('./PublicationsList');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationsList from './PublicationsList';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {locale} from 'config';
import {myRecordsList} from 'mock/data';


function setup({publicationsList, customActions, showDefaultActions, isShallow = true}) {
    const props = {
        publicationsList: publicationsList || [], // : PropTypes.array,
        customActions: customActions || [], // : PropTypes.array,
        showDefaultActions: showDefaultActions || false // : PropTypes.bool
    };

    if(isShallow) {
        return shallow(<PublicationsList {...props} />);
    }

    return mount(<PublicationsList {...props} />, {
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

describe('PublicationsList renders ', () => {
    it('empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with items', () => {
        const wrapper = setup({publicationsList: myRecordsList.data});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(22);
    });
});
