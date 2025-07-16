# PartialDateField

simple date-picker for UQ Library applications using ReactJs.

## PartialDateField Props

- `dateFormat: PropTypes.string`
- `allowPartial: PropTypes.bool`
- `locale: PropTypes.object`
- `months: PropTypes.array`
- `onChange: PropTypes.func`
- `floatingTitle: PropTypes.string`
- `floatingTitleRequired: PropTypes.bool`
- `disableFuture: PropTypes.bool`

## PartialDateField defaultProps

- `dateFormat: 'YYYY-MM-DD'`
- `allowPartial: false`
- `floatingTitle: 'Enter a date'`
- `months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`
- `disableFuture: false`

## Usage

### ./App.js

```jsx harmony
import React from 'react';
...

import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';

const App = () => (
  <div>
    <PartialDateField
        dateFormat="YYYY-MM-DD"
        allowPartial
        disableFuture
    />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```