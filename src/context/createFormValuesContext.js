
import React, {useContext} from 'react';
import Immutable from 'immutable';


const FormValuesContext = React.createContext({
    formValues: Immutable.Map({})
});

export const useFormValuesContext = () => useContext(FormValuesContext);

export default FormValuesContext;
