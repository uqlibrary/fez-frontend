# Alert

Prorotype component to display alerts/warnings/errors

## Props
- `message: PropTypes.string`
- `title: PropTypes.string`
- `type PropTypes.string - valid values ['error', 'error_outline', 'warning', 'info', 'info_outline', 'help', 'help_outline']`
- `showLoader PropTypes.bool` - prop is to render a spinner instead of icon
- `allowDismiss PropTypes.bool` - prop is to render a dismiss button
- `dismissAction PropTypes.func` - prop is function to call when dismiss button pressed
- `dismissTitle PropTypes.string` - prop is title for dismiss button for accessibility


## Usage
```jsx
import React from 'react';
...

import {Alerts} from 'uqlibrary-react-toolbox';
      
const App = () => (
  <div>
  
    <Alerts 
        title="This is a title"
        message="Some body text."
        type="error_outline"
        outsidelayout
        showLoader
    />
    
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

