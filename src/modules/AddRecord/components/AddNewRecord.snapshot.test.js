import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AddNewRecord from './AddNewRecord';

function setup(values) {
    return shallow(<AddNewRecord {...values}/>);
}

describe('Add new record', () => {
    it('should render stepper and a publication form', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
