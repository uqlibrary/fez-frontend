import React from 'react';
import ListEditor from './ListEditor';
import { List } from 'immutable';
import FreeTextForm from './FreeTextForm';
import IssnForm from './IssnForm';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { rtlRender, act, fireEvent, waitFor } from 'test-utils';

const defaultProps = {
    className: 'testClass', // : PropTypes.string,
    searchKey: { value: 'value', order: 'order' }, // : PropTypes.object.isRequired,
    isValid: jest.fn(), // PropTypes.func,
    disabled: false, // PropTypes.bool,
    onChange: jest.fn(), // PropTypes.func,
    formComponent: jest.fn(props => (
        <div data-testid="form-component" {...(!!props.disabled ? { disabled: 'disabled' } : {})} />
    )),
    inputField: jest.fn(props => <div data-testid="input-field" className={props.className} />),
    hideReorder: false,
    distinctOnly: false,
    errorText: '',
    listEditorId: 'test',
    scrollList: false,
    scrollListHeight: 250,
    maxCount: 0,
};

const addItemsToList = ({ items, getByTestId, assertCount = true }) => {
    const expectedCount = items.length;
    items.forEach(item => {
        act(() => {
            fireEvent.change(getByTestId('test-input'), { target: { value: item } });
        });
        act(() => {
            fireEvent.click(getByTestId('test-add'));
        });
    });

    assertCount && expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(expectedCount);
};

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...defaultProps,
        scrollList: testProps.scrollList || false,
        scrollListHeight: testProps.scrollListHeight || 250,
        ...testProps,
    };
    return renderer(<ListEditor {...props} />);
}

