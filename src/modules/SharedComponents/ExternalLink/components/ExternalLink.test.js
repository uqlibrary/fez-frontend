jest.dontMock('./ExternalLink');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ExternalLink from './ExternalLink';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({linkText, linkUrl = 'www.google.com', linkTooltip, externalLinkIcon = true, className = 'externalLink', isShallow = false}) {
    const props = {
        linkText: linkText,
        linkUrl: linkUrl,
        linkTooltip: linkTooltip,
        externalLinkIcon: externalLinkIcon,
        className: className
    };

    if(isShallow) {
        return shallow(<ExternalLink {...props} />);
    }

    return mount(<ExternalLink {...props} />, {
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
        const wrapper = setup({linkUrl: 'www.google.com', linkText: 'Google'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component without open-in-new window icon', () => {
        const wrapper = setup({linkUrl: 'www.google.com', linkText: 'Google', externalLinkIcon: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
