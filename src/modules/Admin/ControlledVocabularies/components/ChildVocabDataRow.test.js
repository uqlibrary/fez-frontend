import React from 'react';

import { render, WithReduxStore, WithRouter, userEvent, within } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabDataRow from './ChildVocabDataRow';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';

jest.mock('../ControlledVocabularyContext');
import {
    ControlledVocabulariesActionContext,
    ControlledVocabulariesStateContext,
} from '../ControlledVocabularyContext';

const row = mockData.childVocabList['453669'].data[0].controlled_vocab;

function setup(testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) {
    const { actionContext, stateContext, ...rest } = testProps;

    const actionContextProps = {
        onAdminEditActionClick: jest.fn(),
        ...actionContext,
    };
    const stateContextProps = {
        cvo_id: null,
        isOpen: false,
        ...stateContext,
    };

    const props = { parentId: 1, ...rest };

    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <ControlledVocabulariesActionContext.Provider value={actionContextProps}>
                    <ControlledVocabulariesStateContext.Provider value={stateContextProps}>
                        <ChildVocabDataRow {...props} />
                    </ControlledVocabulariesStateContext.Provider>
                </ControlledVocabulariesActionContext.Provider>
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('ControlledVocabularies ChildVocabTable', () => {
    it('should render the child table row', async () => {
        const { getByTestId } = setup({ row: row });
        expect(getByTestId('child-row-id-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-desc-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-order-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-image-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-eid-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-action-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-link-453670')).toBeInTheDocument();
        expect(getByTestId('child-row-title-link-453670').href).toMatch(/\/\?id=453670$/);
    });

    it('should fire the edit vocab function when the edit button is clicked', async () => {
        const mockFn = jest.fn();
        const { getByTestId } = setup({
            row: row,
            actionContext: {
                onAdminEditActionClick: mockFn,
            },
        });
        expect(within(getByTestId('row-453670')).getByText('453670'));
        expect(within(getByTestId('row-453670')).getByText('Yukulta / Ganggalidda language G34'));
        expect(within(getByTestId('row-453670')).getByText(/^G34$/));
        await userEvent.click(getByTestId('admin-edit-button-453670'));
        expect(mockFn).toHaveBeenCalledWith({
            parentId: 1,
            row: expect.objectContaining({ cvo_title: 'Yukulta / Ganggalidda language G34' }),
        });
    });
});
