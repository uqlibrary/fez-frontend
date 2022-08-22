import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import JournalsListDataRow from './JournalsListDataRow';
import { JournalFieldsMap } from './JournalFieldsMap';
import { WithReduxStore, fireEvent, render, act } from 'test-utils';
import Immutable from 'immutable';
import { sanitiseId } from 'helpers/general';
import mediaQuery from 'css-mediaquery';
import { mockData } from 'mock/data/testing/journals/journalSearchResults';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

const testData = {
    row: mockData.data[0],
    index: 0,
};

const setup = (state = {}) => {
    const onChange = state.onChange ?? jest.fn();
    return render(
        <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
            <Table>
                <TableBody>
                    <JournalsListDataRow {...testData} {...state} onChange={onChange} />
                </TableBody>
            </Table>
        </WithReduxStore>,
    );
};

describe('JournalsListDataRow', () => {
    it('should render a row', () => {
        window.matchMedia = createMatchMedia(1024);
        const { getByTestId } = setup({ isSelectable: true, checked: false });
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).toBeInTheDocument();
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('checked');

        expect(getByTestId('journal-list-expander-btn-0')).toBeInTheDocument();

        // title link
        const linkId = sanitiseId(`${testData.row.jnl_jid}-${testData.row.jnl_title}-link`);
        expect(getByTestId(linkId)).toBeInTheDocument();
        expect(getByTestId(linkId)).toHaveTextContent(testData.row.jnl_title);
    });
});
