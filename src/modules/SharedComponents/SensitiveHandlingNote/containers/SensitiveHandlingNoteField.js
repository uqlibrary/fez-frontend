import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SENSITIVE_HANDLING_NOTE_OTHER_TYPE, SENSITIVE_HANDLING_NOTE_TYPE } from 'config/general';
import { selectFields } from 'locale/selectFields';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { validation } from 'config';

export const isSensitiveHandlingNoteTypeOther = value => parseInt(value, 10) === SENSITIVE_HANDLING_NOTE_OTHER_TYPE;

export const SensitiveHandlingNoteField = props => {
    const methods = useFormContext();
    const formValues = methods.getValues('filesSection');

    const [isOther, setIsOther] = useState(isSensitiveHandlingNoteTypeOther(formValues?.sensitiveHandlingNote?.id));
    const handleSensitiveHandlingNoteIdChange = value => setIsOther(isSensitiveHandlingNoteTypeOther(value));
    const idError = methods.getFieldState('filesSection.sensitiveHandlingNote.id').error;
    const otherError = methods.getFieldState('filesSection.sensitiveHandlingNote.other').error;
    return (
        <>
            <Field
                {...props}
                control={methods.control}
                component={NewGenericSelectField}
                name={'filesSection.sensitiveHandlingNote.id'}
                textFieldId={'rek-sensitive-handling-note-id'}
                genericSelectFieldId="rek-sensitive-handling-note-id"
                itemsList={[{ value: '0', text: 'None' }, ...SENSITIVE_HANDLING_NOTE_TYPE]}
                onChange={handleSensitiveHandlingNoteIdChange}
                {...selectFields.sensitiveHandlingNoteType}
                {...(!!idError ? { error: true, errorText: idError } : {})}
                value={methods.getValues('filesSection.sensitiveHandlingNote.id') ?? ''}
            />
            {isOther && (
                <Field
                    control={methods.control}
                    component={TextField}
                    label={'Sensitive Handling Note (Other)'}
                    name={'filesSection.sensitiveHandlingNote.other'}
                    textFieldId={'rek-sensitive-handling-note-other'}
                    fullWidth
                    multiline
                    minRows={6}
                    maxRows={6}
                    inputProps={{ maxLength: 65535 }}
                    validate={value => isOther && validation.required(value)}
                    {...(!!otherError ? { error: true, errorText: otherError } : {})}
                    value={methods.getValues('filesSection.sensitiveHandlingNote.other') ?? ''}
                />
            )}
        </>
    );
};

export default SensitiveHandlingNoteField;
