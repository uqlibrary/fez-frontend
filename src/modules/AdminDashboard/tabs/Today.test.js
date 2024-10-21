/* eslint-disable no-unused-vars */
import React from 'react';
import Immutable from 'immutable';

import { render, WithReduxStore, waitForElementToBeRemoved, userEvent } from 'test-utils';

import Today from './Today';

const setup = (props = {}, state = {}, renderer = render) => {
    return renderer(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <Today {...props} />
        </WithReduxStore>,
    );
};

describe('Today tab', () => {
    it('should render loading state', async () => {
        const { getAllByTestId, getByText, getByTestId, queryByTestId } = setup(
            {},
            { adminDashboardTodayReducer: { adminDashboardTodayLoading: true } },
        );

        expect(getAllByTestId('admin-dashboard-systemalerts-skeleton').length).toBe(3);
        expect(getAllByTestId('admin-dashboard-quicklinks-skeleton').length).toBe(8);
        expect(getByText('Quick Links')).toBeInTheDocument();
        expect(getByTestId('quick-link-progressor')).toBeInTheDocument();

        expect(queryByTestId('alert')).not.toBeInTheDocument();
    });

    // Note: at the time of writing (May 2024), mui-x/chart components do not work with Jest tests.
    // Coverage for the when charts are shown etc. is covered in Cypress instead.

    it('should render message if no Today data available', async () => {
        const { getByText, getByTestId } = setup(
            {},
            { adminDashboardTodayReducer: { adminDashboardTodaySuccess: true } },
        );
        await waitForElementToBeRemoved(getByTestId('quick-link-progressor'));

        expect(getByText('No data available')).toBeInTheDocument();
    });

    it('should render alert if quick link loading fails', async () => {
        const { queryByTestId, getByTestId } = setup(
            {},
            { adminDashboardQuickLinksReducer: { adminDashboardQuickLinksUpdateFailed: 'test error' } },
        );
        await waitForElementToBeRemoved(getByTestId('quick-link-progressor'));

        expect(getByTestId('alert')).toBeInTheDocument();
        await userEvent.click(getByTestId('dismiss'));
        expect(queryByTestId('alert')).not.toBeInTheDocument();
    });
});
