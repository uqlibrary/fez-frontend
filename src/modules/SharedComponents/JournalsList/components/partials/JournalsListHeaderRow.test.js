import React from 'react';
import Table from '@mui/material/Table';
import JournalsListHeaderRow from './JournalsListHeaderRow';
import JournalFieldsMap from './JournalFieldsMap';
import { act, WithReduxStore, fireEvent, render } from 'test-utils';
import { sanitiseId } from 'helpers/general';

const setup = (state = {}) => {
    const onChange = state.onChange ?? jest.fn();
    return render(
        <WithReduxStore initialState={{ searchJournalsReducer: state }}>
            <Table>
                <JournalsListHeaderRow {...state} onChange={onChange} />
            </Table>
        </WithReduxStore>,
    );
};

describe('JournalsListHeaderRow', () => {
    it('should render ', () => {
        const { getByTestId } = setup({ checked: false });
        expect(getByTestId('journal-list-header-col-1-select-all')).toBeInTheDocument();
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('checked');
    });
    it('should render without checkbox', () => {
        const { queryByTestId } = setup({ isSelectable: false });
        expect(queryByTestId('journal-list-header-col-1-select-all')).not.toBeInTheDocument();
    });
    it('should render with checked Select All ', () => {
        const { getByTestId } = setup({ isSelectable: true, checked: true });
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-header-col-1-select-all')).toHaveAttribute('checked');
    });
    it('should render all headers on with help icons', () => {
        const mockMap = [...JournalFieldsMap];
        mockMap.find(field => field.key === 'highest_quartile').subLabel = 'Test sublabel';
        jest.mock('./JournalFieldsMap', () => mockMap, { virtual: true });

        // this just checks the elements are in the page. See search.spec.js for breakpoint tests
        const { getByTestId, getByText } = setup({ isSelectable: true });

        expect(getByTestId('journal-list-header')).toBeInTheDocument();
        JournalFieldsMap.filter(item => item.compactView).map((item, index) => {
            expect(getByTestId(`journal-list-header-${sanitiseId(item.key)}`)).toHaveTextContent(item.label);
            if (index !== 0) {
                expect(getByTestId(`help-icon-${sanitiseId(item.key)}`)).toBeInTheDocument();
            }
            if (item.key === 'highest_quartile') {
                expect(getByText('Test sublabel')).toBeInTheDocument();
            }
        });
    });

    it('should fire onChange function when Select All is checked', () => {
        const onChange = jest.fn();
        const { getByTestId } = setup({ isSelectable: true, checked: false, onChange });
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('checked');
        act(() => {
            fireEvent.click(getByTestId('journal-list-header-col-1-select-all'));
        });
        expect(onChange).toHaveBeenCalled();
    });
});
