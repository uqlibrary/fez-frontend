jest.dontMock('./DateCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DateCitationView from './DateCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';


function setup({date, format, prefix, suffix, isShallow = false}) {
    const props = {
        date: date,
        format: format,
        prefix: prefix,
        suffix: suffix
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

    it('should render component with date : [July 1st, 2017]', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: '[M] [D], [Y]', prefix: '[', suffix: ']' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default prefix and suffix : (1/6/2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: '[d]/[m]/[Y]' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with date : On the 1st day of June in 2017', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: 'On the [D] day of [M] in [Y]', prefix: '', suffix: '' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with a blank format, prefix and suffix', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: '', prefix: '', suffix: '' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with just the year in brackets : (2017).', () => {
        const wrapper = setup({ date: '2017-07-01T00:00:00Z', format: '[Y]'});
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
