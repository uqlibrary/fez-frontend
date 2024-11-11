import React from 'react';
import { rtlRender } from 'test-utils';
import FieldGridItem from './FieldGridItem';
import { FormProvider } from 'react-hook-form';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { useValidatedForm } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';

global.console = {
    ...global.console,
    warn: jest.fn(),
};

// eslint-disable-next-line react/prop-types
const FormProviderWrapper = ({ children, methods, ...props }) => {
    const attributes = useValidatedForm(props);
    return (
        <FormProvider {...attributes} {...methods}>
            {children}
        </FormProvider>
    );
};

const setup = (testProps = {}, renderer = rtlRender) => {
    const { values = {}, methods = {}, ...rest } = testProps;
    const props = {
        ...rest,
        group: [1],
    };

    return renderer(
        <FormProviderWrapper
            values={{
                ...values,
            }}
            methods={methods}
        >
            <FieldGridItem {...props} />
        </FormProviderWrapper>,
    );
};

describe('FieldGridItem', () => {
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));
    });

    afterEach(() => {
        useJournalContext.mockReset();
    });

    it('should render default view', () => {
        const { getByTestId } = setup({
            field: 'jnl_title',
            values: {
                adminSection: {
                    jnl_jid: 12,
                    jnl_title: 'This is a test title',
                },
            },
        });
        expect(getByTestId('jnl_title-input')).toHaveValue('This is a test title');
    });

    it('should render error', () => {
        const { getByTestId } = setup({
            field: 'jnl_title',
            values: {
                adminSection: {
                    jnl_jid: 12,
                    jnl_title: 'This is a test title',
                },
            },
            methods: { getFieldState: jest.fn(() => ({ error: 'Test error message' })) },
        });
        expect(getByTestId('jnl_title-input')).toHaveValue('This is a test title');
        expect(getByTestId('jnl_title-helper-text')).toHaveTextContent('Test error message');
    });

    it('should handle missing field config', () => {
        setup({
            field: 'fake_field',
            values: {
                adminSection: {
                    jnl_jid: 12,
                    jnl_title: 'This is a test title',
                },
            },
        });
        expect(global.console.warn).toHaveBeenCalledWith('No field config found for', 'fake_field');
    });
});

describe('FieldGridItem without record', () => {
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));
    });

    it('should render default view', () => {
        const { getByTestId } = setup({
            field: 'jnl_title',
        });
        expect(getByTestId('jnl_title-input')).toBeInTheDocument();
    });
});
