jest.dontMock('./DashboardArticleCount');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {authorDetails} from '../../../mock/data/authors/';

import DashboardArticleCount from './DashboardArticleCount';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardArticleCount {...props} />);
}

describe('Dashboard Article Count test', () => {
    it('Render the authors article counts as expected for a UQ researcher)', () => {
        const values = {
            values: {}
        };
        const articleCount = authorDetails.uqresearcher.espace.doc_count;
        const articleFirstYear = authorDetails.uqresearcher.espace.first_year;
        const articleLastYear = authorDetails.uqresearcher.espace.last_year;
        values.values = {articleCount, articleFirstYear, articleLastYear};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
