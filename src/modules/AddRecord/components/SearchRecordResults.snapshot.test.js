import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SearchRecordResults from './SearchRecordResults';

function setup(values) {
    return shallow(<SearchRecordResults {...values}/>);
}

describe('Search record results', () => {
    it('should render stepper and a publication list with', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should navigate to find on cancel workflow', () => {
        const cancelWorkflow = jest.fn();
        const history = {
            push: cancelWorkflow
        };

        const wrapper = setup({history: history});
        wrapper.instance()._cancelWorkflow();
        expect(cancelWorkflow).toBeCalled();
    });

    it('should navigate to new publication form', () => {
        const navigateToNewPublicationForm = jest.fn();
        const history = {
            push: navigateToNewPublicationForm
        };

        const wrapper = setup({history: history});
        wrapper.instance()._showNewRecordForm();

        expect(navigateToNewPublicationForm).toBeCalled();
    });

    it('should go to claim publication form with given record', () => {
        const navigateToClaimPublication = jest.fn();
        const setClaimPublication = jest.fn();

        const actions = {
            setClaimPublication: setClaimPublication
        };

        const history = {
            push: navigateToClaimPublication
        };

        const wrapper = setup({history: history, actions: actions});
        wrapper.instance()._claimPublication();

        expect(setClaimPublication).toBeCalled();
        expect(navigateToClaimPublication).toBeCalled();
    })
});
