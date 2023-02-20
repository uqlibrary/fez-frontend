import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import { render } from '@testing-library/react';
import { DashboardResearcherIdsClass, styles } from './DashboardResearcherIds';

import { AllTheProviders } from 'test-utils';

import { currentAuthor } from 'mock/data';

jest.mock('../../../context');
import { OrcidSyncContext } from 'context';

function setup(testProps, testArgs = {}) {
    const args = { isShallow: false, ...testArgs };
    // build full props list required by the component
    const props = {
        classes: {},
        theme: {},
        ...testProps,
    };
    return getElement(DashboardResearcherIdsClass, props, args);
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
        const wrapper = setup(props);
        wrapper.find('ContextConsumer').forEach(consumer => {
            expect(toJson(consumer.dive())).toMatchSnapshot();
        });
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
        const wrapper = setup(testValues);

        const navigateToRoute = jest.spyOn(wrapper.find('DashboardResearcherIdsClass').instance(), 'navigateToRoute');
        const button = wrapper.find('#orcid');
        expect(button.length).toEqual(1);
        button.forEach(button => {
            button.simulate('click');
            expect(navigateToRoute).toHaveBeenCalled();
        });
        button.forEach(button => {
            button.simulate('keypress', { key: 'Enter' });
            expect(navigateToRoute).toHaveBeenCalled();
        });
    });

    it('Testing unauth internal links', () => {
        const testValues = {
            ...props,
            values: {
                ...props.values,
                orcid: null,
            },
            authenticated: { researcher: false, scopus: false, google_scholar: false, orcid: false },
        };
        const wrapper = setup(testValues);
        wrapper.find('ContextConsumer').forEach(consumer => {
            expect(toJson(consumer.dive())).toMatchSnapshot();
        });
        expect(toJson(wrapper.find('a'))).toMatchSnapshot();
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
        const wrapper = setup(testValues);
        wrapper.find('ContextConsumer').forEach(consumer => {
            expect(toJson(consumer.dive())).toMatchSnapshot();
        });
        expect(toJson(wrapper.find('a'))).toMatchSnapshot();
    });

    it('Testing orcid caption', () => {
        const testValues = {
            ...props,
            authenticated: { researcher: true, scopus: true, google_scholar: true, orcid: true },
        };
        const wrapper = setup(testValues);
        wrapper.find('ContextConsumer').forEach(consumer => {
            expect(toJson(consumer.dive())).toMatchSnapshot();
        });
    });

    it('should have a style generator', () => {
        const theme = {
            palette: {
                white: {
                    main: '#fff',
                },
            },
        };

        expect(styles(theme)).toMatchSnapshot();
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
