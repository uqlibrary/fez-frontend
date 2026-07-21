import React from 'react';
import { render as defaultRender } from 'test-utils';
import JournalUserLists from './index';
import { locale } from 'locale';

jest.mock('./Manager', () => () => <div data-testid="mock-manager" />);

const setup = () => defaultRender(<JournalUserLists />);

describe('JournalUserLists', () => {
    it('should render the page title and manager', () => {
        const { getByText, getByTestId } = setup();

        expect(getByText(locale.pages.journalUserLists.title)).toBeInTheDocument();
        expect(getByTestId('mock-manager')).toBeInTheDocument();
    });
});
