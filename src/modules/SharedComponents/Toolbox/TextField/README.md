# TextField

A simple TextField component that lists items for UQ Library applications using ReactJs

## Props

- `standard props from http://www.material-ui.com/#/components/text-field`
- `helpTitle: PropTypes.string`
- `helpText: PropTypes.any`

## Usage

### ./App.js

```jsx
import React from 'react';
...

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';

const App = () => (
  <div>
    <TextField
        name="sampleFieldName"
        type="text"
        fullWidth
        floatingLabelText="Sample floating label"/>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
