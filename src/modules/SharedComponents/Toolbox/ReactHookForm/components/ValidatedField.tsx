import React from 'react';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useValidatedFormField } from 'hooks/useValidatedFormField';
import { FieldProps } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Field';

const ValidatedField = (props: FieldProps) => {
    useValidatedFormField(props?.name);

    return <Field {...props} />;
};

export default ValidatedField;
