jest.dontMock('./PublicationStats');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {formattedData} from 'mock/data/academic/publicationStats';
import PublicationStats from './PublicationStats';

function setup({publicationsStats}) {
    const props = {
        publicationsStats: publicationsStats
    };
    return shallow(<PublicationStats {...props} />);
}

describe('PublicationStats component', () => {
    it('should render statistics with table and data', () => {
        const wrapper = setup(formattedData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
