import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SENSITIVE_HANDLING_NOTE_TYPE } from 'config/general';
import { selectFields } from 'locale/selectFields';
import { validation } from 'config';
import { isSensitiveHandlingNoteTypeOther } from 'helpers/datastreams';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

export const SensitiveHandlingNoteField = props => {
    const form = useFormContext();
    const [sensitiveHandlingNoteId, texts] = useWatch({
        control: form.control,
        name: ['filesSection.sensitiveHandlingNote.id', 'filesSection.sensitiveHandlingNote.other'],
    });

    console.log(sensitiveHandlingNoteId, texts);
    const isOther = isSensitiveHandlingNoteTypeOther(sensitiveHandlingNoteId);
    // const handleSensitiveHandlingNoteIdChange = value => {
    //     const isSensitive = isSensitiveHandlingNoteTypeOther(value);
    //     setIsOther(isSensitive);
    //     console.log('handleSensitiveHandlingNoteIdChange', value);
    // };
    const idError = form.getFieldState('filesSection.sensitiveHandlingNote.id').error;
    const otherError = form.getFieldState('filesSection.sensitiveHandlingNote.other').error;
    console.log(form.getFieldState('filesSection.sensitiveHandlingNote.other'));
    return (
        <>
            <Field
                {...props}
                control={form.control}
                component={NewGenericSelectField}
                name={'filesSection.sensitiveHandlingNote.id'}
                textFieldId={'rek-sensitive-handling-note-id'}
                genericSelectFieldId="rek-sensitive-handling-note-id"
                itemsList={[{ value: '0', text: 'None' }, ...SENSITIVE_HANDLING_NOTE_TYPE]}
                onChange={(value, onChange) => {
                    // handleSensitiveHandlingNoteIdChange(value);
                    // form.trigger('filesSection.sensitiveHandlingNote');
                    onChange(value);
                }}
                {...selectFields.sensitiveHandlingNoteType}
                {...(!!idError ? { error: true, errorText: idError } : {})}
            />

            {isOther && (
                <Field
                    control={form.control}
                    component={TextField}
                    label={'Sensitive Handling Note (Other)'}
                    name={'filesSection.sensitiveHandlingNote.other'}
                    textFieldId={'rek-sensitive-handling-note-other'}
                    fullWidth
                    multiline
                    required
                    minRows={6}
                    maxRows={6}
                    inputProps={{ maxLength: 65535 }}
                    validate={[validation.required]}
                    {...(!!otherError ? { error: true, errorText: otherError } : {})}
                />
            )}
        </>
    );
};

export default SensitiveHandlingNoteField;
