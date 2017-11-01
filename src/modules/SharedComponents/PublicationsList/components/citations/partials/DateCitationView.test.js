jest.dontMock('./DateCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DateCitationView from './DateCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';


function setup({date, isShallow = false}) {
    const props = {
        date: date, // : PropTypes.object.isRequired,
    };

    if(isShallow) {
        return shallow(<DateCitationView {...props} />);
    }

    return mount(<DateCitationView {...props} />, {
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

describe('DateCitationView test ', () => {
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

    it('should render component with date in newspaperArticle format', () => {
        const testObject = {
            'rek_date': '2017-07-01T00:00:00Z',
            'format' : 'newspaperArticle'
        };
        const wrapper = setup({ date: testObject.rek_date, format: testObject.format });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date invalid date format', () => {
        const testObject = {
            'rek_date': 'BLA BLA BLA'
        };
        const wrapper = setup({ date: testObject.rek_date });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with TZ date and custom prefix and suffix', () => {
        const testObject = {
            'rek_date': '2017-07-01T00:00:00Z',
            'prefix': '[',
            'suffix': '].'
        };
        const wrapper = setup({ date: testObject.rek_date, prefix: testObject.prefix, suffix: testObject.suffix });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
