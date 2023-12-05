import React from 'react';
import { rtlRender, WithReduxStore, preview } from 'test-utils';
import AdminSection from './AdminSection';
import { journalDoaj } from 'mock/data';
import Immutable from 'immutable';
import { reduxForm } from 'redux-form';

jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';

const WithReduxForm = reduxForm({ form: 'testForm', formValues: Immutable.Map({ ...journalDoaj.data }) })(AdminSection);

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithReduxForm {...props} />
        </WithReduxStore>,
    );
}

describe('AdminSection component', () => {
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: 'adminjournal',
        }));

        useFormValuesContext.mockImplementation(() => ({
            formValues: {},
        }));
    });

    it('should render default view', () => {
        const render = setup();
        preview.debug();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render design form fields', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
                jnl_jbject_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [
                    {
                        jnl_jsmemberof: 'Test collection',
                        parent: {
                            jnl_jecurity_policy: 2,
                            jnl_jatastream_policy: 1,
                        },
                    },
                ],
                jnl_jisplay_type: 313,
                jnl_jubtype: 'Creative Work - Design/Architectural',
            },
        }));

        const render = setup();
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
