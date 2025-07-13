import React from 'react';
import { latestPubsPayload } from 'mock/data/testing/latestPublications';
import MyLatestPublications from './MyLatestPublications';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    searchLatestPublications: jest.fn(),
}));
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, testState = {}) {
    const props = {
        ...testProps,
    };
    const state = {
        myLatestPublicationsReducer: {
            latestPublicationsList: latestPubsPayload.data,
            totalPublicationsCount: latestPubsPayload.total,
        },
        accountReducer: {},
        ...testState,
    };
    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <MyLatestPublications {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component MyLatestPublications', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render latest publications', async () => {
        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const container = setup({}, { myLatestPublicationsReducer: { loadingLatestPublications: true } });
        expect(container).toMatchSnapshot();
    });

    it('should fetch data if account author details have loaded', () => {
        setup({}, { accountReducer: { author: {} } });
        expect(actions.searchLatestPublications).toHaveBeenCalled();
    });

    it('should not fetch data if account author details are not loaded', () => {
        setup();
        expect(actions.searchLatestPublications).not.toHaveBeenCalled();
    });

    it('_viewMyResearch method', () => {
        const { getByRole } = setup();
        fireEvent.click(getByRole('button', { name: /View all/i }));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/mine');
    });
});
