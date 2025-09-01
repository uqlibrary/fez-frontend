import React from 'react';
import Grid from '@mui/material/GridLegacy';
import JournalsListCollapsibleDataPanelContent from './JournalsListCollapsibleDataPanelContent';
import JournalFieldsMap from './JournalFieldsMap';
import mockData from 'mock/data/testing/journals/journals';
import { WithReduxStore, render, createMatchMedia } from 'test-utils';
import { sanitiseId } from 'helpers/general';

const defaultTestData = {
    item: 0,
    index: 0,
    classes: {},
    isFirstRow: true,
    isLastRow: true,
};

const setup = ({ testData = { ...defaultTestData }, ...state } = {}) => {
    const onChange = state.onChange ?? jest.fn();
    return render(
        <WithReduxStore initialState={{ searchJournalsReducer: state }}>
            <Grid container>
                <JournalsListCollapsibleDataPanelContent {...testData} {...state} onChange={onChange} />
            </Grid>
        </WithReduxStore>,
    );
};

describe('JournalsListCollapsibleDataPanelContent', () => {
    const testItems = JournalFieldsMap.filter(item => !item.compactView);

    it('should render panel content on desktop', () => {
        window.matchMedia = createMatchMedia(1024);
        testItems.map(item => {
            const data = item.translateFn(mockData[0]);
            document.body.innerHTML = '';
            const { getByTestId, getByText } = setup({ item, data });
            const id = sanitiseId(item.key);
            expect(getByTestId(`journal-list-header-${id}-${defaultTestData.index}`)).toBeInTheDocument();
            expect(getByText(item.label)).toBeInTheDocument();
            if (!!item.subLabel) {
                expect(getByText(item.subLabel)).toBeInTheDocument();
            }

            if (!!item.titleHelp) {
                expect(getByTestId(`help-icon-${id}-${defaultTestData.index}`)).toBeInTheDocument();
            }
            expect(getByTestId(`journal-list-data-${id}-${defaultTestData.index}`)).toBeInTheDocument();
        });
    });

    it('should render panel content on mobile', () => {
        window.matchMedia = createMatchMedia(599);
        testItems.map(item => {
            const data = item.translateFn(mockData[0]);
            document.body.innerHTML = '';
            const { getByTestId, getByText } = setup({ item, data });
            const id = sanitiseId(item.key);
            expect(getByTestId(`journal-list-header-${id}-${defaultTestData.index}`)).toBeInTheDocument();
            expect(getByText(item.label)).toBeInTheDocument();
            if (!!item.subLabel) {
                expect(getByText(item.subLabel)).toBeInTheDocument();
            }

            if (!!item.titleHelp) {
                expect(getByTestId(`help-icon-${id}-${defaultTestData.index}`)).toBeInTheDocument();
            }
            expect(getByTestId(`journal-list-data-${id}-${defaultTestData.index}`)).toBeInTheDocument();
        });
    });
});
