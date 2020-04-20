# ConfirmDialogBox

Pre formatted dialog box for confirmation

## Props

- locale: PropTypes.object
- onAction: PropTypes.func
- onRef: PropTypes.func

## Usage

### ./App.js

```jsx
import React from 'react';
...

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const App = () => (
  <div>
    <ConfirmDialogBox onAction={this.deleteItem} onRef={this.setRef} />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
