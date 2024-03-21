import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import DashboardResearcherIds from './DashboardResearcherIds';

import { AllTheProviders, render, WithRouter, WithReduxStore, fireEvent } from 'test-utils';

import { currentAuthor } from 'mock/data';

jest.mock('../../../context');
import { OrcidSyncContext } from 'context';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps) {
    // build full props list required by the component
    const props = {
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
        mockUseNavigate.mockClear();
    });

    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('Testing clicking on ID internal links', () => {
        const testValues = {
            ...props,
            values: {
                ...props.values,
                orcid: null,
            },
            authenticated: { researcher: false, scopus: false, google_scholar: false, orcid: false },
        };
        const { container, getByTestId } = setup(testValues);

        expect(container).toMatchSnapshot();

        const link = getByTestId('orcid');
        fireEvent.click(link);
        expect(mockUseNavigate).toHaveBeenCalledTimes(1);
        fireEvent.keyPress(link, { key: 'Enter', keyCode: 13 });
        expect(mockUseNavigate).toHaveBeenCalledTimes(2);
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

        const { container } = render(
            <AllTheProviders>
                <Provider store={setupStoreForMount().store}>
                    <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                        <OrcidSyncContext.Provider value={context}>
                            <DashboardResearcherIds {...props} />
                        </OrcidSyncContext.Provider>
                    </MemoryRouter>
                </Provider>
            </AllTheProviders>,
        );
        expect(container).toMatchSnapshot();
    });
});
