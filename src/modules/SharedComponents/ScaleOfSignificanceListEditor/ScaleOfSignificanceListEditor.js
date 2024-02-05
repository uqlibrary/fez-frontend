import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListRowHeader from '../Toolbox/ListEditor/components/ListRowHeader';
import ListRow from '../Toolbox/ListEditor/components/ListRow';
import ScaleOfSignificanceForm from './ScaleOfSignificanceForm';
import { ScaleOfSignificanceTemplate } from './ScaleOfSignificanceTemplate';
import FormHelperText from '@mui/material/FormHelperText';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import AddCircle from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';
import { diff } from 'deep-object-diff';
// Steve work here
// import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
// import Grid from '@mui/material/Unstable_Grid2';
// import { SIGNIFICANCE } from 'config/general';

export class ScaleOfSignificanceListEditor extends Component {
    static propTypes = {
        contributors: PropTypes.object,
        actions: PropTypes.any,
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
        // rowItemTemplate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        category: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        required: PropTypes.bool,
        scrollList: PropTypes.bool, // doesnt seem to be used
        scrollListHeight: PropTypes.number, // doesnt seem to be used
        canEdit: PropTypes.bool,
        getItemSelectedToEdit: PropTypes.func,
        listEditorId: PropTypes.string.isRequired,
        scaleOfSignificance: PropTypes.array,
        clearedScaleAuthors: PropTypes.bool,
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
        inputNormalizer: /* istanbul ignore next */ value => /* istanbul ignore next */ value,
        locale: {
            form: {
                locale: {
                    significanceInputFieldLabel: 'NoLabel',
                    addButtonLabel: 'Add item',
                    editButtonLabel: 'Edit item',
                },
            },
        },
        required: false,
        error: false,
        errorText: '',
    };

    constructor(props) {
        super(props);
        const valueAsJson =
            ((props.input || /* istanbul ignore next */ {}).name &&
                typeof (props.input.value || {}).toJS === 'function' &&
                props.input.value.toJS()) ||
            ((props.input || /* istanbul ignore next */ {}).name && props.input.value);
        this.state = {
            itemList: valueAsJson ? valueAsJson.map(item => item[props.searchKey.value]) : [],
            itemIndexSelectedToEdit: null,
            buttonLabel: props.locale.form.locale.addButtonLabel,
            showAddForm: false,
            formMode: 'edit',
        };
        this.state.originalItemList = this.state.itemList;

        this.transformOutput = this.transformOutput.bind(this);
        this.saveChangeToItem = this.saveChangeToItem.bind(this);
        this.moveUpList = this.moveUpList.bind(this);
        this.moveDownList = this.moveDownList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteAllItems = this.deleteAllItems.bind(this);
        this.loadEditForm = this.loadEditForm.bind(this);
        this.showFormInEditMode = this.showFormInEditMode.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        /* istanbul ignore else */
        if (this.props.onChange) {
            this.props.onChange(this.transformOutput(this.state.itemList));
        }

        if (Object.keys(diff(this.props.scaleOfSignificance, prevProps.scaleOfSignificance)).length > 0) {
            this.setState({
                itemList: [...this.props.scaleOfSignificance],
            });
        } else if (Object.keys(diff(this.state.itemList, prevState.itemList)).length > 0) {
            this.props.actions.updateAdminScaleSignificance(this.state.itemList);
        }
    }
    transformOutput = items => {
        return items.map((item, index) => this.props.transformFunction(this.props.searchKey, item, index));
    };

