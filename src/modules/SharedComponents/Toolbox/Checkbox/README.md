# SelectField

A simple Checkbox component that lists items for UQ Library applications using ReactJs

## Props

- `standard props from http://www.material-ui.com/#/components/checkbox`
- `helpTitle: PropTypes.string`
- `helpText: PropTypes.any`

## Usage

### ./App.js

```jsx
import React from 'react';
...

import { Checkbox } from 'modules/SharedComponents/Toolbox/Checkbox';

const App = () => (
  <div>
    <Checkbox
       label="Simple"
     />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
