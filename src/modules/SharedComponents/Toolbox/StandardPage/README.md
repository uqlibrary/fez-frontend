# StandardPage

component for a pre-formatted page

## Props

- `title: PropTypes.string.isRequired`

## Usage

**./App.js**
```jsx
import React from 'react';
...

import {StandardPage} from 'uqlibrary-react-toolbox';
        
const App = () => (
  <div>
    <StandardPage 
      title='Contact us'>
      some text or react elements....
    </StandardPage>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

