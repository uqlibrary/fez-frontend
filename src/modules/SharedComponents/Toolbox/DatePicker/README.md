# TextField

A simple DatePicker component that lists items for UQ Library applications using ReactJs

## Props
- `standard props from http://www.material-ui.com/#/components/date-picker`
- `helpTitle: PropTypes.string`
- `helpText: PropTypes.any`


## Usage

**./App.js**
```jsx
import React from 'react';
...

import {DatePicker} from 'uqlibrary-react-toolbox';
 
const App = () => (
  <div>
    <DatePicker 
        name="sampleFieldName" 
        fullWidth />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
