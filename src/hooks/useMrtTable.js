import { useState, useCallback, useEffect } from 'react';
import { useConfirmationState } from './index';

export const useMrtTable = (list, rules = []) => {
    const [data, setData] = useState(list);
    useEffect(() => {
        setData(list);
    }, [list]);

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
    const setEditRow = useCallback(row => setState(prev => ({ ...prev, editingRow: row })), []);
    const resetEditRow = useCallback(() => setState(prev => ({ ...prev, editingRow: null })), []);

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
        hasValidationErrors,
    };
};
