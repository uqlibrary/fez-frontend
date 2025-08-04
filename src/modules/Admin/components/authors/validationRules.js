import { validation } from 'config';

const isValid = value => !validation.isEmpty(value) && !validation.maxLength255Validator(value);

export const validationRules = [
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
