jest.dontMock('./DashboardArticleCount');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardArticleCount from './DashboardArticleCount';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardArticleCount {...props} />);
}

describe('Dashboard Article Count test', () => {
    it('Render the authors article counts as expected for a UQ researcher)', () => {
        const props = {
            values: {
                articleCount: '123',
                articleFirstYear: 1234,
                articleLastYear: 5678,
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
