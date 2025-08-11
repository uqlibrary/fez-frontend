import { validation } from 'config';

import { AUTHOR_EXTERNAL_IDENTIFIER_TYPE } from 'config/general';

const isValid = value => !validation.isEmpty(value) && !validation.maxLength255Validator(value);

const isIdValid = (id, type) => {
    const validateMethod = AUTHOR_EXTERNAL_IDENTIFIER_TYPE.find(item => item.value === type);
    return validateMethod ? validation[validateMethod.text.toLowerCase()](id) : undefined;
};

const defaultValidationRules = [
    {
        id: 'nameAsPublished',
        validate: rowData => {
            const valid = isValid(rowData.nameAsPublished);
            return (
                !valid && {
                    field: 'nameAsPublished',
                    message: 'required',
                }
            );
        },
    },
];

export default defaultValidationRules;

export const extendedValidationRules = [
    {
        id: 'externalIdentifier',
        validate: rowData => {
            const validationMessage = isIdValid(rowData.externalIdentifier, rowData.externalIdentifierType);
            return (
                !!validationMessage && {
                    field: 'externalIdentifier',
                    message: validationMessage,
                }
            );
        },
    },
];
