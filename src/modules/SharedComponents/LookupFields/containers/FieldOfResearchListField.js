import React from 'react';
import {LookupListEditor} from 'uqlibrary-react-toolbox';
import {FieldOfResearchField} from './FieldOfResearchField';

export const FieldOfResearchListField = (fieldProps) => {
    return(<LookupListEditor
        inputField={FieldOfResearchField}
        errorText={fieldProps.meta ? fieldProps.meta.error : null}
        onChange={fieldProps.input.onChange}
        {...fieldProps} />);
};
