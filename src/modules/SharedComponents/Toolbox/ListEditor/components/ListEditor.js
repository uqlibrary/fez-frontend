import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListRowHeader from './ListRowHeader';
import ListRow from './ListRow';
import { GenericTemplate } from './GenericTemplate';

import FormHelperText from '@mui/material/FormHelperText';
import { isArrayDeeplyEqual } from '../../../../../helpers/general';

export default class ListEditor extends Component {
    static propTypes = {
        formComponent: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.object.isRequired]),
        inputField: PropTypes.oneOfType([
            PropTypes.object, // eg connected auto complete fields
            PropTypes.func,
        ]),
        className: PropTypes.string,
        searchKey: PropTypes.object.isRequired,
        maxCount: PropTypes.number,
        isValid: PropTypes.func,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        locale: PropTypes.object,
        hideReorder: PropTypes.bool,
        distinctOnly: PropTypes.bool,
        error: PropTypes.bool,
        errorText: PropTypes.string,
        remindToAdd: PropTypes.bool,
        input: PropTypes.object,
        transformFunction: PropTypes.func.isRequired,
        maxInputLength: PropTypes.number,
        inputNormalizer: PropTypes.func,
        rowItemTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        category: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        required: PropTypes.bool,
        scrollList: PropTypes.bool,
        scrollListHeight: PropTypes.number,
        canEdit: PropTypes.bool,
        getItemSelectedToEdit: PropTypes.func,
        listEditorId: PropTypes.string.isRequired,
        onAddItem: PropTypes.func,
    };

    static defaultProps = {
        canEdit: false,
        hideReorder: false,
        distinctOnly: false,
        searchKey: {
            value: 'rek_value',
            order: 'rek_order',
        },
        maxCount: 0,
        transformFunction: (searchKey, item, index) => ({
            [searchKey.value]: item,
            [searchKey.order]: index + 1,
        }),
        rowItemTemplate: GenericTemplate,
        inputNormalizer: value => value,
        locale: {
            form: {
                locale: {
                    inputFieldLabel: 'NoLabel',
                },
            },
        },
        required: false,
        scrollList: false,
        scrollListHeight: 250,
        getItemSelectedToEdit: (list, index) => list[index] || null,
        onAddItem: state => state,
    };

    constructor(props) {
        super(props);

        const valueAsJson =
            ((props.input || {}).name &&
                typeof (props.input.value || {}).toJS === 'function' &&
                props.input.value.toJS()) ||
            ((props.input || {}).name && props.input.value);
        this.state = {
            itemList: valueAsJson ? valueAsJson.map(item => item[props.searchKey.value]) : [],
            itemIndexSelectedToEdit: null,
        };

        this.transformOutput = this.transformOutput.bind(this);
        this.addItem = this.addItem.bind(this);
        this.moveUpList = this.moveUpList.bind(this);
        this.moveDownList = this.moveDownList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteAllItems = this.deleteAllItems.bind(this);
        this.editItem = this.editItem.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // notify parent component when local state has been updated, eg itemList added/removed/reordered
        if (this.props.onChange && !isArrayDeeplyEqual(prevState.itemList, this.state.itemList)) {
            this.props.onChange(this.transformOutput(this.state.itemList));
        }
    }

    transformOutput = items => {
        return items.map((item, index) => this.props.transformFunction(this.props.searchKey, item, index));
    };

    /**
     *  if item is not selected to edit
     *      then check for existing key/id in the list
     *  else
     *      check for existing key/id & value both
     *
     * @param item object
     * @param list array
     * @returns bool
     */
    isItemInTheList = (item, list) => {
        if ((!!item.key && !!item.value) || (!!item.id && !!item.value)) {
            if (this.state.itemIndexSelectedToEdit === null) {
                return (
                    list.filter(listItem => {
                        return (
                            (!!listItem.key && listItem.key === item.key) || (!!listItem.id && listItem.id === item.id)
                        );
                    }).length > 0
                );
            } else {
                return (
                    list.filter(listItem => {
                        return (
                            (!!listItem.key &&
                                listItem.key === item.key &&
                                !!listItem.value &&
                                listItem.value === item.value) ||
                            (!!listItem.id &&
                                listItem.id === item.id &&
                                !!listItem.value &&
                                listItem.value === item.value)
                        );
                    }).length > 0
                );
            }
        } else {
            return list.indexOf(item) !== -1;
        }
    };

    addItem = item => {
        if (
            !!item &&
            (this.props.maxCount === 0 || this.state.itemList.length < this.props.maxCount) &&
            ((this.props.distinctOnly && !this.isItemInTheList(item, this.state.itemList)) ||
                (!this.props.distinctOnly && this.state.itemList.indexOf(item) === -1))
        ) {
            let newState = {};
            // If when the item is submitted, there is no maxCount,
            // its not exceeding the maxCount, is distinct and isnt already in the list...
            if ((!!item.key && !!item.value) || (!!item.id && !!item.value)) {
                // Item is an object with {key: 'something', value: 'something'} - as per FoR codes
                // OR item is an object with {id: 'PID:1234', value: 'Label'} - as per related datasets
                if (this.state.itemIndexSelectedToEdit !== null && this.state.itemIndexSelectedToEdit > -1) {
                    newState = {
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            item,
                            ...this.state.itemList.slice(this.state.itemIndexSelectedToEdit + 1),
                        ],
                        itemIndexSelectedToEdit: null,
                    };
                } else {
                    newState = {
                        itemList: [...this.state.itemList, item],
                    };
                }
            } else if (!!item && !item.key && !item.value && item.includes('|')) {
                // Item is a string with pipes in it - we will strip and separate the values to be individual keywords
                const commaSepListToArray = item.split('|'); // Convert the string to an array of values
                // Filter out empty array values
                const cleanArray = commaSepListToArray.filter(item => item.trim() !== '');
                const totalArray = [...this.state.itemList, ...cleanArray]; // Merge into the list
                if (totalArray.length > this.props.maxCount && this.props.maxCount > 0) {
                    // If the final list is longer that maxCount, trim it back
                    totalArray.length = this.props.maxCount;
                }
                newState = {
                    itemList: [...totalArray],
                };
            } else {
                if (this.state.itemIndexSelectedToEdit !== null && this.state.itemIndexSelectedToEdit > -1) {
                    const itemSelected = !!this.state.itemList[this.state.itemIndexSelectedToEdit].key
                        ? {
                              ...this.state.itemList[this.state.itemIndexSelectedToEdit],
                              key: item,
                          }
                        : item;
                    newState = {
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            itemSelected,
                            ...this.state.itemList.slice(this.state.itemIndexSelectedToEdit + 1),
                        ],
                        itemIndexSelectedToEdit: null,
                    };
                } else {
                    // Item is just a string - so just add it
                    newState = { itemList: [...this.state.itemList, item] };
                }
            }
            this.setState((this.props.onAddItem && this.props.onAddItem(newState)) || newState);
        }
    };

    moveUpList = (item, index) => {
        /* istanbul ignore next */
        if (index === 0) return;
        const nextList = this.state.itemList[index - 1];
        this.setState({
            itemList: [
                ...this.state.itemList.slice(0, index - 1),
                item,
                nextList,
                ...this.state.itemList.slice(index + 1),
            ],
        });
    };

    moveDownList = (item, index) => {
        /* istanbul ignore next */
        if (index === this.state.itemList.length - 1) return;
        const nextList = this.state.itemList[index + 1];
        this.setState({
            itemList: [...this.state.itemList.slice(0, index), nextList, item, ...this.state.itemList.slice(index + 2)],
        });
    };

    deleteItem = (item, index) => {
        this.setState({
            itemList: this.state.itemList.filter((_, i) => i !== index),
        });
    };

    deleteAllItems = () => {
        this.setState({
            itemList: [],
        });
    };

    editItem = index => {
        this.setState({
            itemIndexSelectedToEdit: index,
        });
    };
    render() {
        const renderListsRows = this.state.itemList.map((item, index) => (
            <ListRow
                key={item.key || item.id || `${item}-${index}`}
                index={index}
                item={item}
                canMoveDown={index !== this.state.itemList.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpList}
                onMoveDown={this.moveDownList}
                onDelete={this.deleteItem}
                onEdit={this.editItem}
                {...((this.props.locale && this.props.locale.row) || {})}
                hideReorder={this.props.hideReorder}
                disabled={this.props.disabled}
                itemTemplate={this.props.rowItemTemplate}
                canEdit={this.props.canEdit}
                listRowId={`${this.props.listEditorId}-list-row-${index}`}
            />
        ));
        return (
            <div
                className={`${this.props.className}`}
                id={`${this.props.listEditorId}-list-editor`}
                data-testid={`${this.props.listEditorId}-list-editor`}
            >
                <this.props.formComponent
                    inputField={this.props.inputField}
                    key={
                        (!!this.state.itemIndexSelectedToEdit && `${this.props.listEditorId}-form`) ||
                        'list-editor-form'
                    }
                    onAdd={this.addItem}
                    remindToAdd={this.props.remindToAdd}
                    {...((this.props.locale && this.props.locale.form) || {})}
                    isValid={this.props.isValid}
                    error={this.props.error}
                    disabled={
                        this.props.disabled ||
                        (this.props.maxCount > 0 && this.state.itemList.length >= this.props.maxCount)
                    }
                    maxInputLength={this.props.maxInputLength}
                    normalize={this.props.inputNormalizer}
                    category={this.props.category}
                    required={this.props.required}
                    itemSelectedToEdit={this.props.getItemSelectedToEdit(
                        this.state.itemList,
                        this.state.itemIndexSelectedToEdit,
                    )}
                    itemIndexSelectedToEdit={this.state.itemIndexSelectedToEdit}
                    listEditorId={this.props.listEditorId}
                />
                {this.state.itemList.length > 0 && (
                    <ListRowHeader
                        onDeleteAll={this.deleteAllItems}
                        hideReorder={this.props.hideReorder || this.state.itemList.length < 2}
                        disabled={this.props.disabled}
                        listEditorId={this.props.listEditorId}
                        {...((this.props.locale && this.props.locale.header) || {})}
                    />
                )}
                {!!this.props.scrollList && this.state.itemList.length >= this.props.scrollListHeight / 55 ? (
                    <div
                        className={'ListEditor-scrollable-list'}
                        id={`${this.props.listEditorId}-list`}
                        data-testid={`${this.props.listEditorId}-list`}
                        style={{
                            width: '100%',
                            height: this.props.scrollListHeight,
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                        }}
                    >
                        {renderListsRows}
                    </div>
                ) : (
                    <div id={`${this.props.listEditorId}-list`} data-testid={`${this.props.listEditorId}-list`}>
                        {renderListsRows}
                    </div>
                )}
                <FormHelperText error={this.props.error} children={this.props.errorText} />
            </div>
        );
    }
}
