jest.dontMock('./ExternalLink');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ExternalLink from './ExternalLink';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({text, isShallow = false, ...rest}) {
    if(isShallow) {
        return shallow(<ExternalLink {...rest}>{text}</ExternalLink>);
    }

    return mount(<ExternalLink {...rest}>{text}</ExternalLink>, {
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

describe('ExternalLink test ', () => {
    it('should render component with open-in-new window icon', () => {
        const wrapper = setup({href: 'www.google.com', text: 'Google'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without open-in-new window icon', () => {
        const wrapper = setup({href: 'www.google.com', text: 'Google', openInNewIcon: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
