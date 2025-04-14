# ContributorEditor

=== Notes related to Scale of Significance ===

ContributorEditor has been adjusted to also take scale of significance (NTRO) into consideration as follows:
* Editor now makes use of a Redux reducer, shared between contributor editor and scale of significance editor.
* Redux reducer is enabled by passing prop useFormReducer into the component
* Reucer allows for edits to the contributors to be reflected in the scale of significance editor in real-time (Previously, edits to the contributors did not appear on scale of significance editor, thus showing incorrect values)
* Further changes to the scale of significance component shown in it's related readme.

ReduxForm Field - adds ability for users to add a list of authors/editors to a record.

Data is passed in the following format:

```javascript
[
  {nameAsPublished: "A. Smith", selected: false, authorId: null}
  {nameAsPublished: "J. Smith", selected: true, authorId: 10001}
  {nameAsPublished: "O. Smith", selected: false, authorId: null}
]
```

If showIdentifierLookup is set to true, and user has looked up author from a list data is presented in the following format:

```javascript
[
  {
    ...author, // all author details from back end {aut_id, aut_title, aut_lname, etc...}
    nameAsPublished: 'A. Smith',
    selected: false,
    authorId: null,
  },
];
```

- User will not be able to link their author id to a listed author with not their identifier;
- If they pick their own identifier from autocomplete, it will link to them automatically and they won't be able to change that link (only delete author)
- User will be able to link their id to any author name which doesn't have identifier

To be parsed to request:

```javascript
"fez_record_search_key_[author|contributor]": [
    {"rek_author_id": null, "rek_author": "A. Smith", "rek_author_order": 1},
    {"rek_author_id": null, "rek_author": "J. Smith", "rek_author_order": 2},
    {"rek_author_id": null, "rek_author": "O. Smith", "rek_author_order": 3}
    ],
"fez_record_search_key_[author|contributor]_id": [
    {"rek_author_id": null, "rek_author_id_order": 1},
    {"rek_author_id": 10001, "rek_author_id_order": 2},
    {"rek_author_id": null, "rek_author_id_order": 3}
    ]
```

## Props

- showIdentifierLookup: PropTypes.bool - (default: false) - if set to true, will display autocomplete field with author lookup
- showContributorAssignment: PropTypes.bool - (default: false) - if set to true, will display a radio button to allow author to associate themselves with an author from the list
- className: PropTypes.string - wraps control in this class (if set to 'requiredField' will set style as required field)
- disabled: PropTypes.bool - if set to true, disables control
- author: PropTypes.object - current author object (comes from redux store)
- onChange: PropTypes.func - required function for reduxForm Field
- locale: PropTypes.object - text labels for the control

## Usage

### ./App.js

```jsx
  ...
  <Field
    component={ContributorsEditorField}
    name="authors"
    className="requiredField" // if this field to be required - add CSS class to indicate it's required
    validate={[validation.isValidContributor]} // if required - add validation
    disabled={this.props.submitting}
  />

```
