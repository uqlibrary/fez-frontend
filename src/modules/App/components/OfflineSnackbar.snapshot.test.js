jest.dontMock('../components/OfflineSnackbar');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import OfflineSnackbar from '../components/OfflineSnackbar';

function setup({...props}) {
    return shallow(<OfflineSnackbar {...props} />);
}

describe('OfflineSnackbar snapshots test', () => {

    const locale = {
        online: {
            open: true,
            message: 'Online',
            autoHideDuration: 5000
        },
        offline: {
            open: true,
            message: 'Offline',
        }
    };

    it('renders empty component', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({online: true, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders offline snackbar', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({online: false, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders back online snackbar', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({online: true, hasDisconnected: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
