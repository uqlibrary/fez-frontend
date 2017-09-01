# FacetsFilter
A complimentary component to PublicationList to render the elastic search facets as a categorised list, and to pass a list of UI activated facets back to the parent via a prop function to deal with as it pleases.
## Props
- `facetsData: PropTypes.object`, drawn from the /publications/possible-unclaimed/ api
- `facetsFunction: PropTypes.func`, function from the parent component to pass the values of currently activated facets.
- `omitCategory: PropTypes.array`, List of items to omit from the facet list eg. ['Category 1', 'Category 2']
## Usage
**./App.js**
```jsx
import React from 'react';
...

import {FacetsFilter} from 'modules/FacetsFilter';
        
const App = () => (
    <FacetsFilter 
        facetsData={this.props.facetsData}
        facetsFunction={this._facetsChanged}
        omitCategory="['Display type']"
    />
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

