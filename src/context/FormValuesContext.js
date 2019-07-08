
import React from 'react';
import Immutable from 'immutable';

const FormValuesContext = React.createContext({
    formValues: Immutable.Map({}),
});

export default FormValuesContext;
