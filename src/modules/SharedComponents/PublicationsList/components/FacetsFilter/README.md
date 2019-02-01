# FacetsFilter

A complimentary component to PublicationList to render the elastic search facets as a categorised list, and to pass a list of UI activated facets back to the parent via a prop function to deal with as it pleases.

## Props

- `facetsData: PropTypes.object`, drawn from the /publications/possible-unclaimed/ api
- `activeFacets: PropTypes.object`, Object of facets that are currently active (for rendering purposes)
- `onFacetsChanged: PropTypes.func`, function from the parent component to pass the values of currently activated facets.
- `excludeFacetsList: PropTypes.array`, List of items to omit from the facet list eg. ['Category 1', 'Category 2']
- `renameFacetsList: PropTypes.array`, Object of items to rename facet title eg. {'Display type': 'Publication type'}

## Usage

### ./App.js

```jsx
import React from 'react';
...

import {FacetsFilter} from 'modules/FacetsFilter';

const App = () => (
    <FacetsFilter
        facetsData={this.props.facetsData}
        onFacetsChanged={this._facetsChanged}
        excludeFacetsList="['Display type', 'Subject']"
        activeFacets={this.props.activeFacets}
        renameFacetsList={'Display type': 'Publication type'}
    />
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
