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
});
