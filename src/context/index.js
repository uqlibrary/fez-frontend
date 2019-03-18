import TabbedContext from './createTabbedContext';
import FormValuesContext from './createFormValuesContext';

// Tabbed context for Admin form view (can be used for any other component)
const TabbedContextProvider = TabbedContext.Provider;
const TabbedContextConsumer = TabbedContext.Consumer;

// form values context to provide formValues to the components deep inside the DOM tree
const FormValuesContextProvider = FormValuesContext.Provider;
const FormValuesContextConsumer = FormValuesContext.Consumer;

export {
    TabbedContextProvider, TabbedContextConsumer,
    FormValuesContextProvider, FormValuesContextConsumer
};
