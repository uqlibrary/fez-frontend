import React from 'react';
import DatePicker from 'material-ui-pickers/DatePicker';

export default function DatePickerField(fieldProps) {
    return (
        <DatePicker
            value={!!fieldProps.input.value && fieldProps.input.value || null}
            format="DD/MM/YYYY"
            onChange={fieldProps.input.onChange}
            error={!!fieldProps.meta.error}
            helperText={fieldProps.meta.error}
            { ...fieldProps }
        />
    );
}
