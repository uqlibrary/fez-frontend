import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStoreForMount } from 'test.setup';
import { render } from '@testing-library/react';
import { DashboardResearcherIdsClass, styles } from './DashboardResearcherIds';

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
    return getElement(DashboardResearcherIdsClass, props);
}

describe('Dashboard Researcher IDs test', () => {
    const testFn = jest.fn();
    const props = {
        history: { push: testFn },
        classes: {},
        values: {
            publons: currentAuthor.uqresearcher.data.aut_publons_id,
            researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
            scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
            google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
            orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
        },
        authenticated: { publons: false, researcher: true, scopus: false, google_scholar: false, orcid: true },
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

    it('navigateToRoute method', () => {
        const wrapper = setup(props);
        wrapper.instance().navigateToRoute(null, 'publons');
        expect(testFn).toHaveBeenCalledWith(
            'http://guides.library.uq.edu.au/for-researchers/researcher-identifier/publons',
        );
    });

    it('Testing clicking on ID internal links', () => {
        const testValues = {
            ...props,
            values: {
                ...props.values,
                orcid: null,
            },
            authenticated: { publons: false, researcher: false, scopus: false, google_scholar: false, orcid: false },
        };
        const wrapper = setup(testValues);
        const navigateToRoute = jest.spyOn(wrapper.instance(), 'navigateToRoute');
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
            authenticated: { publons: false, researcher: false, scopus: false, google_scholar: false, orcid: false },
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
            authenticated: { publons: true, researcher: true, scopus: true, google_scholar: true, orcid: true },
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
            authenticated: { publons: true, researcher: true, scopus: true, google_scholar: true, orcid: true },
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
            <Provider store={setupStoreForMount().store}>
                <MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
                    <OrcidSyncContext.Provider value={context}>
                        <DashboardResearcherIdsClass {...props} />
                    </OrcidSyncContext.Provider>
                </MemoryRouter>
            </Provider>,
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
