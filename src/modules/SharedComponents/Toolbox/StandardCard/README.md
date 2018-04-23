# StandardCard

component for a standard card display with help button

## Props

- `title: PropTypes.string.isRequired`
- `help: PropTypes.object`, eg {title: 'About', text: 'help text..', buttonLabel:'Close'}

## Usage

**./App.js**
```jsx
import React from 'react';
...

import {StandardCard} from 'uqlibrary-react-toolbox';
        
const App = () => (
  <div>
    <StandardCard 
      title='Contact us' 
      text='contact details here...' 
      help={title: 'About', text: 'help text..', buttonLabel:'Close'} 
       />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

