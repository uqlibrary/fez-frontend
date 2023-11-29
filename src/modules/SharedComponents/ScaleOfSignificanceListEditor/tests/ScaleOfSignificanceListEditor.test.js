import React from 'react';
import ScaleOfSignificanceListEditor from '../ScaleOfSignificanceListEditor';
import { List } from 'immutable';
import { render, WithReduxStore, fireEvent, within } from 'test-utils';

window.CKEDITOR = {
    replace: () => ({
        setReadOnly: jest.fn(),
        setData: jest.fn(),
        on: jest.fn(),
    }),
};

/* eslint react/prop-types: 0 */
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: props => {
        const TextField = require('@mui/material/TextField').default;

        // props.instanceRef.current = { setData: jest.fn(), value: 'try' };
        if (props.inputRef.current) props.instanceRef.current = props.inputRef.current;
        else props.instanceRef.current = { setData: jest.fn() };
        if (props.instanceRef.current) props.instanceRef.current.setData = jest.fn();
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
    return render(
        <WithReduxStore>
            <ScaleOfSignificanceListEditor {...props} />
        </WithReduxStore>,
    );
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

    /*
    it('should render items not more than maxCount', () => {
        const wrapper = setup({ maxCount: 1 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
        wrapper.instance().saveChangeToItem('two');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should not add null item to the list', () => {
        const wrapper = setup();
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem(undefined);
        wrapper.instance().saveChangeToItem(null);
        wrapper.instance().saveChangeToItem('');
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('should render items individually when comma separated not more than maxCount', () => {
        const wrapper = setup({ maxCount: 5 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().saveChangeToItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should add item and set state', () => {
        const wrapper = setup({
            maxCount: 5,
            distinctOnly: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().saveChangeToItem({
            key: 'test',
            value: 'test',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not call transformOutput if onChange prop method is not defined', () => {
        const wrapper = setup({
            onChange: null,
        });
        const test = jest.spyOn(wrapper.instance(), 'transformOutput');
        wrapper.setProps({});
        expect(test).not.toBeCalled();
    });

    it('should add an object item and set state', () => {
        const wrapper = setup({
            maxCount: 5,
            distinctOnly: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().saveChangeToItem({
            id: 'test',
            value: 'test',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update an item with selected index', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        wrapper.setState({ itemIndexSelectedToEdit: 1 });
        wrapper.instance().saveChangeToItem('four');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update an entry with selected index', () => {
        const wrapper = setup();
        wrapper.setState({
            itemList: [
                { key: 'test 1', value: { thing: 'something' } },
                { key: 'test 2', value: { thing: 'something else' } },
            ],
        });
        wrapper.setState({ itemIndexSelectedToEdit: 1 });
        wrapper.instance().saveChangeToItem('new 1');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set item to edit index', () => {
        const wrapper = setup();
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        wrapper.instance().loadEditForm(1);
        expect(wrapper.state().itemIndexSelectedToEdit).toEqual(1);
    });

    it('should not add duplicate item with the same "key" in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { key: '1234-1234', value: { ulrichs: {} } },
                { key: '1234-1111', value: { ulrichs: {} } },
            ],
        });

        wrapper.instance().saveChangeToItem({ key: '1234-1234', value: { sherpaRomeo: {}, ulrichs: {} } });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem({ key: '1234-1235', value: { sherpaRomeo: {}, ulrichs: {} } });

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should not add duplicate item with the same "id" in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { id: 1234, value: 'test' },
                { id: 2345, value: 'testing' },
            ],
        });

        wrapper.instance().saveChangeToItem({ id: 1234, value: 'test' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem({ id: 1235, value: 'testing testing' });

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should not add duplicate item with the same text in the list', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: ['test', 'testing'],
        });

        wrapper.instance().saveChangeToItem('test');

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().saveChangeToItem('testing testing');

        expect(wrapper.state().itemList.length).toEqual(3);
    });

    it('should add edited item with the same "id" but different "value"', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { id: 1234, value: 'test' },
                { id: 2345, value: 'testing' },
            ],
        });

        wrapper.instance().saveChangeToItem({ id: 1234, value: 'test' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().loadEditForm(1);

        wrapper.instance().saveChangeToItem({ id: 2345, value: 'testing testing' });

        expect(wrapper.state().itemList.length).toEqual(2);

        expect(wrapper.state().itemList).toEqual([
            { id: 1234, value: 'test' },
            { id: 2345, value: 'testing testing' },
        ]);
    });

    it('should add edited item with the same "key" but different "value"', () => {
        const wrapper = setup({
            distinctOnly: true,
        });

        wrapper.setState({
            itemList: [
                { key: 'http://www.test.com', value: 'test site' },
                { key: 'http://www.testing.com', value: 'testing site' },
            ],
        });

        wrapper.instance().saveChangeToItem({ key: 'http://www.test.com', value: 'test site' });

        expect(wrapper.state().itemList.length).toEqual(2);

        wrapper.instance().loadEditForm(0);

        wrapper.instance().saveChangeToItem({ key: 'http://www.test.com', value: 'test link' });

        expect(wrapper.state().itemList.length).toEqual(2);

        expect(wrapper.state().itemList).toEqual([
            { key: 'http://www.test.com', value: 'test link' },
            { key: 'http://www.testing.com', value: 'testing site' },
        ]);
    });*/
});
