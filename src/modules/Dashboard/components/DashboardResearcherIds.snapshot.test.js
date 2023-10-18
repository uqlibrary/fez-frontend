import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import DashboardResearcherIds, { DashboardResearcherIdsClass } from './DashboardResearcherIds';

import { AllTheProviders, render, WithRouter, WithReduxStore, fireEvent } from 'test-utils';

import { currentAuthor } from 'mock/data';

jest.mock('../../../context');
import { OrcidSyncContext } from 'context';

function setup(testProps) {
    // build full props list required by the component
    const props = {
        classes: {},
        theme: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <DashboardResearcherIds {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Dashboard Researcher IDs test', () => {
    const testFn = jest.fn();
    const props = {
        history: { push: testFn },
        classes: {},
        values: {
            researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
            scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
            google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
            orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
        },
        authenticated: { researcher: true, scopus: false, google_scholar: false, orcid: true },
    };

    afterEach(() => {
        testFn.mockReset();
    });

    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('Testing clicking on ID internal links', () => {
        const pushMock = jest.fn();
        const testValues = {
            ...props,
            values: {
                ...props.values,
                orcid: null,
            },
            authenticated: { researcher: false, scopus: false, google_scholar: false, orcid: false },
            history: { push: pushMock },
        };
        const { container, getByTestId } = setup(testValues);

        expect(container).toMatchSnapshot();

        const link = getByTestId('orcid');
        fireEvent.click(link);
        expect(pushMock).toHaveBeenCalledTimes(1);
        fireEvent.keyPress(link, { key: 'Enter', keyCode: 13 });
        expect(pushMock).toHaveBeenCalledTimes(2);
    });

    it('Testing auth internal links', () => {
        const testValues = {
            ...props,
            values: {
                ...props.values,
                orcid: null,
            },
            authenticated: { researcher: true, scopus: true, google_scholar: true, orcid: true },
        };
        const { container } = setup(testValues);
        expect(container).toMatchSnapshot();
    });

    it('Testing orcid caption', () => {
        const testValues = {
            ...props,
            authenticated: { researcher: true, scopus: true, google_scholar: true, orcid: true },
        };
        const { container } = setup(testValues);
        expect(container).toMatchSnapshot();
    });

    it('should show orcid sync UI', () => {
        const context = {
            showSyncUI: true,
            orcidSyncProps: {
                author: {
                    aut_orcid_id: 'test',
                },
                orcidSyncStatus: {
                    orj_status: 'Done',
                },
            },
        };

        const wrapper = render(
            <AllTheProviders>
                <Provider store={setupStoreForMount().store}>
                    <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                        <OrcidSyncContext.Provider value={context}>
                            <DashboardResearcherIdsClass {...props} />
                        </OrcidSyncContext.Provider>
                    </MemoryRouter>
                </Provider>
            </AllTheProviders>,
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
