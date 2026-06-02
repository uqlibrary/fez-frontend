import React from 'react';
import { useValidatedFormField } from 'hooks/useValidatedFormField';
import Field, { FieldProps } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Field';

const ValidatedField = (props: FieldProps) => {
    useValidatedFormField(props?.name);

    return <Field {...props} />;
};

export default ValidatedField;
