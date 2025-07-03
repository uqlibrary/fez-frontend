import React from 'react';
import ListEditor from './components/ListEditor';
import IssnForm from './components/IssnForm';

/**
 * @param {string} value
 * @return {string}
 */
export const normalizeIssn = value => {
    const newValue = value.replace('-', '');
    return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
};

/**
 * @param {{value: string, order: number}} searchKey
 * @param {{key: number}} item
 * @param {number} index
 * @return {{value: string, order: number}}
 */
export const transformIssn = (searchKey, item, index) => ({
    [searchKey.value]: item.key,
    [searchKey.order]: index + 1,
});

export default function IssnListEditorField(fieldProps) {
    return (
        <ListEditor
            formComponent={IssnForm}
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && !!fieldProps.meta.error}
            onChange={fieldProps.input?.onChange}
            remindToAdd={fieldProps.remindToAdd}
            inputNormalizer={normalizeIssn}
            transformFunction={transformIssn}
            {...fieldProps}
        />
    );
}
