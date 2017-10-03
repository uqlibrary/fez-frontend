import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AddRecordStepper from './AddRecordStepper';

function setup(values) {
    return shallow(<AddRecordStepper {...values}/>);
}

describe('Add record stepper tests', () => {
    it('should render steps and activate step 2', () => {
        const values = {
            activeStep: 1,
            steps: [
                {label: 'Step 1'},
                {label: 'Step 2'},
                {label: 'Step 3'}
            ]
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
