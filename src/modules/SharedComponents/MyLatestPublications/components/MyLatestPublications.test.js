import React from 'react';
import { latestPubsPayload } from 'mock/data/testing/latestPublications';
import { MyLatestPublications } from './MyLatestPublications';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        history: {},
        actions: {
            searchLatestPublications: jest.fn(),
        },
        classes: { blueButton: 'blueButton' },
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <MyLatestPublications {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component MyLatestPublications', () => {
    it('should render latest publications', () => {
        const { container } = setup({
            latestPublicationsList: latestPubsPayload.data,
            totalPublicationsCount: latestPubsPayload.total,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const container = setup({ loadingLatestPublications: true });
        expect(container).toMatchSnapshot();
    });

    it('should fetch data if account author details is loaded', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: false, actions: { searchLatestPublications: testFn } });
        expect(testFn).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        const testFn = jest.fn();
        setup({ accountAuthorDetailsLoading: true, actions: { searchLatestPublications: testFn } });
        expect(testFn).not.toBeCalled();
    });

    it('_viewMyResearch method', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ history: { push: testFn } });
        fireEvent.click(getByRole('button', { name: /View all/i }));
        // wrapper.instance()._viewMyResearch();
        expect(testFn).toHaveBeenCalledWith('/records/mine');
    });
});
