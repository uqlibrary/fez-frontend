import React from 'react';
import PropTypes from 'prop-types';

import { uniqWith, isEqual } from 'lodash';
import FormHelperText from '@mui/material/FormHelperText';

import ListRowHeader from './ListRowHeader';
import ListRow from './ListRow';
import GenericTemplate from './GenericTemplate';
import FreeTextForm from './FreeTextForm';

export const NewListEditor = ({
    canAdd = true,
    canEdit,
    disabled,
    error,
    errorText,
    hideReorder,
    isValid,
    inputNormalizer = value => value,
    list,
    listEditorId,
    ListEditorForm = FreeTextForm,
    ListEditorItemTemplate = GenericTemplate,
    locale,
    maxCount,
    onChange,
    required,
    scrollList,
    scrollListHeight,
    searchKey,
    transform = (list, searchKey) =>
        list.map((listItem, index) => ({ [searchKey.value]: listItem, [searchKey.order]: index + 1 })),
}) => {
    const [mode, setMode] = React.useState('add');
    const [indexToUpdate, setIndexToUpdate] = React.useState(null);
    const [itemToUpdate, setItemToUpdate] = React.useState(null);
    const [itemsList, setItemsList] = React.useState(list);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAdd = React.useCallback(item =>
        setItemsList(itemsList =>
            uniqWith([...itemsList, ...(Array.isArray(item) ? item : [item])], isEqual).slice(0, maxCount),
        ),
    );

    /**
     * @param {object} item
     * @param {function} indexFinder(list, item) {} specific implementation to find
     *      duplicate index of the item being submitted
     *
     * This implementation doesn't handle keywords with pipes (|) during update
     */
    const handleUpdate = React.useCallback(
        (item, indexFinder) => {
            setItemsList(itemsList => {
                const preIndexItems = itemsList.slice(0, indexToUpdate);
                const postIndexItems = itemsList.slice(indexToUpdate + 1);

                if (indexFinder([...preIndexItems, ...postIndexItems], item) < 0) {
                    return [...preIndexItems, item, ...postIndexItems];
                } else {
                    return [...preIndexItems, itemToUpdate, ...postIndexItems];
                }
            });

            setIndexToUpdate(null);
            setItemToUpdate(null);
            setMode('add');
        },
        [indexToUpdate, itemToUpdate],
    );

    const handleEdit = React.useCallback(
        index => {
            setIndexToUpdate(index);
            setItemToUpdate(itemsList[index]);
            setMode('update');
        },
        [itemsList],
    );

    const handleMoveUp = React.useCallback(
        (item, index) =>
            setItemsList(itemsList => [
                ...itemsList.slice(0, index - 1),
                item,
                itemsList[index - 1],
                ...itemsList.slice(index + 1),
            ]),
        [],
    );

    const handleMoveDown = React.useCallback(
        (item, index) =>
            setItemsList(itemsList => [
                ...itemsList.slice(0, index),
                itemsList[index + 1],
                item,
                ...itemsList.slice(index + 2),
            ]),
        [],
    );

    const handleDelete = React.useCallback(
        (item, index) => setItemsList(itemsList => itemsList.filter((_, i) => i !== index)),
        [],
    );

    const handleDeleteAll = React.useCallback(() => setItemsList(() => []), []);

    const scrollStyle = React.useRef(
        !!scrollList && itemsList.length >= scrollListHeight / 55
            ? {
                  style: { width: '100%', height: scrollListHeight, overflowX: 'hidden', overflowY: 'scroll' },
                  id: `${listEditorId}-scroll-list`,
                  'data-testid': `${listEditorId}-scroll-list`,
              }
            : {},
    );

    /**
     * Run this effect on itemsList changed from various actions (add/update/delete/moveUp/moveDown)
     */
    React.useEffect(() => {
        onChange(transform(itemsList, searchKey));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsList]);

    return (
        <div id={`${listEditorId}-list-editor`}>
            {canAdd && (
                <ListEditorForm
                    key={`${listEditorId}-form-${mode}`}
                    mode={mode}
                    onSubmit={mode === 'add' ? handleAdd : handleUpdate}
                    disabled={disabled || (maxCount > 0 && itemsList.length >= maxCount)}
                    required={required}
                    isValid={isValid}
                    itemSelectedToEdit={itemToUpdate}
                    normalize={inputNormalizer}
                    listEditorFormId={`${listEditorId}-form-${mode}`}
                    listEditorId={listEditorId}
                    {...((locale && locale.form) || {})}
                />
            )}
            {itemsList.length > 0 && (
                <ListRowHeader
                    onDeleteAll={handleDeleteAll}
                    hideReorder={hideReorder || itemsList.length < 2}
                    disabled={disabled}
                    listEditorId={listEditorId}
                    {...((locale && locale.header) || {})}
                />
            )}
            <div id={`${listEditorId}-list`} data-testid={`${listEditorId}-list`} {...scrollStyle.current}>
                {itemsList.map((item, index) => (
                    <ListRow
                        key={JSON.stringify(item) + index}
                        item={item}
                        index={index}
                        canEdit={canEdit}
                        canMoveDown={index < itemsList.length - 1}
                        canMoveUp={index > 0}
                        disabled={disabled}
                        hideReorder={hideReorder}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        itemTemplate={ListEditorItemTemplate}
                        listRowId={`${listEditorId}-list-row-${index}`}
                        {...((locale && locale.row) || {})}
                    />
                ))}
            </div>
            <FormHelperText error={error} children={errorText} />
        </div>
    );
};

NewListEditor.propTypes = {
    canAdd: PropTypes.bool,
    canEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    distinctOnly: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    hideReorder: PropTypes.bool,
    isValid: PropTypes.func,
    inputNormalizer: PropTypes.func,
    list: PropTypes.array,
    listEditorId: PropTypes.string.isRequired,
    ListEditorForm: PropTypes.elementType.isRequired,
    ListEditorItemTemplate: PropTypes.elementType,
    locale: PropTypes.object,
    maxCount: PropTypes.number,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    scrollList: PropTypes.bool,
    scrollListHeight: PropTypes.number,
    searchKey: PropTypes.object,
    transform: PropTypes.func,
};

export default React.memo(NewListEditor);
