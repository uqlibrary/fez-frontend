# Loaders

reusable loaders for applications


## AppLoader
application loader

## Props
- `title: PropTypes.string.isRequired` - title to display
- `logoImage: PropTypes.string` - url of an image of a logo
- `logoText: PropTypes.string` - alt text for a logo image
- `progressColor: PropTypes.string` - colour of progress animation
    
    
## InlineLoader
small loader animation to be used inline

## Props
- `message: PropTypes.string` - text to display


## ContentLoader
loader animation inside of a paper card

## Props
- `message: PropTypes.string` - text to display


## Usage

**./App.js**
```jsx
import React from 'react';
...
import {AppLoader} from 'uqlibrary-react-toolbox';


const App = () => (
  <div>
    {isLoading && <AppLoader title='FEZ' logoImage='http://image/image.svg' logoText='Fez frontend logo'}
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

