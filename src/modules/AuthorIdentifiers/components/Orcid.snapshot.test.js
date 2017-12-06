jest.mock('js-cookie', () => {
    function get(something) {
        return something || 'test'
    }

    return {
        get: get
    }
});

jest.dontMock('./Orcid');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Orcid from './Orcid';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({author, history, actions, location, account, isShallow = false}) {
    const props = {
        author: author || {aut_id: 410},
        actions: actions || {},
        history: history || {},
        location: location || {},
        account: account || {firstName: 'Test', lastName: 'Last'}
    };

    if(isShallow) {
        return shallow(<Orcid {...props} />);
    }

    return mount(<Orcid {...props} />, {
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


describe('Component Orcid ', () => {
    it('should render claim publication form', () => {
        const wrapper = setup({});
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should open confirmation dialog box for link orcid', () => {
        const wrapper = setup({history: {}});
        const showConfirmation = jest.fn();
        wrapper.instance().authoriseConfirmationBox = {
            showConfirmation: showConfirmation
        };

        wrapper.instance()._confirmLinkOrcid();
        expect(showConfirmation).toBeCalled();
    });

    it('should open confirmation dialog box for create orcid', () => {
        const wrapper = setup({history: {}});
        const showConfirmation = jest.fn();
        wrapper.instance().authoriseConfirmationBox = {
            showConfirmation: showConfirmation
        };

        wrapper.instance()._confirmCreateOrcid();
        expect(showConfirmation).toBeCalled();
    });
});
