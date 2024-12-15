import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import ListRowHeader from './ListRowHeader';
import ListRow from './ListRow';
import { GenericTemplate } from './GenericTemplate';

import FormHelperText from '@mui/material/FormHelperText';
// import { isArrayDeeplyEqual } from '../../../../../helpers/general';

export const ListEditor = ({
    formComponent: FormComponent,
    searchKey = {
        value: 'rek_value',
        order: 'rek_order',
    },
    locale = {
        form: {
            locale: {
                inputFieldLabel: 'NoLabel',
            },
        },
    },
    transformFunction = (searchKey, item, index) => ({
        [searchKey.value]: item,
        [searchKey.order]: index + 1,
    }),
    getItemSelectedToEdit = (list, index) => list[index] || null,
    inputNormalizer = value => value,
    rowItemTemplate = GenericTemplate,
    maxCount = 0,
    scrollListHeight = 250,
    required = false,
    scrollList = false,
    canEdit = false,
    hideReorder = false,
    distinctOnly = false,
    inputField,
    className,
    isValid,
    disabled,
    onChange,
    error,
    errorText,
    remindToAdd,
    input,
    maxInputLength,
    category,
    listEditorId,
}) => {
    const methods = useFormContext();
    const setInitState = () => {
        const valueAsJson =
            ((input || {}).name && typeof (input.value || {}).toJS === 'function' && input.value.toJS()) ||
            ((input || {}).name && input.value);

        return valueAsJson ? valueAsJson.map(item => item[searchKey.value]) : [];
    };

    const [itemList, setItemList] = useState(setInitState);
    const [itemIndexSelectedToEdit, setItemIndexSelectedToEdit] = useState(null);

    useEffect(() => {
        console.log('useEffect');
        if (onChange) {
            const transformOutput = items => {
                return items.map((item, index) => transformFunction(searchKey, item, index));
            };
            // notify parent component when local state has been updated, eg itemList added/removed/reordered
            onChange(transformOutput(itemList));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemList]);

    const addItem = useCallback(
        item => {
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
            const isItemInTheList = (item, list) => {
                if ((!!item.key && !!item.value) || (!!item.id && !!item.value)) {
                    if (itemIndexSelectedToEdit === null) {
                        return (
                            list.filter(listItem => {
                                return (
                                    (!!listItem.key && listItem.key === item.key) ||
                                    (!!listItem.id && listItem.id === item.id)
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

            if (
                !!item &&
                (maxCount === 0 || itemList.length < maxCount) &&
                ((distinctOnly && !isItemInTheList(item, itemList)) || (!distinctOnly && itemList.indexOf(item) === -1))
            ) {
                // If when the item is submitted, there is no maxCount,
                // its not exceeding the maxCount, is distinct and isnt already in the list...
                if ((!!item.key && !!item.value) || (!!item.id && !!item.value)) {
                    // Item is an object with {key: 'something', value: 'something'} - as per FoR codes
                    // OR item is an object with {id: 'PID:1234', value: 'Label'} - as per related datasets
                    if (itemIndexSelectedToEdit !== null && itemIndexSelectedToEdit > -1) {
                        setItemList(prev => [
                            ...prev.slice(0, itemIndexSelectedToEdit),
                            item,
                            ...prev.slice(itemIndexSelectedToEdit + 1),
                        ]);
                        setItemIndexSelectedToEdit(null);
                    } else {
                        setItemList(prev => [...prev, item]);
                    }
                } else if (!!item && !item.key && !item.value && item.includes('|')) {
                    // Item is a string with pipes in it -
                    // we will strip and separate the values to be individual keywords
                    const commaSepListToArray = item.split('|'); // Convert the string to an array of values
                    // Filter out empty array values
                    const cleanArray = commaSepListToArray.filter(item => item.trim() !== '');
                    const totalArray = [...itemList, ...cleanArray]; // Merge into the list
                    if (totalArray.length > maxCount && maxCount > 0) {
                        // If the final list is longer that maxCount, trim it back
                        totalArray.length = maxCount;
                    }
                    setItemList([...totalArray]);
                } else {
                    if (itemIndexSelectedToEdit !== null && itemIndexSelectedToEdit > -1) {
                        const itemSelected = !!itemList[itemIndexSelectedToEdit].key
                            ? {
                                  ...itemList[itemIndexSelectedToEdit],
                                  key: item,
                              }
                            : item;

                        setItemList(prev => [
                            ...prev.slice(0, itemIndexSelectedToEdit),
                            itemSelected,
                            ...prev.slice(itemIndexSelectedToEdit + 1),
                        ]);
                        setItemIndexSelectedToEdit(null);
                    } else {
                        // Item is just a string - so just add it
                        setItemList(prev => [...prev, item]);
                    }
                }
            }
        },

        [distinctOnly, itemIndexSelectedToEdit, itemList, maxCount],
    );

    const moveUpList = useCallback(
        (item, index) => {
            /* istanbul ignore next */
            console.log(item, index, itemList, itemList.length - 1);
            if (index === 0) return;
            const nextList = itemList[index - 1];
            setItemList(prev => [...prev.slice(0, index - 1), item, nextList, ...prev.slice(index + 1)]);
        },
        [itemList],
    );

    const moveDownList = useCallback(
        (item, index) => {
            /* istanbul ignore next */
            console.log(item, index, itemList, itemList.length - 1);
            if (index === itemList.length - 1) return;
            const nextList = itemList[index + 1];

            setItemList(prev => [...prev.slice(0, index), nextList, item, ...prev.slice(index + 2)]);
        },
        [itemList],
    );

    const deleteItem = useCallback(
        (item, index) => {
            setItemList(itemList.filter((_, i) => i !== index));
        },
        [itemList],
    );

    const deleteAllItems = useCallback(() => {
        setItemList([]);
    }, []);

    const editItem = useCallback(index => {
        setItemIndexSelectedToEdit(index);
    }, []);

    const renderListsRows = useMemo(
        () => {
            return itemList.map((item, index) => (
                <ListRow
                    key={item.key || item.id || `${item}-${index}`}
                    index={index}
                    item={item}
                    canMoveDown={index !== itemList.length - 1}
                    canMoveUp={index !== 0}
                    onMoveUp={moveUpList}
                    onMoveDown={moveDownList}
                    onDelete={deleteItem}
                    onEdit={editItem}
                    {...((locale && locale.row) || {})}
                    hideReorder={hideReorder}
                    disabled={disabled}
                    itemTemplate={rowItemTemplate}
                    canEdit={canEdit}
                    listRowId={`${listEditorId}-list-row-${index}`}
                />
            ));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [itemList, moveDownList, moveUpList],
    );
    return (
        <div className={`${className}`} id={`${listEditorId}-list-editor`} data-testid={`${listEditorId}-list-editor`}>
            <Field
                control={methods.control}
                component={FormComponent}
                name={listEditorId}
                inputField={inputField}
                key={(!!itemIndexSelectedToEdit && `${listEditorId}-form`) || 'list-editor-form'}
                onAdd={addItem}
                remindToAdd={remindToAdd}
                {...((locale && locale.form) || {})}
                isValid={isValid}
                error={error}
                disabled={disabled || (maxCount > 0 && itemList.length >= maxCount)}
                maxInputLength={maxInputLength}
                normalize={inputNormalizer}
                category={category}
                required={required}
                itemSelectedToEdit={getItemSelectedToEdit(itemList, itemIndexSelectedToEdit)}
                itemIndexSelectedToEdit={itemIndexSelectedToEdit}
                listEditorId={listEditorId}
            />

            {itemList.length > 0 && (
                <ListRowHeader
                    onDeleteAll={deleteAllItems}
                    hideReorder={hideReorder || itemList.length < 2}
                    disabled={disabled}
                    listEditorId={listEditorId}
                    {...((locale && locale.header) || {})}
                />
            )}
            {!!scrollList && itemList.length >= scrollListHeight / 55 ? (
                <div
                    className={'ListEditor-scrollable-list'}
                    id={`${listEditorId}-list`}
                    data-testid={`${listEditorId}-list`}
                    style={{
                        width: '100%',
                        height: scrollListHeight,
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                    }}
                >
                    {renderListsRows}
                </div>
            ) : (
                <div id={`${listEditorId}-list`} data-testid={`${listEditorId}-list`}>
                    {renderListsRows}
                </div>
            )}
            <FormHelperText error={error} children={errorText} />
        </div>
    );
};
ListEditor.propTypes = {
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
    transformFunction: PropTypes.func,
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
};

export default memo(ListEditor);
