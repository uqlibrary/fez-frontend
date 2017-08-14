jest.dontMock('./Dashboard');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Dashboard from './Dashboard';
import * as mock from 'mock/data';

function setup(
    {
        account,
        authorDetails,
        authorDetailsLoading,
        loadingPublicationsByYear,
        publicationsByYear,
        publicationTypesCount,
        possiblyYourPublicationsCount,
        hidePossiblyYourPublicationsLure,
        publicationsList,
        loadingPublicationsStats,
        publicationsStats
    }
    ) {
    const props = {
        account: account || mock.accounts.uqresearcher,
        authorDetails: authorDetails,
        authorDetailsLoading: authorDetailsLoading || false,
        loadingPublicationsByYear: loadingPublicationsByYear || false,
        publicationsByYear: publicationsByYear,
        publicationTypesCount: publicationTypesCount,
        possiblyYourPublicationsCount: possiblyYourPublicationsCount,
        hidePossiblyYourPublicationsLure: hidePossiblyYourPublicationsLure || false,
        publicationsList: publicationsList,
        loadingPublicationsStats: loadingPublicationsStats || false,
        publicationsStats: publicationsStats,
        actions: {},
        history: {}
    };
    return shallow(<Dashboard {...props} />);
}

describe('Dashboard test', () => {
    it('renders alert for non-authors', () => {
        const wrapper = setup({account: mock.accounts.uqstaff});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders dashboard header only', () => {
        const wrapper = setup({authorDetails: mock.authorDetails});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders possibly your publications lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails,
            possiblyYourPublicationsCount: mock.possibleCounts.data});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render possibly your publications lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails,
            possiblyYourPublicationsCount: mock.possibleCounts.data,
            hidePossiblyYourPublicationsLure: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });


});
