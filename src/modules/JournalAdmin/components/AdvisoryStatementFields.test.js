import React from 'react';
import Immutable from 'immutable';
import {
    api,
    assertRichTextEditorValue,
    render,
    setRichTextEditorValue,
    userEvent,
    waitForText,
    waitElementToBeInDocument,
    WithReduxStore,
} from 'test-utils';
import { FormProvider } from 'react-hook-form';
import { useValidatedForm } from 'hooks';
import { AdvisoryStatementFields } from './AdvisoryStatementFields';
import { JOURNAL_ADVISORY_STATEMENT_TYPE } from '../../../config/general';
import { vocabulariesList } from '../../../mock/data';
import * as repositories from '../../../repositories';
import { screen, within } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

let defaultComponentProps;

const TestForm = (props = {}) => {
    // eslint-disable-next-line react/prop-types
    const methods = useValidatedForm(props?.form || {});
    return (
        <FormProvider {...methods}>
            <form>
                <AdvisoryStatementFields {...(props?.field || {}) /* eslint-disable-line react/prop-types */} />
            </form>
        </FormProvider>
    );
};
function setup(props = {}) {
    const state = Immutable.Map({});

    return render(
        <WithReduxStore initialState={state}>
            <TestForm
                {...{
                    field: {
                        type: {
                            ...defaultComponentProps.type,
                            ...(props.field?.type || {}),
                        },
                        text: {
                            ...defaultComponentProps.text,
                            ...(props.field?.text || {}),
                        },
                    },
                    form: props?.form || {},
                }}
            />
        </WithReduxStore>,
    );
}

describe('Component JournalAdvisoryStatementTypeField', () => {
    beforeEach(() => {
        defaultComponentProps = {
            type: {
                name: 'adminSection.advisoryStatement.type',
                floatingLabelText: 'Advisory statement Type / default statement',
                id: 'jnl_advisory_statement_type',
                required: false,
            },
            text: {
                name: 'adminSection.advisoryStatement.text',
                title: 'Advisory statement',
                format: value => Immutable.Map(value),
                richEditorId: 'jnl-advisory-statement',
                canEdit: true,
                required: false,
                noRef: true,
            },
        };

        api.mock.cvo.get({
            cvoId: JOURNAL_ADVISORY_STATEMENT_TYPE,
            data: vocabulariesList[JOURNAL_ADVISORY_STATEMENT_TYPE].data,
        });
    });

    afterEach(() => {
        api.mock.reset();
    });

    const getTypeCvoId = title => {
        const match = vocabulariesList[JOURNAL_ADVISORY_STATEMENT_TYPE].data.find(
            v => v.controlled_vocab.cvo_title === title,
        ).controlled_vocab.cvo_id;
        if (!match) throw new Error(`unable to find statement type title matching: ${title}`);
        return match;
    };

    const getTypeDefaultStatementText = value => {
        const match = vocabulariesList[JOURNAL_ADVISORY_STATEMENT_TYPE].data
            .find(v => v.controlled_vocab.cvo_id === value || v.controlled_vocab.cvo_title === value)
            .controlled_vocab.cvo_desc?.trim?.();
        if (!match) throw new Error(`unable to find statement type matching: ${value}`);
        return match;
    };
    const setStatementText = async value =>
        await setRichTextEditorValue(defaultComponentProps.text.richEditorId, value);

    const assertStatementText = async value => {
        await assertRichTextEditorValue(defaultComponentProps.text.richEditorId, value);
        value &&
            (await waitForText(value, { within: () => screen.getByTestId(defaultComponentProps.text.richEditorId) }));
    };

    const clearStatementTypeField = async () => {
        await userEvent.click(screen.getByTestId(`${defaultComponentProps.type.id}-input`));
        await waitElementToBeInDocument(() =>
            within(screen.getByTestId(`${defaultComponentProps.type.id}-input`).parentNode).getByTitle('Clear'),
        );
        await userEvent.click(
            within(screen.getByTestId(`${defaultComponentProps.type.id}-input`).parentNode).getByTitle('Clear'),
        );
    };

    describe('without form values', () => {
        it('should allow typing in a new statement text', async () => {
            setup();
            const expectedStatement = 'advisory statement text';
            await setStatementText(expectedStatement);
            await assertStatementText(expectedStatement);
        });

        it('should allow selecting a statement type option with a default statement text', async () => {
            const { getByTestId } = setup();

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'err');
            await userEvent.click(await waitForText('Error'));
            const expectedStatement = getTypeDefaultStatementText('Error');
            await assertStatementText(expectedStatement);

            // make sure clearing statement type field resets statement text field to its initial state
            await clearStatementTypeField();
            await assertStatementText('');
        });

        it('should allow selecting a statement type without a default statement text', async () => {
            const { getByTestId } = setup();

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'warn');
            await userEvent.click(within(await screen.findByRole('listbox')).getAllByRole('option')[1]);
            await waitFor(() => expect(getByTestId(`${defaultComponentProps.type.id}-input`).value).toBe('Warning'));
            await assertStatementText('');
        });

        it('should not update custom statement text', async () => {
            const { getByTestId } = setup();

            const updatedStatement = 'custom advisory statement text';
            await setStatementText(updatedStatement);
            await assertStatementText(updatedStatement);

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'err');
            await userEvent.click(await waitForText('Error'));

            // make sure clearing statement type field won't reset statement text field to its initial state
            await assertStatementText(updatedStatement);
            await clearStatementTypeField();
            await assertStatementText(updatedStatement);
        });
    });

    describe('with form values', () => {
        it('should allow updating statement text', async () => {
            const statement = 'advisory statement text';
            setup({ form: { defaultValues: { [defaultComponentProps.text.name]: statement } } });
            await assertStatementText(statement);

            const updatedStatement = `${statement} updated`;
            await setStatementText(updatedStatement);
            await waitForText(updatedStatement);
        });

        it('should allow updating statement text by selecting a new statement type', async () => {
            const initialStatement = getTypeDefaultStatementText('Warning');
            const { getByTestId } = setup({
                form: {
                    defaultValues: {
                        [defaultComponentProps.type.name]: getTypeCvoId('Warning'),
                        [defaultComponentProps.text.name]: initialStatement,
                    },
                },
            });
            await waitForText('Warning');
            await assertStatementText(initialStatement);

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'err');
            await userEvent.click(await waitForText('Error'));
            const expectedStatement = getTypeDefaultStatementText('Error');
            await assertStatementText(expectedStatement);

            // make sure clearing statement type field resets statement text field to its initial state
            await clearStatementTypeField();
            await assertStatementText(initialStatement);
        });

        it('should allow clearing statement text by selecting a statement type without a default statement text', async () => {
            const initialStatement = getTypeDefaultStatementText('Error');
            const { getByTestId } = setup({
                form: {
                    defaultValues: {
                        [defaultComponentProps.type.name]: getTypeCvoId('Error'),
                        [defaultComponentProps.text.name]: initialStatement,
                    },
                },
            });
            await waitForText('Error');
            await assertStatementText(initialStatement);

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'warn');
            await userEvent.click(within(await screen.findByRole('listbox')).getAllByRole('option')[1]);
            await waitFor(() => expect(getByTestId(`${defaultComponentProps.type.id}-input`).value).toBe('Warning'));
            await assertStatementText('');

            // make sure clearing statement type field resets statement text field to its initial state
            await clearStatementTypeField();
            await assertStatementText(initialStatement);
        });

        it('should not update custom statement', async () => {
            const customStatement = 'custom advisory statement text';
            const { getByTestId } = setup({
                form: {
                    defaultValues: {
                        [defaultComponentProps.type.name]: getTypeCvoId('Warning'),
                        [defaultComponentProps.text.name]: customStatement,
                    },
                },
            });
            await waitForText('Warning');
            await assertStatementText(customStatement);

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'err');
            await userEvent.click(await waitForText('Error'));

            // make sure clearing statement type field won't reset statement text field to its initial state
            await assertStatementText(customStatement);
            await clearStatementTypeField();
            await assertStatementText(customStatement);
        });

        it('should not update statement text that has been replaced by a custom statement', async () => {
            const initialStatement = getTypeDefaultStatementText('Warning');
            const { getByTestId } = setup({
                form: {
                    defaultValues: {
                        [defaultComponentProps.type.name]: getTypeCvoId('Warning'),
                        [defaultComponentProps.text.name]: initialStatement,
                    },
                },
            });
            await waitForText('Warning');
            await assertStatementText(initialStatement);

            // update statement type
            const updatedStatement = 'custom advisory statement text';
            await setStatementText(updatedStatement);
            await assertStatementText(updatedStatement);

            // select statement type
            await userEvent.type(getByTestId(`${defaultComponentProps.type.id}-input`), 'err');
            await userEvent.click(await waitForText('Error'));

            // make sure clearing statement type field won't reset statement text field to its initial state
            await assertStatementText(updatedStatement);
            await clearStatementTypeField();
            await assertStatementText(updatedStatement);
        });
    });
});