describe('ListEditor tests', () => {
    it('should render full component with a defined className', () => {
        const { container, getByTestId } = setup({ className: 'requiredField' });
        expect(getByTestId('test-list-editor')).toHaveClass('requiredField');
        expect(getByTestId('form-component')).not.toHaveAttribute('disabled');
        expect(container).toMatchSnapshot();
    });

    it('should render full component as disabled', () => {
        const { container, getByTestId } = setup({ disabled: true });
        expect(getByTestId('test-list-editor')).toHaveClass('testClass');
        expect(getByTestId('form-component')).toHaveAttribute('disabled');
        expect(container).toMatchSnapshot();
    });

    it('should delete all items from a list', async () => {
        const { getByTestId } = setup({ formComponent: FreeTextForm });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({ items: ['one', 'two', 'three'], getByTestId });

        act(() => {
            fireEvent.click(getByTestId('delete-all-test'));
        });
        await waitFor(() => expect(getByTestId('test-delete-all')).toBeInTheDocument());
        act(() => {
            fireEvent.click(getByTestId('confirm-test-delete-all'));
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
    });

    it('should move down an item', () => {
        const { container, getByTestId } = setup({ formComponent: FreeTextForm });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({ items: ['one', 'two', 'three'], getByTestId });

        expect(getByTestId('test-list-row-1')).toHaveTextContent('two');
        act(() => {
            fireEvent.click(getByTestId('test-list-row-1-move-down'));
        });
        expect(getByTestId('test-list-row-1')).toHaveTextContent('three');

        expect(container).toMatchSnapshot();
    });

    it('should move up an item', () => {
        const { container, getByTestId } = setup({ formComponent: FreeTextForm });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({ items: ['one', 'two', 'three'], getByTestId });

        expect(getByTestId('test-list-row-1')).toHaveTextContent('two');
        act(() => {
            fireEvent.click(getByTestId('test-list-row-1-move-up'));
        });
        expect(getByTestId('test-list-row-1')).toHaveTextContent('one');

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

        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(2);
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
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(2);
        expect(container).toMatchSnapshot();
    });

    it('should process incomplete props without error', () => {
        const { container } = setup({
            input: {
                name: 'test',
            },
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        expect(container).toMatchSnapshot();
    });

    it('should add item with key and set state', () => {
        const { container, getByTestId } = setup({
            maxCount: 5,
            distinctOnly: true,
            locale: {
                row: {},
                form: {},
                header: {},
            },
            formComponent: props => (
                <div>
                    <Button
                        data-testid="test-button"
                        onClick={() =>
                            props.onAdd({
                                key: 'test',
                                value: 'test',
                            })
                        }
                    />
                </div>
            ),
        });
        expect(container).toMatchSnapshot();
        act(() => {
            fireEvent.click(getByTestId('test-button'));
        });

        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(1);
        expect(getByTestId('test-list-row-0')).toHaveTextContent('test');

        expect(container).toMatchSnapshot();
    });

    it('should add an item with id and set state', () => {
        const { container, getByTestId } = setup({
            maxCount: 5,
            distinctOnly: true,
            locale: {
                row: {},
                form: {},
                header: {},
            },
            formComponent: props => (
                <div>
                    <Button
                        data-testid="test-button"
                        onClick={() =>
                            props.onAdd({
                                id: 'test',
                                value: 'test',
                            })
                        }
                    />
                </div>
            ),
        });
        expect(container).toMatchSnapshot();
        act(() => {
            fireEvent.click(getByTestId('test-button'));
        });

        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(1);
        expect(getByTestId('test-list-row-0')).toHaveTextContent('test');

        expect(container).toMatchSnapshot();
    });

    it('should call default input normaliser function', () => {
        const { container, getByTestId } = setup({
            locale: {},
            formComponent: props => (
                <div>
                    <Button
                        data-testid="test-button"
                        onClick={jest.fn(() => expect(props.normalize('test')).toBe('test'))}
                    />
                </div>
            ),
        });
        expect(container).toMatchSnapshot();
        act(() => {
            fireEvent.click(getByTestId('test-button'));
        });
    });

    it('should not call transformOutput if onChange prop method is not defined', () => {
        const onChangeFn = jest.fn();
        const { rerender } = setup();

        setup({ onChange: onChangeFn }, rerender);
        expect(onChangeFn).toHaveBeenCalledTimes(1);

        setup({ onChange: null }, rerender);
        expect(onChangeFn).toHaveBeenCalledTimes(1); // shouldnt increment
    });

    it('Should render a list of many items in a scrollable HTML div', () => {
        const { container, getByTestId } = setup({
            scrollList: true,
            scrollListHeight: 250,
            formComponent: FreeTextForm,
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({
            items: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            getByTestId,
        });
        expect(getByTestId('test-list')).toHaveStyle(
            'width: 100%; height: 250px; overflow-x: hidden; overflow-y: scroll;',
        );
        expect(container).toMatchSnapshot();
    });

    it('Should render a list of many items inline 1', () => {
        const { container, getByTestId } = setup({
            scrollList: false,
            scrollListHeight: 250,
            formComponent: FreeTextForm,
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({
            items: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            getByTestId,
        });
        expect(getByTestId('test-list')).not.toHaveStyle(
            'width: 100%; height: 250px; overflow-x: hidden; overflow-y: scroll;',
        );
        expect(container).toMatchSnapshot();
    });

    it('Should render a list of many items inline 2', () => {
        const { container, getByTestId } = setup({
            scrollList: false,
            formComponent: FreeTextForm,
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({
            items: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
            getByTestId,
        });
        expect(getByTestId('test-list')).not.toHaveStyle(
            'width: 100%; height: 250px; overflow-x: hidden; overflow-y: scroll;',
        );
        expect(container).toMatchSnapshot();
    });

    it('should update an item with selected index', () => {
        const { container, getByTestId } = setup({
            canEdit: true,
            formComponent: FreeTextForm,
        });
        expect(document.querySelector('[data-testid=test-list]').childElementCount).toEqual(0);
        addItemsToList({
            items: ['one', 'two', 'three'],
            getByTestId,
        });
        act(() => {
            fireEvent.click(getByTestId('test-list-row-1-edit'));
        });
        addItemsToList({
            items: ['four'],
            getByTestId,
            assertCount: false,
        });
        expect(getByTestId('test-list-row-1')).toHaveTextContent('four');
        expect(container).toMatchSnapshot();
    });

    it('should update an issn with selected index', () => {
        const { container, getByTestId } = setup({
            canEdit: true,
            formComponent: IssnForm,
            rowItemTemplate: entry => <Typography variant="body2">{entry.item.key}</Typography>,
        });

        addItemsToList({
            items: ['1234-1234', '1234-1111'],
            getByTestId,
        });
        act(() => {
            fireEvent.click(getByTestId('test-list-row-1-edit'));
        });
        addItemsToList({
            items: ['1234-2222'],
            getByTestId,
            assertCount: false,
        });
        expect(getByTestId('test-list-row-1')).toHaveTextContent('1234-2222');

        expect(container).toMatchSnapshot();
    });

    describe('Class instance', () => {
        const getInstance = props => {
            const instance = new ListEditor(props ?? defaultProps);
            instance.setState = jest.fn(newState => {
                instance.state = { ...instance.state, ...newState };
            });
            return instance;
        };
        it('should render an item to the list', () => {
            const instance = getInstance();
            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem('one');
            expect(instance.state.itemList.length).toEqual(1);
        });

        it('should render an object item to the list', () => {
            const instance = getInstance();

            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem({ id: 'test', value: 'test value' });
            expect(instance.state.itemList.length).toEqual(1);
        });

        it('should update an object item in the list', () => {
            const instance = getInstance();

            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem({ id: 'test', value: 'test value' });
            expect(instance.state.itemList.length).toEqual(1);
            instance.editItem(0);
            instance.addItem({ id: 'test', value: 'testing value' });
            expect(instance.state.itemList.length).toEqual(1);
            expect(instance.state.itemList).toEqual([{ id: 'test', value: 'testing value' }]);
        });

        it('should render items not more than maxCount', () => {
            const instance = getInstance({ ...defaultProps, maxCount: 1 });

            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem('one');
            expect(instance.state.itemList.length).toEqual(1);
            instance.addItem('two');
            expect(instance.state.itemList.length).toEqual(1);
        });

        it('should not add null item to the list', () => {
            const instance = getInstance();
            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem(undefined);
            instance.addItem(null);
            instance.addItem('');
            expect(instance.state.itemList.length).toEqual(0);
        });

        it('should delete an item from the list', () => {
            const instance = getInstance();
            instance.setState({ itemList: ['one', 'two', 'three'] });
            expect(instance.state.itemList.length).toEqual(3);
            instance.deleteItem('one', 0);
            expect(instance.state.itemList.length).toEqual(2);
        });

        it('should render items individually when comma separated not more than maxCount', () => {
            const instance = getInstance({ ...defaultProps, maxCount: 5 });

            expect(instance.state.itemList.length).toEqual(0);
            instance.addItem('one');
            expect(instance.state.itemList.length).toEqual(1);
            instance.addItem('two|three|four');
            expect(instance.state.itemList.length).toEqual(4);
            instance.addItem('two|three|four||five||');
            expect(instance.state.itemList.length).toEqual(5);
        });

        it('should set item to edit index', () => {
            const instance = getInstance();
            instance.setState = jest.fn(newState => {
                instance.state = { ...instance.state, ...newState };
            });
            instance.setState({ itemList: ['one', 'two', 'three'] });
            instance.editItem(1);
            expect(instance.state.itemIndexSelectedToEdit).toEqual(1);
        });

        it('should not add duplicate item with the same "key" in the list', () => {
            const instance = getInstance({ maxCount: 0, distinctOnly: true });

            instance.setState({
                itemList: [
                    { key: '1234-1234', value: { ulrichs: {} } },
                    { key: '1234-1111', value: { ulrichs: {} } },
                ],
            });
            instance.addItem({ key: '1234-1234', value: { sherpaRomeo: {}, ulrichs: {} } });
            expect(instance.state.itemList.length).toEqual(2); // dupe not added
            instance.addItem({ key: '1234-1235', value: { sherpaRomeo: {}, ulrichs: {} } });
            expect(instance.state.itemList.length).toEqual(3);
        });

        it('should not add duplicate item with the same "id" in the list', () => {
            const instance = getInstance({ maxCount: 0, distinctOnly: true });

            instance.setState({
                itemList: [
                    { id: 1234, value: 'test' },
                    { id: 2345, value: 'testing' },
                ],
            });
            instance.addItem({ id: 1234, value: 'test' });
            expect(instance.state.itemList.length).toEqual(2); // dupe not added
            instance.addItem({ id: 1235, value: 'testing testing' });
            expect(instance.state.itemList.length).toEqual(3);
        });

        it('should not add duplicate item with the same text in the list', () => {
            const instance = getInstance({ maxCount: 0, distinctOnly: true });

            instance.setState({
                itemList: ['test', 'testing'],
            });
            instance.addItem('test');
            expect(instance.state.itemList.length).toEqual(2); // dupe not added
            instance.addItem('testing testing');
            expect(instance.state.itemList.length).toEqual(3);
        });

        it('should add edited item with the same "id" but different "value"', () => {
            const instance = getInstance({ maxCount: 0, distinctOnly: true });

            instance.setState({
                itemList: [
                    { id: 1234, value: 'test' },
                    { id: 2345, value: 'testing' },
                ],
            });
            instance.addItem({ id: 1234, value: 'test' });
            expect(instance.state.itemList.length).toEqual(2); // dupe not added
            instance.editItem(1);
            instance.addItem({ id: 2345, value: 'testing testing' });
            expect(instance.state.itemList.length).toEqual(2);
            expect(instance.state.itemList).toEqual([
                { id: 1234, value: 'test' },
                { id: 2345, value: 'testing testing' },
            ]);
        });

        it('should add edited item with the same "key" but different "value"', () => {
            const instance = getInstance({ maxCount: 0, distinctOnly: true });

            instance.setState({
                itemList: [
                    { key: 'http://www.test.com', value: 'test site' },
                    { key: 'http://www.testing.com', value: 'testing site' },
                ],
            });
            instance.addItem({ key: 'http://www.test.com', value: 'test site' });
            expect(instance.state.itemList.length).toEqual(2); // dupe not added
            instance.editItem(0);
            instance.addItem({ key: 'http://www.test.com', value: 'test link' });
            expect(instance.state.itemList.length).toEqual(2);
            expect(instance.state.itemList).toEqual([
                { key: 'http://www.test.com', value: 'test link' },
                { key: 'http://www.testing.com', value: 'testing site' },
            ]);
        });
    });
});
