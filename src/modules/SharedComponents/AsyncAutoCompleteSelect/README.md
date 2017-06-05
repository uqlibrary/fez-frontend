# AsyncAutoCompleteSelect

A smart select field component that filters the select field data as you type for UQ Library applications using ReactJs

## Props
- `dataSource: PropTypes.func`
- `dataSourceLabel: PropTypes.string`
- `disabled: PropTypes.bool.isRequired`
- `errorText: PropTypes.string`
- `value: PropTypes.any`
- `label: PropTypes.string.isRequired`
- `onChange: PropTypes.func`
- `alwaysRenderSuggestions: PropTypes.bool`
- `minLength: PropTypes.number`

## Usage

**./App.js**
```jsx
import React from 'react';
...

import {AutoCompleteSelect} from 'uqlibrary-react-toolbox';

const dataSource = [
        {"username":"test1","name":"Test User 1","mail":null},
        {"username":"test2","name":"Test User 2","mail":"test2@test.com"},
        {"username":"test3","name":"Test User 3","mail":"test3@test.com"},
        {"username":"test4","name":"Test User 4","mail":"test4@test.com"}
    ];
    
    const autoCompleteOwner = {
        name: 'A Name',
        mail: 'Mail Text'
    };
 
const App = () => (
  <div>
    <AsyncAutoCompleteSelect name="owner"
        label="Owner"
        dataSource
        labelField="name"
        value={autoCompleteOwner}
        popoverFloatingLabelText="This is a sample label"
        errorText="" />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
