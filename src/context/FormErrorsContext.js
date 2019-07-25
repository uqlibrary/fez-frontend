import React from 'react';
import Immutable from 'immutable';

const FormErrorsContext = React.createContext({
    formValues: Immutable.Map({}),
});

export default FormErrorsContext;
