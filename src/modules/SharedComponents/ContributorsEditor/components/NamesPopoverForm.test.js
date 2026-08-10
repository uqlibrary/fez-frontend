import React, { createRef } from 'react';
import { render, act, assertDisabled, assertEnabled } from 'test-utils';
import userEvent from '@testing-library/user-event';
import NamesPopoverForm, { defaultFormFields, MODE_GIVEN_NAME_FIRST } from './NamesPopoverForm';

const setup = (props = {}, renderMethod = render) => {
    const ref = createRef();

    const result = renderMethod(
        <>
            <button data-testid="trigger" onClick={event => ref.current.open(event, props.value || '')}>
                open form
            </button>
            <NamesPopoverForm id="test" ref={ref} onClose={jest.fn()} {...props} />
        </>,
    );

    return { ...result, ref };
};

describe('NamesPopoverForm', () => {
    let user;
    beforeEach(() => {
        user = userEvent.setup();
    });
    afterEach(() => jest.clearAllMocks());

    describe('initial render', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        it('should not display form on initial render', async () => {
            const { queryByTestId } = setup();
            await act(async () => {
                jest.runAllTimers();
            });

            expect(queryByTestId('test-names-popover-form-family-name-input')).not.toBeInTheDocument();
            expect(queryByTestId('test-names-popover-form-given-name-input')).not.toBeInTheDocument();
        });
    });

    describe('popover behavior', () => {
        it('should display form when trigger is clicked and focus on first field', async () => {
            const { getByTestId, findByTestId } = setup();
            await user.click(getByTestId('trigger'));

            expect(await findByTestId('test-names-popover-form-family-name-input')).toBeInTheDocument();
            expect(getByTestId('test-names-popover-form-family-name-input')).toHaveFocus();
            expect(getByTestId('test-names-popover-form-given-name-input')).toBeInTheDocument();
        });

        it('should display form when trigger is clicked and focus on first field for `given name first` mode', async () => {
            const { getByTestId, findByTestId } = setup({ mode: MODE_GIVEN_NAME_FIRST });
            await user.click(getByTestId('trigger'));

            expect(await findByTestId('test-names-popover-form-given-name-input')).toBeInTheDocument();
            expect(getByTestId('test-names-popover-form-given-name-input')).toHaveFocus();
            expect(getByTestId('test-names-popover-form-family-name-input')).toBeInTheDocument();
        });

        it('should open and pre-fill fields with given values', async () => {
            const { getByTestId, findByTestId } = setup({ value: ' Doe ,  John ' });
            await user.click(getByTestId('trigger'));

            const familyInput = await findByTestId('test-names-popover-form-family-name-input');
            const givenInput = getByTestId('test-names-popover-form-given-name-input');

            expect(familyInput).toHaveValue('Doe');
            expect(givenInput).toHaveValue('John');
        });

        it('should open and pre-fill fields with given values for `given name first` mode', async () => {
            const { getByTestId, findByTestId } = setup({ value: ' John  Doe ', mode: MODE_GIVEN_NAME_FIRST });
            await user.click(getByTestId('trigger'));

            const familyInput = await findByTestId('test-names-popover-form-family-name-input');
            const givenInput = getByTestId('test-names-popover-form-given-name-input');

            expect(familyInput).toHaveValue('Doe');
            expect(givenInput).toHaveValue('John');
        });

        it('should hide on ESC without calling onClose', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId, queryByTestId } = setup(onClose);
            await user.click(getByTestId('trigger'));

            await findByTestId('test-names-popover-form-family-name-input');
            expect(queryByTestId('test-names-popover-form')).toBeInTheDocument();
            await user.keyboard('{escape}');

            expect(queryByTestId('test-names-popover-form')).not.toBeInTheDocument();
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('validation', () => {
        it('should validate fields against all validation rules', async () => {
            const { getByTestId, queryByTestId, findByTestId } = setup();
            await user.click(getByTestId('trigger'));

            for (const item of defaultFormFields) {
                // non-empty values
                if (item.name === 'family-name') {
                    expect(await findByTestId(`test-names-popover-form-${item.name}-helper-text`)).toHaveTextContent(
                        'This field is required',
                    );
                    assertDisabled(getByTestId(`test-names-popover-form-submit-button`));
                }

                // min chars
                await user.type(await getByTestId(`test-names-popover-form-${item.name}-input`), 'd');
                expect(getByTestId(`test-names-popover-form-${item.name}-helper-text`)).toHaveTextContent(
                    'Must be at least 2 characters',
                );
                assertDisabled(getByTestId(`test-names-popover-form-submit-button`));

                // commas
                await user.type(await getByTestId(`test-names-popover-form-${item.name}-input`), 'd,');
                expect(getByTestId(`test-names-popover-form-${item.name}-helper-text`)).toHaveTextContent(
                    'Commas are not allowed',
                );
                assertDisabled(getByTestId(`test-names-popover-form-submit-button`));

                await user.type(await getByTestId(`test-names-popover-form-${item.name}-input`), '{backspace}d');
                expect(queryByTestId(`test-names-popover-form-${item.name}-helper-text`)).not.toBeInTheDocument();
            }
            assertEnabled(getByTestId(`test-names-popover-form-submit-button`));
        });
    });

    describe('submission', () => {
        it('should allow typing full name and submit the form', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId } = setup({ onClose });
            await user.click(getByTestId('trigger'));

            await user.type(await findByTestId('test-names-popover-form-family-name-input'), '  Doe  ');
            await user.type(getByTestId('test-names-popover-form-given-name-input'), '  John  ');
            await user.click(getByTestId('test-names-popover-form-submit-button'));

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith('Doe, John');
        });

        it('should allow typing last name only and submit the form', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId } = setup({ onClose });
            await user.click(getByTestId('trigger'));

            await user.type(await findByTestId('test-names-popover-form-family-name-input'), '  Doe  ');
            await user.click(getByTestId('test-names-popover-form-submit-button'));

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith('Doe');
        });

        it('should allow typing full name and the submit form while on `given name first` mode', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId } = setup({ onClose, mode: MODE_GIVEN_NAME_FIRST });
            await user.click(getByTestId('trigger'));

            await user.type(await findByTestId('test-names-popover-form-family-name-input'), '  Doe  ');
            await user.type(getByTestId('test-names-popover-form-given-name-input'), '  John  ');
            await user.click(getByTestId('test-names-popover-form-submit-button'));

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith('John Doe');
        });

        it('should allow typing last name only and submit the form while on `given name first` mode', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId } = setup({ onClose, mode: MODE_GIVEN_NAME_FIRST });
            await user.click(getByTestId('trigger'));

            await user.type(await findByTestId('test-names-popover-form-family-name-input'), '  Doe  ');
            await user.click(getByTestId('test-names-popover-form-submit-button'));

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith('Doe');
        });

        it('should submit form on enter', async () => {
            const onClose = jest.fn();
            const { getByTestId, findByTestId } = setup({ onClose });
            await user.click(getByTestId('trigger'));

            await user.type(await findByTestId('test-names-popover-form-family-name-input'), '  Doe  ');
            await user.type(getByTestId('test-names-popover-form-given-name-input'), '  John  ');
            await user.keyboard('{enter}');

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledWith('Doe, John');
        });
    });
});
