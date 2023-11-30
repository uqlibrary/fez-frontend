import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListRowHeader from '../Toolbox/ListEditor/components/ListRowHeader';
import ListRow from '../Toolbox/ListEditor/components/ListRow';
import ScaleOfSignificanceForm from './ScaleOfSignificanceForm';
import { ScaleOfSignificanceTemplate } from './ScaleOfSignificanceTemplate';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AddCircle from '@mui/icons-material/Add';
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
        console.log('Initial Props in SoS', props);
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

        console.log('SHAPE OF ITEMLIST', this.state.itemList);
        if (!!this.props.scaleOfSignificance && this.props.scaleOfSignificance.length > 0) {
            this.state.itemList = [...this.props.scaleOfSignificance];
        }

        this.state.originalItemList = this.state.itemList;

        this.transformOutput = this.transformOutput.bind(this);
        this.saveChangeToItem = this.saveChangeToItem.bind(this);
        this.moveUpList = this.moveUpList.bind(this);
        this.moveDownList = this.moveDownList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteAllItems = this.deleteAllItems.bind(this);
        this.loadEditForm = this.loadEditForm.bind(this);
        this.showFormInAddMode = this.showFormInAddMode.bind(this);
        this.showFormInEditMode = this.showFormInEditMode.bind(this);
    }
    componentDidMount() {
        console.log('test', this.props.contributors.authors);
        if (this.props?.contributors?.authors?.length > 0) {
            this.state.originalAuthors = this.props.contributors.authors;
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.onChange) {
            this.props.onChange(this.transformOutput(this.state.itemList));
        }
        console.log('SOS prev', this.props.scaleOfSignificance, this.state.itemList);
        // If the props have changed, we should set the significance to the props, surely.
        if (this.props.scaleOfSignificance.length > 0) {
            // if the INBOUND props have changed, set to the new inbound props.
            if (Object.keys(diff(this.props.scaleOfSignificance, prevProps.scaleOfSignificance)).length > 0) {
                this.state.itemList = [...this.props.scaleOfSignificance];
            }
            // otherwise, the state should be correct.
        }
        this.props.actions.updateAdminScaleSignificance(this.state.itemList);
        // if (prevProps.scaleOfSignificance)
        // notify parent component when local state has been updated, eg itemList added/removed/reordered
        /* istanbul ignore else */
        // OLD WAY I DID IT
        // console.log('CHANGED PROPS IN SIG EDITOR', this.props);
        // if (this.props.onChange) {
        //     this.props.onChange(this.transformOutput(this.state.itemList));
        // }
        // // DETECT A CHANGE IN THE ORDER OF AUTHORS
        // if (!!prevProps?.contributors?.authors && Array.isArray(prevProps?.contributors?.authors)) {
        //     console.log('Entered section A');
        //     if (JSON.stringify(prevProps.contributors.authors) !== JSON.stringify(this.props.contributors.authors)) {
        //         console.log('They are not the same. Entered section B');
        //         // if one is added....
        //         if (
        //             this.props.contributors.authors.length > prevProps.contributors.authors.length &&
        //             this.props.contributors.authors.length > this.state.itemList.length
        //         ) {
        //             // Create a new Scale of Significance record.
        //             // The new record will be the last record in the list in this case.
        //             const newRecord = this.props.contributors.authors[this.props.contributors.authors.length - 1];
        //             this.setState({
        //                 itemList: [
        //                     ...this.state.itemList,
        //                     {
        //                         author: {
        //                             rek_author: newRecord.nameAsPublished,
        //                         },
        //                         id: 0,
        //                         key: 0,
        //                         value: {
        //                             plainText: 'Missing',
        //                             htmlText: 'Missing',
        //                         },
        //                     },
        //                 ],
        //             });
        //         } else if (
        //             this.props.contributors.authors.length < prevProps.contributors.authors.length &&
        //             this.props.contributors.authors.length < this.state.itemList.length
        //         ) {
        //             const newList = [...this.state.itemList];
        //             let found = false;
        //             prevProps.contributors.authors.forEach((previous, index) => {
        //                 /* istanbul ignore else */
        //                 if (
        //                     !found &&
        //                     JSON.stringify(previous) !== JSON.stringify(this.props.contributors.authors[index])
        //                 ) {
        //                     newList.splice(index, 1);
        //                     found = true;
        //                 }
        //             });
        //             /* istanbul ignore else */
        //             if (!found && this.state.itemList.length > this.props.contributors.authors.length) {
        //                 newList.pop();
        //             }
        //             this.setState({
        //                 itemList: [...newList],
        //             });
        //         } else if (
        //             this.props.contributors.authors.length < prevProps.contributors.authors.length &&
        //             this.props.contributors.authors.length === this.state.itemList.length
        //         ) {
        //             this.setState({
        //                 itemList: [...this.state.itemList],
        //             });
        //         } else {
        //             /* istanbul ignore else */
        //             if (this.state.itemList.length > 1) {
        //                 // if the order has changed....
        //                 console.log('IT SHOULD NOT BE DOING THIS');
        //                 const newList = [...this.state.itemList];
        //                 let found = false;
        //                 prevProps.contributors.authors.forEach((previous, index) => {
        //                     if (!found) {
        //                         /* istanbul ignore else */
        //                         if (
        //                             JSON.stringify(previous)
        //                              !== JSON.stringify(this.props.contributors.authors[index])
        //                         ) {
        //                             newList[index] = this.state.itemList[index + 1];
        //                             newList[index + 1] = this.state.itemList[index];
        //                             found = true;
        //                         }
        //                     }
        //                 });
        //                 this.setState({
        //                     itemList: [...newList],
        //                 });
        //             }
        //         }
        //     }
        // }
        // console.log('SHAPE OF ITEMLIST', this.state.itemList);
        // this.props.actions.updateAdminScaleSignificance(this.state.itemList);
    }
    transformOutput = items => {
        return items.map((item, index) => this.props.transformFunction(this.props.searchKey, item, index));
    };

    getItemSelectedToEdit = (mode, list, index) => {
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

    calculateAuthors = (moved, swapped, index, targetIndex) => {
        const movedAuthor =
            !!this.props?.contributors?.authors && Array.isArray(this.props?.contributors?.authors)
                ? this.props.contributors.authors[index].nameAsPublished
                : moved.author.rek_author;
        const swappedAuthor =
            !!this.props?.contributors?.authors && Array.isArray(this.props?.contributors?.authors)
                ? this.props.contributors.authors[targetIndex].nameAsPublished
                : swapped.author.rek_author;
        return { movedAuthor, swappedAuthor };
    };

    moveUpList = (item, index) => {
        /* istanbul ignore next */
        // Handle the order changing part here?
        if (index === 0) return;

        console.log('this is what it should be', this.state.itemList);
        const itemList = [...this.state.itemList];
        itemList[index] = this.state.itemList[index - 1];
        itemList[index - 1] = this.state.itemList[index];

        const movedAuthor = { ...itemList[index].author };
        const swappedAuthor = { ...itemList[index - 1].author };
        itemList[index].author = swappedAuthor;
        itemList[index - 1].author = movedAuthor;
        console.log('this is the itemlist now', itemList, this.state.itemList, index);
        // debugger; // eslint-disable-line no-debugger
        // console.log('MOVED STUFF', movedAuthor, swappedAuthor, this.state.itemList);
        // // const { movedAuthor, swappedAuthor } = this.calculateAuthors(movedItem, swappedItem, index, index - 1);
        // // movedItem.author = swappedAuthor;
        // // swappedItem.author = movedAuthor;
        this.setState({
            itemList: [...itemList],
        });
        // console.log('IT NOW SHOULD BE', itemList);
    };

    moveDownList = (item, index) => {
        /* istanbul ignore next */
        if (index === this.state.itemList.length - 1) return;
        console.log('this is what it should be', this.state.itemList);
        const itemList = [...this.state.itemList];
        itemList[index] = this.state.itemList[index + 1];
        itemList[index + 1] = this.state.itemList[index];

        const movedAuthor = { ...itemList[index].author };
        const swappedAuthor = { ...itemList[index + 1].author };
        itemList[index].author = swappedAuthor;
        itemList[index + 1].author = movedAuthor;
        console.log('this is the itemlist now', itemList, this.state.itemList, index);
        // debugger; // eslint-disable-line no-debugger
        // console.log('MOVED STUFF', movedAuthor, swappedAuthor, this.state.itemList);
        // // const { movedAuthor, swappedAuthor } = this.calculateAuthors(movedItem, swappedItem, index, index - 1);
        // // movedItem.author = swappedAuthor;
        // // swappedItem.author = movedAuthor;
        this.setState({
            itemList: [...itemList],
        });
    };

    /* istanbul ignore next */
    deleteItem = (item, index) => {
        this.setState({
            itemList: this.state.itemList.filter((_, i) => i !== index),
        });
    };

    /* istanbul ignore next */
    deleteAllItems = () => {
        this.setState({
            itemList: [],
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

    showFormInAddMode = () => {
        this.setState({
            showAddForm: true,
            formMode: 'add',
            buttonLabel: this.props.locale.form.locale.addButtonLabel,
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
        const renderListsRows = this.state.itemList.map((item, index) => {
            const tempItem = {
                id: index,
                // authorName: item.authorName || item.author?.rek_author || null,
                author: {
                    // eslint-disable-next-line camelcase
                    // rek_author: item.author?.rek_author || this.state.itemList[index].author?.rek_author || null,
                    rek_author:
                        this.props.contributors?.authors[index]?.nameAsPublished ||
                        // item.author?.rek_author ||
                        this.state.itemList[index].author?.rek_author ||
                        null,
                },
                key: item.key,
                value: {
                    htmlText: item.value?.htmlText || /* istanbul ignore next */ null,
                },
            };
            return (
                <ListRow
                    key={item.id || item.key || `${item}-${index}`}
                    index={index}
                    item={tempItem}
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
                {this.state.showAddForm ? (
                    <ScaleOfSignificanceForm
                        key={
                            (!!this.state.itemIndexSelectedToEdit && `${this.props.listEditorId}-form`) ||
                            'list-editor-form'
                        }
                        contributors={this.props.contributors}
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
                    />
                ) : (
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <IconButton
                            data-analyticsid="rek-significance-showhidebutton"
                            data-testid="rek-significance-showhidebutton"
                            onClick={this.showFormInAddMode}
                            aria-label={this.props.locale.form.locale.addEntryButton}
                            size="small"
                            style={{
                                color: '#fff',
                                backgroundColor:
                                    this.state.itemList?.length >= this.props?.contributors?.authors?.length
                                        ? '#ccc'
                                        : '#51247A',
                            }}
                            disabled={this.state.itemList?.length >= this.props?.contributors?.authors?.length}
                        >
                            <AddCircle />
                        </IconButton>
                    </Box>
                )}
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
    contributors: state && state.get('adminAuthorsReducer') ? state.get('adminAuthorsReducer') : null,
    ...(state && state.get('adminScaleOfSignificanceReducer') ? state.get('adminScaleOfSignificanceReducer') : null),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScaleOfSignificanceListEditor);
