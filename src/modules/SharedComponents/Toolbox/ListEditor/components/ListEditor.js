import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListRowHeader from './ListRowHeader';
import ListRow from './ListRow';
import { GenericTemplate } from './GenericTemplate';

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
        errorText: PropTypes.string,
        remindToAdd: PropTypes.bool,
        input: PropTypes.object,
        transformFunction: PropTypes.func.isRequired,
        maxInputLength: PropTypes.number,
        inputNormalizer: PropTypes.func,
        rowItemTemplate: PropTypes.func,
        category: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        required: PropTypes.bool,
        scrollList: PropTypes.bool,
        scrollListHeight: PropTypes.number,
        canEdit: PropTypes.bool,
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
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // notify parent component when local state has been updated, eg itemList added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(this.transformOutput(nextState.itemList));
        }
    }

    transformOutput = items => {
        return items.map((item, index) => this.props.transformFunction(this.props.searchKey, item, index));
    };

    addItem = item => {
        if (
            !!item &&
            (this.props.maxCount === 0 || this.state.itemList.length < this.props.maxCount) &&
            (!this.props.distinctOnly || this.state.itemList.indexOf(item) === -1)
        ) {
            // If when the item is submitted, there is no maxCount,
            // its not exceeding the maxCount, is distinct and isnt already in the list...
            if ((!!item.key && !!item.value) || (!!item.id && !!item.value)) {
                // Item is an object with {key: 'something', value: 'something'} - as per FoR codes
                // OR item is an object with {id: 'PID:1234', value: 'Label'} - as per related datasets
                if (this.state.itemIndexSelectedToEdit !== null && this.state.itemIndexSelectedToEdit > -1) {
                    this.setState({
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            item,
                            ...this.state.itemList.slice(this.state.itemIndexSelectedToEdit + 1),
                        ],
                        itemIndexSelectedToEdit: null,
                    });
                } else {
                    this.setState({
                        itemList: [...this.state.itemList, item],
                    });
                }
            } else if (!!item && !item.key && !item.value && item.includes(',')) {
                // Item is a string with commas in it - we will strip and separate the values to be individual keywords
                const commaSepListToArray = item.split(','); // Convert the string to an array of values
                // Filter out empty array values
                const cleanArray = commaSepListToArray.filter(item => item.trim() !== '');
                const totalArray = [...this.state.itemList, ...cleanArray]; // Merge into the list
                if (totalArray.length > this.props.maxCount) {
                    // If the final list is longer that maxCount, trim it back
                    totalArray.length = this.props.maxCount;
                }
                this.setState({
                    itemList: [...totalArray],
                });
            } else {
                if (this.state.itemIndexSelectedToEdit !== null && this.state.itemIndexSelectedToEdit > -1) {
                    this.setState({
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            item,
                            ...this.state.itemList.slice(this.state.itemIndexSelectedToEdit + 1),
                        ],
                        itemIndexSelectedToEdit: null,
                    });
                } else {
                    // Item is just a string - so just add it
                    this.setState({
                        itemList: [...this.state.itemList, item],
                    });
                }
            }
        }
    };

    moveUpList = (item, index) => {
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
        const componentID = (
            (this.props.locale.form && this.props.locale.form.title) ||
            (this.props.locale.form && this.props.locale.form.inputFieldLabel) ||
            (this.props.locale.form &&
                this.props.locale.form.locale &&
                this.props.locale.form.locale.inputFieldLabel) ||
            ''
        ).replace(/\s+/g, '');
        const renderListsRows = this.state.itemList.map((item, index) => (
            <ListRow
                form={
                    (this.props.locale &&
                        this.props.locale.form &&
                        this.props.locale.form.locale &&
                        this.props.locale.form.locale.inputFieldLabel) ||
                    'NoLabel'
                }
                key={index}
                index={index}
                item={item}
                canMoveDown={index !== this.state.itemList.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpList}
                onMoveDown={this.moveDownList}
                onDelete={this.deleteItem}
                onEdit={this.editItem}
                {...(this.props.locale && this.props.locale.row ? this.props.locale.row : {})}
                hideReorder={this.props.hideReorder}
                disabled={this.props.disabled}
                itemTemplate={this.props.rowItemTemplate}
                canEdit={this.props.canEdit}
            />
        ));
        return (
            <div className={`${this.props.className} ${componentID}`}>
                <this.props.formComponent
                    inputField={this.props.inputField}
                    key={this.state.itemIndexSelectedToEdit + 1 || 'link-info-form'}
                    onAdd={this.addItem}
                    remindToAdd={this.props.remindToAdd}
                    locale={{ ...(this.props.locale && this.props.locale.form ? this.props.locale.form : {}) }}
                    {...(this.props.locale && this.props.locale.form ? this.props.locale.form : {})}
                    isValid={this.props.isValid}
                    disabled={
                        this.props.disabled ||
                        (this.props.maxCount > 0 && this.state.itemList.length >= this.props.maxCount)
                    }
                    errorText={this.props.errorText}
                    maxInputLength={this.props.maxInputLength}
                    normalize={this.props.inputNormalizer}
                    category={this.props.category}
                    required={this.props.required}
                    itemSelectedToEdit={this.state.itemList[this.state.itemIndexSelectedToEdit] || null}
                    itemIndexSelectedToEdit={this.state.itemIndexSelectedToEdit}
                />
                {this.state.itemList.length > 0 && (
                    <ListRowHeader
                        {...(this.props.locale && this.props.locale.header ? this.props.locale.header : {})}
                        onDeleteAll={this.deleteAllItems}
                        hideReorder={this.props.hideReorder || this.state.itemList.length < 2}
                        disabled={this.props.disabled}
                    />
                )}
                {!!this.props.scrollList && this.state.itemList.length >= this.props.scrollListHeight / 55 ? (
                    <div
                        className={'ListEditor-scrollable-list'}
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
                    renderListsRows
                )}
            </div>
        );
    }
}
