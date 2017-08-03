jest.dontMock('./DashboardArticleCount');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardArticleCount from './DashboardArticleCount';

function setup({articleCount, articleFirstYear, articleLastYear}) {
    const props = {
        articleCount: '999',
        articleFirstYear: 1234,
        articleLastYear: 5678
    };
    return shallow(<DashboardArticleCount {...props} />);
}

describe('Alert snapshots test', () => {
    it('Render the eSpace document count, and years spanning', () => {
    const articleCount = "999";
    const articleFirstYear = 1234;
    const articleLastYear = 5678;

    const wrapper = setup(articleCount, articleFirstYear, articleLastYear);
    expect(toJson(wrapper)).toMatchSnapshot();
});
});