jest.dontMock('./PublicationStats');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {formattedData} from '../../../mock/data/academic/publicationStats';
import {PublicationStats} from './PublicationStats';

function setup(values) {
    const props = {publicationsStats: values};
    return shallow(<PublicationStats {...props} />);
}

describe('PublicationStats test', () => {
    it('Renders the publication stats as expected for a UQ researcher', () => {
        const wrapper = setup(formattedData);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
