import React from 'react';
import { latestPubsPayload } from 'mock/data/testing/latestPublications';
import MyLatestPublications from './MyLatestPublications';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';
import * as actions from 'actions';
import { openAccessibleProps } from './MyLatestPublications';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    searchLatestPublications: jest.fn(),
}));
const mockUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
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

    describe('openAccessibleProps', () => {
        const mockNavigate = jest.fn();

        beforeEach(() => {
            mockNavigate.mockClear();
        });

        it('should return correct props object structure', () => {
            const props = openAccessibleProps(mockNavigate);

            expect(props).toHaveProperty('forceUseCustomActions');
            expect(props).toHaveProperty('customActions');
            expect(typeof props.forceUseCustomActions).toBe('function');
            expect(Array.isArray(props.customActions)).toBe(true);
            expect(props.customActions).toHaveLength(2);
        });

        it('should return actions with correct labels from locale', () => {
            const props = openAccessibleProps(mockNavigate);

            expect(props.customActions[0].label).toBe('Make open access');
            expect(props.customActions[0].primary).toBe(true);
            expect(props.customActions[1].label).toBe('Request correction');
            expect(props.customActions[1].primary).toBe(false);
        });

        it('should call navigate with openAccessComplianceFix path when first action is triggered', () => {
            const props = openAccessibleProps(mockNavigate);
            const mockRecord = { rek_pid: 'UQ:12345' };

            props.customActions[0].handleAction(mockRecord);

            expect(mockNavigate).toHaveBeenCalledWith('/records/UQ:12345/make-open-access');
        });

        it('should call navigate with fix path when second action is triggered', () => {
            const props = openAccessibleProps(mockNavigate);
            const mockRecord = { rek_pid: 'UQ:67890' };

            props.customActions[1].handleAction(mockRecord);

            expect(mockNavigate).toHaveBeenCalledWith('/records/UQ:67890/fix');
        });

        it('should call potentiallyOpenAccessible method on record in forceUseCustomActions', () => {
            const props = openAccessibleProps(mockNavigate);
            const mockRecord = {
                rek_pid: 'UQ:12345',
                potentiallyOpenAccessible: jest.fn().mockReturnValue(true),
            };

            const result = props.forceUseCustomActions(mockRecord);

            expect(mockRecord.potentiallyOpenAccessible).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return false when potentiallyOpenAccessible returns false', () => {
            const props = openAccessibleProps(mockNavigate);
            const mockRecord = {
                rek_pid: 'UQ:12345',
                potentiallyOpenAccessible: jest.fn().mockReturnValue(false),
            };

            const result = props.forceUseCustomActions(mockRecord);

            expect(mockRecord.potentiallyOpenAccessible).toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should handle different record PIDs correctly', () => {
            const props = openAccessibleProps(mockNavigate);
            const mockRecord1 = { rek_pid: 'UQ:111111' };
            const mockRecord2 = { rek_pid: 'UQ:222222' };

            props.customActions[0].handleAction(mockRecord1);
            props.customActions[1].handleAction(mockRecord2);

            expect(mockNavigate).toHaveBeenCalledWith('/records/UQ:111111/make-open-access');
            expect(mockNavigate).toHaveBeenCalledWith('/records/UQ:222222/fix');
            expect(mockNavigate).toHaveBeenCalledTimes(2);
        });
    });
});
