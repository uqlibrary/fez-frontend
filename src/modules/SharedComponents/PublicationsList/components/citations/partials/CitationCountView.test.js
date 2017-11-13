jest.dontMock('./CitationCountView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import CitationCountView from './CitationCountView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {researchReport} from 'mock/data/testing/records';


function setup({source, count, link, title, isShallow = false}) {
    const props = {
        source: source,
        count: count,
        link: link,
        title: title
    };

    if(isShallow) {
        return shallow(<CitationCountView {...props} />);
    }

    return mount(<CitationCountView {...props} />, {
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

describe('CitationCountView test ', () => {
    it('should render component with given count', () => {
        const wrapper = setup({source: 'wos', count: 4, link: 'www.google.com', title: 'Google'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
