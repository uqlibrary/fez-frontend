import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import { AdminSectionContainer, mapStateToProps } from './AdminSectionContainer';
import Immutable from 'immutable';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';
jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';

const WithReduxForm = reduxForm({ form: 'testForm', formValues: Immutable.Map({ ...journalDoaj.data }) })(
    AdminSectionContainer,
);

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithReduxForm {...props} />
        </WithReduxStore>,
    );
}

describe('AdminSectionContainer component', () => {
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: 'adminjournal',
        }));

        useFormValuesContext.mockImplementation(() => ({
            formValues: Immutable.Map({ ...journalDoaj.data }),
        }));
    });
    it('should render default view', () => {
        const { getByTestId } = setup();
        expect(getByTestId('jnl_title')).toBeInTheDocument();
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            formValues: Immutable.Map({}),
        });
    });
});
