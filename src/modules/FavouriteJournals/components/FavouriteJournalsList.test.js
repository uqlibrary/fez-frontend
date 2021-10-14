import React from 'react';
import * as mockData from 'mock/data/testing/journals/journalComparison';
import { FavouriteJournalsList } from './FavouriteJournalsList';
import { rtlRender } from '../../../../utils/test-utils';
import { PublicationsListPaging, PublicationsListSorting } from '../../SharedComponents/PublicationsList';
import { JournalsList } from '../../SharedComponents/JournalsList';
import { locale } from '../../../locale';

function setup(testProps = {}) {
    return rtlRender(<FavouriteJournalsList {...testProps} />);
}

describe('FavouriteJournalsList', () => {
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('favourite-journals-list-nothing')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
    });
    it('should display loading message', () => {
        const { getByText, queryByTestId } = setup({ loading: true });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
        expect(getByText(locale.components.favouriteJournals.favouriteJournalsList.loading)).toBeInTheDocument();
    });
    it('should render when there are no fav journals', () => {
        const { getByText, queryByTestId } = setup({ loaded: true, total: 0 });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).not.toBeInTheDocument();
        expect(getByText(locale.components.favouriteJournals.favouriteJournalsList.empty)).toBeInTheDocument();
    });
    it('should display loading error', () => {
        const { queryByTestId } = setup({ loaded: true, error: {} });
        expect(queryByTestId('favourite-journals-list-nothing')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-loading')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-empty')).not.toBeInTheDocument();
        expect(queryByTestId('favourite-journals-list-error')).toBeInTheDocument();
    });
    it('should render when there are fav journals', () => {
        const wrapper = getElement(FavouriteJournalsList, { loaded: true, journals: mockData.journals });
        expect(wrapper.find(PublicationsListSorting).length).toBe(1);
        expect(wrapper.find(JournalsList).length).toBe(1);
    });
    it('should render when there are fav journals with pagination', () => {
        const wrapper = getElement(FavouriteJournalsList, { loaded: true, journals: mockData.journals, total: 30 });
        expect(wrapper.find(PublicationsListSorting).length).toBe(1);
        expect(wrapper.find(JournalsList).length).toBe(1);
        expect(wrapper.find(PublicationsListPaging).length).toBe(2);
    });
});
