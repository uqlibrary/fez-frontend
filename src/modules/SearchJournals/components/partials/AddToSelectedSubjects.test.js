import React from 'react';
import { api, assertDisabled, render, userEvent, waitFor, waitForText, WithReduxStore } from 'test-utils';
import { AddToSelectedSubjects } from './AddToSelectedSubjects';
import { JOURNAL_SEARCH_SUBJECTS_VOCAB_ID } from 'config/general';

jest.mock('hooks/useControlledVocabs', () => {
    // require inside the factory to avoid hoisting issues
    const { vocabulariesList } = require('mock/data');
    const { JOURNAL_SEARCH_SUBJECTS_VOCAB_ID } = require('config/general');

    return {
        __esModule: true,
        useControlledVocabs: jest.fn().mockReturnValue({
            items: vocabulariesList[JOURNAL_SEARCH_SUBJECTS_VOCAB_ID].data.map(item => ({
                key: item.controlled_vocab.cvo_id,
                value: item.controlled_vocab.cvo_title,
            })),
            fetch: jest.fn(),
            itemsLoading: false,
        }),
    };
});

import { useControlledVocabs } from 'hooks/useControlledVocabs';
import { vocabulariesList } from '../../../../mock/data';

const setup = ({ onAdd, selected, state } = {}) =>
    render(
        <WithReduxStore initialState={state}>
            <AddToSelectedSubjects onAdd={onAdd || jest.fn} selected={selected} />
        </WithReduxStore>,
    );

describe('AddToSelectedSubjects', () => {
    afterEach(() => {
        jest.clearAllMocks();
        api.mock.reset();
    });

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

        expect(useControlledVocabs).toHaveBeenCalledWith(JOURNAL_SEARCH_SUBJECTS_VOCAB_ID, expect.any(Function));
        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith({
            cvoId: 41000,
            id: 'Subject-41000',
            text: '1000 General',
            type: 'Subject',
        });
        // should close after adding
        expect(queryByTestId('for-code-autocomplete-field-input')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
    });

    it('should hide selected subjects from dropdown list', async () => {
        // user real hook to test filter func
        useControlledVocabs.mockImplementation(jest.requireActual('hooks/useControlledVocabs').useControlledVocabs);

        api.mock.cvo.get({
            cvoId: JOURNAL_SEARCH_SUBJECTS_VOCAB_ID,
            data: vocabulariesList[JOURNAL_SEARCH_SUBJECTS_VOCAB_ID].data,
        });

        const onAdd = jest.fn();
        const { getByTestId, queryByText } = setup({
            onAdd,
            selected: {
                'Subject-41000': {
                    cvoId: 41000,
                    id: 'Subject-41000',
                    text: '1000 General',
                    type: 'Subject',
                },
            },
        });

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete-field-input'), '10');
        await waitForText('1010 Math');
        // should not list already selected subjects
        expect(queryByText('1000 General')).not.toBeInTheDocument();
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
