# StandardRighthandCard

component for a right hand panel wrapper

## Props

- `title: PropTypes.string.isRequired`
- `help: PropTypes.object`, eg {title: 'Help title', text: 'Some help text..', buttonLabel:'OK'}

## Usage

**./App.js**
```jsx
import React from 'react';
...

import {StandardRighthandCard} from 'uqlibrary-react-toolbox';
        
const App = () => (
    <StandardRighthandCard title={txt.component.title} help={txt.component.help}>
        Some content here.
    </StandardRighthandCard>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

