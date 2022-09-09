import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import JournalsListCollapsibleDataPanel from './JournalsListCollapsibleDataPanel';
import mockData from 'mock/data/testing/journals/journals';
import { WithReduxStore, render } from 'test-utils';
import Immutable from 'immutable';
import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

const defaultTestData = {
    row: mockData[0],
    index: 0,
    classes: {},
};

const setup = ({ testData = { ...defaultTestData }, ...state }) => {
    const onChange = state.onChange ?? jest.fn();
    return render(
        <WithReduxStore initialState={Immutable.Map({ searchJournalsReducer: state })}>
            <Table>
                <TableBody>
                    <JournalsListCollapsibleDataPanel {...testData} {...state} onChange={onChange} />
                </TableBody>
            </Table>
        </WithReduxStore>,
    );
};

describe('JournalsListCollapsibleDataPanel', () => {
    it('should render a closed panel', () => {
        window.matchMedia = createMatchMedia(1024);
        const { getByTestId } = setup({ open: false });
        expect(getByTestId(`collapsible-cell-closed-${defaultTestData.index}`)).toBeInTheDocument();
    });

    it('should render an open panel', () => {
        window.matchMedia = createMatchMedia(1024);
        const { getByTestId } = setup({ open: true });
        expect(getByTestId(`collapsible-cell-open-${defaultTestData.index}`)).toBeInTheDocument();
        expect(getByTestId(`journal-list-collapse-panel-${defaultTestData.index}`)).toBeInTheDocument();
    });

    /* coverage */
    it('should render an open panel for XS breakpoint', () => {
        window.matchMedia = createMatchMedia(599);
        const { getByTestId } = setup({ open: true });
        expect(getByTestId(`collapsible-cell-open-${defaultTestData.index}`)).toBeInTheDocument();
        expect(getByTestId(`journal-list-collapse-panel-${defaultTestData.index}`)).toBeInTheDocument();
    });
});
