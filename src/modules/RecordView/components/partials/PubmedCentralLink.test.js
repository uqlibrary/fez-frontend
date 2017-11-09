jest.dontMock('./PubmedCentralLink');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PubmedCentralLink from './PubmedCentralLink';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({pubmedCentralId, isShallow = false}) {
    const props = {
        pubmedCentralId: pubmedCentralId
    };

    if(isShallow) {
        return shallow(<PubmedCentralLink {...props} />);
    }

    return mount(<PubmedCentralLink {...props} />, {
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

describe('PubmedCentralLink test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with pubmedCentralId', () => {
        const wrapper = setup({pubmedCentralId: 'PMC12345677'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
