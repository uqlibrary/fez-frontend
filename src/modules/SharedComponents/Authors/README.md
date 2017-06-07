# Authors

Smart component that lists authors for UQ Library applications using ReactJs

## Props
- `title: PropTypes.string`
- `addAuthor: PropTypes.func`
- `removeAuthor: PropTypes.func`
- `formValues: PropTypes.object`
- `loadAuthors: PropTypes.func.isRequired`
- `listOfAuthors: PropTypes.object.isRequired`
- `selectedAuthors: PropTypes.object`
- `form: PropTypes.string.isRequired.isRequired`
    
## Usage

**./App.js**
```jsx
import React from 'react';
...

import {Authors} from 'uqlibrary-react-toolbox';
      
const App = () => (
  <div>
    <Authors 
        form="someFormName" />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

