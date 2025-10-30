import React from 'react';
import { render, WithReduxStore, FormProviderWrapper } from 'test-utils';
import AdminSection from './AdminSection';
import { journalDoaj } from 'mock/data';
import { fieldConfig } from 'config/journalAdmin';

import { ADMIN_JOURNAL } from 'config/general';

// Mock the RichEditorField to avoid lazy loading in tests
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: require('modules/SharedComponents/RichEditor/components/RichEditor').default,
}));

jest.mock('../../../../context');
import { useJournalContext } from 'context';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function setup(testProps = {}, renderer = render) {
    const { values = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return renderer(
        <FormProviderWrapper
            values={{
                ...values,
            }}
        >
            <WithReduxStore>
                <AdminSection {...props} />
            </WithReduxStore>
        </FormProviderWrapper>,
    );
}

describe('AdminSection component', () => {
    let allFields;
    let fieldIds;
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const configValues = Object.values(fieldConfig.default);
        const simpleFields = configValues.filter(field => !field.composed).map(field => field.componentProps);
        const composedFields = configValues
            .filter(field => field.composed)
            .reduce((acc, field) => acc.concat(Object.values(field.componentProps)), []);
        allFields = simpleFields.concat(composedFields);
        fieldIds = allFields
            .filter(props => props.name.includes('adminSection.'))
            .map(props => props.id || props.textFieldId || props.richEditorId)
            .map(id => (id === 'jnl_advisory_statement_type' ? 'jnl_advisory_statement_type-input' : id));
    });

    it('should render default view', () => {
        const { getByTestId } = setup({
            values: { journal: { ...journalDoaj.data } },
        });
        fieldIds.forEach(id => {
            expect(getByTestId(id)).toBeInTheDocument();
        });
    });

    it('should render disabled view', () => {
        fieldIds = allFields.filter(props => props.id || props.textFieldId).map(props => props.id || props.textFieldId);
        // only test actual input fields
        const { getByTestId } = setup({ values: { journal: { ...journalDoaj.data } }, disabled: true });
        fieldIds.forEach(id => {
            expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
        });
    });
});
