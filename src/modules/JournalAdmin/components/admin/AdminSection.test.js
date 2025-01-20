import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import AdminSection from './AdminSection';
import { journalDoaj } from 'mock/data';
import { fieldConfig } from 'config/journalAdmin';

import { ADMIN_JOURNAL } from 'config/general';

jest.mock('../../../../context');
import { useJournalContext } from 'context';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function setup(testProps = {}, renderer = rtlRender) {
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
            <AdminSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('AdminSection component', () => {
    let fieldIds;
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        fieldIds = Object.values(fieldConfig.default)
            .filter(field => field.componentProps.name.includes('adminSection.'))
            .map(field => field.componentProps.textFieldId || field.componentProps.richEditorId);
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
        fieldIds = Object.values(fieldConfig.default)
            .filter(field => field.componentProps.name.includes('adminSection.') && !!field.componentProps.textFieldId)
            .map(field => field.componentProps.textFieldId);
        // only test actual input fields
        const { getByTestId } = setup({ values: { journal: { ...journalDoaj.data } }, disabled: true });
        fieldIds.forEach(id => {
            expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
        });
    });
});
