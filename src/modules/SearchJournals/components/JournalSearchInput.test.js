import React from 'react';
import { fireEvent, render, WithReduxStore } from 'test-utils';
import { JournalSearchInput } from './JournalSearchInput';
import locale from 'locale/components';
import { act } from '@testing-library/react';

const setup = state => {
    return render(
        <WithReduxStore>
            <JournalSearchInput {...{ onReset: jest.fn(), ...state }} />
        </WithReduxStore>,
    );
};

describe('JournalSearchInput', () => {
    it('should render', () => {
        const { getByText, queryByTestId } = setup();
        expect(getByText(locale.components.searchJournals.journalSearchInput.titlePrefix)).toBeInTheDocument();
        expect(getByText(locale.components.searchJournals.journalSearchInput.title)).toBeInTheDocument();
        expect(queryByTestId('journal-search-keywords-input')).toBeInTheDocument();
        expect(queryByTestId('clear-journal-search-keywords')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow to enter short text', () => {
        const input = 'a';
        const { queryByTestId } = setup();
        fireEvent.change(queryByTestId('journal-search-keywords-input'), { target: { value: input } });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        expect(queryByTestId('clear-journal-search-keywords')).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('should allow to enter text', async () => {
        jest.useFakeTimers();
        global.dataLayer = { push: jest.fn() };
        const input = 'abc';
        const { queryByTestId } = setup();
        fireEvent.change(queryByTestId('journal-search-keywords-input'), { target: { value: input } });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        await act(() => jest.advanceTimersByTime(2000));
        expect(global.dataLayer.push).toHaveBeenCalledTimes(1);
    });

    it('should allow to clear text', () => {
        const input = 'abc';
        const { queryByTestId } = setup({ initialValue: input });
        expect(queryByTestId('journal-search-keywords-input').value).toBe(input);
        fireEvent.click(queryByTestId('clear-journal-search-keywords'));
        expect(queryByTestId('journal-search-keywords-input').value).toBe('');
    });
});
