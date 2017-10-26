jest.dontMock('./YearCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import YearCitationView from './YearCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';


function setup({date, isShallow = true}) {
    const props = {
        date: date, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<YearCitationView {...props} />);
    }

    return mount(<YearCitationView {...props} />, {
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

describe('YearCitationView test ', () => {
    it('should render component with no date', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date not in TZ format', () => {
        const testObject = {
            'rek_date': '2010-08-01 00:00:00'
        };
        const wrapper = setup({ date: testObject.rek_date });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date in TZ format', () => {
        const testObject = {
            'rek_date': '2017-07-01T00:00:00Z'
        };
        const wrapper = setup({ date: testObject.rek_date });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date invalid date format', () => {
        const testObject = {
            'rek_date': 'BLA BLA BLA'
        };
        const wrapper = setup({ date: testObject.rek_date });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
