jest.dontMock('./AddMissingRecord');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AddMissingRecord from './AddMissingRecord';
import * as routes from '../../../config/routes';

function setup({rawSearchQuery, author, location, actions, history, match, addRecordStep}){
    const props = {
        author: author || null,
        actions: actions || {},
        addRecordStep: addRecordStep || null,
        rawSearchQuery: rawSearchQuery || null,
        match: match || {},
        location: location || {},
        history: history || {}
    };
    return shallow(<AddMissingRecord {...props} />);
}

describe('Component AddMissingRecord', () => {

    it('method getStepperIndex should return step [0] and Stepper should render the 1st step', () => {
        const props = {
            location: { pathname: routes.pathConfig.records.add.find },
            addRecordStep: () => <span />
        };
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.instance().getStepperIndex(props.location.pathname)).toEqual(0);
    });

    it('method getStepperIndex should return step [1] and Stepper should render the 2nd step', () => {
        const props = {
            rawSearchQuery: 'This is a test',
            location: { pathname: routes.pathConfig.records.add.results },
            addRecordStep: () => <span />
        };
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.instance().getStepperIndex(props.location.pathname)).toEqual(1);
    });

    it('method getStepperIndex should return step [2] and Stepper should render the 3rd step', () => {
        const props = {
            location: { pathname: routes.pathConfig.records.add.new },
            addRecordStep: () => <span />
        };
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.instance().getStepperIndex(props.location.pathname)).toEqual(2);
    });

    it('should call back to step [0] (records/add/find) when there is no rawSearchQuery defined when landing on records/add/results', () => {
        const testReplace = jest.fn();
        const props = {
            rawSearchQuery: null,
            history: {replace: testReplace},
            location: { pathname: routes.pathConfig.records.add.results },
            match: { path: routes.pathConfig.records.add.results },
            addRecordStep: () => <span />
        };
        const wrapper = setup({...props});
        expect(testReplace).toBeCalledWith(routes.pathConfig.records.add.find);
    });
});

