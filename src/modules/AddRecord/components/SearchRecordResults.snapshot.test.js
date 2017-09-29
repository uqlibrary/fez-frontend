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

    it('should redirect to find on cancel workflow', () => {
        const cancelWorkflow = jest.fn();
        const history = {
            push: cancelWorkflow
        };

        const wrapper = setup({history: history});
        wrapper.instance()._cancelWorkflow();
        expect(cancelWorkflow).toBeCalled();
    });

    it('should redirect to new publication form', () => {
        const goToNewPublicationForm = jest.fn();
        const history = {
            push: goToNewPublicationForm
        };

        const wrapper = setup({history: history});
        wrapper.instance()._showNewRecordForm();

        expect(goToNewPublicationForm).toBeCalled();
    });

    it('should go to claim publication form with given record', () => {
        const goToClaimPublication = jest.fn();
        const setClaimPublication = jest.fn();

        const actions = {
            setClaimPublication: setClaimPublication
        };

        const history = {
            push: goToClaimPublication
        };

        const wrapper = setup({history: history, actions: actions});
        wrapper.instance()._claimPublication();

        expect(setClaimPublication).toBeCalled();
        expect(goToClaimPublication).toBeCalled();
    })
});
