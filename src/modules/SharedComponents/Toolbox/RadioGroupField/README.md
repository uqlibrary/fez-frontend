# RadioGroupField

A simple RadioGroupField component that lists items for UQ Library applications using ReactJs

## Props

- `options: An array of objects containing standard props for each radio button from https://mui.com/material-ui/api/radio-group/`
- `radioGroupFieldId: PropTypes.string.isRequired`
- `hideLabel: PropTypes.bool`
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

import { RadioGroupField } from 'modules/SharedComponents/Toolbox/RadioGroupField';

const App = () => (
    <div>
        <RadioGroupField
            radioGroupFieldId="aRadioGroupField"
            options={[
                { label: "Item 1", value: 1 },
                { label: "Item 2", value: 2 }
            ]}
        >
        </RadioGroupField>
    </div>
);

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);
```
