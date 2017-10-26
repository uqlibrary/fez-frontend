jest.dontMock('./DoiCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DoiCitationView from './DoiCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';
import {researchReport} from 'mock/data/testing/records';


function setup({doi, isShallow = true}) {
    const props = {
        doi: doi
    };

    if(isShallow) {
        return shallow(<DoiCitationView {...props} />);
    }

    return mount(<DoiCitationView {...props} />, {
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

describe('DoiCitationView test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with doi', () => {
        const wrapper = setup({doi: '10.121212/lskdjflsdjf', isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
