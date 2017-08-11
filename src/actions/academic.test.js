jest.dontMock('./AuthorsPublicationsPerYearChart');

import React from 'react';
import {shallow} from 'enzyme';

import AthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';
import {publicationYearsBig, publicationYearsSmall, publicationYearsTiny, publicationYearsZero} from './data/publicationYears';

function setup({rawData, yAxisTitle}) {
    const props = {
    };
    return shallow(<AthorsPublicationsPerYearChart {...props} />);
}


describe('AuthorsPublicationsPerYearChart unit tests', () => {
    it('it should return empty data', () => {
        const chart = new AthorsPublicationsPerYearChart({rawData:publicationYearsZero, yAxisTitle: 'title'});
        const categories = chart.getCategories([]);
        const series = chart.getSeries([]);

        expect(categories.length).toEqual(0);
        expect(series.length).toEqual(5);
        expect(JSON.stringify(series)).toEqual('[{"name":"Journal Article","data":[]},{"name":"Conference Paper","data":[]},{"name":"Book Chapter","data":[]},{"name":"Book","data":[]},{"name":"Other","data":[]}]');
    });

    it('it should return data for only one publication', () => {
        const chart = new AthorsPublicationsPerYearChart({rawData:{}, yAxisTitle: 'title'});
        const data = publicationYearsTiny.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact'];

        const categories = chart.getCategories(data);
        expect(categories.length).toEqual(1);
        expect(categories[0]).toEqual(2014);

        const series = chart.getSeries(data);
        expect(series.length).toEqual(5);
        expect(JSON.stringify(series)).toEqual('[{"name":"Journal Article","data":[0]},{"name":"Conference Paper","data":[0]},{"name":"Book Chapter","data":[0]},{"name":"Book","data":[0]},{"name":"Other","data":[1]}]');
    });

    it('it should return data for multiple publications', () => {
        const chart = new AthorsPublicationsPerYearChart({rawData:{}, yAxisTitle: 'title'});
        const data = publicationYearsSmall.facet_counts.facet_pivot['date_year_t,display_type_i_lookup_exact'];

        const categories = chart.getCategories(data);
        expect(categories.length).toEqual(9);
        expect(categories.toString()).toEqual("2005,2007,2008,2009,2011,2012,2013,2014,2015");

        const series = chart.getSeries(data);
        expect(series.length).toEqual(5);
        expect(JSON.stringify(series)).toEqual('[{"name":"Journal Article","data":[1,1,2,2,2,1,1,3,2]},{"name":"Conference Paper","data":[0,0,0,0,1,0,0,0,0]},{"name":"Book Chapter","data":[0,0,0,0,0,0,0,0,0]},{"name":"Book","data":[0,0,0,0,0,0,0,0,0]},{"name":"Other","data":[0,1,0,0,0,0,0,0,0]}]');
    });
});

