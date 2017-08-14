jest.dontMock('./ClaimPublication');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ClaimPublication from './ClaimPublication';
import * as mock from 'mock/data';

function setup({
        publicationsList,
        loadingPublications,
        author,
        authorLoading,
        possibleCounts
    }) {
    const props = {
        publicationsList: publicationsList || [],
        loadingPublications,
        author,
        authorLoading,
        possibleCounts,
        actions: {},
        history: {}
    };
    return shallow(<ClaimPublication {...props} />);
}

describe('ClaimPublication test', () => {
    it('renders empty list', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading author data', () => {
        const wrapper = setup({ authorLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders loading screen while loading publications ', () => {
        const wrapper = setup({ author: {}, loadingPublications: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders no results', () => {
        const wrapper = setup({ author: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders list of publications and counts', () => {
        const wrapper = setup({ author: {}, possibleCounts: mock.possibleCounts.data, publicationsList: mock.possibleUnclaimed.data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
