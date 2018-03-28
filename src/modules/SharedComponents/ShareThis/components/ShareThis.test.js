jest.dontMock('./ShareThis');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ShareThis from './ShareThis';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import {myRecordsList} from 'mock/data';

function setup({publication, isShallow = false}) {

    const props = {
        show: PropTypes.bool || true
    };

    if(isShallow) {
        return shallow(<ShareThis {...props} />);
    }

    return mount(<ShareThis {...props} />, {
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

describe('CitationCounts renders ', () => {
    it('component with show true', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with show false', () => {
        const wrapper = setup({ show: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
