import React from 'react';
import { WithReduxStore } from 'test-utils';
import AdminSection from './AdminSection';
import { journalDoaj } from 'mock/data';
import { fieldConfig } from 'config/journalAdmin';

import { FormProvider } from 'react-hook-form';
import { useValidatedForm } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { render } from '@testing-library/react';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// eslint-disable-next-line react/prop-types
const FormProviderWrapper = ({ children, ...props }) => {
    const methods = useValidatedForm(props);
    return <FormProvider {...methods}>{children}</FormProvider>;
};

function setup(testProps = {}) {
    const { values = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return render(
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
    let fieldIds;
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        fieldIds = Object.values(fieldConfig.default)
            .filter(field => field.componentProps.name.includes('adminSection.'))
            .map(
                field =>
                    field.componentProps.textFieldId ||
                    field.componentProps.richEditorId ||
                    (field.componentProps.name.includes('advisoryStatementType') &&
                        'jnl-advisory-statement-type-input'),
            );
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
