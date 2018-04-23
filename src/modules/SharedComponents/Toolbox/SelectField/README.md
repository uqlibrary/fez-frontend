# SelectField

A simple SelectField component that lists items for UQ Library applications using ReactJs

## Props
- `standard props from http://www.material-ui.com/#/components/select-field`
- `helpTitle: PropTypes.string`
- `helpText: PropTypes.any`


## Usage

**./App.js**
```jsx
import React from 'react';
...

import {SelectField} from 'uqlibrary-react-toolbox';
 
const App = () => (
  <div>
    <SelectField
        name="aSelectField"
    >
        <MenuItem value={1} primaryText="Menu Item 1" />
        <MenuItem value={2} primaryText="Menu Item 2" />
        <MenuItem value={3} primaryText="Menu Item 3" />
    </SelectField>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
