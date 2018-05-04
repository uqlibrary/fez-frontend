/* eslint-disable */

import React from 'react';
import {shallow, mount} from 'enzyme';
import toJson from 'enzyme-to-json';

import AuthorsPublicationTypesCountChart from './AuthorsPublicationTypesCountChart';

function setup(testProps, isShallow = false) {
    if (isShallow)
        return shallow(<AuthorsPublicationTypesCountChart {...testProps} />);

    return mount(<AuthorsPublicationTypesCountChart {...testProps} />);
}


describe('AuthorsPublicationTypesCountChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({series: []});
        expect(toJson(app)).toMatchSnapshot();
    });
});

