import React from 'react';
import { assertDisabled, render, userEvent, waitForText, WithReduxStore } from 'test-utils';
import { AddToSelectedSubjects } from './AddToSelectedSubjects';

jest.mock('hooks/useControlledVocabs', () => ({
    __esModule: true,
    useControlledVocabs: jest.fn().mockReturnValue({
        items: [
            {
                key: 453236,
                value: '1000 General',
            },
        ],
        fetch: jest.fn(),
        itemsLoading: false,
    }),
}));

import { useControlledVocabs } from 'hooks/useControlledVocabs';
import { FOR_CODE_VOCAB_ID } from '../../../../config/general';

const setup = ({ onAdd, state } = {}) =>
    render(
        <WithReduxStore initialState={state}>
            <AddToSelectedSubjects onAdd={onAdd || jest.fn} />
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
        expect(getByTestId('for-code-autocomplete-field-input')).toBeInTheDocument();
    });

    it('should call given onAdd with mapped subject and closes when a subject is selected', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup({ onAdd });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '100');
        await userEvent.click(await waitForText('1000 General'));

        expect(useControlledVocabs).toHaveBeenCalledWith(FOR_CODE_VOCAB_ID);
        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith({
            type: 'Subject',
            cvoId: 453236,
            text: '1000 General',
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
