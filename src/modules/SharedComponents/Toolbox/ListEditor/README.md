# ListEditor

TODO: update LookupListEditor

ReduxForm Field - adds ability for users to add a list of items (strings) to a record,
data is passed to redux form values in the following format:

```javascript
[
    { value: 'item 1', order: 1 },
    { value: 'item 2', order: 2 },
    { value: 'item 3', order: 3 }
];
```

## Props

- className: PropTypes.string - wraps control in this class (if set to 'requiredField' will set style as required field)
- disabled: PropTypes.bool - if set to true, disables control
- onChange: PropTypes.func - required function for reduxForm Field
- locale: PropTypes.object - text labels for the control
- searchKey: PropTypes.object.isRequired - a structure for output, eg {{value: 'rek_isbn', order: 'rek_isbn_order'}}
- maxCount: PropTypes.number - a max number of items (default 0 - no limit)
- isValid: PropTypes.func - validation function, takes item value outputs an error message or empty string
- scrollList: PropTypes.bool - if true, will scroll the items list instead of just expanding endlessly
- scrollListheight: PropTypes.number - height in pixels of the scrollable area

## Usage

### ./App.js

```jsx
  ...
   <Field
      component={ListEditorField}
      name="fez_record_search_key_isbn"
      isValid={validation.isValidIsbn}
      maxCount={5}
      searchKey={{value: 'rek_isbn', order: 'rek_isbn_order'}}
      locale={locale.components.isbnForm.field}
      disabled={this.props.submitting} />
```
