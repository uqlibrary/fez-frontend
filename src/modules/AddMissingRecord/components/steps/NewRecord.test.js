import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import NewRecord from './NewRecord';

function setup(values) {
    return shallow(<NewRecord {...values}/>);
}

describe('Add new record', () => {
    it('should render stepper and a publication form', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const wrapper = setup({history: {}});
        const showConfirmation = jest.fn();
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmation
        };

        wrapper.instance()._recordSaved();
        expect(showConfirmation).toBeCalled();
    });

    it.skip('should navigate to find publication', () => {
        const navigateToRecordSearch = jest.fn();
        const history = {
            push: navigateToRecordSearch
        };

        const wrapper = setup({history: history});
        wrapper.instance()._restartWorkflow();

        expect(navigateToRecordSearch).toBeCalled();
    });

    it('should navigate to dashboard', () => {
        const navigateToDashboard = jest.fn();
        const history = {
            push: navigateToDashboard
        };

        const wrapper = setup({history: history});
        wrapper.instance()._navigateToDashboard();

        expect(navigateToDashboard).toBeCalled();
    });

    it('should restart workflow', () => {
        const navigateToSearch = jest.fn();
        const history = {
            push: navigateToSearch
        };

        const wrapper = setup({history: history});
        wrapper.instance()._restartWorkflow();

        expect(navigateToSearch).toBeCalled();
    });
});
