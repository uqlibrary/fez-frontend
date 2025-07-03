import React from 'react';
import { rtlRender } from 'test-utils';
import FieldGridItem from './FieldGridItem';
import { FormProvider, useFormContext } from 'react-hook-form';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { useValidatedForm } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';
import { fieldConfig } from 'config/journalAdmin';

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

    describe('composed field', () => {
        it('should handle composed field', () => {
            fieldConfig.default.composed_field = {
                composed: true,
                component: props => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const { register } = useFormContext();
                    return (
                        <>
                            <div>
                                <input
                                    {...register(props.field1.name)}
                                    {...props.field1}
                                    className={props.field1.error ? 'error' : ''}
                                />
                            </div>
                            <div>
                                <input
                                    {...register(props.field2.name)}
                                    {...props.field2}
                                    className={props.field2.error ? 'error' : ''}
                                />
                            </div>
                        </>
                    );
                },
                componentProps: {
                    field1: {
                        'data-testid': 'field1',
                        name: 'sectionA.field1',
                    },
                    field2: {
                        'data-testid': 'field2',
                        name: 'sectionA.field2',
                    },
                },
            };
            const { getByTestId } = setup({
                field: 'composed_field',
                methods: {
                    getFieldState: jest.fn(field => field === 'sectionA.field1' && { error: 'error message' }),
                },
                values: {
                    sectionA: {
                        field1: 'value 1',
                    },
                },
            });

            expect(getByTestId('field1')).toHaveValue('value 1');
            expect(getByTestId('field1')).toHaveAttribute('class', 'error');
            expect(getByTestId('field1')).toHaveAttribute('errortext', 'error message');
            expect(getByTestId('field2')).toHaveValue('');
            expect(getByTestId('field2')).not.toHaveAttribute('class', 'error');
            expect(getByTestId('field2')).not.toHaveAttribute('errortext', 'error message');
        });
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
