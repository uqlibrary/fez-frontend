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
        accountAuthorDetailsLoading,
        loadingPublicationsByYear,
        publicationsByYear,
        publicationTypesCount,
        possiblyYourPublicationsCount,
        hidePossiblyYourPublicationsLure,
        publicationsList,
        loadingPublicationsStats,
        publicationsStats,
        possiblyYourPublicationsCountLoading
    }
    ) {
    const props = {
        account: account || mock.accounts.uqresearcher,
        authorDetails: authorDetails,
        accountAuthorDetailsLoading: accountAuthorDetailsLoading || false,
        loadingPublicationsByYear: loadingPublicationsByYear || false,
        publicationsByYear: publicationsByYear,
        publicationTypesCount: publicationTypesCount,
        possiblyYourPublicationsCount: possiblyYourPublicationsCount,
        hidePossiblyYourPublicationsLure: hidePossiblyYourPublicationsLure || false,
        publicationsList: publicationsList,
        loadingPublicationsStats: loadingPublicationsStats || false,
        publicationsStats: publicationsStats,
        possiblyYourPublicationsCountLoading: possiblyYourPublicationsCountLoading || false,
        actions: {
            countPossiblyYourPublications: jest.fn(),
            loadAuthorPublicationsStats: jest.fn(),
            searchLatestPublications: jest.fn(),
            searchTrendingPublications: jest.fn(),
            loadAuthorPublicationsByYear: jest.fn()
        },
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
        const wrapper = setup({authorDetails: mock.authorDetails.uqresearcher});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders possibly your publications lure but not the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render possibly your publications lure or the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: true,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render possibly your publications lure and shows the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 0,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render either the publications lure or the add a record lure while the pub count is still loading', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: null,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
