import { useContext } from 'react';

import FormErrorsContext from './FormErrorsContext';

export const useFormErrorsContext = () => useContext(FormErrorsContext);

export { FormErrorsContext };
