# AuthButton

simple reusable login/logout button for UQ Library applications

## Props
- `isAuthorizedUser: PropTypes.bool.isRequired` - flag indicating if user is logged in or not
- `loginUrl: PropTypes.string.isRequired` - redirect URL
- `logoutUrl: PropTypes.string.isRequired` - redirect URL
- `signOutTooltipText: PropTypes.string` - default value 'Log out'
- `signInTooltipText: PropTypes.strin` - default value 'Log in'
    
## Usage

**./App.js**
```jsx
import React from 'react';
...

import {AuthButton} from 'uqlibrary-react-toolbox';

...

const App = () => (
  <div>
    ...
    <AuthButton {...props} />
    ...
  </div>
);

```

