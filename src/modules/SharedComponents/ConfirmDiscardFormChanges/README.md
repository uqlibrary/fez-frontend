# ConfirmDiscardFormChanges

This is an HOC to alert user if the form displayed on the route is dirty and when user accidentally close browser or change url by any means (drag and drop file/url)

## Usage

This needs to be used with redux-form `reduxForm`:

```javascript
import { confirmDiscardFormChanges } from '/ConfirmDiscardFormChanges';

...

let YourFormContainer = reduxForm({
    form: FORM_NAME
})(confirmDiscardFormChanges(YourForm, 'YourFormName'));
```
