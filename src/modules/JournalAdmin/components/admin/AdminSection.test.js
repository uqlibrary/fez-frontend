import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import AdminSection from './AdminSection';
import { journalDoaj } from 'mock/data';
import Immutable from 'immutable';
import { reduxForm } from 'redux-form';
import { fieldConfig } from 'config/journalAdmin';

jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';

const WithReduxForm = reduxForm({ form: 'testForm', formValues: Immutable.Map({ ...journalDoaj.data }) })(AdminSection);

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

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
    let fieldIds;
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
        fieldIds = Object.values(fieldConfig.default)
            .filter(field => field.componentProps.name.includes('adminSection.'))
            .map(field => field.componentProps.textFieldId || field.componentProps.richEditorId);
    });

    it('should render default view', () => {
        const { getByTestId } = setup();
        fieldIds.forEach(id => {
            expect(getByTestId(id)).toBeInTheDocument();
        });
    });

    it('should render disabled view', () => {
        fieldIds = Object.values(fieldConfig.default)
            .filter(field => field.componentProps.name.includes('adminSection.') && !!field.componentProps.textFieldId)
            .map(field => field.componentProps.textFieldId);
        // only test actual input fields
        const { getByTestId } = setup({ disabled: true });
        fieldIds.forEach(id => {
            expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
        });
    });
});
