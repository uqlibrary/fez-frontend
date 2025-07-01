import { useState, useCallback } from 'react';
import { useConfirmationState } from './index';

export const useMrtTable = (list, rules) => {
    const [data, setData] = useState(list);
    const [state, setState] = useState({ busy: false, deleteRowId: null, editingRow: null });
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [validationErrors, setValidationErrors] = useState({});

    const setBusy = useCallback((isBusy = true) => setState(prev => ({ ...prev, busy: isBusy })), []);
    const setDeleteRow = id => {
        setState(prev => ({ ...prev, deleteRowId: id }));
        showConfirmation();
    };
    const resetDeleteRow = () => {
        setState(prev => ({ ...prev, deleteRowId: null }));
        hideConfirmation();
    };
    const setEditRow = row => setState(prev => ({ ...prev, editingRow: row }));
    const resetEditRow = () => setState(prev => ({ ...prev, editingRow: null }));

    const validate = rules => row => {
        const errors = rules.reduce((acc, curr) => {
            const fieldError = curr.validate?.(row);
            return fieldError ? [...acc, fieldError] : acc;
        }, []);
        return errors.length > 0 ? errors : null;
    };

    const getValidationError = (errors = [], field) => {
        return errors.find(error => error.field === field)?.message;
    };

    const handleValidation = (row, field, value) => {
        const currentValues = { ...row.original, ...row._valuesCache };
        const updatedValues = { ...currentValues, [field]: value };

        const errors = validate(rules)(updatedValues);

        setValidationErrors(prev => ({
            ...prev,
            [row.id]: errors,
        }));
    };

    const clearValidationErrors = () => setValidationErrors({});

    return {
        data,
        isBusy: state.busy,
        pendingDeleteRowId: state.deleteRowId,
        editingRow: state.editingRow,
        isOpen,
        validationErrors,
        setData,
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
    };
};
