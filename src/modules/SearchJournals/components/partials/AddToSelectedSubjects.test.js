import React from 'react';
import { assertDisabled, render, userEvent, waitFor, waitForText, WithReduxStore } from 'test-utils';
import { AddToSelectedSubjects } from './AddToSelectedSubjects';

jest.mock('hooks/useControlledVocabs', () => ({
    __esModule: true,
    useControlledVocabs: jest.fn().mockReturnValue({
        items: [
            {
                key: 1000,
                value: '1000 General',
            },
            {
                key: 1010,
                value: '1010 Math',
            },
        ],
        fetch: jest.fn(),
        itemsLoading: false,
    }),
}));

import { useControlledVocabs } from 'hooks/useControlledVocabs';
import { FOR_CODE_VOCAB_ID } from '../../../../config/general';

const setup = ({ onAdd, selected, state } = {}) =>
    render(
        <WithReduxStore initialState={state}>
            <AddToSelectedSubjects onAdd={onAdd || jest.fn} selected={selected} />
        </WithReduxStore>,
    );
describe('AddToSelectedSubjects', () => {
    it('should render the add button (closed state) by default', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
    });

    it('should render a disabled button when state `journalsListLoading=true`', () => {
        setup({ state: { searchJournalsReducer: { journalsListLoading: true } } });
        assertDisabled('add-to-subject-selection-button');
    });

    it('should open the bordered chip with autocomplete when the button is clicked', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        expect(queryByTestId('add-to-subject-selection-button')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(getByTestId('for-code-autocomplete-field-input')).toHaveFocus();
        });
    });

    it('should call given onAdd with mapped subject and closes when a subject is selected', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        await userEvent.click(await waitForText('1000 General'));

        expect(useControlledVocabs).toHaveBeenCalledWith(FOR_CODE_VOCAB_ID, expect.any(Function));
        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith({
            cvoId: 1000,
            id: 'Subject-1000',
            text: '1000 General',
            type: 'Subject',
        });
        // should close after adding
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
    });

    it('should hide selected subjects from dropdown list', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId, queryByText } = setup({
            onAdd,
            selected: [
                {
                    'Subject-1000': {
                        cvoId: 1000,
                        id: 'Subject-1000',
                        text: '1000 General',
                        type: 'Subject',
                    },
                },
            ],
        });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        await userEvent.click(await waitForText('1010 Math'));
        // should not list already selected subjects
        expect(queryByText('1000 General')).not.toBeInTheDocument();

        expect(useControlledVocabs).toHaveBeenCalledWith(FOR_CODE_VOCAB_ID, expect.any(Function));
        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith({
            cvoId: 1010,
            id: 'Subject-1010',
            text: '1010 Math',
            type: 'Subject',
        });
        // should close after adding
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
    });

    it('closes when Escape is pressed in the autocomplete input', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '{escape}');

        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        // onAdd must not have been called
        expect(onAdd).not.toHaveBeenCalled();
    });
});
