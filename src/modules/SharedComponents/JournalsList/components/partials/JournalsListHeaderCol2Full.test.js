import React from 'react';
import JournalsListHeaderCol2Full from './JournalsListHeaderCol2Full';
import { render, WithReduxStore } from 'test-utils';

const testProps = {
    journal: {
        key: 'test_record',
        size: 20,
        titleHelp: {
            title: 'test',
            text: <p>test paragraph</p>,
        },
    },
};
const setup = (props = {}, state = {}) => {
    return render(
        <WithReduxStore initialState={{ searchJournalsReducer: state }}>
            <JournalsListHeaderCol2Full {...props} />
        </WithReduxStore>,
    );
};

describe('JournalsListHeaderCol2 Full', () => {
    it('Should show a title help if one provided, with margin', () => {
        const { queryByTestId } = setup({
            ...testProps,
        });
        expect(queryByTestId('help-icon-test-record')).toBeInTheDocument();
        const dataElement = queryByTestId('journal-list-header-full-test-record');
        expect(dataElement.querySelector('div.MuiGrid-grid-xs-2').style.marginRight).toEqual('10px');
    });
    it('Should show a title help if one provided, no margin', () => {
        const { queryByTestId } = setup({
            ...testProps,
            journal: {
                ...testProps.journal,
                size: 260,
            },
        });
        expect(queryByTestId('help-icon-test-record')).toBeInTheDocument();
        const dataElement = queryByTestId('journal-list-header-full-test-record');
        expect(dataElement.querySelector('div.MuiGrid-grid-xs-2').style.marginRight).toEqual('0px');
    });

    it('Should not show a title help if none provided', () => {
        const { queryByTestId } = setup({
            journal: {
                key: 'test_record',
                size: 255,
            },
        });
        expect(queryByTestId('help-icon-test-record')).not.toBeInTheDocument();
    });
});
