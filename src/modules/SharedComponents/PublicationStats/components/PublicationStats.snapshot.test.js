jest.dontMock('./PublicationStats');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {formattedData} from 'mock/data/testing/publicationStats';
import PublicationStats from './PublicationStats';

function setup(publicationsStats) {
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

    it('should render an empty component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render 1 for hindex because they round up to 1', () => {
        const fakeData = {
            "thomson_citation_count_i": {
                "count": 301,
                "avg": 24.498338870432,
                "sum": 7374,
                "hindex": 0.9, // from GET/hindex response.hindex_incites
                "years": "1992-2017"
            },
            "scopus_citation_count_i": {
                "count": 210,
                "avg": 25.22380952381,
                "sum": 5297,
                "hindex": 0.51, // from GET/hindex response.hindex_scopus
                "years": "1992-2017"
            }
        };
        const wrapper = setup(fakeData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render N/A for hindex because they equal zero', () => {
        const fakeData = {
            "thomson_citation_count_i": {
                "count": 301,
                "avg": 24.498338870432,
                "sum": 7374,
                "hindex": 0.499, // from GET/hindex response.hindex_incites
                "years": "1992-2017"
            },
            "scopus_citation_count_i": {
                "count": 210,
                "avg": 25.22380952381,
                "sum": 5297,
                "hindex": 0.001, // from GET/hindex response.hindex_scopus
                "years": "1992-2017"
            }
        };
        const wrapper = setup(fakeData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render N/A for hindex because it is null', () => {
        const fakeData = {
            "thomson_citation_count_i": {
                "count": 301,
                "avg": 24.498338870432,
                "sum": 7374,
                "hindex": null, // from GET/hindex response.hindex_incites
                "years": "1992-2017"
            },
            "scopus_citation_count_i": {
                "count": 210,
                "avg": 25.22380952381,
                "sum": 5297,
                "hindex": null, // from GET/hindex response.hindex_scopus
                "years": "1992-2017"
            }
        };
        const wrapper = setup(fakeData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render N/A for hindex because it is undefined', () => {
        const fakeData = {
            "thomson_citation_count_i": {
                "count": 301,
                "avg": 24.498338870432,
                "sum": 7374,
                "hindex": undefined, // from GET/hindex response.hindex_incites
                "years": "1992-2017"
            },
            "scopus_citation_count_i": {
                "count": 210,
                "avg": 25.22380952381,
                "sum": 5297,
                "hindex": undefined, // from GET/hindex response.hindex_scopus
                "years": "1992-2017"
            }
        };
        const wrapper = setup(fakeData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
