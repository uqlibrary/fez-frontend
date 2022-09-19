# SearchComponent

Prototype component to publicly search eSpace

## Props

- `searchQueryParams: PropTypes.object` - Parameters for the search query
- `inHeader: PropTypes.bool` - Apply styles/behaviour for header placement
- `showAdvancedSearchButton: PropTypes.bool` - Show button to switch to advanced
- `showSearchButton: PropTypes.bool` - Show a search button in header
- `showPrefixIcon: PropTypes.bool` - Show the magnify glass icon before input
- `showMobileSearchButton: PropTypes.bool` - Show icon to expand mobile search across header

## Usage

```jsx
import React from 'react';
...

import { SearchComponent } from 'modules/SharedComponents/SearchComponent';

const App = () => (
  <div>

    <SearchComponent
        inHeader
        showAdvancedSearchButton
        showSearchButton
        showPrefixIcon
        showMobileSearchButton
    />

  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
