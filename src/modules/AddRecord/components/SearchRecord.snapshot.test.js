import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SearchRecord from './SearchRecord';

function setup(values) {
    return shallow(<SearchRecord {...values}/>);
}

describe('Search record', () => {
    it('should render stepper and a publication search form', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
