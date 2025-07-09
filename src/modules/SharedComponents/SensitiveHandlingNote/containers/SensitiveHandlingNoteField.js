import React, { useState } from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SENSITIVE_HANDLING_NOTE_OTHER_TYPE, SENSITIVE_HANDLING_NOTE_TYPE } from 'config/general';
import { selectFields } from 'locale/selectFields';
import { Field } from 'redux-form/immutable';
import { useFormValuesContext } from 'context';
import { validation } from 'config';

export const isSensitiveHandlingNoteTypeOther = value => parseInt(value, 10) === SENSITIVE_HANDLING_NOTE_OTHER_TYPE;

export const SensitiveHandlingNoteField = props => {
    const { formValues } = useFormValuesContext();
    const [isOther, setIsOther] = useState(isSensitiveHandlingNoteTypeOther(formValues.sensitiveHandlingNote?.id));
    const handleSensitiveHandlingNoteIdChange = value => setIsOther(isSensitiveHandlingNoteTypeOther(value));
    return (
        <>
            <Field
                {...props}
                component={NewGenericSelectField}
                name={'filesSection.sensitiveHandlingNote.id'}
                textFieldId={'rek-sensitive-handling-note-id'}
                genericSelectFieldId="rek-sensitive-handling-note-id"
                itemsList={[{ value: '0', text: 'None' }, ...SENSITIVE_HANDLING_NOTE_TYPE]}
                onChange={handleSensitiveHandlingNoteIdChange}
                {...selectFields.sensitiveHandlingNoteType}
            />
            {isOther && (
                <Field
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
                />
            )}
        </>
    );
};

export default SensitiveHandlingNoteField;
