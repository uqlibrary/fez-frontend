import React from 'react';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import DashboardOrcidSyncContainer, { openUrl, DashboardOrcidSync } from './DashboardOrcidSync';

function setup(testProps = {}) {
    const props = {
        author: {
            aut_orcid_id: '0000-1111-1111-1111',
            aut_orcid_works_last_sync: '2020-02-14 16:23:30',
        },
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <DashboardOrcidSync {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('openUrl helper', () => {
    it('should return function that calls window.open', () => {
        const testOpen = jest.spyOn(window, 'open');
        testOpen.mockImplementation(() => {});
        const url = 'https://www.uq.edu.au/';
        openUrl(url)();
        expect(testOpen).toHaveBeenCalledWith(url, '_blank');
    });
});

describe('DashboardOrcidSyncContainer', () => {
    it('should render properly', () => {
        const { container } = render(
            <WithReduxStore>
                <WithRouter>
                    <DashboardOrcidSyncContainer author={{ aut_orcid_works_last_sync: '2020-02-14 16:23:30' }} />
                </WithRouter>
            </WithReduxStore>,
        );
        expect(container).toMatchSnapshot();
    });
});

describe('DashboardOrcidSync', () => {
    it('should render properly', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render Pending status', () => {
        const { container } = setup({
            orcidSyncStatus: {
                orj_status: 'Pending',
            },
        });
        expect(container).toMatchSnapshot();
    });

    /* it('should render Done status, and be able to click the sync button', async () => {
        const testFn1 = jest.fn();
        const testFn2 = jest.fn();
        const { container, getByTestId } = setup({
            author: {
                aut_orcid_id: 'test',
            },
            orcidSyncStatus: {
                orj_status: 'Done',
            },
            hideDrawer: testFn1,
            requestOrcidSync: testFn2,
        });
        expect(container).toMatchSnapshot();

        fireEvent.click(getByTestId('HelpOutlineIcon'));
        fireEvent.click(getByTestId('orcid-upload-start-button'));

        expect(testFn1).toHaveBeenCalledTimes(1);
        expect(testFn2).toHaveBeenCalledTimes(1);
    });*/

    it('should render Error status', () => {
        const { container } = setup({
            orcidSyncStatus: {
                orj_status: 'Error',
            },
        });
        expect(container).toMatchSnapshot();
    });
});
