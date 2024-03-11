import React from 'react';

import { render, WithReduxStore, WithRouter, fireEvent, userEvent, within } from 'test-utils';

import * as mockData from 'mock/data';

import ChildVocabDataRow from './ChildVocabDataRow';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';
import * as actions from 'actions/viewControlledVocab';

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

        expect(getByTestId('child-row-id-453670')).toHaveTextContent('453670');
        expect(getByTestId('child-row-title-453670')).toHaveTextContent('Yukulta / Ganggalidda language G34');
        expect(getByTestId('child-row-desc-453670')).toHaveTextContent('');
        expect(getByTestId('child-row-eid-453670')).toHaveTextContent('G34');
        expect(getByTestId('child-row-action-453670')).toHaveTextContent('');

        const spy = jest.spyOn(actions, 'loadChildVocabList');
        fireEvent.click(getByTestId('child-row-title-link-453670'));
        expect(spy).toHaveBeenCalled();
    });
    it('should render a locked child table row', async () => {
        const { getByTestId, queryByTestId } = setup({ row: row, locked: true });
        expect(getByTestId('child-row-id-453670')).toHaveTextContent('453670');
        expect(getByTestId('child-row-title-453670')).toHaveTextContent('Yukulta / Ganggalidda language G34');
        expect(getByTestId('child-row-desc-453670')).toHaveTextContent('');
        expect(getByTestId('child-row-eid-453670')).toHaveTextContent('G34');
        expect(getByTestId('child-row-title-link-453670')).toHaveClass('MuiLink-button');
        expect(queryByTestId('child-row-action-453670')).not.toBeInTheDocument();
        expect(queryByTestId('admin-edit-button-453670')).not.toBeInTheDocument();

        // expect 4 columns, ignoring the portal which is first child in the child row
        expect(getByTestId('child-row-em-453670').children[1].children.length).toBe(4);
    });
    it('should render a locked child table row with hidden icon', async () => {
        const { getByTestId, queryByTestId } = setup({ row: { ...row, cvo_hide: 1 }, locked: true });
        expect(getByTestId('child-row-id-453670')).toHaveTextContent('453670');
        expect(getByTestId('child-row-title-453670')).toHaveTextContent('Yukulta / Ganggalidda language G34');
        expect(getByTestId('child-row-desc-453670')).toHaveTextContent('');
        expect(getByTestId('child-row-eid-453670')).toHaveTextContent('G34');
        expect(getByTestId('child-row-title-link-453670')).toHaveClass('MuiLink-button');
        expect(queryByTestId('child-row-action-453670')).not.toBeInTheDocument();
        expect(queryByTestId('admin-edit-button-453670')).not.toBeInTheDocument();
        expect(queryByTestId('row-hidden-icon-453670')).toBeInTheDocument();

        // expect 4 columns, ignoring the portal which is first child in the child row
        expect(getByTestId('child-row-em-453670').children[1].children.length).toBe(4);
    });

    it('should fire the edit vocab function when the edit button is clicked', async () => {
        const mockFn = jest.fn();
        const { getByTestId } = setup({
            row: row,
            actionContext: {
                onAdminEditActionClick: mockFn,
            },
        });

        expect(within(getByTestId('child-row-em-453670')).getByText('453670'));
        expect(within(getByTestId('child-row-em-453670')).getByText('Yukulta / Ganggalidda language G34'));
        expect(within(getByTestId('child-row-em-453670')).getByText(/^G34$/));
        await userEvent.click(getByTestId('admin-edit-button-453670'));
        expect(mockFn).toHaveBeenCalledWith({
            parentId: 1,
            row: expect.objectContaining({ cvo_title: 'Yukulta / Ganggalidda language G34' }),
        });
    });
});
