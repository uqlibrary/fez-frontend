import React from 'react';
import { render, userEvent } from 'test-utils';
import { AddToSelectedSubjects } from './AddToSelectedSubjects';

jest.mock('./ForCodeAutocompleteField', () => ({
    ForCodeAutocompleteField: jest.fn(props => (
        <input
            data-testid="for-code-autocomplete"
            // trigger onChange with a fake item when we simulate a change
            onChange={() => props.onChange && props.onChange({ key: '123', value: 'Test subject' })}
            onKeyDown={props.onKeyDown}
        />
    )),
}));

const setup = onAdd => render(<AddToSelectedSubjects onAdd={onAdd || jest.fn} />);
describe('AddToSelectedSubjects', () => {
    it('renders the add button (closed state) by default', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        expect(queryByTestId('for-code-autocomplete')).not.toBeInTheDocument();
    });

    it('opens the bordered chip with autocomplete when the button is clicked', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        expect(queryByTestId('add-to-subject-selection-button')).not.toBeInTheDocument();
        expect(getByTestId('for-code-autocomplete')).toBeInTheDocument();
    });

    it('calls onAdd with mapped subject and closes when a subject is selected', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup(onAdd);

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete'), 'subject');

        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith({
            type: 'Subject',
            cvoId: '123',
            text: 'Test subject',
        });
        // should close after adding
        expect(queryByTestId('for-code-autocomplete')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
    });

    it('closes when Escape is pressed in the autocomplete input', async () => {
        const onAdd = jest.fn();
        const { getByTestId, queryByTestId } = setup(onAdd);

        await userEvent.click(getByTestId('add-to-subject-selection-button'));
        await userEvent.type(getByTestId('for-code-autocomplete'), '{escape}');

        expect(queryByTestId('for-code-autocomplete')).not.toBeInTheDocument();
        expect(getByTestId('add-to-subject-selection-button')).toBeInTheDocument();
        // onAdd must not have been called
        expect(onAdd).not.toHaveBeenCalled();
    });
});
