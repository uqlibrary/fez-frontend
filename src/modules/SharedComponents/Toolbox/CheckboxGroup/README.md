# CheckboxGroup

A simple CheckboxGroup component that lists items for UQ Library applications using ReactJs

## Props

- `options: An array of objects containing standard props for each checkbox from https://mui.com/material-ui/api/checkbox/`
- `checkboxGroupId: PropTypes.string`
- `hideLabel: PropTypes.bool`
- `row: PropTypes.bool`,
- `formHelperTextProps: PropTypes.object`
- `help: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.any,
      buttonLabel: PropTypes.string,
  })`
- `onChange: PropTypes.func`,

## Usage

### ./App.js

```jsx
import React from 'react';
...

import { CheckboxGroup } from 'modules/SharedComponents/Toolbox/CheckboxGroup';

const App = () => (
  <div>
    <CheckboxGroup
        checkboxGroupId="aCheckboxGroup"
        options={[
            { label: "Item 1", value: 1},
            { label: "Item 2", value: 2, appendTextField: true}
        ]}
    >
    </CheckboxGroup>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
