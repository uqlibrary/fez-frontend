/* eslint-disable */

import React from 'react';
import {shallow, mount} from 'enzyme';
import toJson from 'enzyme-to-json';

import AuthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';

function setup(testProps, isShallow = false) {
    if (isShallow)
        return shallow(<AuthorsPublicationsPerYearChart {...testProps} />);

    return mount(<AuthorsPublicationsPerYearChart {...testProps} />);
}


describe('AuthorsPublicationsPerYearChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({series: [], categories: [], yAxisTitle: 'title'});
        expect(toJson(app)).toMatchSnapshot();
    });
});
