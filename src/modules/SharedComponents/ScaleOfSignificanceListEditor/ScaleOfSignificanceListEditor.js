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

        console.log('STATE AT THIS TIME', this.state.itemList);
        const testItemList = [];
        this.state.itemList.map(item => {
            item.author = { rek_author: item.author.rek_author, rek_author_id: item.author.rek_author_id };
            testItemList.push(item);
        });
        console.log('TEST ITEM LIST', testItemList);

        this.state.itemList = testItemList;
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
        console.log('THIS STATE', this.state);
        console.log('THIS PROPS', this.props);
        if (this.props?.contributors?.authors?.length > 0) {
            this.state.originalAuthors = this.props.contributors.authors;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // notify parent component when local state has been updated, eg itemList added/removed/reordered
        /* istanbul ignore else */
        console.log('The Item List', this.state.itemList);
        console.log('xtest', prevProps);
        console.log('ytest', prevState);
        console.log('prev state test', prevState.originalAuthors);
        console.log('this state', this.state);
        console.log('contributors onupdate', this.props.contributors);
        if (this.props.onChange) {
            this.props.onChange(this.transformOutput(this.state.itemList));
        }
        // DETECT A CHANGE IN THE ORDER OF AUTHORS

        console.log('Length check', this.props.contributors.authors.length, prevProps.contributors.authors.length);
        if (prevProps.contributors.authors !== this.props.contributors.authors) {
            // if one is added....
            if (
                this.props.contributors.authors.length > prevProps.contributors.authors.length &&
                this.props.contributors.authors.length > this.state.itemList.length
            ) {
                // Create a new Scale of Significance record.
                // The new record will be the last record in the list in this case.
                const newRecord = this.props.contributors.authors[this.props.contributors.authors.length - 1];
                console.log('NEW RECORD', newRecord);
                this.setState({
                    itemList: [
                        ...this.state.itemList,
                        {
                            author: {
                                rek_author: newRecord.nameAsPublished,
                            },
                            id: 0,
                            key: 0,
                            value: {
                                plainText: 'Missing',
                                htmlText: 'Missing',
                            },
                        },
                    ],
                });
            } else if (
                this.props.contributors.authors.length < prevProps.contributors.authors.length &&
                this.props.contributors.authors.length < this.state.itemList.length
            ) {
                const newList = [...this.state.itemList];
                let found = false;
                prevProps.contributors.authors.forEach((previous, index) => {
                    if (!found && JSON.stringify(previous) !== JSON.stringify(this.props.contributors.authors[index])) {
                        delete newList[index];
                        found = true;
                    }
                });
                if (!found) {
                    newList.pop();
                }
                this.setState({
                    itemList: [...newList],
                });
            } else {
                // if the order has changed....
                const newList = [...this.state.itemList];
                let found = false;
                prevProps.contributors.authors.forEach((previous, index) => {
                    if (!found) {
                        if (JSON.stringify(previous) !== JSON.stringify(this.props.contributors.authors[index])) {
                            newList[index] = this.state.itemList[index + 1];
                            newList[index + 1] = this.state.itemList[index];
                            found = true;
                        }
                    }
                });
                this.setState({
                    itemList: [...newList],
                });
            }
        } else {
            console.log('Apparently they are the same');
        }
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
        console.log('Saving the change', item);
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
            console.log('The edited item?', item);
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

    moveUpList = (item, index) => {
        /* istanbul ignore next */
        if (index === 0) return;
        const movedItem = this.state.itemList[index];
        const swappedItem = this.state.itemList[index - 1];
        this.setState({
            itemList: [
                ...this.state.itemList.slice(0, index - 1),
                movedItem,
                swappedItem,
                ...this.state.itemList.slice(index + 1),
            ],
        });
    };

    moveDownList = (item, index) => {
        /* istanbul ignore next */
        if (index === this.state.itemList.length - 1) return;
        const movedItem = this.state.itemList[index];
        const swappedItem = this.state.itemList[index + 1];
        this.setState({
            itemList: [
                ...this.state.itemList.slice(0, index),
                swappedItem,
                movedItem,
                ...this.state.itemList.slice(index + 2),
            ],
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
        // const SIGNIFICANCE_VALUES = [...SIGNIFICANCE, { text: 'Missing', value: -1 }];
        // console.log(SIGNIFICANCE_TESTING, SIGNIFICANCE);
        console.log('This is a test', this.props.contributors);
        // let renderContributors = [];
        // if (this.props.contributors && this.props.contributors.authors
        // && this.props.contributors.authors.length > 0) {
        //     // renderContributors = this.props.contributors.authors.map(item => {
        //     renderContributors = this.state.itemList.map((item, index) => {
        //         console.log('ITEM', item);
        //         return (
        //             <Grid container spacing={2}>
        //                 <Grid item sm={2}>
        //                     {/* Might have to move this renderContributors to a function
        //                         so I can capture changes to author order.
        //                         Maybe do something like:
        //                         Based on the scale of significance ordering:
        //                         * Map the list of authors.
        //                         * Set the value of the author to the correct one in the order in SoS.
        //                     */}

        //                     <NewGenericSelectField
        //                         // error={!!fieldProps.meta && fieldProps.meta.error}
        //                         // errorText={!!fieldProps.meta && fieldProps.meta.error}
        //                         onChange={this.setSignificance}
        //                         value={this.props.contributors.authors[index].nameAsPublished}
        //                         itemsList={[
        //                             ...this.props.contributors.authors.map(authoritem => ({
        //                                 value: authoritem.nameAsPublished,
        //                                 text: authoritem.nameAsPublished,
        //                             })),
        //                         ]}
        //                         selectPrompt="Choose Author"
        //                         genericSelectFieldId="rek-subtype"
        //                     />
        //                 </Grid>
        //                 <Grid item sm={2}>
        //                     <NewGenericSelectField
        //                         // error={!!fieldProps.meta && fieldProps.meta.error}
        //                         // errorText={!!fieldProps.meta && fieldProps.meta.error}
        //                         // onChange={(!!fieldProps.input && fieldProps.input.onChange)
        // || fieldProps.onChange}
        //                         value={item.key > 0 ? item.key : -1}
        //                         itemsList={SIGNIFICANCE_TESTING}
        //                         selectPrompt="Choose Significance"
        //                         genericSelectFieldId={`scale-item-${index}`}
        //                     />
        //                 </Grid>
        //             </Grid>
        //         );
        //     });
        // }

        // console.log('authors', renderContributors);
        // OLD Scale of Significance from here.

        const renderListsRows = this.state.itemList.map((item, index) => {
            const tempItem = {
                id: index,
                // authorName: item.authorName || item.author?.rek_author || null,
                author: {
                    // eslint-disable-next-line camelcase
                    // rek_author: item.author?.rek_author || this.state.itemList[index].author?.rek_author || null,
                    rek_author:
                        this.props.contributors?.authors[index]?.nameAsPublished ||
                        item.author?.rek_author ||
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
export const mapStateToProps = state => ({
    contributors: state && state.get('adminAuthorsReducer') ? state.get('adminAuthorsReducer') : null,
});

export default connect(mapStateToProps)(ScaleOfSignificanceListEditor);
