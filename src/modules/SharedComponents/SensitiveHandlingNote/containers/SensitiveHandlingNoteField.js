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
    const [sensitiveHandlingNoteId] = useWatch({
        control: form.control,
        name: ['filesSection.sensitiveHandlingNote.id'],
    });
    const isOther = isSensitiveHandlingNoteTypeOther(sensitiveHandlingNoteId);
    React.useLayoutEffect(() => {
        !!isOther && form.trigger('filesSection.sensitiveHandlingNote.other');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOther]);

    const idError = form.getFieldState('filesSection.sensitiveHandlingNote.id').error;
    const otherError = form.getFieldState('filesSection.sensitiveHandlingNote.other').error;
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
