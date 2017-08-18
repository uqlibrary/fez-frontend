# ContributorEditor

ReduxForm Field - adds ability for users to add a list of authors/editors to a record,
data is passed to redux form values in the following format:

```
[
  {nameAsPublished: "A. Smith", selected: false, authorId: null}
  {nameAsPublished: "J. Smith", selected: true, authorId: 10001}
  {nameAsPublished: "O. Smith", selected: false, authorId: null}
]
```

to be parsed to request:

```
"fez_record_search_key_author": [
    {"rek_author_id": null, "rek_author": "A. Smith", "rek_author_order": 1}, 
    {"rek_author_id": null, "rek_author": "J. Smith", "rek_author_order": 2}, 
    {"rek_author_id": null, "rek_author": "O. Smith", "rek_author_order": 3}
    ],
"fez_record_search_key_author_id": [
    {"rek_author_id": null, "rek_author_id_order": 1}, 
    {"rek_author_id": 10001, "rek_author_id_order": 2}, 
    {"rek_author_id": null, "rek_author_id_order": 3}
    ]
```

### Props 
- showIdentifierLookup: PropTypes.bool - (default: false) - if set to true, will display autocomplete field with author lookup
- showContributorAssignment: PropTypes.bool - (default: false) - if set to true, will display a radio button to allow author to associate themselves with an author from the list
- className: PropTypes.string - wraps control in this class (if set to 'requiredField' will set style as required field)
- disabled: PropTypes.bool - if set to true, disables control 
- author: PropTypes.object - current author object (comes from redux store)
- onChange: PropTypes.func - required function for reduxForm Field
- locale: PropTypes.object - text labels for the control
  
## Usage

**./App.js**
```jsx

  ...
  <Field
    component={ContributorsEditorField}
    name="authors" 
    className="requiredField" // if this field to be required - add CSS class to indicate it's required
    validate={[validation.isValidContributor]} // if required - add validation
    disabled={this.props.submitting} />
    
```
