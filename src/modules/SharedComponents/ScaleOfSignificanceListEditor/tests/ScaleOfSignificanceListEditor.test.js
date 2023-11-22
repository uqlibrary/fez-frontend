import React from 'react';
import ScaleOfSignificanceListEditor from '../ScaleOfSignificanceListEditor';
import { List } from 'immutable';
import { rtlRender, fireEvent, within } from 'test-utils';

/* eslint react/prop-types: 0 */
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: props => {
        const TextField = require('@mui/material/TextField').default;

        return (
            <TextField
                id={props.richEditorId}
                onChange={e => props.onChange({ plainText: e.target.value })}
                inputProps={{ 'aria-label': 'contribution-statement', 'data-testid': props.richEditorId }}
                inputRef={props.inputRef}
            />
        );
    },
}));

const defaultProps = {
    className: 'testClass',
    searchKey: { value: 'rek_value', order: 'rek_order' },
    isValid: jest.fn(),
    canEdit: true,
    disabled: false,
    onChange: jest.fn(),
    formComponent: jest.fn(),
    inputField: jest.fn(),
    hideReorder: false,
    distinctOnly: false,
    errorText: '',
    scrollList: false,
    scrollListHeight: 250,
    listEditorId: 'test-list-editor',
    input: {
        name: 'scaleofsignificancestatement',
        value: [
            {
                rek_order: 1,
                rek_value: {
                    author: {
                        rek_author_id: 111,
                        rek_author_pid: 'UQ:11',
                        rek_author: 'Test, Tom',
                        rek_author_order: 1,
                    },
                    id: 922694,
                    key: 0,
                    value: { plainText: 'Missing', htmlText: 'Missing' },
                },
            },
        ],
    },
    locale: {
        form: {
            locale: {
                significanceInputFieldLabel: 'NoLabel',
                addButtonLabel: 'Add item',
                editButtonLabel: 'Edit item',
            },
        },
    },
};

function setup(testProps = {}) {
    const props = {
        ...defaultProps,
        ...testProps,
    };
    return rtlRender(<ScaleOfSignificanceListEditor {...props} />);
}

describe('ScaleOfSignificanceListEditor tests', () => {
    it('should render full component with a defined className', () => {
        const { container } = setup({ className: 'requiredField' });
        expect(container).toMatchSnapshot();
    });

    it('should render full component as disabled', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render input value as itemList', () => {
        const { container } = setup({
            input: {
                name: 'test',
                value: [
                    {
                        rek_value: 'test 1',
                    },
                    {
                        rek_value: 'test 2',
                    },
                ],
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render input value as itemList for List', () => {
        const { container } = setup({
            input: {
                name: 'test',
                value: new List([
                    {
                        rek_value: 'test 1',
                    },
                    {
                        rek_value: 'test 2',
                    },
                ]),
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should process incomplete props without error', () => {
        const { container } = setup({
            input: {
                name: 'test',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render add form', () => {
        const { container, getByTestId } = setup();
        fireEvent.click(getByTestId('rek-significance-showhidebutton'));
        expect(container).toMatchSnapshot();
    });

    it('should add an entry', () => {
        const { container, getByTestId, getByRole } = setup();
        fireEvent.click(getByTestId('rek-significance-showhidebutton'));
        fireEvent.mouseDown(getByTestId('rek-significance-select'));
        fireEvent.click(getByRole('option', { name: 'Minor' }));
        fireEvent.change(getByTestId('rek-creator-contribution-statement'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-significance-add'));
        expect(container).toMatchSnapshot();
    });

    it('should render edit form', () => {
        const { container, getByTestId } = setup();
        fireEvent.click(getByTestId('test-list-editor-list-row-0-edit'));
        expect(container).toMatchSnapshot();
    });

    it('should update an object item in the list', () => {
        const { container, getByTestId, getByRole } = setup();
        expect(within(getByTestId('test-list-editor-list-row-0')).queryByText('Major')).not.toBeInTheDocument();

        fireEvent.click(getByTestId('test-list-editor-list-row-0-edit'));
        fireEvent.mouseDown(getByTestId('rek-significance-select'));
        fireEvent.click(getByRole('option', { name: 'Major' }));
        fireEvent.change(getByTestId('rek-creator-contribution-statement'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('rek-significance-add'));

        expect(within(getByTestId('test-list-editor-list-row-0')).queryByText('Major')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should delete an item from the list', () => {
        const { getByText, getByTestId } = setup();
        fireEvent.click(getByTestId('test-list-editor-list-row-0-delete'));
        fireEvent.click(getByTestId('confirm-test-list-editor-list-row-0-delete'));
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should delete all items from a list', () => {
        const { getByText, getByTestId } = setup();
        fireEvent.click(getByTestId('delete-all-test-list-editor'));
        fireEvent.click(getByTestId('confirm-test-list-editor-delete-all'));
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should move up an item', () => {
        const { getByTestId } = setup({
            input: {
                name: 'test',
                value: new List([
                    {
                        rek_value: {
                            author: {
                                rek_author_id: 111,
                                rek_author: 'Test, Author 1',
                                rek_author_order: 1,
                            },
                            value: { plainText: 'Minor', htmlText: 'Minor' },
                        },
                    },
                    {
                        rek_value: {
                            author: {
                                rek_author_id: 222,
                                rek_author: 'Test, Author 2',
                                rek_author_order: 2,
                            },
                            value: { plainText: 'Major', htmlText: 'Major' },
                        },
                    },
                ]),
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(getByTestId('test-list-editor-list-row-0')).toHaveTextContent(/Author 1/);
        expect(getByTestId('test-list-editor-list-row-1')).toHaveTextContent(/Author 2/);
        fireEvent.click(getByTestId('test-list-editor-list-row-1-move-up'));
        expect(getByTestId('test-list-editor-list-row-0')).toHaveTextContent(/Author 2/);
        expect(getByTestId('test-list-editor-list-row-1')).toHaveTextContent(/Author 1/);
    });

    it('should move down an item', () => {
        const { getByTestId } = setup({
            input: {
                name: 'test',
                value: new List([
                    {
                        rek_value: {
                            author: {
                                rek_author_id: 111,
                                rek_author: 'Test, Author 1',
                                rek_author_order: 1,
                            },
                            value: { plainText: 'Minor', htmlText: 'Minor' },
                        },
                    },
                    {
                        rek_value: {
                            author: {
                                rek_author_id: 222,
                                rek_author: 'Test, Author 2',
                                rek_author_order: 2,
                            },
                            value: { plainText: 'Major', htmlText: 'Major' },
                        },
                    },
                ]),
            },
            searchKey: {
                order: 'rek_order',
                value: 'rek_value',
            },
        });
        expect(getByTestId('test-list-editor-list-row-0')).toHaveTextContent(/Author 1/);
        expect(getByTestId('test-list-editor-list-row-1')).toHaveTextContent(/Author 2/);
        fireEvent.click(getByTestId('test-list-editor-list-row-0-move-down'));
        expect(getByTestId('test-list-editor-list-row-0')).toHaveTextContent(/Author 2/);
        expect(getByTestId('test-list-editor-list-row-1')).toHaveTextContent(/Author 1/);
    });
});
