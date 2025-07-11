import { useState, useCallback, useEffect } from 'react';

import PropTypes from 'prop-types';

import { useConfirmationState } from './index';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook providing convenience methods and properties for interacting with an MRT table.
 * @param {Array} list The table data object
 * @param {Array} rules One or more validation rules to apply against field data
 * @returns
 *      data,
 *      isBusy,
        pendingDeleteRowId,
        editingRow,
        isOpen,
        validationErrors,
        isPendingDelete,
        hasSelectedRows,
        selectedRows,
        setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        showConfirmation,
        hideConfirmation,
        validate,
        getValidationError,
        handleValidation,
        clearValidationErrors,
        hasValidationErrors,
        setSelectedRows,
        resetSelectedRows,
 */
export const useMrtTable = (list, rules = []) => {
    const [data, setData] = useState(list);

    const [state, setState] = useState({ busy: false, deleteRowId: null, editingRow: null });
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [validationErrors, setValidationErrors] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const setBusy = useCallback((isBusy = true) => setState(prev => ({ ...prev, busy: isBusy })), []);
    const setDeleteRow = id => {
        setState(prev => ({ ...prev, deleteRowId: id }));
        showConfirmation();
    };
    const resetDeleteRow = () => {
        setState(prev => ({ ...prev, deleteRowId: null }));
        hideConfirmation();
    };
    const isPendingDelete = state.deleteRowId !== null;
    const setEditRow = useCallback(row => setState(prev => ({ ...prev, editingRow: row })), []);
    const resetEditRow = useCallback(() => setState(prev => ({ ...prev, editingRow: null })), []);

    const hasSelectedRows = Object.keys(rowSelection ?? [])?.length > 0;
    const resetSelectedRows = () => setRowSelection({});

    const validate = useCallback(
        rules => row => {
            const errors = rules.reduce((acc, curr) => {
                const fieldError = curr.validate?.(row);
                return fieldError ? [...acc, fieldError] : acc;
            }, []);
            return errors.length > 0 ? errors : null;
        },
        [],
    );

    const getValidationError = useCallback((errors = [], field) => {
        return errors.find(error => error.field === field)?.message;
    }, []);

    const handleValidation = useCallback(
        (row, field, value) => {
            const currentValues = { ...row.original, ...row._valuesCache };
            const updatedValues = { ...currentValues, [field]: value };
            const errors = validate(rules)(updatedValues);

            setValidationErrors(prev => ({
                ...prev,
                [row.id]: errors,
            }));
        },
        [rules, validate],
    );

    const hasValidationErrors = id => Array.isArray(validationErrors[id]) && validationErrors[id].length > 0;
    const clearValidationErrors = () => setValidationErrors({});

    useEffect(() => {
        resetSelectedRows();
        setData(list);
    }, [list]);

    const _setData = data => {
        hasSelectedRows && resetSelectedRows();
        setData(data);
    };

    return {
        data,
        isBusy: state.busy,
        pendingDeleteRowId: state.deleteRowId,
        editingRow: state.editingRow,
        isOpen,
        validationErrors,
        isPendingDelete,
        hasSelectedRows,
        selectedRows: rowSelection,
        setData: _setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        showConfirmation,
        hideConfirmation,
        validate: validate(rules),
        getValidationError,
        handleValidation,
        clearValidationErrors,
        hasValidationErrors,
        setSelectedRows: setRowSelection,
        resetSelectedRows,
    };
};
useMrtTable.propTypes = {
    list: PropTypes.array.isRequired,
    rules: PropTypes.any,
};

/**
 * Convenience methods and properties for interacting with an API to manage table pagination data
 * @param {Object} actions Object of server API methods in the format
 * {
 *   read: ()=>{},
 *   update: ()=>{},
 *   delete: ()=>{},
 * }
 * @param {number} pageSize Size of page in rows
 * @param {number} pageIndex Current zero-indexed page number
 * @returns
 *
        userListLoading,
        userListLoadingError,
        userListItemUpdating,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleting,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAdding,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
        pagination,
        data,
        request,
        onPaginationChange,
        onSetPageSize,

 */
export const useServerData = ({ actions, pageSize = 10, pageIndex = 0 }) => {
    const [state, _setState] = useState({
        data: [],
        pageIndex,
        pageSize,
        resultCount: 0,
    });
    const dispatch = useDispatch();
    const {
        userListLoading,
        userListLoadingError,
        userListItemUpdating,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleting,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAdding,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
    } = useSelector(state => state?.get('manageUsersReducer'));

    const _get = useCallback(
        payload => {
            dispatch(actions.read({ page: payload.pageIndex, pageSize: payload.pageSize, search: payload.searchTerm }))
                .then(response => {
                    _setState(prev => ({
                        ...prev,
                        data: response.data,
                        pageIndex: response.page,
                        pageSize: response.size,
                        resultCount: response.totalCount ?? (response.data?.length + 1 || 0),
                    }));
                })
                .catch(e => {
                    console.error(e);
                });
        },
        [actions, dispatch],
    );

    const onPaginationChange = updater => {
        // Updater can be a function or a value
        const newPagination =
            typeof updater === 'function' ? updater({ pageIndex: state.pageIndex, pageSize: state.pageSize }) : updater;
        _get(newPagination);
    };

    const onSetPageSize = size => {
        _get({ ...state, pageSize: size });
    };

    useEffect(() => {
        _get(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        userListLoading,
        userListLoadingError,
        userListItemUpdating,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleting,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAdding,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
        pagination: { pageIndex: state.pageIndex, pageSize: state.pageSize, resultCount: state.resultCount },
        data: state.data,
        request: _get,
        onPaginationChange,
        onSetPageSize,
    };
};
useServerData.propTypes = {
    actions: PropTypes.shape({
        read: PropTypes.func.isRequired,
        update: PropTypes.func,
        delete: PropTypes.func,
    }).isRequired,
    pageSize: PropTypes.number,
    pageIndex: PropTypes.number,
};
