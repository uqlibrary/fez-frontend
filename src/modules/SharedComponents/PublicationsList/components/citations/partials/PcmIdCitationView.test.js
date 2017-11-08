jest.dontMock('./PcmIdCitationView');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PcmIdCitationView from './PcmIdCitationView';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({pcmId, isShallow = false}) {
    const props = {
        pcmId: pcmId
    };

    if(isShallow) {
        return shallow(<PcmIdCitationView {...props} />);
    }

    return mount(<PcmIdCitationView {...props} />, {
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

describe('PcmIdCitationView test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with pcmId', () => {
        const wrapper = setup({pcmId: 'PCM12345677'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