    getItemSelectedToEdit = (mode, list, index) => {
        // Edit likely never to be used in new editor.
        // kept for backward compatibility
        /* istanbul ignore next */
        if (mode === 'add') {
            return null;
        }
        return list[index] || /* istanbul ignore next */ null;
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
    /* istanbul ignore next */
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

    saveChangeToItem = item => {
        /* istanbul ignore else */
        if (
            !!item &&
            (this.props.maxCount === 0 ||
                /* istanbul ignore next */ this.state.itemList.length < this.props.maxCount) &&
            ((this.props.distinctOnly && /* istanbul ignore next */ !this.isItemInTheList(item, this.state.itemList)) ||
                (!this.props.distinctOnly && this.state.itemList.indexOf(item) === -1))
        ) {
            const editedItem = {
                ...this.state.itemList[this.state.itemIndexSelectedToEdit],
                ...item,
            };
            // If when the item is submitted, there is no maxCount,
            // its not exceeding the maxCount, is distinct and isnt already in the list...
            /* istanbul ignore else */
            if (
                this.state.formMode === 'edit' &&
                (((!!item.key || item.key === 0) && !!item.value) ||
                    /* istanbul ignore next */ (!!item.id && !!item.value))
            ) {
                // Item is an object with {key: 'something', value: 'something'} - as per FoR codes
                // OR item is an object with {id: 'PID:1234', value: 'Label'} - as per related datasets
                /* istanbul ignore else */
                if (this.state.itemIndexSelectedToEdit !== null && this.state.itemIndexSelectedToEdit > -1) {
                    this.setState({
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            editedItem,
                            ...this.state.itemList.slice(this.state.itemIndexSelectedToEdit + 1),
                        ],
                        itemIndexSelectedToEdit: null,
                    });
                } else {
                    this.setState({
                        itemList: [...this.state.itemList, editedItem],
                    });
                }
            } else {
                /* istanbul ignore next */
                if (
                    this.state.formMode === 'edit' &&
                    this.state.itemIndexSelectedToEdit !== null &&
                    this.state.itemIndexSelectedToEdit > -1
                ) {
                    const itemSelected = !!this.state.itemList[this.state.itemIndexSelectedToEdit].key
                        ? {
                              ...this.state.itemList[this.state.itemIndexSelectedToEdit],
                              key: item,
                          }
                        : item;

                    this.setState({
                        itemList: [
                            ...this.state.itemList.slice(0, this.state.itemIndexSelectedToEdit),
                            itemSelected,
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
        /* istanbul ignore next */
        if (index === 0) return;

        const itemList = [...this.state.itemList];
        itemList[index] = this.state.itemList[index - 1];
        itemList[index - 1] = this.state.itemList[index];

        const movedAuthor = { ...itemList[index].author };
        const swappedAuthor = { ...itemList[index - 1].author };
        itemList[index].author = swappedAuthor;
        itemList[index - 1].author = movedAuthor;
        this.setState({
            itemList: [...itemList],
        });
    };

    moveDownList = (item, index) => {
        /* istanbul ignore next */
        if (index === this.state.itemList.length - 1) return;
        const itemList = [...this.state.itemList];
        itemList[index] = this.state.itemList[index + 1];
        itemList[index + 1] = this.state.itemList[index];

        const movedAuthor = { ...itemList[index].author };
        const swappedAuthor = { ...itemList[index + 1].author };
        itemList[index].author = swappedAuthor;
        itemList[index + 1].author = movedAuthor;
        this.setState({
            itemList: [...itemList],
        });
    };

    /* istanbul ignore next */
    deleteItem = (item, index) => {
        const updatedState = [...this.state.itemList];
        const itemToDelete = item;
        itemToDelete.key = 0;
        itemToDelete.value = {
            plainText: 'Missing',
            htmlText: 'Missing',
        };
        updatedState[index] = itemToDelete;
        this.setState({
            itemList: [...updatedState],
        });
    };

    /* istanbul ignore next */
    deleteAllItems = () => {
        const newList = [...this.state.itemList];
        this.state.itemList.map((item, index) => {
            newList[index].key = 0;
            newList[index].value = {
                plainText: 'Missing',
                htmlText: 'Missing',
            };
        });
        this.setState({
            itemList: newList,
        });
    };

    loadEditForm = index => {
        this.showFormInEditMode();
        this.setState({
            itemIndexSelectedToEdit: index,
        });
        this.state.buttonLabel = this.props.locale.form.locale.editButtonLabel;

        // if its a long list we need the form to scroll into view
        // scrollIntoView function is not attached to the form
        /* istanbul ignore next */
        const form = document.getElementById('rek-significance-list-editor');
        form &&
            form.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
            });
    };

    showFormInEditMode = (show = true) => {
        this.setState({
            showAddForm: show,
            formMode: 'edit',
            buttonLabel: this.props.locale.form.locale.editButtonLabel,
        });
    };
    render() {
        const renderListsRows =
            !!this.state.itemList &&
            this.state.itemList.map((item, index) => {
                const tempItem = {
                    id: index,
                    // authorName: item.authorName || item.author?.rek_author || null,
                    author: {
                        // eslint-disable-next-line camelcase
                        rek_author: item.author?.rek_author || this.state.itemList[index].author?.rek_author || null,
                    },
                    key: item.id,
                    scaleValue: item.key,
                    signifValue: {
                        htmlText: item.value?.htmlText || /* istanbul ignore next */ null,
                    },
                };
                return (
                    <ListRow
                        key={item.id || `${item}-${index}`}
                        index={index}
                        item={tempItem}
                        canDelete={tempItem.scaleValue > 0}
                        canMoveDown={index !== this.state.itemList.length - 1}
                        canMoveUp={index !== 0}
                        onMoveUp={this.moveUpList}
                        onMoveDown={this.moveDownList}
                        onDelete={this.deleteItem}
                        onEdit={this.loadEditForm}
                        {...((this.props.locale && this.props.locale.row) || /* istanbul ignore next */ {})}
                        hideReorder={this.props.hideReorder}
                        disabled={this.props.disabled}
                        itemTemplate={ScaleOfSignificanceTemplate}
                        canEdit={this.props.canEdit}
                        listRowId={`${this.props.listEditorId}-list-row-${index}`}
                    />
                );
            });
        const noRecordsStyle = {
            textAlign: 'center',
            fontSize: '0.875rem',
            padding: 16,
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
        };
        return (
            <div id={`${this.props.listEditorId}-list-editor`}>
                <ScaleOfSignificanceForm
                    key={
                        (!!this.state.itemIndexSelectedToEdit && `${this.props.listEditorId}-form`) ||
                        'list-editor-form'
                    }
                    saveChangeToItem={this.saveChangeToItem}
                    remindToAdd={this.props.remindToAdd}
                    {...((this.props.locale && this.props.locale.form) || /* istanbul ignore next */ {})}
                    isValid={this.props.isValid}
                    error={this.props.error}
                    disabled={
                        this.props.disabled ||
                        (this.props.maxCount > 0 &&
                            /* istanbul ignore next */ this.state.itemList.length >= this.props.maxCount)
                    }
                    maxInputLength={this.props.maxInputLength}
                    normalize={this.props.inputNormalizer}
                    category={this.props.category}
                    required={this.props.required}
                    itemSelectedToEdit={this.getItemSelectedToEdit(
                        this.state.formMode,
                        this.state.itemList,
                        this.state.itemIndexSelectedToEdit,
                    )}
                    itemIndexSelectedToEdit={this.state.itemIndexSelectedToEdit}
                    listEditorId={this.props.listEditorId}
                    input={this.props.input}
                    buttonLabel={this.state.buttonLabel}
                    showForm={this.showFormInEditMode}
                    formMode={this.state.formMode}
                    hidden={!this.state.showAddForm}
                />

                <ListRowHeader
                    onDeleteAll={this.deleteAllItems}
                    hideReorder={this.props.hideReorder || this.state.itemList.length < 2}
                    disabled={this.props.disabled}
                    listEditorId={this.props.listEditorId}
                    {...((this.props.locale && this.props.locale.header) || /* istanbul ignore next */ {})}
                />
                {this.state.itemList.length > 0 ? (
                    <div id={`${this.props.listEditorId}-list`} data-testid={`${this.props.listEditorId}-list`}>
                        {renderListsRows}
                    </div>
                ) : (
                    <div id={`${this.props.listEditorId}-list`} data-testid={`${this.props.listEditorId}-list`}>
                        <Typography style={noRecordsStyle}>No records to display</Typography>
                    </div>
                )}
                {this.props.error && (
                    /* istanbul ignore next */ <FormHelperText error>{this.props.error}</FormHelperText>
                )}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}
export const mapStateToProps = state => ({
    ...(state && state.get('adminScaleOfSignificanceReducer')
        ? state.get('adminScaleOfSignificanceReducer')
        : /* istanbul ignore next */ null),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScaleOfSignificanceListEditor);
