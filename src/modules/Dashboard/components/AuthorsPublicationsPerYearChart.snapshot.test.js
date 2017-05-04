jest.dontMock('./AuthorsPublicationsPerYearChart');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import AthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';
import {publicationYearsBig, publicationYearsSmall, publicationYearsTiny, publicationYearsZero} from '../../../mock/data/publication-years';

function setup({rawData, yAxisTitle}) {
    const props = {
        rawData,
        yAxisTitle
    };
    return shallow(<AthorsPublicationsPerYearChart {...props} />);
}


describe('AuthorsPublicationsPerYearChart snapshot tests', () => {
    it('it should render chart component', () => {
        const app = setup({rawData: publicationYearsBig, yAxisTitle: 'title'});
        expect(toJson(app)).toMatchSnapshot();
    });
});

